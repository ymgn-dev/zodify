import { assert } from 'node:console'
import type { Component, DataTypeLiteral, Format } from '../schemas'

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
  return minLength ? `.min(${minLength})` : ''
}

function maxLengthToZodString(maxLength?: number) {
  return maxLength ? `.max(${maxLength})` : ''
}

function minimumToZodString(minimum?: number) {
  return minimum ? `.min(${minimum})` : ''
}

function maximumToZodString(maximum?: number) {
  return maximum ? `.max(${maximum})` : ''
}

export function componentToZodString(component: Component) {
  const schemaType = component.type === 'array' ? 'z.array' : 'z.object'

  const properties = Object.entries(component.properties ?? {}).map(([key, value]) => {
    const { type, format, minLength, maxLength, minimum, maximum } = value
    const typeSchema = typeToZodType(type)
    const formatSchema = formatToZodFormat(format)
    const minLengthSchema = minLengthToZodString(minLength)
    const maxLengthSchema = maxLengthToZodString(maxLength)
    const minimumSchema = minimumToZodString(minimum)
    const maximumSchema = maximumToZodString(maximum)

    return `${key}: ${typeSchema}${formatSchema}${minLengthSchema}${maxLengthSchema}${minimumSchema}${maximumSchema}`
  })

  return `${schemaType}({\n  ${properties.join(',\n  ')}\n})`
}
