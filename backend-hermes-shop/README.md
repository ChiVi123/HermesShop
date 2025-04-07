### example data

```js
const c = {
    id: "cbab5360-5d54-5339-8d4e-cf5e6915b58a",
    name: "active shoes",
};

const p1 = {
    id: "5d8df57e-e2f3-5f0b-8f81-db6a3467d53a",
    name: "Men's Tree Gliders",
    slugify: "mens-tree-gliders",
    category: {
        id: "cbab5360-5d54-5339-8d4e-cf5e6915b58a",
        name: "active shoes",
    },
    gender: "men",
    rating: 4,
    currency: "USD",
    attrs: [
        { key: "classics", type: "color" },
        { key: "limited edition", type: "color" },
        { key: "size", type: "text" },
    ],
    skus: [
        {
            id: "3e54b82d-4a83-5994-865d-3af632077216",
            productId: "5d8df57e-e2f3-5f0b-8f81-db6a3467d53a",
            name: "Deep Navy 1.2",
            slugify: "mens-tree-gliders-deep-navy-1-2",
            price: 45,
            discountPrice: 36,
            attrs: [
                {
                    key: "classics",
                    value: "linear-gradient(135deg, rgb(127, 129, 129) 50%, rgb(172, 174, 173) 50%)",
                },
                {
                    key: "size",
                    value: 1.2,
                },
            ],
        },
        {
            id: "996dafe1-d383-5e22-915d-cdd2e39f4f7a",
            productId: "5d8df57e-e2f3-5f0b-8f81-db6a3467d53a",
            name: "Blizzard/Bold Red 1.5",
            slugify: "mens-tree-gliders-blizzard-bold-red-1-5",
            price: 138,
            attrs: [
                {
                    key: "limited edition",
                    value: "rgb(76, 68, 64)",
                },
                {
                    key: "size",
                    value: 1.5,
                },
            ],
        },
    ],
};

const inventory = [
    {
        skuId: "3e54b82d-4a83-5994-865d-3af632077216",
        stock: 12,
    },
    {
        skuId: "996dafe1-d383-5e22-915d-cdd2e39f4f7a",
        stock: 8,
    },
];
```
