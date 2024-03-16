# Itsm Middleware

## Development

```
npm install
npm run dev
```

```
open http://localhost:3000
```

## Instructions for Simulating Internet Access

To make the application available on the internet, we used an alternative to ngrok.
Just run the command:

```
ssh -R 80:localhost:3000 serveo.net
```

According to the url returned, we can now test. Ex:

```
curl --request GET https://8b69bf071122ad7a00024a6ca8cd7537.serveo.net/rate
```

## Instructions for Running on Docker

```
docker build -f Dockerfile -t mdw .
docker run -d --name mdw --rm -p 3000:3000 mdw:latest
```

### To view the log

```
docker logs -f mdw
```
