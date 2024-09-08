import { pascalToCamel } from '../../utils'
import { PropConverterBase } from './base'
import type { StringFormat } from '../schemas'

export class StringPropConverter extends PropConverterBase {
  minLengthToZodString(minLength?: number) {
    return minLength !== undefined ? `.min(${minLength})` : ''
  }

  maxLengthToZodString(maxLength?: number) {
    return maxLength !== undefined ? `.max(${maxLength})` : ''
  }

  defaultToZodString(defaultValue?: string) {
    return defaultValue !== undefined ? `.default('${defaultValue}')` : ''
  }

  formatToZodString(format?: StringFormat) {
    switch (format) {
      case 'date':
        return '.date()'
      case 'date-time':
        return '.datetime()'
      case 'uuid':
        return '.uuid()'
      case 'email':
        return '.email()'
      case 'uri':
        return '.url()'
      case 'ipv4':
      case 'ipv6':
        return '.ip()'
      default:
        return ''
    }
  }

  override toZodString() {
    return `${pascalToCamel(this.key)}: z.string()${this.formatToZodString(this.prop.format as StringFormat)}\
    ${this.minLengthToZodString(this.prop.minLength)}\
    ${this.maxLengthToZodString(this.prop.maxLength)}\
    ${this.defaultToZodString(this.prop.default as string | undefined)}`
  }
}
