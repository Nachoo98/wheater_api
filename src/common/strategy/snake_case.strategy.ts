import { DefaultNamingStrategy, NamingStrategyInterface } from 'typeorm';

export class SnakeCaseStrategy extends DefaultNamingStrategy implements NamingStrategyInterface {
  tableName(className: string, customName: string): string {
    return customName || this.snakeCase(className);
  }

  columnName(propertyName: string, customName: string, embeddedPrefixes: string[]): string {
    return this.snakeCase(propertyName);
  }

  relationName(propertyName: string): string {
    return this.snakeCase(propertyName);
  }

  snakeCase(name: string): string {
    return name.replace(/(?:^|\.?)([A-Z])/g, (_, x) => '_' + x.toLowerCase()).replace(/^_/, '');
  }
}
