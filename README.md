# Zodify

This package generates Zod schema based on an OpenAPI yaml file.

## TODO

- [ ] Convert components#schemas to Zod schema
- [ ] Convert paths#parameters to Zod schema
- [ ] oneOf keyword
- [ ] anyOf keyword
- [ ] multipleOf keyword
- [ ] express-fileupload type support

## Usage

It is still under development, but it will be available as shown below.

```bash
npx zodify -i docs/openapi.yaml -o ./gen/schemas.ts
```
