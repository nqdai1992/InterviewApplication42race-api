import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';

class EnvironmentVariables {
  PORT?: number;
  STRAVA_CLIENT_ID: string;
  STRAVA_CLIENT_SECRET: string;
  DB_CONNECTION_STRING: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
