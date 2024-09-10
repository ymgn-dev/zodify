import { SchemaPropertyConverterBase } from '.'
import { pascalToCamel, YamlSchemaManager } from '../../utils'
import type { RefSchemaProperty } from '../../types'

export class RefPropertyConverter extends SchemaPropertyConverterBase {
  constructor(
    protected readonly schemaName: string,
    protected readonly schemaPropertyName: string,
    protected readonly schemaProperty: RefSchemaProperty,
    protected readonly required: boolean,
  ) {
    super(schemaName, schemaPropertyName, schemaProperty)
  }

  convertRef() {
    const depSchemaName = this.schemaProperty.$ref.split('/').pop() ?? ''
    YamlSchemaManager.addSchemaDependencies(this.schemaName, depSchemaName)
    return `${pascalToCamel(depSchemaName)}Schema`
  }

  convertMinItems() {
    if (this.schemaProperty.minItems === undefined) {
      return ''
    }
    return `.min(${this.schemaProperty.minItems})`
  }

  convertMaxItems() {
    if (this.schemaProperty.maxItems === undefined) {
      return ''
    }
    return `.max(${this.schemaProperty.maxItems})`
  }

  convertDefault() {
    if (this.schemaProperty.default === undefined) {
      return ''
    }
    return Array.isArray(this.schemaProperty.default)
      ? `.default([${this.schemaProperty.default}])`
      : `.default(${this.schemaProperty.default})`
  }

  override convert() {
    return `
    ${this.schemaProperty.description ? `// ${this.schemaProperty.description}` : ''}
    ${this.schemaPropertyName ? `${this.schemaPropertyName}: ` : ''}${this.convertRef()}${this.convertMinItems()}${this.convertMaxItems()}${!this.required ? '.optional()' : ''}${this.convertDefault()},
    `
  }
}
