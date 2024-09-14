# Zodify
OpenAPI の yaml から、Zod の型定義を生成するツールです。

> [!WARNING]
> このツールは TypeSpec の定義を基に生成された yaml のみを対象としていることに注意してください。

## セットアップ

```sh
git clone git@github.com:Dom-Hacker-Inc/zodify.git
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

さらに、以下に書くデコレータでは表現できない Zod スキーマを生成したい場合は、 `@doc()` デコレータの拡張記法を使用することができます。
`zod: ` より左側に通常のコメントを記述(任意)し、右側に Zod のスキーマを記述します。
なお、この拡張記法を使用した場合は、以下の型ごとのデコレータは無視されます。

```tsp
model SampleModel {
  @doc("メールアドレス, 未設定は空文字 zod: z.union([z.string().email(), z.literal(\"\")]).default(\"\")")
  email: string;
}
```

```ts
export const sampleModelSchema = z.object({
  // メールアドレス, 未設定は空文字
  email: z.union([z.string().email(), z.literal('')]).default(''),
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
| integer | `z.number().int()` に変換されます |
| int64 | `z.number().int()` に変換されます |
| int32 | `z.number().int()` に変換されます |
| int16 | `z.number().int()` に変換されます |
| int8 | `z.number().int()` に変換されます |
| safeint | `z.number().int()` に変換されます |
| uint64 | `z.number().int()` に変換されます |
| uint32 | `z.number().int()` に変換されます |
| uint16 | `z.number().int()` に変換されます |
| uint8 | `z.number().int()` に変換されます |
| numeric | `z.number()` に変換されます |
| float | `z.number()` に変換されます |
| float64 | `z.number()` に変換されます |
| float32 | `z.number()` に変換されます |
| decimal | `z.number()` に変換されます |
| decimal128 | `z.number()` に変換されます |

| デコレータ | 補足 |
| --- | --- |
| `@minValue(42)` | `.gte(42)` に変換されます |
| `@maxValue(42)` | `.lte(42)` に変換されます |
| `@minValueExclusive(8)` | `.gt(8)` に変換されます |
| `@maxValueExclusive(8)` | `.lt(8)` に変換されます |

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
  a: z.number().int().optional(),
  b: z.number().int().default(42),
  c: z.number().optional().default(3.14),
})
```

<details>

<summary>TypeSpec の定義例</summary>

```tsp
@doc("数値")
model NumericValues {
  @minValue(42.6)
  @maxValue(95.8)
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
| utcDateTime | `z.string().datetime()` に変換されます |
| offsetDateTime | `z.string().datetime()` に変換されます |
| duration | `z.string().duration()` に変換されます |
| url | `z.string().url()` に変換されます |

| デコレータ | 補足 |
| --- | --- |
| `@minLength(42)` | `.min(4)` に変換されます |
| `@maxLength(42)` | `.max(4)` に変換されます |
| `@format("date")` | plainDate 型と同等, `.date()` に変換されます |
| `@format("time")` | plainTime 型と同等, `.time()` に変換されます |
| `@format("date-time")` | utcDateTime, offsetDateTime 型と同等, `.datetime()` に変換されます |
| `@format("duration")` | duration 型と同等, `.duration()` に変換されます |
| `@format("uri")` | url 型と同等, `.url()` に変換されます |
| `@format("email")` | `.email()` に変換されます |
| `@format("uuid")` | `.uuid()` に変換されます |
| `@format("cuid")` | `.cuid()` に変換されます |
| `@format("ip")` | `.ip()` に変換されます |

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

| 型 | 補足 |
| --- | --- |
| Element[] | `z.array(elementSchema)` に変換されます |

| デコレータ | 補足 |
| --- | --- |
| `@minItems(42)` | `.min(4)` に変換されます |
| `@maxItems(42)` | `.max(4)` に変換されます |

#### その他補足

Typespec のモデルのプロパティをオプショナルにする場合は、 `?` を付けてください。
また、デフォルト値を設定する場合は、次のように `=` を使用してください(TypeSpec の仕様で配列のデフォルト値は `#[...]` と書く必要があります)。
オプショナルとデフォルト値を併用することもできます。

```tsp
model OtherModel {
  @format("uuid")
  id: string;
}

@doc("配列のテスト")
model Sample {
  a?: string[];
  b: string[] = #["sample1", "sample2"];
  c?: string[] = #[];
  d: int32[] = #[4, 8, 32];
  e: OtherModel[] = #[];
}
```

上記のモデルは次のように変換されます。

```ts
export const otherModelSchema = z.object({
  id: z.string().uuid(),
})

// 配列のテスト
export const sampleSchema = z.object({
  a: z.array(z.string()).optional(),
  b: z.array(z.string()).default(['sample1', 'sample2']),
  c: z.array(z.string()).optional().default([]),
  d: z.array(z.number().int()).default([4, 8, 32]),
  e: z.array(otherModelSchema).default([]),
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
