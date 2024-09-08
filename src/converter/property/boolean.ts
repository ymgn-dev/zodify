import { pascalToCamel } from '../../utils'
import { PropConverterBase } from './base'
import type { Format, NumberFormat } from '../schemas'

export class BooleanPropConverter extends PropConverterBase {
  defaultToZodString(defaultValue?: string) {
    return defaultValue !== undefined ? `.default(${defaultValue})` : ''
  }

  override toZodString() {
    return `${pascalToCamel(this.key)}: z.boolean()\
    ${this.defaultToZodString(this.prop.default as string | undefined)}`
  }
}
