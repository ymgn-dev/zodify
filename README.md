# Zodify
OpenAPI の yaml から、Zod の型定義を生成するツールです。

> [!WARNING]
> このツールは TypeSpec の定義を基に生成された yaml のみを対象としていることに注意してください。

## セットアップ

```sh
git clone git@github.com:DomHacler/zodify.git
cd zodify
npm run build
```

## 使い方

`-i` オプションで OpenAPI の yaml ファイルを指定し、`-o` オプションで出力先の `.ts` ファイルを指定します。

```sh
node dist/index.mjs -i ./path/to/openapi.yaml -o ./path/to/output.ts
```

## サポートする文法

### コメントデコレータ

`@doc()` デコレータを使用することで、モデルやプロパティにコメントを付けることができます。

```tsp
@doc("モデルのコメントです")
model SampleModel {
  @doc("モデルの ID です")
  @format("uuid")
  id: string;

  @doc("作成日")
  createdAt: utcDateTime;

  @doc("更新日")
  updatedAt: utcDateTime;
}
```

上記のモデルは次のように変換されます。

```ts
import { z } from 'zod'

// モデルのコメントです
export const sampleModelSchema = z.object({
  // モデルの ID です
  id: z.string().uuid(),

  // 作成日
  createdAt: z.string().datetime(),

  // 更新日
  updatedAt: z.string().datetime(),
})
```

### モデル

トップレベルのモデル定義を行うための文法です。

| 文法 | 補足 |
| --- | --- |
| `model Element { }` | `z.object({ ... })` に変換されます |
| `model Elements is Array<Element> { }` | `z.array(...)` に変換されます |
| `enum Element { }` | `z.enum([ ... ])` に変換されます |

<details>

<summary>TypeSpec の定義例</summary>

```tsp
model SampleModel {
  a: numeric;
  b: string;
}

model ArraySampleModel is Array<SampleModel> {}

enum  EnumSample {
  A,
  B,
  C
}
```

</details>

---

### 数値

| 型 | 補足 |
| --- | --- |
| numeric | `z.number()` に変換されます |
| integer | `z.number()` に変換されます |
| float | `z.number()` に変換されます |
| int64 | `z.number()` に変換されます |
| int32 | `z.number()` に変換されます |
| int16 | `z.number()` に変換されます |
| int8 | `z.number()` に変換されます |
| safeint | `z.number()` に変換されます |
| uint64 | `z.number()` に変換されます |
| uint32 | `z.number()` に変換されます |
| uint16 | `z.number()` に変換されます |
| uint8 | `z.number()` に変換されます |
| float64 | `z.number()` に変換されます |
| float32 | `z.number()` に変換されます |
| decimal | `z.number()` に変換されます |
| decimal128 | `z.number()` に変換されます |

| デコレータ | 補足 |
| --- | --- |
| `@minValue(42)` | `z.number().gte(42)` に変換されます |
| `@maxValue(42)` | `z.number().lte(42)` に変換されます |
| `@minValueExclusive(8)` | `z.number().gt(8)` に変換されます |
| `@maxValueExclusive(8)` | `z.number().lt(8)` に変換されます |

#### その他補足

Typespec のモデルのプロパティをオプショナルにする場合は、 `?` を付けてください。
また、デフォルト値を設定する場合は、次のように `=` を使用してください。
オプショナルとデフォルト値を併用することもできます。

```tsp
model Sample {
  a?: int32;
  b: integer = 42;
  c?: float = 3.14;
}
```

上記のモデルは次のように変換されます。

```ts
export const sampleSchema = z.object({
  a: z.number().optional(),

  b: z.number().default(42),

  c: z
    .number()
    .optional()
    .default(3.14),
})
```

<details>

<summary>TypeSpec の定義例</summary>

