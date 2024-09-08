import * as fs from 'node:fs'
import yaml from 'yaml'
import { componentToZodString } from './core'
import { camelize } from './utils'

const file = fs.readFileSync('sample/openapi.yaml', 'utf8')
const parsed = yaml.parse(file)

const components = parsed?.components?.schemas ?? []

for (const key in components) {
  // eslint-disable-next-line no-console
  console.log(`export const ${camelize(key)}Schema = ${componentToZodString(components[key])}\n`)
}
