import { SchemaPropertyConverterBase } from '.'
import type { ExtendDocSchemaProperty } from '../../types'

export class ExtendDocPropertyConverter extends SchemaPropertyConverterBase {
  constructor(
    protected readonly schemaName: string,
    protected readonly schemaPropertyName: string,
    protected readonly schemaProperty: ExtendDocSchemaProperty,
    protected readonly required: boolean,
  ) {
    super(schemaName, schemaPropertyName, schemaProperty)
  }

  override convert() {
    const split = this.schemaProperty.description.split('zod:')
    const comment = split.at(0) ? `\n\n// ${split.at(0)}\n` : ''
    const schema = split.at(1)?.trim() ?? ''
    const propertyName = this.schemaPropertyName ? `${this.schemaPropertyName}: ` : ''
    return `${comment}${propertyName}${schema},`
  }
}
