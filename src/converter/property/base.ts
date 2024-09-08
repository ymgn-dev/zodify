import type { Property } from '../schemas'

export abstract class PropConverterBase {
  constructor(
    protected readonly key: string,
    protected readonly prop: Property,
  ) { }

  public abstract toZodString(): string
}
