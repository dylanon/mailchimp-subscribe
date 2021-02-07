# Mailchimp Subscribe Microservice

## Configuring a new Vercel project

1. Update secret names in now.json

```
"API_KEY": "@yourprojectprefix-chimp-apikey",
"AUDIENCE_ID": "@yourprojectprefix-chimp-audienceid",
"BASE_URL": "@yourprojectprefix-chimp-baseurl"
```

2. Create secrets with the `now` CLI:

```
npx now secret add yourprojectprefix-chimp-apikey your-secret-here
```

3. Deploy

Preview deployment:

```
npm run deploy
```

Production deployment:

```
npm run deploy:prod
```
