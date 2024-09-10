export abstract class SchemaPropertyConverterBase {
  constructor(
    protected readonly schemaName: string,
    protected readonly schemaPropertyName: string,
    protected readonly schemaProperty: unknown,
  ) { }

  abstract convert(): string
}
