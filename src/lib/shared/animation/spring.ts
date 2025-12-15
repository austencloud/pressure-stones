/**
 * Spring physics configuration
 */
export interface SpringConfig {
	stiffness: number; // How strong the spring pulls (higher = faster)
	damping: number; // How much resistance (higher = less bouncy)
	mass: number; // Weight of the object (higher = more momentum)
}

/**
 * Preset spring configurations
 */
export const SPRING_PRESETS = {
	// Bouncy player movement
	bouncy: { stiffness: 300, damping: 20, mass: 1 },
	// Heavier stone push
	heavy: { stiffness: 200, damping: 25, mass: 2 },
	// Snappy UI response
	snappy: { stiffness: 400, damping: 30, mass: 0.8 },
	// Gentle float
	gentle: { stiffness: 150, damping: 15, mass: 1 },
	// Quick pop
	pop: { stiffness: 500, damping: 25, mass: 0.5 }
} as const;

/**
 * Animate a value using spring physics
 * Returns a promise that resolves when animation completes
 */
export function animateSpring(
	from: number,
	to: number,
	config: SpringConfig,
	onUpdate: (value: number) => void
): Promise<void> {
	return new Promise((resolve) => {
		let position = from;
		let velocity = 0;
		const { stiffness, damping, mass } = config;

		let lastTime = performance.now();
		let animationId: number;

		function tick(currentTime: number) {
			const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.064); // Cap at ~15fps minimum
			lastTime = currentTime;

			// Spring force: F = -k * x (where x is displacement from target)
			const displacement = position - to;
			const springForce = -stiffness * displacement;

			// Damping force: F = -c * v
			const dampingForce = -damping * velocity;

			// Acceleration: a = F / m
			const acceleration = (springForce + dampingForce) / mass;

			// Update velocity and position
			velocity += acceleration * deltaTime;
			position += velocity * deltaTime;

			onUpdate(position);

			// Check if we're done (close enough and slow enough)
			const isSettled = Math.abs(displacement) < 0.5 && Math.abs(velocity) < 0.5;

			if (isSettled) {
				onUpdate(to); // Snap to final position
				resolve();
			} else {
				animationId = requestAnimationFrame(tick);
			}
		}

		animationId = requestAnimationFrame(tick);

		// Safety cleanup (shouldn't normally trigger)
		setTimeout(() => {
			cancelAnimationFrame(animationId);
			onUpdate(to);
			resolve();
		}, 2000);
	});
}

/**
 * Animate two values (x, y) using spring physics
 */
export function animateSpring2D(
	from: { x: number; y: number },
	to: { x: number; y: number },
	config: SpringConfig,
	onUpdate: (x: number, y: number) => void
): Promise<void> {
	return new Promise((resolve) => {
		let posX = from.x;
		let posY = from.y;
		let velX = 0;
		let velY = 0;
		const { stiffness, damping, mass } = config;

		let lastTime = performance.now();
		let animationId: number;

		function tick(currentTime: number) {
			const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.064);
			lastTime = currentTime;

			// X axis
			const dispX = posX - to.x;
			const springForceX = -stiffness * dispX;
			const dampingForceX = -damping * velX;
			const accX = (springForceX + dampingForceX) / mass;
			velX += accX * deltaTime;
			posX += velX * deltaTime;

			// Y axis
			const dispY = posY - to.y;
			const springForceY = -stiffness * dispY;
			const dampingForceY = -damping * velY;
			const accY = (springForceY + dampingForceY) / mass;
			velY += accY * deltaTime;
			posY += velY * deltaTime;

			onUpdate(posX, posY);

			const isSettled =
				Math.abs(dispX) < 0.5 &&
				Math.abs(dispY) < 0.5 &&
				Math.abs(velX) < 0.5 &&
				Math.abs(velY) < 0.5;

			if (isSettled) {
				onUpdate(to.x, to.y);
				resolve();
			} else {
				animationId = requestAnimationFrame(tick);
			}
		}

		animationId = requestAnimationFrame(tick);

		setTimeout(() => {
			cancelAnimationFrame(animationId);
			onUpdate(to.x, to.y);
			resolve();
		}, 2000);
	});
}
