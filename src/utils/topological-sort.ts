export function topologicalSort(models: [string, string[]][]): string[] {
  const adjList = new Map<string, string[]>()
  const indegree = new Map<string, number>()
  const queue: string[] = []
  const result: string[] = []

  for (const [model, dependencies] of models) {
    adjList.set(model, dependencies)
    indegree.set(model, 0)
  }
  for (const [_, dependencies] of models) {
    for (const dep of dependencies) {
      indegree.set(dep, (indegree.get(dep) || 0) + 1)
    }
  }
  for (const [model, count] of indegree) {
    if (count === 0)
      queue.push(model)
  }
  while (queue.length > 0) {
    const model = queue.shift()!
    result.push(model)

    for (const dep of adjList.get(model) || []) {
      indegree.set(dep, indegree.get(dep)! - 1)
      if (indegree.get(dep) === 0)
        queue.push(dep)
    }
  }
  if (result.length !== models.length) {
    throw new Error('Cycle detected')
  }
  return result
}
