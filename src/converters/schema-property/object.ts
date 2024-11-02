import {
  AllOfPropertyConverter,
  ArrayPropertyConverter,
  BooleanPropertyConverter,
  ExtendDocPropertyConverter,
  IntegerPropertyConverter,
  NumberPropertyConverter,
  OneOrAnyOfPropertyConverter,
  RefPropertyConverter,
  SchemaPropertyConverterBase,
  StringPropertyConverter,
} from '.'
import { YamlSchemaManager } from '../../managers/yaml-schema-manager'
import { pascalToCamel } from '../../utils'
import { extendDocSchemaPropertyValidator } from '../../validators/schema-property'
import type { ObjectSchemaProperty } from '../../types'

export class ObjectPropertyConverter extends SchemaPropertyConverterBase {
  constructor(
    protected readonly schemaName: string,
    protected readonly schemaPropertyName: string,
    protected readonly schemaProperty: ObjectSchemaProperty,
    protected readonly required: boolean,
  ) {
    super(schemaName, schemaPropertyName, schemaProperty)
  }

  convertAllOf() {
    const schemas: string[] = []
    for (const allOf of this.schemaProperty.allOf ?? []) {
      const depSchemaName = allOf.$ref.split('/').pop() ?? ''
      YamlSchemaManager.addSchemaDependencies(this.schemaName, depSchemaName)
      schemas.push(`${pascalToCamel(depSchemaName)}Schema`)
    }
    return schemas
  }

  override convert() {
    const schemaPropertyNames = Object.keys(this.schemaProperty.properties)
    const propertyConverters: SchemaPropertyConverterBase[] = []

    for (const propertyName of schemaPropertyNames) {
      const property = this.schemaProperty.properties[propertyName]
      if (extendDocSchemaPropertyValidator.safeParse(property).success) {
        const parsed = extendDocSchemaPropertyValidator.parse(property)
        propertyConverters.push(
          new ExtendDocPropertyConverter(
            this.schemaName,
            propertyName,
            parsed,
            this.schemaProperty.required?.includes(propertyName) ?? false,
          ),
        )
        continue
      }
      switch (property.type) {
        case 'string':
          propertyConverters.push(
            new StringPropertyConverter(
              this.schemaName,
              propertyName,
              property,
              this.schemaProperty.required?.includes(propertyName) ?? false,
            ),
          )
          break
        case 'number':
          propertyConverters.push(
            new NumberPropertyConverter(
              this.schemaName,
              propertyName,
              property,
              this.schemaProperty.required?.includes(propertyName) ?? false,
            ),
          )
          break
        case 'integer':
          propertyConverters.push(
            new IntegerPropertyConverter(
              this.schemaName,
              propertyName,
              property,
              this.schemaProperty.required?.includes(propertyName) ?? false,
            ),
          )
          break
        case 'boolean':
          propertyConverters.push(
            new BooleanPropertyConverter(
              this.schemaName,
              propertyName,
              property,
              this.schemaProperty.required?.includes(propertyName) ?? false,
            ),
          )
          break
        case 'array':
          propertyConverters.push(
            new ArrayPropertyConverter(
              this.schemaName,
              propertyName,
              property,
              this.schemaProperty.required?.includes(propertyName) ?? false,
            ),
          )
          break
        case 'ref':
          propertyConverters.push(
            new RefPropertyConverter(
              this.schemaName,
              propertyName,
              property,
              this.schemaProperty.required?.includes(propertyName) ?? false,
            ),
          )
          break
        case 'anyOf':
        case 'oneOf':
          propertyConverters.push(
            new OneOrAnyOfPropertyConverter(
              this.schemaName,
              propertyName,
              property,
              this.schemaProperty.required?.includes(propertyName) ?? false,
            ),
          )
          break
        case 'allOf':
          propertyConverters.push(
            new AllOfPropertyConverter(
              this.schemaName,
              propertyName,
              property,
              this.schemaProperty.required?.includes(propertyName) ?? false,
            ),
          )
          break
        // TODO: add objectPropertyConverter
      }
    }

    const comment = this.schemaProperty.description ? `\n\n// ${this.schemaProperty.description}\n` : ''
    const propertyName = this.schemaPropertyName ? `${this.schemaPropertyName}: ` : ''
    const allOf = this.convertAllOf()
    const allOfSchema = allOf.length > 1 ? `.${allOf.join('.merge(')})` : `${allOf.length > 0 ? `.merge(${allOf[0]})` : ''}`

    return `${comment}${propertyName}z.object({
      ${propertyConverters.map(converter => converter.convert()).join('\n')}
    })${allOfSchema}`
  }
}
