import { exec } from 'node:child_process'
import * as fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { Command } from 'commander'
import yaml from 'yaml'
import { ArrayCmpConverter } from './converter/component/array'
import { EnumCmpConverter } from './converter/component/enum'
import { ObjectCmpConverter } from './converter/component/object'
import { refCount } from './converter/ref-count'
import { pascalToCamel } from './utils/pascal-to-camel'
import type { CmpConverterBase } from './converter/component/base'
import type { Component } from './converter/schemas'

function convert(cmp: Component) {
  let converter: CmpConverterBase | undefined
  if (cmp.enum) {
    converter = new EnumCmpConverter(cmp)
  }
  else if (cmp.type === 'object') {
    converter = new ObjectCmpConverter(cmp)
  }
  else if (cmp.type === 'array') {
    converter = new ArrayCmpConverter(cmp)
  }
  return converter?.toZodString() ?? ''
}

function loadComponents(filePath: string) {
  const file = fs.readFileSync(filePath, 'utf8')
  const parsed = yaml.parse(file)

  const keys = Object.keys(parsed?.components?.schemas ?? [])

  for (const key of keys) {
    refCount[key] = 0
  }

  return (parsed?.components?.schemas ?? []) as Record<string, Component>
}

function write(outPath: string, components: Record<string, Component>) {
  const dirPath = path.dirname(outPath)

  const writePriority: { key: string, value: string }[] = []
  for (const refCountKey of Object.keys(refCount)) {
    writePriority.push({ key: refCountKey, value: '' })
  }

  for (const key of Object.keys(components)) {
    const index = writePriority.findIndex(x => x.key === key)
    writePriority[index] = { key, value: `export const ${pascalToCamel(key)}Schema = ${convert(components[key])}\n\n` }
  }

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }

  fs.writeFileSync(outPath, 'import { z } from \'zod\'\n\n', 'utf8')

  const sorted = writePriority.sort((a, b) => refCount[b.key] - refCount[a.key])
  for (const { value } of sorted) {
    fs.writeFileSync(outPath, value, { flag: 'a' })
  }

  exec(`npx prettier --write ${outPath}`, (error, _stdout, stderr) => {
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

const components = loadComponents(options.input)
write(options.output, components)
