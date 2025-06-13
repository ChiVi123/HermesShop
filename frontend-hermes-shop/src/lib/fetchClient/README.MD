Custom from [wretch (github)](https://github.com/elbywan/wretch) and [axios (github)]()

## License's Julien Elbaz

MIT License

Copyright (c) 2017 Julien Elbaz

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## License's Axios

Copyright (c) 2014-present Matt Zabriskie & Collaborators

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

```js
const promise = new Promise((resolve) => {
  resolve({ status: 'init', step: 0 });
});

promise
  .then((value) => {
    console.log(value);
    return { ...value, status: 'interceptor request', step: value.step + 1 };
  })
  .catch((error) => Promise.reject(error))
  .then((value) => {
    console.log(value);
    return { ...value, status: 'interceptor request', step: value.step + 1 };
  })
  .catch((error) => Promise.reject(error))
  .then(async (value) => {
    console.log(value);
    const fetchPromise = new Promise((resolve, reject) => {
      const isError = false;
      if (isError) {
        reject('fetch error');
      } else {
        resolve({ ...value, status: 'fetch', step: value.step + 1 });
      }
    });

    try {
      const res = await fetchPromise;
      console.log(res);
      return { ...res, status: 'fetch response', step: res.step + 1 };
    } catch (error) {
      console.log(error);
      return Promise.reject(error);
    }
  })
  .catch((error) => Promise.reject(error))
  .then(
    (value) => {
      console.log(value);
      return { ...value, status: 'interceptor response', step: value.step + 1 };
    },
    (error) => Promise.reject(error)
  )
  .then(
    (value) => {
      console.log(value);
      return { ...value, status: 'interceptor response', step: value.step + 1 };
    },
    (error) => Promise.reject(error)
  )
  .catch((error) => Promise.reject(error))
  .then((value) => {
    console.log(value);
    return { ...value, status: 'parse body', step: value.step + 1 };
  })
  .then((value) => {
    console.log(value);
  })
  .catch(() => {
    console.log('catch wrapper');
  });
```
