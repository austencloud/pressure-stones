import type { ContainerModuleLoadOptions } from 'inversify';
import { ContainerModule } from 'inversify';

export const gameModule = new ContainerModule((_options: ContainerModuleLoadOptions) => {
	// Game services will be bound here as they are implemented
	// options.bind(TYPES.IGameEngine).to(GameEngine).inSingletonScope();
	// options.bind(TYPES.IMovementService).to(MovementService).inSingletonScope();
	// options.bind(TYPES.IStonePushService).to(StonePushService).inSingletonScope();
	// options.bind(TYPES.ISequenceValidationService).to(SequenceValidationService).inSingletonScope();
});
