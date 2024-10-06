import * as path from 'node:path'

export function getRelativePath(from: string, to: string): string {
  const relativePath = path.relative(path.dirname(from), path.dirname(to))
  return relativePath || '.'
}
