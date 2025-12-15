import type { ContainerModuleLoadOptions } from 'inversify';
import { ContainerModule } from 'inversify';
import { TYPES } from '../types';
import { StorageService } from '../../foundation/services/implementations/StorageService';

export const coreModule = new ContainerModule((options: ContainerModuleLoadOptions) => {
	options.bind(TYPES.IStorageService).to(StorageService).inSingletonScope();
});
