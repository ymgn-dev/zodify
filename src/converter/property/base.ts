import type { Property, Required } from '../schemas'

export abstract class PropConverterBase {
  constructor(
    protected readonly key: string,
    protected readonly prop: Property,
    protected readonly required: Required,
  ) { }

  protected optionalToZodString() {
    const isOptional = !this.required?.includes(this.key)
    return isOptional ? '.optional()' : ''
  }

  public abstract toZodString(): string
}
