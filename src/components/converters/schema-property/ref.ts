import { SchemaPropertyConverterBase } from '.'
import { pascalToCamel } from '../../../utils'
import { YamlSchemaManager } from '../../yaml-schema-manager'
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
    const comment = this.schemaProperty.description ? `\n\n// ${this.schemaProperty.description}\n` : ''
    const propertyName = this.schemaPropertyName ? `${this.schemaPropertyName}: ` : ''
    const ref = this.convertRef().trim()
    const min = this.convertMinItems().trim()
    const max = this.convertMaxItems().trim()
    const required = !this.required ? '.optional()' : ''
    const defaultValue = this.convertDefault().trim()
    return `${comment}${propertyName}${ref}${min}${max}${required}${defaultValue},`
  }
}
