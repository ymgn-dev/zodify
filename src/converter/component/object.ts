import { assert } from 'node:console'
import { ArrayPropConverter } from '../property/array'
import { BooleanPropConverter } from '../property/boolean'
import { NumberPropConverter } from '../property/number'
import { RefPropConverter } from '../property/ref'
import { StringPropConverter } from '../property/string'
import { CmpConverterBase } from './base'
import type { PropConverterBase } from '../property/base'

export class ObjectCmpConverter extends CmpConverterBase {
  override toZodString() {
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
        case 'boolean':
          propConverter = new BooleanPropConverter(key, prop)
          break
        case 'array':
          propConverter = new ArrayPropConverter(key, prop, this.cmp)
          break
        case undefined:
          if (prop.$ref) {
            propConverter = new RefPropConverter(key, prop)
          }
          break
        // TODO: Add support for other types
        // object
        default:
          assert(false, `Unsupported type: ${prop.type}`)
      }
      return propConverter?.toZodString() ?? ''
    })

    return `z.object({\n  ${props.join(',\n  ')}\n})`
  }
}
