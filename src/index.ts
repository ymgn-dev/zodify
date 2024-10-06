#!/usr/bin/env node

import process from 'node:process'
import { Command } from 'commander'
import { YamlSchemaManager } from './components/yaml-schema-manager'
import { YamlParamManager } from './parameters/yaml-param-manager'

interface Options {
  input: string
  outputSchema: string
  outputParam: string
}

const program = new Command()
program
  .requiredOption('-i, --input <type>', 'Input file')
  .requiredOption('-o, --output-schema <type>', 'Schema output ts file')
  .requiredOption('-p, --output-param <type>', 'Param output ts file')
  .parse(process.argv)
const options = program.opts<Options>()

const yamlSchemaLoader = new YamlSchemaManager(options.input, options.outputSchema)
yamlSchemaLoader.convert()
yamlSchemaLoader.write()

const yamlParamLoader = new YamlParamManager(options.input, options.outputParam, options.outputSchema)
yamlParamLoader.convert()
yamlParamLoader.write()
