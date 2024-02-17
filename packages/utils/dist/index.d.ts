import { EnvVariablesKeys } from '@mbsm/types';
import { z } from 'zod';

declare const getEnvAsStr: (key: EnvVariablesKeys) => string;
declare const getEnvAsInt: (key: EnvVariablesKeys) => number;
declare const getEnvAsBool: (key: EnvVariablesKeys) => boolean;

declare const snakeToCamel: (str: string) => string;
declare const getErrorMessage: (error: any) => string;

declare const getFormattedZodError: (error: z.ZodError) => string;

export { getEnvAsBool, getEnvAsInt, getEnvAsStr, getErrorMessage, getFormattedZodError, snakeToCamel };
