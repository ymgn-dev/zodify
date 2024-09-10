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
} from '../converters/schema'
import {
  arraySchemaValidator,
  enumNumberSchemaValidator,
  enumStringSchemaValidator,
  objectSchemaValidator,
} from '../validators/schema'
import { topologicalSort } from './topological-sort'
import type { ComponentSchemas } from '../types'

export class YamlSchemaManager {
  constructor(
    private readonly inputFilePath: string,
    private readonly writeFilePath: string,
  ) {
    this.initialize()
  }

  private static schemas: ComponentSchemas = []

  // Schema name, schema output
  private outputs: Record<string, string> = {}

  // Schema name, schema dependencies
  private static schemaDeps: Record<string, string[]> = {}

  // Load all schemas from the input file
  private initialize() {
    const file = fs.readFileSync(this.inputFilePath, 'utf8')
    const yamlFile = yaml.parse(file)

    for (const key of Object.keys(yamlFile?.components?.schemas ?? [])) {
      YamlSchemaManager.schemas.push({
        name: key,
        schema: yamlFile.components.schemas[key],
      })
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
    for (const s of YamlSchemaManager.schemas) {
      if (arraySchemaValidator.safeParse(s.schema).success) {
        const arraySchema = arraySchemaValidator.parse(s.schema)
        const output = new ArraySchemaConverter(s.name, arraySchema).convert()
        this.outputs[s.name] = output
      }
      else if (enumStringSchemaValidator.safeParse(s.schema).success) {
        const enumSchema = enumStringSchemaValidator.parse(s.schema)
        const output = new EnumStringSchemaConverter(s.name, enumSchema).convert()
        this.outputs[s.name] = output
      }
      else if (enumNumberSchemaValidator.safeParse(s.schema).success) {
        const enumSchema = enumNumberSchemaValidator.parse(s.schema)
        const output = new EnumNumberSchemaConverter(s.name, enumSchema).convert()
        this.outputs[s.name] = output
      }
      else if (objectSchemaValidator.safeParse(s.schema).success) {
        const objectSchema = objectSchemaValidator.parse(s.schema)
        const output = new ObjectSchemaConverter(s.name, objectSchema).convert()
        this.outputs[s.name] = output
      }
      else {
        assert(false, `Schema ${s.name} is not a valid schema`)
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
