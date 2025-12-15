import type { ContainerModuleLoadOptions } from 'inversify';
import { ContainerModule } from 'inversify';

export const editorModule = new ContainerModule((_options: ContainerModuleLoadOptions) => {
	// Editor services will be bound here as they are implemented
	// options.bind(TYPES.IEditorService).to(EditorService).inSingletonScope();
	// options.bind(TYPES.IPuzzleValidationService).to(PuzzleValidationService).inSingletonScope();
});
