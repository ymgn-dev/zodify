import { CmpConverterBase } from './base'

export class EnumCmpConverter extends CmpConverterBase {
  override toZodString() {
    const values = this.cmp.enum?.map(v => `'${v}'`)
    return `z.enum([${values?.join(', ')}])`
  }
}
