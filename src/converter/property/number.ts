import { pascalToCamel } from '../../utils'
import { PropConverterBase } from './base'
import type { NumberFormat } from '../schemas'

export class NumberPropConverter extends PropConverterBase {
  minToZodString(minimum?: number) {
    return minimum !== undefined ? `.min(${minimum})` : ''
  }

  maxToZodString(maximum?: number) {
    return maximum !== undefined ? `.max(${maximum})` : ''
  }

  defaultToZodString(defaultValue?: number) {
    return defaultValue !== undefined ? `.default(${defaultValue})` : ''
  }

  formatToZodString(format?: NumberFormat) {
    switch (format) {
      case 'float':
      case 'double':
      case 'int8':
      case 'int16':
      case 'int32':
      case 'int64':
      default:
        return ''
    }
  }

  override toZodString() {
    return `${pascalToCamel(this.key)}: z.string()${this.formatToZodString(this.prop.format as NumberFormat)}\
    ${this.minToZodString(this.prop.minimum)}\
    ${this.maxToZodString(this.prop.maximum)}\
    ${this.defaultToZodString(this.prop.default as number | undefined)}\
    ${this.optionalToZodString()}
    `
  }
}
