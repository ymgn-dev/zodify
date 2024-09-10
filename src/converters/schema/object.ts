import { SchemaConverterBase } from '.'
import { pascalToCamel } from '../../utils'
import {
  ArrayPropertyConverter,
  BooleanPropertyConverter,
  IntegerPropertyConverter,
  NumberPropertyConverter,
  RefPropertyConverter,
  StringPropertyConverter,
} from '../schema-property'
import type { ObjectSchema } from '../../types'
import type { SchemaPropertyConverterBase } from '../schema-property'

export class ObjectSchemaConverter extends SchemaConverterBase {
  constructor(
    protected readonly name: string,
    protected readonly schema: ObjectSchema,
  ) {
    super(name, schema)
  }

  override convert() {
    const schemaPropertyNames = Object.keys(this.schema.properties)
    const propertyConverters: SchemaPropertyConverterBase[] = []

    for (const propertyName of schemaPropertyNames) {
      const property = this.schema.properties[propertyName]
      switch (property.type) {
        case 'string':
          propertyConverters.push(
            new StringPropertyConverter(
              this.name,
              propertyName,
              property,
              this.schema.required?.includes(propertyName) ?? false,
            ),
          )
          break
        case 'number':
          propertyConverters.push(
            new NumberPropertyConverter(
              this.name,
              propertyName,
              property,
              this.schema.required?.includes(propertyName) ?? false,
            ),
          )
          break
        case 'integer':
          propertyConverters.push(
            new IntegerPropertyConverter(
              this.name,
              propertyName,
              property,
              this.schema.required?.includes(propertyName) ?? false,
            ),
          )
          break
        case 'boolean':
          propertyConverters.push(
            new BooleanPropertyConverter(
              this.name,
              propertyName,
              property,
              this.schema.required?.includes(propertyName) ?? false,
            ),
          )
          break
        case 'array':
          propertyConverters.push(
            new ArrayPropertyConverter(
              this.name,
              propertyName,
              property,
              this.schema.required?.includes(propertyName) ?? false,
            ),
          )
          break
        case 'ref':
          propertyConverters.push(
            new RefPropertyConverter(
              this.name,
              propertyName,
              property,
              this.schema.required?.includes(propertyName) ?? false,
            ),
          )
          break
      }
    }
    return `${this.schema.description ? `// ${this.schema.description}` : ''}
    ${this.name ? `export const ${pascalToCamel(this.name)}Schema = ` : ''}z.object({
      ${propertyConverters.map(converter => converter.convert()).join('')}
    })`
  }
}
