import {
  SchemaPropertyConverterBase,
} from '.'
import { YamlSchemaManager } from '../../managers/yaml-schema-manager'
import { pascalToCamel } from '../../utils'
import type {
  AllOfSchemaProperty,
} from '../../types'

export class AllOfPropertyConverter extends SchemaPropertyConverterBase {
  constructor(
    protected readonly schemaName: string,
    protected readonly schemaPropertyName: string,
    protected readonly schemaProperty: AllOfSchemaProperty,
    protected readonly required: boolean,
  ) {
    super(schemaName, schemaPropertyName, schemaProperty)
  }

  convertRefs() {
    const schemas: string[] = []
    for (const allOf of this.schemaProperty.allOf ?? []) {
      const depSchemaName = allOf.$ref.split('/').pop() ?? ''
      YamlSchemaManager.addSchemaDependencies(this.schemaName, depSchemaName)
      schemas.push(`${pascalToCamel(depSchemaName)}Schema`)
    }
    return schemas
  }

  override convert() {
    const comment = this.schemaProperty.description ? `\n\n// ${this.schemaProperty.description}\n` : ''
    const propertyName = this.schemaPropertyName ? `${this.schemaPropertyName}: ` : ''
    const refs = this.convertRefs()
    const required = !this.required ? '.optional()' : ''
    return `${comment}${propertyName}${refs.length > 1 ? `${refs.join('.merge(')})` : refs[0]}${required},`
  }
}
