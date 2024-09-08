import assert from 'node:assert'
import { pascalToCamel } from '../../utils'
import { refCount } from '../ref-count'
import { PropConverterBase } from './base'

export class RefPropConverter extends PropConverterBase {
  itemName() {
    const ref = this.prop.$ref ?? ''
    if (!ref) {
      assert('items.$ref is not defined')
    }
    const cmp = ref.split('/').pop() as string
    // add to refCount
    refCount[cmp] = (refCount[`${pascalToCamel(cmp)}Schema`] ?? 0) + 1
    return `${pascalToCamel(cmp)}Schema`
  }

  override toZodString() {
    return `${pascalToCamel(this.key)}: ${this.itemName()}`
  }
}
