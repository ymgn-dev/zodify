import { exec } from 'node:child_process'
import { assert } from 'node:console'
import * as fs from 'node:fs'
import path from 'node:path'
import yaml from 'yaml'
import {
  ArraySchemaConverter,
  EnumNumberSchemaConverter,
  EnumStringSchemaConverter,
  ObjectSchemaConverter,
  OneOrAnyOfSchemaConverter,
} from '../converters/schema'
import {
  BooleanPropertyConverter,
  IntegerPropertyConverter,
  NumberPropertyConverter,
  StringPropertyConverter,
} from '../converters/schema-property'
import { topologicalSort } from '../utils'
import {
  arraySchemaValidator,
  enumNumberSchemaValidator,
  enumStringSchemaValidator,
  objectSchemaValidator,
  oneOrAnyOfSchemaValidator,
} from '../validators/schema'
import {
  booleanSchemaPropertyValidator,
  integerSchemaPropertyValidator,
  numberSchemaPropertyValidator,
  stringSchemaPropertyValidator,
} from '../validators/schema-property'
import type { AnySchema } from '../types'

export class YamlSchemaManager {
  constructor(
    private readonly inputFilePath: string,
    private readonly writeFilePath: string,
  ) {
    this.initialize()
  }

  private static schemas: Map<string, AnySchema> = new Map()

  // Schema name, schema output
  private outputs: Record<string, string> = {}

  // Schema name, schema dependencies
  private static schemaDeps: Record<string, string[]> = {}

  // Load all schemas from the input file
  private initialize() {
    const file = fs.readFileSync(this.inputFilePath, 'utf8')
    const yamlFile = yaml.parse(file)

    for (const key of Object.keys(yamlFile?.components?.schemas ?? [])) {
      YamlSchemaManager.schemas.set(key, yamlFile.components.schemas[key])
      YamlSchemaManager.schemaDeps[key] = []
    }
  }

  public static addSchemaDependencies(name: string, depSchemaName: string) {
    assert(
      YamlSchemaManager.schemaDeps[depSchemaName] !== undefined,
      `Schema ${depSchemaName} does not exist in the ref counter`,
    )
    YamlSchemaManager.schemaDeps[depSchemaName] = [...YamlSchemaManager.schemaDeps[depSchemaName], name]
  }

  public convert() {
    for (const [key, value] of YamlSchemaManager.schemas) {
      // Schema
      if (arraySchemaValidator.safeParse(value).success) {
        const arraySchema = arraySchemaValidator.parse(value)
        const output = new ArraySchemaConverter(key, arraySchema).convert()
        this.outputs[key] = output
      }
      else if (enumStringSchemaValidator.safeParse(value).success) {
        const enumSchema = enumStringSchemaValidator.parse(value)
        const output = new EnumStringSchemaConverter(key, enumSchema).convert()
        this.outputs[key] = output
      }
      else if (enumNumberSchemaValidator.safeParse(value).success) {
        const enumSchema = enumNumberSchemaValidator.parse(value)
        const output = new EnumNumberSchemaConverter(key, enumSchema).convert()
        this.outputs[key] = output
      }
      else if (objectSchemaValidator.safeParse(value).success) {
        const objectSchema = objectSchemaValidator.parse(value)
        const output = new ObjectSchemaConverter(key, objectSchema).convert()
        this.outputs[key] = output
      }
      else if (oneOrAnyOfSchemaValidator.safeParse(value).success) {
        const oneOrAnyOfSchema = oneOrAnyOfSchemaValidator.parse(value)
        const output = new OneOrAnyOfSchemaConverter(key, oneOrAnyOfSchema).convert()
        this.outputs[key] = output
      }
      // Scalars(Schema Property と構造が一致するため Coverter を借りている)
      else if (booleanSchemaPropertyValidator.safeParse(value).success) {
        const booleanPropertySchema = booleanSchemaPropertyValidator.parse(value)
        const output = new BooleanPropertyConverter('', key, booleanPropertySchema, true).convertAsScalar()
        this.outputs[key] = output
      }
      else if (numberSchemaPropertyValidator.safeParse(value).success) {
        const numberPropertySchema = numberSchemaPropertyValidator.parse(value)
        const output = new NumberPropertyConverter('', key, numberPropertySchema, true).convertAsScalar()
        this.outputs[key] = output
      }
      else if (integerSchemaPropertyValidator.safeParse(value).success) {
        const integerPropertySchema = integerSchemaPropertyValidator.parse(value)
        const output = new IntegerPropertyConverter('', key, integerPropertySchema, true).convertAsScalar()
        this.outputs[key] = output
      }
      else if (stringSchemaPropertyValidator.safeParse(value).success) {
        const stringPropertySchema = stringSchemaPropertyValidator.parse(value)
        const output = new StringPropertyConverter('', key, stringPropertySchema, true).convertAsScalar()
        this.outputs[key] = output
      }
      else {
        assert(false, `Schema ${key} is not a valid schema`)
      }
    }
  }

  public write() {
    const sortedDependencies = topologicalSort(Object.entries(YamlSchemaManager.schemaDeps))

    const dirPath = path.dirname(this.writeFilePath)
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true })
    }

    fs.writeFileSync(this.writeFilePath, 'import { z } from \'zod\'\n\n', 'utf8')
    for (const name of sortedDependencies) {
      fs.writeFileSync(this.writeFilePath, `${this.outputs[name]}\n\n`, { flag: 'a' })
    }

    exec(`npx prettier --write ${this.writeFilePath}`, (error, _stdout, stderr) => {
      if (error) {
        console.error(`Error executing eslint: ${error.message}`)
      }
      else if (stderr) {
        console.error(`Prettier stderr: ${stderr}`)
      }
      // eslint-disable-next-line no-console
      console.log('Successfully generated zod schemas')
    })
  }
}
