import {
  BooleanPropertyConverter,
  IntegerPropertyConverter,
  NumberPropertyConverter,
  SchemaPropertyConverterBase,
  StringPropertyConverter,
} from '.'
import { pascalToCamel } from '../../../utils'
import { YamlSchemaManager } from '../../yaml-schema-manager'
import type {
  AnySchemaPropertyFormat,
  ArraySchemaProperty,
  IntegerSchemaPropertyFormat,
  NumberSchemaPropertyFormat,
  SchemaDataType,
  StringSchemaPropertyFormat,
} from '../../types'

export class ArrayPropertyConverter extends SchemaPropertyConverterBase {
  constructor(
    protected readonly schemaName: string,
    protected readonly schemaPropertyName: string,
    protected readonly schemaProperty: ArraySchemaProperty,
    protected readonly required: boolean,
  ) {
    super(schemaName, schemaPropertyName, schemaProperty)
  }

  convertItem(
    type: SchemaDataType,
    format?: AnySchemaPropertyFormat,
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
      default:
        return ''
    }
  }

  convertItemRef() {
    if (!this.schemaProperty.items.$ref) {
      return ''
    }
    const depSchemaName = this.schemaProperty.items.$ref.split('/').pop() ?? ''
    YamlSchemaManager.addSchemaDependencies(this.schemaName, depSchemaName)
    return `${pascalToCamel(depSchemaName)}Schema`
  }

  convertItemType() {
    const type = this.schemaProperty.items.type
    if (type === undefined) {
      return ''
    }
    return this.convertItem(
      type,
      this.schemaProperty.items.format as AnySchemaPropertyFormat,
    )
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
    const itemRef = this.convertItemRef().trim()
    const itemType = this.convertItemType().trim()
    const min = this.convertMinItems().trim()
    const max = this.convertMaxItems().trim()
    const required = !this.required ? '.optional()' : ''
    const defaultValue = this.convertDefault().trim()
    return `${comment}${propertyName}z.array(${itemRef !== '' ? itemRef : itemType})${min}${max}${required}${defaultValue},`
  }
}
