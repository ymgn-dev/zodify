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
    return `
    ${this.schemaProperty.description ? `// ${this.schemaProperty.description}` : ''}
    ${this.schemaPropertyName ? `${this.schemaPropertyName}: ` : ''}z.boolean()${!this.required ? '.optional()' : ''}${this.convertDefault()},
    `
  }
}
