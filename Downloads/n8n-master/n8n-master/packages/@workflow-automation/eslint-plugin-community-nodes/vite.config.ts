import { defineConfig, mergeConfig } from 'vite';
import { vitestConfig } from '@workflow-automation/vitest-config/node';

export default mergeConfig(defineConfig({}), vitestConfig);
