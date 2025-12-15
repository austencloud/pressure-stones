export const TYPES = {
	// Foundation Services
	IStorageService: Symbol.for('IStorageService'),

	// Game Services
	IGameEngine: Symbol.for('IGameEngine'),
	IMovementService: Symbol.for('IMovementService'),
	IStonePushService: Symbol.for('IStonePushService'),
	ISequenceValidationService: Symbol.for('ISequenceValidationService'),

	// Editor Services
	IEditorService: Symbol.for('IEditorService'),
	IPuzzleValidationService: Symbol.for('IPuzzleValidationService'),

	// Animation & Audio
	IAnimationService: Symbol.for('IAnimationService'),
	IAudioService: Symbol.for('IAudioService'),

	// Persistence & Auth
	IPuzzlePersistenceService: Symbol.for('IPuzzlePersistenceService'),
	IAuthService: Symbol.for('IAuthService'),

	// State (bound as constant values)
	IGameState: Symbol.for('IGameState'),
	IEditorState: Symbol.for('IEditorState'),
	IAuthState: Symbol.for('IAuthState')
} as const;

export type ServiceTypes = typeof TYPES;
