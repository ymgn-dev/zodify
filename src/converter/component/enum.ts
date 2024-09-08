import { CmpConverterBase } from './base'

export class EnumCmpConverter extends CmpConverterBase {
  toZodString() {
    const values = this.cmp.enum?.map(v => `'${v}'`)
    return `z.enum([${values?.join(', ')}])`
  }
}
