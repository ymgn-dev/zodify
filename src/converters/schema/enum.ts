import { SchemaConverterBase } from '.'
import { pascalToCamel } from '../../utils'
import type { EnumNumberSchema, EnumStringSchema } from '../../types'

export class EnumStringSchemaConverter extends SchemaConverterBase {
  constructor(
    protected readonly name: string,
    protected readonly schema: EnumStringSchema,
  ) {
    super(name, schema)
  }

  override convert() {
    return `${this.schema.description ? `// ${this.schema.description}` : ''}
    export const ${pascalToCamel(this.name)}Schema = z.enum([
      ${this.schema.enum.map(value => `'${value}'`).join(',\n')}
    ])`
  }
}

export class EnumNumberSchemaConverter extends SchemaConverterBase {
  constructor(
    protected readonly name: string,
    protected readonly schema: EnumNumberSchema,
  ) {
    super(name, schema)
  }

  override convert() {
    const comment = this.schema.description ? `// ${this.schema.description}\n` : ''
    const name = this.name ? `export const ${pascalToCamel(this.name)}Schema = ` : ''
    return `${comment}${name}z.enum([${this.schema.enum.join(',\n')}])`
  }
}
