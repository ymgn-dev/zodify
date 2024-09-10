import {
  BooleanPropertyConverter,
  IntegerPropertyConverter,
  NumberPropertyConverter,
  SchemaPropertyConverterBase,
  StringPropertyConverter,
} from '.'
import { pascalToCamel, YamlSchemaManager } from '../../utils'
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
    const itemRef = this.convertItemRef()
    const itemType = this.convertItemType()

    return `${this.schemaProperty.description ? `\n\n// ${this.schemaProperty.description}` : ''}
    ${this.schemaPropertyName ? `${this.schemaPropertyName}: ` : ''}z.array(${itemRef === '' ? itemType : itemRef})${this.convertMinItems()}${this.convertMaxItems()}${!this.required ? '.optional()' : ''}${this.convertDefault()},`
  }
}
