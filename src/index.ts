import { exec } from 'node:child_process'
import * as fs from 'node:fs'
import path from 'node:path'
import yaml from 'yaml'
import { EnumCmpConverter } from './converter/component/enum'
import { ObjectCmpConverter } from './converter/component/object'
import { refCount } from './converter/ref-count'
import { pascalToCamel } from './utils'
import type { CmpConverterBase } from './converter/component/base'
import type { Component } from './converter/schemas'

function convert(cmp: Component) {
  let converter: CmpConverterBase | undefined
  if (cmp?.enum) {
    converter = new EnumCmpConverter(cmp)
  }
  else if (cmp?.properties) {
    converter = new ObjectCmpConverter(cmp)
  }

  return converter?.toZodString() ?? ''
}

function loadComponents() {
  const file = fs.readFileSync('sample/openapi.yaml', 'utf8')
  const parsed = yaml.parse(file)

  const keys = Object.keys(parsed?.components?.schemas ?? [])

  for (const key of keys) {
    refCount[key] = 0
  }

  return (parsed?.components?.schemas ?? []) as Record<string, Component>
}

function write(components: Record<string, Component>) {
  const dirPath = path.join(path.resolve(), 'gen')
  const filePath = path.join(dirPath, 'zodify.ts')

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

  fs.writeFileSync(filePath, 'import { z } from \'zod\'\n\n', 'utf8')

  const sorted = writePriority.sort((a, b) => refCount[b.key] - refCount[a.key])
  for (const { value } of sorted) {
    fs.writeFileSync(filePath, value, { flag: 'a' })
  }

  exec(`npx eslint --fix ${filePath}`, (error, _stdout, stderr) => {
    if (error) {
      console.error(`Error executing eslint: ${error.message}`)
    }
    else if (stderr) {
      console.error(`Eslint stderr: ${stderr}`)
    }
    // eslint-disable-next-line no-console
    console.log('Successfully generated zod schemas')
  })
}

const components = loadComponents()
write(components)
