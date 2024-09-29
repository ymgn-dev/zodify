# Zodify
A tool that generates Zod type definitions from OpenAPI YAML.

> [!WARNING]
> Please note that this tool only targets YAML generated based on TypeSpec definitions.

Japanese version: [README_ja.md](./README_ja.md)

## Setup

```sh
git clone git@github.com:ymgn-dev/zodify.git
cd zodify
npm run build
```

## Usage

Specify the OpenAPI YAML file with the `-i` option and the output `.ts` file with the `-o` option.

```sh
node dist/index.mjs -i ./path/to/openapi.yaml -o ./path/to/output.ts
```

## Supported Syntax

### Comment Decorators

You can add comments to models and properties using the `@doc()` decorator.

```tsp
@doc("This is a comment for the model")
model SampleModel {
  @doc("This is the model's ID")
  @format("uuid")
  id: string;

  @doc("Creation date")
  createdAt: utcDateTime;

  @doc("Update date")
  updatedAt: utcDateTime;
}
```

The above model will be converted as follows:

```ts
// This is a comment for the model
export const sampleModelSchema = z.object({
  // This is the model's ID
  id: z.string().uuid(),

  // Creation date
  createdAt: z.string().datetime(),

  // Update date
  updatedAt: z.string().datetime(),
})
```

Additionally, if you want to generate Zod schemas that cannot be expressed using the standard decorators below, you can use an extended notation for the `@doc()` decorator.
Write regular comments (optional) to the left of `zod:`, and the Zod schema on the right.
Note that when using this extended notation, the type-specific decorators below will be ignored.

```tsp
model SampleModel {
  @doc("Email address, unset defaults to an empty string zod: z.union([z.string().email(), z.literal("")]).default("")")
  email: string;
}
```

```ts
export const sampleModelSchema = z.object({
  // Email address, unset defaults to an empty string
  email: z.union([z.string().email(), z.literal('')]).default(''),
})
```

### Models

This syntax is used for defining top-level models.

| Syntax | Notes |
| --- | --- |
| `model Element { }` | Converts to `z.object({ ... })` |
| `model Elements is Array<Element> { }` | Converts to `z.array(...)` |
| `enum Element { }` | Converts to `z.enum([ ... ])` |

<details>

<summary>TypeSpec definition example</summary>

```tsp
model SampleModel {
  a: numeric;
  b: string;
}

model ArraySampleModel is Array<SampleModel> {}

enum EnumSample {
  A,
  B,
  C
}
```

</details>

---

### Scalars

This syntax is used for defining types that do not exist in TypeSpec.

```tsp
@doc("UUID")
@format("uuid")
scalar Uuid extends string;

@doc("Integer greater than 100")
@minValueExclusive(100)
scalar Gt100 extends int32;
```

The above model will be converted as follows:

```ts
// UUID
export const uuidSchema = z.string().uuid()

// Integer greater than 100
export const gt100Schema = z.number().int().gt(100)
```

---

### Numbers

| Type | Notes |
| --- | --- |
| integer | Converts to `z.number().int()` |
| int64 | Converts to `z.number().int()` |
| int32 | Converts to `z.number().int()` |
| int16 | Converts to `z.number().int()` |
| int8 | Converts to `z.number().int()` |
| safeint | Converts to `z.number().int()` |
| uint64 | Converts to `z.number().int()` |
| uint32 | Converts to `z.number().int()` |
| uint16 | Converts to `z.number().int()` |
| uint8 | Converts to `z.number().int()` |
| numeric | Converts to `z.number()` |
| float | Converts to `z.number()` |
| float64 | Converts to `z.number()` |
| float32 | Converts to `z.number()` |
| decimal | Converts to `z.number()` |
| decimal128 | Converts to `z.number()` |

| Decorator | Notes |
| --- | --- |
| `@minValue(42)` | Converts to `.gte(42)` |
| `@maxValue(42)` | Converts to `.lte(42)` |
| `@minValueExclusive(8)` | Converts to `.gt(8)` |
| `@maxValueExclusive(8)` | Converts to `.lt(8)` |

#### Additional Notes

To make properties in a TypeSpec model optional, add a `?` after the property name.
You can also set default values using `=`. It is possible to combine both optional and default values.

```tsp
model Sample {
  a?: int32;
  b: integer = 42;
  c?: float = 3.14;
}
```

The above model will be converted as follows:

```ts
export const sampleSchema = z.object({
  a: z.number().int().optional(),
  b: z.number().int().default(42),
  c: z.number().optional().default(3.14),
})
```

<details>

<summary>TypeSpec definition example</summary>

```tsp
@doc("Numeric values")
model NumericValues {
  @minValue(42.6)
  @maxValue(95.8)
  a: numeric;

  @minValueExclusive(8)
  @maxValueExclusive(16)
  b: integer;

  @doc("Optional input")
  c: float;

  @doc("Has a default value")
  d: int64 = 42;
  e: int32;
  f: int16;
  g: int8;
  h: safeint;
  i: uint64;
  j: uint32;
  k: uint16;
  l: uint8;
  m: float64;
  n: float32;
  o: decimal;
  p: decimal128;
}
```

