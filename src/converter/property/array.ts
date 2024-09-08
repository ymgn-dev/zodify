import { assert } from 'node:console'
import { pascalToCamel } from '../../utils'
import { refCount } from '../ref-count'
import { PropConverterBase } from './base'
import type { Component, Property } from '../schemas'

export class ArrayPropConverter extends PropConverterBase {
  constructor(
    protected readonly key: string,
    protected readonly prop: Property,
    protected readonly cmp: Component,
  ) {
    super(key, prop)
  }

  minItemsToZodString(minItems?: number) {
    return minItems !== undefined ? `.min(${minItems})` : ''
  }

  maxItemsToZodString(maxItems?: number) {
    return maxItems !== undefined ? `.max(${maxItems})` : ''
  }

  defaultToZodString(defaultValue?: string) {
    return defaultValue !== undefined ? `.default(${defaultValue})` : ''
  }

  itemName() {
    const ref = this.prop.items?.$ref ?? ''
    if (!ref) {
      assert('items.$ref is not defined')
    }
    const cmp = ref.split('/').pop() as string
    // add to refCount
    refCount[cmp] = (refCount[`${pascalToCamel(cmp)}Schema`] ?? 0) + 1
    return `${pascalToCamel(cmp)}Schema`
  }

  override toZodString() {
    return `${pascalToCamel(this.key)}: z.array(${this.itemName()})\
    ${this.minItemsToZodString(this.cmp.minItems)}\
    ${this.maxItemsToZodString(this.cmp.maxItems)}\
    ${this.defaultToZodString(this.prop.default as string | undefined)}
    `
  }
}
