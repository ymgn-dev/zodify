import { SchemaPropertyConverterBase } from '.'
import type { BooleanSchemaProperty } from '../../types'

export class BooleanPropertyConverter extends SchemaPropertyConverterBase {
  constructor(
    protected readonly schemaName: string,
    protected readonly schemaPropertyName: string,
    protected readonly schemaProperty: BooleanSchemaProperty,
    protected readonly required: boolean,
  ) {
    super(schemaName, schemaPropertyName, schemaProperty)
  }

  convertDefault() {
    if (this.schemaProperty.default === undefined) {
      return ''
    }
    return `.default(${this.schemaProperty.default})`
  }

  override convert() {
    const comment = this.schemaProperty.description ? `\n\n// ${this.schemaProperty.description}\n` : ''
    const propertyName = this.schemaPropertyName ? `${this.schemaPropertyName}: ` : ''
    const required = !this.required ? '.optional()' : ''
    const defaultValue = this.convertDefault().trim()
    return `${comment}${propertyName}z.boolean()${required}${defaultValue},`
  }
}
