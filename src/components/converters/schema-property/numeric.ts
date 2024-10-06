import { SchemaPropertyConverterBase } from '.'
import { pascalToCamel } from '../../../utils'
import type { IntegerSchemaProperty, NumberSchemaProperty } from '../../types'

export class NumberPropertyConverter extends SchemaPropertyConverterBase {
  constructor(
    protected readonly schemaName: string,
    protected readonly schemaPropertyName: string,
    protected readonly schemaProperty: NumberSchemaProperty,
    protected readonly required: boolean,
  ) {
    super(schemaName, schemaPropertyName, schemaProperty)
  }

  convertMinimum() {
    if (this.schemaProperty.minimum === undefined) {
      return ''
    }

    return this.schemaProperty.exclusiveMinimum
      ? `.gt(${this.schemaProperty.minimum})`
      : `.gte(${this.schemaProperty.minimum})`
  }

  convertMaximum() {
    if (this.schemaProperty.maximum === undefined) {
      return ''
    }

    return this.schemaProperty.exclusiveMaximum
      ? `.lt(${this.schemaProperty.maximum})`
      : `.lte(${this.schemaProperty.maximum})`
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
    const min = this.convertMinimum().trim()
    const max = this.convertMaximum().trim()
    const defaultValue = this.convertDefault().trim()
    return `${comment}${propertyName}z.number()${min}${max}${required}${defaultValue},`
  }

  convertAsScalar() {
    const comment = this.schemaProperty.description ? `\n\n// ${this.schemaProperty.description}\n` : ''
    const name = this.schemaPropertyName ? `${pascalToCamel(this.schemaPropertyName)}Schema = ` : ''
    const required = !this.required ? '.optional()' : ''
    const min = this.convertMinimum().trim()
    const max = this.convertMaximum().trim()
    const defaultValue = this.convertDefault().trim()
    return `${comment}export const ${name}z.number()${min}${max}${required}${defaultValue}`
  }
}

export class IntegerPropertyConverter extends SchemaPropertyConverterBase {
  constructor(
    protected readonly schemaName: string,
    protected readonly schemaPropertyName: string,
    protected readonly schemaProperty: IntegerSchemaProperty,
    protected readonly required: boolean,
  ) {
    super(schemaName, schemaPropertyName, schemaProperty)
  }

  convertMinimum() {
    if (this.schemaProperty.minimum === undefined) {
      return ''
    }

    return this.schemaProperty.exclusiveMinimum
      ? `.gt(${this.schemaProperty.minimum})`
      : `.gte(${this.schemaProperty.minimum})`
  }

  convertMaximum() {
    if (this.schemaProperty.maximum === undefined) {
      return ''
    }

    return this.schemaProperty.exclusiveMaximum
      ? `.lt(${this.schemaProperty.maximum})`
      : `.lte(${this.schemaProperty.maximum})`
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
    const min = this.convertMinimum().trim()
    const max = this.convertMaximum().trim()
    const defaultValue = this.convertDefault().trim()
    return `${comment}${propertyName}z.number().int()${min}${max}${required}${defaultValue},`
  }

  convertAsScalar() {
    const comment = this.schemaProperty.description ? `\n\n// ${this.schemaProperty.description}\n` : ''
    const name = this.schemaPropertyName ? `${pascalToCamel(this.schemaPropertyName)}Schema = ` : ''
    const required = !this.required ? '.optional()' : ''
    const min = this.convertMinimum().trim()
    const max = this.convertMaximum().trim()
    const defaultValue = this.convertDefault().trim()
    return `${comment}export const ${name}z.number().int()${min}${max}${required}${defaultValue}`
  }
}
