import { assert } from 'node:console'
import {
  ArrayPropertyConverter,
  BooleanPropertyConverter,
  IntegerPropertyConverter,
  NumberPropertyConverter,
  SchemaPropertyConverterBase,
  StringPropertyConverter,
} from '.'
import { YamlSchemaManager } from '../../managers/yaml-schema-manager'
import { pascalToCamel } from '../../utils'
import type {
  AnySchemaPropertyFormat,
  ArraySchemaProperty,
  IntegerSchemaPropertyFormat,
  NumberSchemaPropertyFormat,
  OneOrAnyOfSchemaProperty,
  SchemaDataType,
  StringSchemaPropertyFormat,
} from '../../types'

export class OneOrAnyOfPropertyConverter extends SchemaPropertyConverterBase {
  constructor(
    protected readonly schemaName: string,
    protected readonly schemaPropertyName: string,
    protected readonly schemaProperty: OneOrAnyOfSchemaProperty,
    protected readonly required: boolean,
  ) {
    super(schemaName, schemaPropertyName, schemaProperty)
  }

  convertItem(
    type: SchemaDataType,
    format?: AnySchemaPropertyFormat,
    arraySchemaProperty?: ArraySchemaProperty,
  ) {
    switch (type) {
      case 'string': {
        return new StringPropertyConverter(
          this.schemaName,
          '',
          {
            type,
            format: format as StringSchemaPropertyFormat,
          },
          true,
        ).convert()
      }
      case 'number': {
        return new NumberPropertyConverter(
          this.schemaName,
          '',
          {
            type,
            format: format as NumberSchemaPropertyFormat,
          },
          true,
        ).convert()
      }
      case 'integer': {
        return new IntegerPropertyConverter(
          this.schemaName,
          '',
          {
            type,
            format: format as IntegerSchemaPropertyFormat,
          },
          true,
        ).convert()
      }
      case 'boolean': {
        return new BooleanPropertyConverter(this.schemaName, '', { type }, true).convert()
      }
      case 'array': {
        if (arraySchemaProperty) {
          return new ArrayPropertyConverter(this.schemaName, '', arraySchemaProperty, true).convert()
        }
        throw new Error('Array items is required')
      }
      default:
        return ''
    }
  }

  convertItems() {
    const converted: string[] = []
    const items = this.schemaProperty.anyOf ?? this.schemaProperty.oneOf ?? []
    for (const i of items) {
      if (i.$ref) {
        const depSchemaName = i.$ref.split('/').pop() ?? ''
        YamlSchemaManager.addSchemaDependencies(this.schemaName, depSchemaName)
        converted.push(`${pascalToCamel(depSchemaName)}Schema,`)
      }
      else if (i.type) {
        const format = i.format as AnySchemaPropertyFormat
        if (i.type === 'array') {
          converted.push(this.convertItem(i.type, format, i))
        }
        else {
          converted.push(this.convertItem(i.type, format))
        }
      }
      else {
        assert(false, `Invalid anyOf item: ${JSON.stringify(i)}`)
      }
    }
    return converted.join('')
  }

  convertDefault() {
    const dVal = this.schemaProperty.default
    if (dVal === undefined) {
      return ''
    }
    if (dVal.every(i => typeof i === 'string')) {
      return `.default([${dVal.map(i => `'${i}'`).join(', ')}])`
    }
    return `.default([${this.schemaProperty.default}])`
  }

  override convert() {
    const comment = this.schemaProperty.description ? `\n\n// ${this.schemaProperty.description}\n` : ''
    const propertyName = this.schemaPropertyName ? `${this.schemaPropertyName}: ` : ''
    const items = this.convertItems()
    const required = !this.required ? '.optional()' : ''
    const defaultValue = this.convertDefault().trim()
    return `${comment}${propertyName}z.union([${items}])${required}${defaultValue},`
  }
}
