import {z} from 'zod';

// Strip remove chaves desconhecidas
const AppConfigSchema = z.object({
  PORT: z.string().optional().default('3000').transform((value) => Number(value)).refine((port) => port >= 0 && port <= 65535, {message: 'PORT must be less 65535'}),
}).strip();


export type AppConfig = z.infer<typeof AppConfigSchema>;
export const appConfig:AppConfig = AppConfigSchema.parse(process.env);