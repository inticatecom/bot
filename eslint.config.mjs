// @ts-check

import eslint from '@eslint/js';
import {defineConfig} from 'eslint/config';
import tslint from 'typescript-eslint';

export default defineConfig(
    eslint.configs.recommended,
    tslint.configs.strict,
    tslint.configs.stylistic
);