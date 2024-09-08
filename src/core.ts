import { assert } from 'node:console'
import type { Component, DataTypeLiteral, Format } from './schemas'

function typeToZodType(openApiType: DataTypeLiteral) {
  return openApiType === 'integer' ? 'z.number()' : `z.${openApiType}()`
}

function formatToZodFormat(format?: Format) {
  if (!format) {
    return ''
  }

  switch (format) {
    // Not supported
    case 'float':
    case 'double':
    case 'int8':
    case 'int16':
    case 'int32':
    case 'int64':
    case 'byte':
    case 'binary':
    case 'password':
      return ''

    // Supported
    case 'date':
      return '.date()'
    case 'date-time':
      return '.datetime()'
    case 'uuid':
      return '.uuid()'
    case 'email':
      return '.email()'
    case 'uri':
      return '.url()'
    case 'ipv4':
    case 'ipv6':
      return '.ip()'
    default:
      assert(false, `Unknown format: ${format}`)
  }
}

function minLengthToZodString(minLength?: number) {
  return minLength !== undefined ? `.min(${minLength})` : ''
}

function maxLengthToZodString(maxLength?: number) {
  return maxLength !== undefined ? `.max(${maxLength})` : ''
}

function minimumToZodString(minimum?: number) {
  return minimum !== undefined ? `.min(${minimum})` : ''
}

function maximumToZodString(maximum?: number) {
  return maximum !== undefined ? `.max(${maximum})` : ''
}

function toEnum(cmp: Component) {
  const enumValues = cmp.enum?.map((v) => {
    return typeof v === 'string' ? `'${v}'` : v
  })
  const enumValuesString = enumValues?.join(', ')
  return `z.enum([${enumValuesString}])`
}

function toObject(cmp: Component) {
  const properties = Object.entries(cmp.properties ?? {}).map(([key, value]) => {
    const { type, format, minLength, maxLength, minimum, maximum } = value
    const typeSchema = typeToZodType(type)
    const formatSchema = formatToZodFormat(format)
    const minLengthSchema = minLengthToZodString(minLength)
    const maxLengthSchema = maxLengthToZodString(maxLength)
    const minimumSchema = minimumToZodString(minimum)
    const maximumSchema = maximumToZodString(maximum)

    return `${key}: ${typeSchema}${formatSchema}${minLengthSchema}${maxLengthSchema}${minimumSchema}${maximumSchema}`
  })
  return `${cmp.type}({\n  ${properties.join(',\n  ')}\n})`
}

export function componentToZodString(cmp: Component) {
  if (cmp.enum) {
    return toEnum(cmp)
  }
  if (cmp.properties) {
    return toObject(cmp)
  }
}
