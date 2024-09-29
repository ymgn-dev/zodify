#!/usr/bin/env node

import process from 'node:process'
import { Command } from 'commander'
import { YamlSchemaManager } from './utils/yaml-schema-manager'

interface Options {
  input: string
  output: string
}

const program = new Command()
program
  .requiredOption('-i, --input <type>', 'Input file')
  .requiredOption('-o, --output <type>', 'Output file')
  .parse(process.argv)
const options = program.opts<Options>()

const yamlSchemaLoader = new YamlSchemaManager(options.input, options.output)
yamlSchemaLoader.convert()
yamlSchemaLoader.write()
