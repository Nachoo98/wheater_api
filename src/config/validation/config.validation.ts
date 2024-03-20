import { plainToClass } from 'class-transformer';
import { IsNotEmpty, IsString, validateSync } from 'class-validator';

class EnviromentVariables {
  @IsNotEmpty()
  @IsString()
  APP_VERSION: string;
}

export const validate = (
  config: Record<string, unknown>,
): EnviromentVariables => {
  const validateConfig = plainToClass(EnviromentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validateConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) throw new Error(errors.toString());

  return validateConfig;
};
