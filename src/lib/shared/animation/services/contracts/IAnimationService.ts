import type { IPosition } from '$lib/shared/domain';

export interface IAnimationService {
	/**
	 * Animate an element moving from one position to another with spring physics
	 */
	animateMove(
		element: HTMLElement,
		from: IPosition,
		to: IPosition,
		tileSize: number
	): Promise<void>;

	/**
	 * Animate a stone being pushed - heavier, weighted slide with slight overshoot
	 */
	animatePush(
		element: HTMLElement,
		from: IPosition,
		to: IPosition,
		tileSize: number
	): Promise<void>;

	/**
	 * Animate a pressure pad activating - glow pulse and scale pop
	 */
	animateActivation(element: HTMLElement): Promise<void>;

	/**
	 * Animate a pressure pad deactivating
	 */
	animateDeactivation(element: HTMLElement): Promise<void>;

	/**
	 * Animate the fail state - screen shake, red flash
	 */
	animateFail(container: HTMLElement): Promise<void>;

	/**
	 * Animate stones resetting to their original positions
	 */
	animateStoneReset(
		elements: { element: HTMLElement; from: IPosition; to: IPosition }[],
		tileSize: number
	): Promise<void>;

	/**
	 * Animate the win state - celebratory effect
	 */
	animateWin(container: HTMLElement): Promise<void>;

	/**
	 * Animate a stone locking in place
	 */
	animateLock(element: HTMLElement): Promise<void>;
}