```tsp
@doc("数値")
model NumericValues {
  @minValue(42)
  @maxValue(95)
  a: numeric;

  @minValueExclusive(8)
  @maxValueExclusive(16)
  b: integer;

  @doc("任意入力")
  c: float;

  @doc("デフォルト値あり")
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

### 文字列

> [!WARNING]
> `bytes` は Zod の定義にないためサポートしていません。

> [!NOTE]
> TypeSpec ではサポートされていませんが、 Zod ではサポートされている型もあります。
> それらの型については下に書かれている `@format()` デコレータを使用して変換することができます。

| 型 | 補足 |
| --- | --- |
| string | `z.string()` に変換されます |
| plainDate | `z.string().date()` に変換されます |
| plainTime | `z.string().time()` に変換されます |
| utcDateTim | `z.string().datetime()` に変換されます |
| offsetDateTime | `z.string().datetime()` に変換されます |
| duration | `z.string().duration()` に変換されます |
| url | `z.string().url()` に変換されます |

| デコレータ | 補足 |
| --- | --- |
| `@minLength(42)` | `z.string().min(4)` に変換されます |
| `@maxLength(42)` | `z.string().max(4)` に変換されます |
| `@format("date")` | `z.string().date()` に変換されます |
| `@format("time")` | `z.string().time()` に変換されます |
| `@format("date-time")` | `z.string().datetime()` に変換されます |
| `@format("duration")` | `z.string().duration()` に変換されます |
| `@format("uri")` | `z.string().url()` に変換されます |
| `@format("email")` | `z.string().email()` に変換されます |
| `@format("uuid")` | `z.string().uuid()` に変換されます |
| `@format("cuid")` | `z.string().cuid()` に変換されます |
| `@format("ip")` | `z.string().ip()` に変換されます |

#### その他補足

Typespec のモデルのプロパティをオプショナルにする場合は、 `?` を付けてください。
また、デフォルト値を設定する場合は、次のように `=` を使用してください。
オプショナルとデフォルト値を併用することもできます。

```tsp
model Sample {
  a?: string;
  b: string = "サンプル文字列";
  c?: string = "サンプル文字列";
}
```

上記のモデルは次のように変換されます。

```ts
export const sampleSchema = z.object({
  a: z.string().optional(),

  b: z.string().default('サンプル文字列'),

  c: z.string().optional().default('サンプル文字列'),
})
```

<details>

<summary>TypeSpec の定義例</summary>

```tsp
@doc("文字列")
model StringValues {
  @minLength(42)
  @maxLength(96)
  a: string;

  @format("date-time")
  b: plainDate;

  @format("uri")
  c: plainTime;

  @format("email")
  d: utcDateTime;

  @format("uuid")
  e: offsetDateTime;
  f: duration;
  g: url;
}
```

</details>

---

### 論理値

| 型 | 補足 |
| --- | --- |
| boolean | `z.boolean()` に変換されます |

#### その他補足

Typespec のモデルのプロパティをオプショナルにする場合は、 `?` を付けてください。
また、デフォルト値を設定する場合は、次のように `=` を使用してください。
オプショナルとデフォルト値を併用することもできます。

```tsp
model Sample {
  a?: boolean;
  b: boolean = true;
  c?: boolean = false;
}
```

上記のモデルは次のように変換されます。

```ts
export const sampleSchema = z.object({
  a: z.boolean().optional(),

  b: z.boolean().default(true),

  c: z.boolean().optional().default(false),
})
```

<details>

<summary>TypeSpec の定義例</summary>

```tsp
@doc("論理値")
model BooleanValues {
  a: boolean;
}
```

</details>

---

### 配列・オブジェクト・列挙型

> [!WARNING]
> `Record<Element>` は現状サポートしていません。
> 列挙型( `` )

| 型 | 補足 |
| --- | --- |
| Element[] | `z.array(elementSchema)` に変換されます |

| デコレータ | 補足 |
| --- | --- |
| `@minItems(42)` | `z.array(...).min(4)` に変換されます |
| `@maxItems(42)` | `z.array(...).max(4)` に変換されます |

#### その他補足

Typespec のモデルのプロパティをオプショナルにする場合は、 `?` を付けてください。
また、デフォルト値を設定する場合は、次のように `=` を使用してください。
オプショナルとデフォルト値を併用することもできます。

```tsp
model Sample {
  a?: string[];
  b: string[] = #["sample1", "sample2"];
  c?: string[] = #[];
}
```

上記のモデルは次のように変換されます。

```ts
export const sampleSchema = z.object({
  a: z.array(z.string()).optional(),

  b: z.array(z.string()).default([]),

  c: z.array(z.string()).optional().default([]),
})
```

<details>

<summary>TypeSpec の定義例</summary>

```tsp
@doc("配列")
model ArrayValues {
  @minItems(42)
  @maxItems(96)
  a: string[];

  b: OtherModel[];
}
```

</details>

---

### その他

> [!WARNING]
> `null`, `unknown`, `void`, `never` は現状サポートしていません。
