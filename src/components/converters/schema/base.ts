export abstract class SchemaConverterBase {
  constructor(
    protected readonly name: string,
    protected readonly schema: unknown,
  ) { }

  abstract convert(): string
}
