import type { Property } from '../schemas'

export abstract class PropConverterBase {
  constructor(
    protected readonly key: string,
    protected readonly prop: Property,
  ) { }

  protected abstract formatToZodString(format: unknown): string
  public abstract toZodString(): string
}
