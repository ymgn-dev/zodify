import { assert } from 'node:console'
import { SchemaConverterBase } from '.'
import { YamlSchemaManager } from '../../managers/yaml-schema-manager'
import { pascalToCamel } from '../../utils'
import {
  integerSchemaPropertyFormatValidator,
  numberSchemaPropertyFormatValidator,
  stringSchemaPropertyFormatValidator,
} from '../../validators/schema-property'
import {
  ArrayPropertyConverter,
  BooleanPropertyConverter,
  IntegerPropertyConverter,
  NumberPropertyConverter,
  StringPropertyConverter,
} from '../schema-property'
import type { AnySchemaPropertyFormat, ArraySchemaProperty, OneOrAnySchema, SchemaDataType } from '../../types'
import type { SchemaPropertyConverterBase } from '../schema-property'

export class OneOrAnyOfSchemaConverter extends SchemaConverterBase {
  constructor(
    protected readonly name: string,
    protected readonly schema: OneOrAnySchema,
  ) {
    super(name, schema)
  }

  convertItemType(
    type: SchemaDataType,
    format?: AnySchemaPropertyFormat,
    arraySchemaProperty?: ArraySchemaProperty,
  ) {
    let converter: SchemaPropertyConverterBase | undefined
    switch (type) {
      case 'string': {
        const validFormat = stringSchemaPropertyFormatValidator
          .safeParse(format)
          .data
        converter = new StringPropertyConverter(this.name, '', { type, format: validFormat }, true)
        break
      }
      case 'number': {
        const validFormat = numberSchemaPropertyFormatValidator
          .safeParse(format)
          .data
        converter = new NumberPropertyConverter(this.name, '', { type, format: validFormat }, true)
        break
      }
      case 'integer': {
        const validFormat = integerSchemaPropertyFormatValidator
          .safeParse(format)
          .data
        converter = new IntegerPropertyConverter(this.name, '', { type, format: validFormat }, true)
        break
      }
      case 'boolean': {
        converter = new BooleanPropertyConverter(this.name, '', { type }, true)
        break
      }
      case 'array': {
        if (arraySchemaProperty) {
          return new ArrayPropertyConverter(this.name, '', arraySchemaProperty, true).convert()
        }
        throw new Error('Array items is required')
      }
    }
    return converter?.convert() ?? ''
  }

  convertItems() {
    const converted: string[] = []
    const items = this.schema.anyOf ?? this.schema.oneOf ?? []
    for (const i of items) {
      if (i.$ref) {
        const depSchemaName = i.$ref.split('/').pop() ?? ''
        YamlSchemaManager.addSchemaDependencies(this.name, depSchemaName)
        converted.push(`${pascalToCamel(depSchemaName)}Schema,`)
      }
      else if (i.type) {
        if (i.type === 'array') {
          converted.push(this.convertItemType(i.type, i.format, i))
        }
        else {
          converted.push(this.convertItemType(i.type, i.format))
        }
      }
      else {
        assert(false, `Invalid anyOf item: ${JSON.stringify(i)}`)
      }
    }
    return converted.join('')
  }

  override convert() {
    const comment = this.schema.description ? `// ${this.schema.description}\n` : ''
    const name = this.name ? `export const ${pascalToCamel(this.name)}Schema = ` : ''
    const items = this.convertItems()
    return `${comment}${name}z.union([${items}])`
  }
}
