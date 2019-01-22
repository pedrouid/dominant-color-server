# dominant-color-server

simple server to get an image dominant color

## Run

```sh
npm run start

# OR

yarn start
```

## API

Simply call the server endpoint with `imgSrc` query parameter

```sh
$ curl localhost:5000?imgSrc=http://example.com/sample.png
{
    "dominantColor": "rgb(60,156,252)"
}
```
