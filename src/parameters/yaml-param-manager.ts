import { exec } from 'node:child_process'
import * as fs from 'node:fs'
import path from 'node:path'
import yaml from 'yaml'
import {
  ArrayPropertyConverter,
  BooleanPropertyConverter,
  IntegerPropertyConverter,
  NumberPropertyConverter,
  RefPropertyConverter,
  StringPropertyConverter,
} from '../components/converters/schema-property'
import {
  arraySchemaPropertyValidator,
  booleanSchemaPropertyValidator,
  integerSchemaPropertyValidator,
  numberSchemaPropertyValidator,
  refSchemaPropertyValidator,
  stringSchemaPropertyValidator,
} from '../components/validators/schema-property'
import { getRelativePath, pascalToCamel } from '../utils'

export class YamlParamManager {
  constructor(
    private readonly inputFilePath: string,
    private readonly writeFilePath: string,
    private readonly schemaWriteFilePath: string,
  ) {
    this.initialize()
  }

  private static params: Map<string, {
    summary?: string
    description?: string
    method: string
    operationId: string
    params: any[]
  }> = new Map()

  private importSchemas: string[] = []
  private outputs: string[] = []

  // Load all schemas from the input file
  private initialize() {
    const file = fs.readFileSync(this.inputFilePath, 'utf8')
    const yamlFile = yaml.parse(file)
    const paths = Object.keys(yamlFile.paths)

    for (const path of paths) {
      const methods = Object.keys(yamlFile.paths[path])
      for (const method of methods) {
        const summary = yamlFile.paths[path][method].summary
        const description = yamlFile.paths[path][method].description
        const params = yamlFile.paths[path][method].parameters as any[]
        const operationId = yamlFile.paths[path][method].operationId as string
        if (params.length > 0) {
          const split = operationId.split('_')
          const key = pascalToCamel(split[0]) + split[1].charAt(0).toUpperCase() + split[1].slice(1)
          YamlParamManager.params.set(key, {
            summary,
            description,
            method,
            operationId,
            params,
          })
        }
      }
    }
  }

  public convert() {
    for (const [key, value] of YamlParamManager.params) {
      const paramOutputs: string[] = []
      for (const param of value.params) {
        const name = param.name
        const schema = param.schema
        const required = param.required

        if (arraySchemaPropertyValidator.safeParse(schema).success) {
          const arraySchema = arraySchemaPropertyValidator.parse(schema)
          const output = new ArrayPropertyConverter(key, name, arraySchema, required).convert()
          paramOutputs.push(output)
        }
        else if (booleanSchemaPropertyValidator.safeParse(schema).success) {
          const booleanSchema = booleanSchemaPropertyValidator.parse(schema)
          const output = new BooleanPropertyConverter(key, name, booleanSchema, required).convert()
          paramOutputs.push(output)
        }
        else if (numberSchemaPropertyValidator.safeParse(schema).success) {
          const numberSchema = numberSchemaPropertyValidator.parse(schema)
          const output = new NumberPropertyConverter(key, name, numberSchema, required).convert()
          paramOutputs.push(output)
        }
        else if (integerSchemaPropertyValidator.safeParse(schema).success) {
          const integerSchema = integerSchemaPropertyValidator.parse(schema)
          const output = new IntegerPropertyConverter(key, name, integerSchema, required).convert()
          paramOutputs.push(output)
        }
        else if (refSchemaPropertyValidator.safeParse(schema).success) {
          const refSchema = refSchemaPropertyValidator.parse(schema)
          const output = new RefPropertyConverter(key, name, refSchema, required).convert()
          this.importSchemas.push(output.split('.')[0].split(':')[1].replace(',', '').trim())
          paramOutputs.push(output)
        }
        else if (stringSchemaPropertyValidator.safeParse(schema).success) {
          const stringSchema = stringSchemaPropertyValidator.parse(schema)
          const output = new StringPropertyConverter(key, name, stringSchema, required).convert()
          paramOutputs.push(output)
        }
      }

      this.outputs.push(`export const ${key}ParamSchema = z.object({\n${paramOutputs.join('\n')}\n})`)
    }
  }

  public write() {
    const dirPath = path.dirname(this.writeFilePath)
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true })
    }

    fs.writeFileSync(this.writeFilePath, 'import { z } from \'zod\'\n\n', 'utf8')

    if (this.importSchemas) {
      const importPath = getRelativePath(this.writeFilePath, this.schemaWriteFilePath)
      const importFilename = path.basename(this.schemaWriteFilePath, '.ts')
      const importFrom = importPath === '.' ? `./${importFilename}` : path.join(importPath, importFilename)

      for (const schema of this.importSchemas) {
        fs.writeFileSync(this.writeFilePath, 'import {\n', { flag: 'a' })
        fs.writeFileSync(this.writeFilePath, `${schema},\n`, { flag: 'a' })
        fs.writeFileSync(this.writeFilePath, `} from '${importFrom}'\n\n`, { flag: 'a' })
      }
    }

    for (const output of this.outputs) {
      fs.writeFileSync(this.writeFilePath, `${output}\n\n`, { flag: 'a' })
    }

    exec(`npx prettier --write ${this.writeFilePath}`, (error, _stdout, stderr) => {
      if (error) {
        console.error(`Error executing eslint: ${error.message}`)
      }
      else if (stderr) {
        console.error(`Prettier stderr: ${stderr}`)
      }
      // eslint-disable-next-line no-console
      console.log('Successfully generated zod param schemas')
    })
  }
}
