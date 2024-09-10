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

### モデル
---

トップレベルのモデル定義を行うための文法です。

| 文法 | 補足 |
| --- | --- |
| `model Element { }` | `z.object({ ... })` に変換されます |
| `model Elements is Array<Element> { }` | `z.array(...)` に変換されます |
| `enum Element { }` | `z.enum([ ... ])` に変換されます |

<details>

<summary>TypeSpec の定義例</summary>

```tsp
model NormalModel {
  a: numeric;
  b: string;
}

model NormalArrayModel is Array<NormalModel> {}

enum  NormalEnum {
  A,
  B,
  C
}
```

</details>

### 数値
---

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
| `@minValue(42)` | `z.number().gte(4)` に変換されます |
| `@maxValue(42)` | `z.number().lte(4)` に変換されます |
| `@minValueExclusive(8)` | `z.number().gt(4)` に変換されます |
| `@maxValueExclusive(8)` | `z.number().lt(4)` に変換されます |

<details>

<summary>TypeSpec の定義例</summary>

```tsp
@doc("数値")
model NumericValues {
  a: numeric;
  b: integer;
  c: float;
  d: int64;
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

### 文字列
---

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

<details>

<summary>TypeSpec の定義例</summary>

```tsp
@doc("文字列")
model StringValues {
  a: string;
  b: plainDate;
  c: plainTime;
  d: utcDateTime;
  e: offsetDateTime;
  f: duration;
  g: url;
}
```

</details>

### 論理値
---

| 型 | 補足 |
| --- | --- |
| boolean | `z.boolean()` に変換されます |

<details>

<summary>TypeSpec の定義例</summary>

```tsp
@doc("論理値")
model BooleanValues {
  a: boolean;
}
```

</details>

### 配列・オブジェクト

> [!WARNING]
> `Record<Element>` は現状サポートしていません。

| 型 | 補足 |
| --- | --- |
| Element[] | `z.array(elementSchema)` に変換されます |

| デコレータ | 補足 |
| --- | --- |
| `@minItems(42)` | `z.array(...).min(4)` に変換されます |
| `@maxItems(42)` | `z.array(...).max(4)` に変換されます |

<details>

<summary>TypeSpec の定義例</summary>

```tsp
@doc("配列")
model ArrayValues {
  a: string[];
  b: OtherModel[];
}
```

</details>

### その他
---

> [!WARNING]
> `null`, `unknown`, `void`, `never` は現状サポートしていません。
