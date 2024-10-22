import { assert } from 'node:console'
import { SchemaPropertyConverterBase } from '.'
import { pascalToCamel } from '../../utils'
import type { StringSchemaProperty } from '../../types'

export class StringPropertyConverter extends SchemaPropertyConverterBase {
  constructor(
    protected readonly schemaName: string,
    protected readonly schemaPropertyName: string,
    protected readonly schemaProperty: StringSchemaProperty,
    protected readonly required: boolean,
  ) {
    super(schemaName, schemaPropertyName, schemaProperty)
  }

  convertFormat() {
    switch (this.schemaProperty.format) {
      case 'date':
        return '.date()'
      case 'date-time':
        return '.datetime()'
      case 'duration':
        return '.duration()'
      case 'time':
        return '.time()'
      case 'byte':
        assert(false, '[Schema property]: byte is not supported')
        break
      case 'uri':
        return '.url()'
      case 'email':
        return '.email()'
      case 'uuid':
        return '.uuid()'
      case 'cuid':
        return '.cuid()'
      case 'cuid2':
        return '.cuid2()'
      case 'ip':
        return '.ip()'
      case undefined:
        return ''
      default:
        assert(false, `[Schema property]: ${this.schemaProperty.format} is not supported`)
    }
  }

  convertMinLength() {
    if (this.schemaProperty.minLength === undefined) {
      return ''
    }
    return `.min(${this.schemaProperty.minLength})`
  }

  convertMaxLength() {
    if (this.schemaProperty.maxLength === undefined) {
      return ''
    }
    return `.max(${this.schemaProperty.maxLength})`
  }

  convertDefault() {
    if (this.schemaProperty.default === undefined) {
      return ''
    }
    return `.default('${this.schemaProperty.default}')`
  }

  override convert() {
    const comment = this.schemaProperty.description ? `\n\n// ${this.schemaProperty.description}\n` : ''
    const propertyName = this.schemaPropertyName ? `${this.schemaPropertyName}: ` : ''
    const format = this.convertFormat()
    const min = this.convertMinLength().trim()
    const max = this.convertMaxLength().trim()
    const required = !this.required ? '.optional()' : ''
    const defaultValue = this.convertDefault().trim()
    return `${comment}${propertyName}z.string()${format}${min}${max}${required}${defaultValue},`
  }

  convertAsScalar() {
    const comment = this.schemaProperty.description ? `\n\n// ${this.schemaProperty.description}\n` : ''
    const name = this.schemaPropertyName ? `${pascalToCamel(this.schemaPropertyName)}Schema = ` : ''
    const format = this.convertFormat()
    const min = this.convertMinLength().trim()
    const max = this.convertMaxLength().trim()
    const required = !this.required ? '.optional()' : ''
    const defaultValue = this.convertDefault().trim()
    return `${comment}export const ${name}z.string()${format}${min}${max}${required}${defaultValue}`
  }
}
