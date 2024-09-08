export function pascalToCamel(pascal: string): string {
  if (pascal.length === 0)
    return pascal
  return pascal.charAt(0).toLowerCase() + pascal.slice(1)
}
