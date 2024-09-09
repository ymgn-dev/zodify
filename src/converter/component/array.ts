import { assert } from 'node:console'
import { pascalToCamel } from '../../utils/pascal-to-camel'
import { refCount } from '../ref-count'
import { CmpConverterBase } from './base'

export class ArrayCmpConverter extends CmpConverterBase {
  minItemsToZodString(minItems?: number) {
    return minItems !== undefined ? `.min(${minItems})` : ''
  }

  maxItemsToZodString(maxItems?: number) {
    return maxItems !== undefined ? `.max(${maxItems})` : ''
  }

  itemName() {
    const ref = this.cmp.items?.$ref ?? ''
    if (!ref) {
      assert('items.$ref is not defined')
    }
    const cmp = ref.split('/').pop() as string
    // add to refCount
    refCount[cmp] = (refCount[`${pascalToCamel(cmp)}Schema`] ?? 0) + 1
    return `${pascalToCamel(cmp)}Schema`
  }

  override toZodString() {
    return `z.array(${this.itemName()})\
    ${this.minItemsToZodString(this.cmp.minItems)}\
    ${this.maxItemsToZodString(this.cmp.maxItems)}\
    `
  }
}
