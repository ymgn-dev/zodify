import { SchemaConverterBase } from '.'
import { YamlSchemaManager } from '../../managers/yaml-schema-manager'
import { pascalToCamel } from '../../utils'
import {
  integerSchemaPropertyFormatValidator,
  numberSchemaPropertyFormatValidator,
  stringSchemaPropertyFormatValidator,
} from '../../validators/schema-property'
import {
  BooleanPropertyConverter,
  IntegerPropertyConverter,
  NumberPropertyConverter,
  StringPropertyConverter,
} from '../schema-property'
import type { ArraySchema } from '../../types'
import type { SchemaPropertyConverterBase } from '../schema-property'

export class ArraySchemaConverter extends SchemaConverterBase {
  constructor(
    protected readonly name: string,
    protected readonly schema: ArraySchema,
  ) {
    super(name, schema)
  }

  convertItemRef() {
    if (!this.schema.items.$ref) {
      return undefined
    }
    const depSchemaName = this.schema.items.$ref.split('/').pop() ?? ''
    YamlSchemaManager.addSchemaDependencies(this.name, depSchemaName)
    return `${pascalToCamel(depSchemaName)}Schema`
  }

  convertItemType() {
    const type = this.schema.items.type
    if (type === undefined) {
      return ''
    }

    let converter: SchemaPropertyConverterBase | undefined
    switch (type) {
      case 'string': {
        const format = stringSchemaPropertyFormatValidator
          .safeParse(this.schema.items.format)
          .data
        converter = new StringPropertyConverter(this.name, '', { type, format }, true)
        break
      }
      case 'number': {
        const format = numberSchemaPropertyFormatValidator
          .safeParse(this.schema.items.format)
          .data
        converter = new NumberPropertyConverter(this.name, '', { type, format }, true)
        break
      }
      case 'integer': {
        const format = integerSchemaPropertyFormatValidator
          .safeParse(this.schema.items.format)
          .data
        converter = new IntegerPropertyConverter(this.name, '', { type, format }, true)
        break
      }
      case 'boolean': {
        converter = new BooleanPropertyConverter(this.name, '', { type }, true)
        break
      }
    }
    return converter?.convert()
  }

  convertMinItems() {
    if (this.schema.minItems === undefined) {
      return ''
    }
    return `.min(${this.schema.minItems})`
  }

  convertMaxItems() {
    if (this.schema.maxItems === undefined) {
      return ''
    }
    return `.max(${this.schema.maxItems})`
  }

  override convert() {
    const comment = this.schema.description ? `// ${this.schema.description}\n` : ''
    const name = this.name ? `export const ${pascalToCamel(this.name)}Schema = ` : ''
    const itemRef = this.convertItemRef()?.trim() ?? ''
    const itemType = this.convertItemType().trim() ?? ''
    const min = this.convertMinItems().trim()
    const max = this.convertMaxItems().trim()
    return `${comment}${name}z.array(${itemRef !== '' ? itemRef : itemType})${min}${max}`
  }
}
