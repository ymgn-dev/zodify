# Zodify

This package generates Zod schema based on an OpenAPI yaml file.

## Usage

It is still under development, but it will be available as shown below.

```bash
npx zodify -i docs/openapi.yaml -o ./gen/schemas.ts
# or
npm run build && node dist/index.mjs -i ./sample/petstore.yaml -o ./gen/petstore.ts
```

## TODO

- [ ] Convert components#schemas to Zod schema
- [ ] Convert paths#parameters to Zod schema
- [ ] express-fileupload type support

### property converters

```yaml
propA:
  type: integer
  format: int32
  minimum: 0
  maximum: 100

propB:
  type: string
  minLength: 1
  maxLength: 100

propC:
  $ref: '#/components/schemas/otherSchema'

propD:
  type: string
  enum:
    - VALIDATION_ERROR

propE:
  type: string
  enum:
    - dog
    - cat
    - fish
```
