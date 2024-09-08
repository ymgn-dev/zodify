export function pascalToCamel(pascal: string): string {
  return pascal.length === 0
    ? pascal
    : pascal.charAt(0).toLowerCase() + pascal.slice(1)
}
