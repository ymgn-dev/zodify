#!/usr/bin/env node

import process from 'node:process'
import { Command } from 'commander'
import { YamlSchemaManager } from './components/yaml-schema-manager'
import { YamlPathManager } from './parameters/yaml-path-manager'
import { YamlQueryManager } from './parameters/yaml-query-manager'

interface Options {
  input: string
  outputSchema: string
  outputPath: string
  outputQuery: string
}

const program = new Command()
program
  .requiredOption('-i, --input <type>', 'Input file')
  .requiredOption('-s, --output-schema <type>', 'Schema output ts file')
  .requiredOption('-p, --output-path <type>', 'Path output ts file')
  .requiredOption('-q, --output-query <type>', 'Query output ts file')
  .parse(process.argv)
const options = program.opts<Options>()

const yamlSchemaLoader = new YamlSchemaManager(options.input, options.outputSchema)
yamlSchemaLoader.convert()
yamlSchemaLoader.write()

const yamlPathLoader = new YamlPathManager(options.input, options.outputPath, options.outputSchema)
yamlPathLoader.convert()
yamlPathLoader.write()

const yamlQueryLoader = new YamlQueryManager(options.input, options.outputQuery, options.outputSchema)
yamlQueryLoader.convert()
yamlQueryLoader.write()
