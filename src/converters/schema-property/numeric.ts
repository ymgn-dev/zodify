import { SchemaPropertyConverterBase } from '.'
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
    return `
    ${this.schemaProperty.description ? `// ${this.schemaProperty.description}` : ''}
    ${this.schemaPropertyName}: z.number()
    ${this.convertMinimum()}
    ${this.convertMaximum()}
    ${!this.required ? '.optional()' : ''}
    ${this.convertDefault()},
    `
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
    return `
    ${this.schemaProperty.description ? `// ${this.schemaProperty.description}` : ''}
    ${this.schemaPropertyName ? `${this.schemaPropertyName}: ` : ''}z.number()${this.convertMinimum()}${this.convertMaximum()}${!this.required ? '.optional()' : ''}${this.convertDefault()},
    `
  }
}
