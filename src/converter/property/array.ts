import { assert } from 'node:console'
import type { ZodAny } from 'zod'
import { pascalToCamel } from '../../utils'
import { refCount } from '../ref-count'
import { PropConverterBase } from './base'
import type { Component, Property, Required } from '../schemas'

export class ArrayPropConverter extends PropConverterBase {
  constructor(
    protected readonly key: string,
    protected readonly prop: Property,
    protected readonly required: Required,
    protected readonly cmp: Component,
  ) {
    super(key, prop, required)
  }

  minItemsToZodString(minItems?: number) {
    return minItems !== undefined ? `.min(${minItems})` : ''
  }

  maxItemsToZodString(maxItems?: number) {
    return maxItems !== undefined ? `.max(${maxItems})` : ''
  }

  defaultToZodString(defaultValue?: unknown) {
    if (typeof defaultValue === 'string') {
      return `.default('${defaultValue}')`
    }
    if (typeof defaultValue === 'number') {
      return `.default(${defaultValue})`
    }
    if (typeof defaultValue === 'object' && Array.isArray(defaultValue)) {
      return `.default([${[defaultValue]}])`
    }
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
    ${this.defaultToZodString(this.prop.default)}\
    ${this.optionalToZodString()}
    `
  }
}
