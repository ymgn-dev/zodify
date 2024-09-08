import { exec } from 'node:child_process'
import * as fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import yaml from 'yaml'
import { EnumCmpConverter } from './converter/component/enum'
import { ObjectCmpConverter } from './converter/component/object'
import { camelize } from './utils'
import type { CmpConverterBase } from './converter/component/base'
import type { Component } from './converter/schemas'

export function convert(cmp: Component) {
  let converter: CmpConverterBase | undefined
  if (cmp.enum) {
    converter = new EnumCmpConverter(cmp)
  }
  else if (cmp.properties) {
    converter = new ObjectCmpConverter(cmp)
  }

  return converter?.toZodString() ?? ''
}

const file = fs.readFileSync('sample/openapi.yaml', 'utf8')
const parsed = yaml.parse(file)

const components = parsed?.components?.schemas ?? []

// Create the output file and directory
const dirPath = path.join(path.resolve(), 'gen')
const filePath = path.join(dirPath, 'zodify.ts')

// Write the output file
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true })
}

fs.writeFileSync(filePath, 'import { z } from \'zod\'\n\n', 'utf8')
for (const key in components) {
  fs.writeFileSync(filePath, `export const ${camelize(key)}Schema = ${convert(components[key])}\n\n`, { flag: 'a' })
}

// Run eslint to fix the formatting
exec(`npx eslint --fix ${filePath}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error executing eslint: ${error.message}`)
    return
  }
  if (stderr) {
    console.error(`Eslint stderr: ${stderr}`)
    return
  }
  // eslint-disable-next-line no-console
  console.log('Successfully generated zod schemas')
})
