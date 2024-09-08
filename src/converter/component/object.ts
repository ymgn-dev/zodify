import { assert } from 'node:console'
import { camelize } from '../../utils'
import { NumberPropConverter } from '../property/number'
import { StringPropConverter } from '../property/string'
import { CmpConverterBase } from './base'
import type { PropConverterBase } from '../property/base'

export class ObjectCmpConverter extends CmpConverterBase {
  toZodString() {
    const props = Object.entries(this.cmp.properties ?? {}).map(([key, prop]) => {
      let propConverter: PropConverterBase | undefined
      switch (prop.type) {
        case 'string':
          propConverter = new StringPropConverter(key, prop)
          break
        case 'number':
        case 'integer':
          propConverter = new NumberPropConverter(key, prop)
          break
        // TODO: Add support for other types
        // boolean
        // object
        // integer
        // array
        default:
          assert(false, `Unsupported type: ${prop.type}`)
      }
      return propConverter?.toZodString() ?? ''
    })

    return `z.object({\n  ${props.join(',\n  ')}\n})`
  }
}
