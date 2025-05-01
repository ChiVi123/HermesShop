File crawl-product.json

All links relate a product should set is false, example:

you want re-crawl product a variant 2, should set all link product a is false

```js
  // before
  cached: {
    'product-a-variant-1': true,
    'product-a-variant-2': true,
    'product-a-variant-3': true,
    'product-b-variant-1': true,
    'product-b-variant-2': true,
  }

  // after
  cached: {
    'product-a-variant-1': false,
    'product-a-variant-2': false, // re-crawl
    'product-a-variant-3': false,
    'product-b-variant-1': true,
    'product-b-variant-2': true,
  }
```