</details>

---

### Strings

> [!WARNING]
> `bytes` is not supported because it is not defined in Zod.

> [!NOTE]
> Some types are not supported in TypeSpec but are supported in Zod.
> These types can be converted using the `@format()` decorator described below.

| Type | Notes |
| --- | --- |
| string | Converts to `z.string()` |
| plainDate | Converts to `z.string().date()` |
| plainTime | Converts to `z.string().time()` |
| utcDateTime | Converts to `z.string().datetime()` |
| offsetDateTime | Converts to `z.string().datetime()` |
| duration | Converts to `z.string().duration()` |
| url | Converts to `z.string().url()` |

| Decorator | Notes |
| --- | --- |
| `@minLength(42)` | Converts to `.min(42)` |
| `@maxLength(42)` | Converts to `.max(42)` |
| `@format("date")` | Equivalent to plainDate type, converts to `.date()` |
| `@format("time")` | Equivalent to plainTime type, converts to `.time()` |
| `@format("date-time")` | Equivalent to utcDateTime and offsetDateTime types, converts to `.datetime()` |
| `@format("duration")` | Equivalent to duration type, converts to `.duration()` |
| `@format("uri")` | Equivalent to url type, converts to `.url()` |
| `@format("email")` | Converts to `.email()` |
| `@format("uuid")` | Converts to `.uuid()` |
| `@format("cuid")` | Converts to `.cuid()` |
| `@format("ip")` | Converts to `.ip()` |

#### Additional Notes

To make properties in a TypeSpec model optional, add a `?` after the property name.
You can also set default values using `=`. It is possible to combine both optional and default values.

```tsp
model Sample {
  a?: string;
  b: string = "Sample string";
  c?: string = "Sample string";
}
```

The above model will be converted as follows:

```ts
export const sampleSchema = z.object({
  a: z.string().optional(),
  b: z.string().default('Sample string'),
  c: z.string().optional().default('Sample string'),
})
```

<details>

<summary>TypeSpec definition example</summary>

```tsp
@doc("String values")
model StringValues {
  @minLength(42)
  @maxLength(96)
  a: string;

  b: plainDate;
  c: plainTime;
  d: utcDateTime;
  e: offsetDateTime;
  f: duration;
  g: url;

  @format("email")
  h: string;

  @format("uuid")
  i: string;
}
```

</details>

---

### Booleans

| Type | Notes |
| --- | --- |
| boolean | Converts to `z.boolean()` |

#### Additional Notes

To make properties in a TypeSpec model optional, add a `?` after the property name.
You can also set default values using `=`. It is possible to combine both optional and default values.

```tsp
model Sample {
  a?: boolean;
  b: boolean = true;
  c?: boolean = false;
}
```

The above model will be converted as follows:

```ts
export const sampleSchema = z.object({
  a: z.boolean().optional(),
  b: z.boolean().default(true),
  c: z.boolean().optional().default(false),
})
```

<details>

<summary>TypeSpec definition example</summary>

```tsp
@doc("Boolean values")
model BooleanValues {
  a: boolean;
}
```

</details>

---

### Arrays, Objects, and Enums

> [!WARNING]
> `Record<Element>` is not currently supported.

| Type | Notes |
| --- | --- |
| Element[] | Converts to `z.array(elementSchema)` |

| Decorator | Notes |
| --- | --- |
| `@minItems(42)` | Converts to `.min(42)` |
| `@maxItems(42)` | Converts to `.max(42)` |

#### Additional Notes

To make properties in a TypeSpec model optional, add a `?` after the property name.
You can also set default values using `=`. For arrays, TypeSpec requires default values to be written as `#[...]`.
It is possible to combine both optional and default values.

```tsp
model OtherModel {
  @format("uuid")
  id: string;
}

@doc("Array test")
model Sample {
  a?: string[];
  b: string[] = #["sample1", "sample2"];
  c?: string[] = #[];
  d: int32[] = #[4, 8, 32];
  e: OtherModel[] = #[];
}
```

The above model will be converted as follows:

```ts
export const otherModelSchema = z.object({
  id: z.string().uuid(),
})

// Array test
export const sampleSchema = z.object({
  a: z.array(z.string()).optional(),
  b: z.array(z.string()).default(['sample1', 'sample2']),
  c: z.array(z.string()).optional().default([]),
  d: z.array(z.number().int()).default([4, 8, 32]),
  e: z.array(otherModelSchema).default([]),
})
```

<details>

<summary>TypeSpec definition example</summary>

```tsp
@doc("Arrays")
model ArrayValues {
  @minItems(42)
  @maxItems(96)
  a: string[];

  b: OtherModel[];
}
```

</details>

---

### Others

> [!WARNING]
> `null`, `unknown`, `void`, and `never` are not currently supported.
