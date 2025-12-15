import type { IAnimationService } from '../contracts/IAnimationService';
import type { IPosition } from '$lib/shared/domain';
import { animateSpring2D, SPRING_PRESETS } from '../../spring';

export class AnimationService implements IAnimationService {
	async animateMove(
		element: HTMLElement,
		from: IPosition,
		to: IPosition,
		tileSize: number
	): Promise<void> {
		const fromPx = { x: from.x * tileSize, y: from.y * tileSize };
		const toPx = { x: to.x * tileSize, y: to.y * tileSize };

		await animateSpring2D(fromPx, toPx, SPRING_PRESETS.bouncy, (x, y) => {
			element.style.left = `${x}px`;
			element.style.top = `${y}px`;
		});
	}

	async animatePush(
		element: HTMLElement,
		from: IPosition,
		to: IPosition,
		tileSize: number
	): Promise<void> {
		const fromPx = { x: from.x * tileSize, y: from.y * tileSize };
		const toPx = { x: to.x * tileSize, y: to.y * tileSize };

		await animateSpring2D(fromPx, toPx, SPRING_PRESETS.heavy, (x, y) => {
			element.style.left = `${x}px`;
			element.style.top = `${y}px`;
		});
	}

	async animateActivation(element: HTMLElement): Promise<void> {
		// Add activation class for CSS animation
		element.classList.add('activating');

		// Scale pop effect
		element.style.transition = 'transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)';
		element.style.transform = 'scale(1.2)';

		await this.delay(150);

		element.style.transform = 'scale(1)';

		await this.delay(150);

		element.style.transition = '';
		element.classList.remove('activating');
	}

	async animateDeactivation(element: HTMLElement): Promise<void> {
		element.style.transition = 'transform 0.2s ease-out, opacity 0.2s ease-out';
		element.style.transform = 'scale(0.95)';
		element.style.opacity = '0.7';

		await this.delay(200);

		element.style.transform = '';
		element.style.opacity = '';
		element.style.transition = '';
	}

	async animateFail(container: HTMLElement): Promise<void> {
		// Screen shake
		const shakeKeyframes = [
			{ transform: 'translateX(0)' },
			{ transform: 'translateX(-10px)' },
			{ transform: 'translateX(10px)' },
			{ transform: 'translateX(-8px)' },
			{ transform: 'translateX(8px)' },
			{ transform: 'translateX(-5px)' },
			{ transform: 'translateX(5px)' },
			{ transform: 'translateX(0)' }
		];

		// Red flash overlay
		const flash = document.createElement('div');
		flash.style.cssText = `
			position: absolute;
			inset: 0;
			background: rgba(231, 76, 60, 0.4);
			pointer-events: none;
			z-index: 100;
			border-radius: inherit;
		`;
		container.style.position = 'relative';
		container.appendChild(flash);

		// Run shake animation
		const shakeAnimation = container.animate(shakeKeyframes, {
			duration: 400,
			easing: 'ease-out'
		});

		// Fade out flash
		flash.animate([{ opacity: 1 }, { opacity: 0 }], {
			duration: 400,
			fill: 'forwards'
		});

		await shakeAnimation.finished;

		// Clean up
		flash.remove();
	}

	async animateStoneReset(
		elements: { element: HTMLElement; from: IPosition; to: IPosition }[],
		tileSize: number
	): Promise<void> {
		// Animate all stones back simultaneously with staggered starts
		const animations = elements.map(({ element, from, to }, index) => {
			return new Promise<void>((resolve) => {
				setTimeout(async () => {
					const fromPx = { x: from.x * tileSize, y: from.y * tileSize };
					const toPx = { x: to.x * tileSize, y: to.y * tileSize };

					// Use gentler spring for reset
					await animateSpring2D(fromPx, toPx, SPRING_PRESETS.gentle, (x, y) => {
						element.style.left = `${x}px`;
						element.style.top = `${y}px`;
					});

					resolve();
				}, index * 50); // Stagger by 50ms
			});
		});

		await Promise.all(animations);
	}

	async animateWin(container: HTMLElement): Promise<void> {
		// Create celebratory particles
		const particleCount = 20;
		const particles: HTMLElement[] = [];

		for (let i = 0; i < particleCount; i++) {
			const particle = document.createElement('div');
			const hue = Math.random() * 360;
			const size = 8 + Math.random() * 8;
			const startX = Math.random() * 100;

			particle.style.cssText = `
				position: absolute;
				width: ${size}px;
				height: ${size}px;
				background: hsl(${hue}, 70%, 60%);
				border-radius: 50%;
				left: ${startX}%;
				top: 50%;
				pointer-events: none;
				z-index: 100;
			`;

			container.appendChild(particle);
			particles.push(particle);

			// Animate each particle
			const angle = (Math.random() - 0.5) * Math.PI;
			const velocity = 200 + Math.random() * 200;
			const vx = Math.cos(angle) * velocity;
			const vy = -Math.abs(Math.sin(angle) * velocity) - 100; // Always go up initially

			particle.animate(
				[
					{ transform: 'translate(0, 0) scale(1)', opacity: 1 },
					{
						transform: `translate(${vx}px, ${vy + 300}px) scale(0)`,
						opacity: 0
					}
				],
				{
					duration: 1000 + Math.random() * 500,
					easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
					fill: 'forwards'
				}
			);
		}

		// Golden flash
		const flash = document.createElement('div');
		flash.style.cssText = `
			position: absolute;
			inset: 0;
			background: radial-gradient(circle, rgba(241, 196, 15, 0.3) 0%, transparent 70%);
			pointer-events: none;
			z-index: 99;
			border-radius: inherit;
		`;
		container.appendChild(flash);

		flash.animate([{ opacity: 0 }, { opacity: 1 }, { opacity: 0 }], {
			duration: 800,
			easing: 'ease-out'
		});

		await this.delay(1500);

		// Clean up
		particles.forEach((p) => p.remove());
		flash.remove();
	}

	async animateLock(element: HTMLElement): Promise<void> {
		// Brief golden glow effect
		const originalBoxShadow = element.style.boxShadow;

		element.style.transition = 'box-shadow 0.2s ease-out, transform 0.2s ease-out';
		element.style.boxShadow = '0 0 20px rgba(241, 196, 15, 0.8), 0 0 40px rgba(241, 196, 15, 0.4)';
		element.style.transform = 'scale(1.1)';

		await this.delay(200);

		element.style.boxShadow = '0 0 10px rgba(241, 196, 15, 0.4)';
		element.style.transform = 'scale(1)';

		await this.delay(300);

		element.style.transition = '';
		element.style.boxShadow = originalBoxShadow || '0 0 8px rgba(241, 196, 15, 0.3)';
	}

	private delay(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}
}

// Singleton instance
let animationServiceInstance: IAnimationService | null = null;

export function getAnimationService(): IAnimationService {
	if (!animationServiceInstance) {
		animationServiceInstance = new AnimationService();
	}
	return animationServiceInstance;
}
