import type { Component } from '../schemas'

export abstract class CmpConverterBase {
  constructor(protected readonly cmp: Component) { }

  abstract toZodString(): string
}
