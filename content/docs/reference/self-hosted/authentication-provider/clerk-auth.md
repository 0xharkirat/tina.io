---
id: '/docs/reference/self-hosted/authentication-provider/clerk-auth'
title: NextAuth Authentication Provider
prev: '/docs/reference/self-hosted/authentication-provider/overview'
next: '/docs/reference/self-hosted/authentication-provider/tina-cloud'
---

[Clerk](https://clerk.com) is a user management service which you can use with a self-hosted Tina setup.

## Getting Started

To get started you will need to install the following dependencies:

```bash
yarn add @clerk/clerk-js @clerk/backend tinacms-clerk
```

## Setup

Visit [clerk.com](https://clerk.com/) to create an account and an "application". Once you've done that, navigate to the API Keys tab to find your credentials and store them in the .env file in your project.

![Clerk API Keys screenshot](/img/clerk-api-keys-screenshot.png)

Be sure to update `TINA_PUBLIC_ALLOWED_EMAIL` with the email address you'll use to sign in to Clerk.

```bash
CLERK_SECRET=sk_test_my-clerk-secret
TINA_PUBLIC_CLERK_PUBLIC_KEY=pk_test_my-clerk-public-key
TINA_PUBLIC_ALLOWED_EMAIL="your-email@gmail.com"
```

## Update the dev command

When self-hosting, you may want to disable auth for local development.

```json
"scripts": {
  "dev": "TINA_PUBLIC_IS_LOCAL=true tinacms dev -c \"next dev\"",
  "dev:prod": "tinacms dev -c \"next dev\"",
}
```

## Update your Tina Config

Add the following to your `tina/config.{ts.js}` file. Be sure to replace "my-email@gmail.com" with the email you're signing in with:

```ts
import { ClerkAuthProvider } from 'tinacms-clerk/dist/frontend'

//...

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === 'true'

export default defineConfig({
  //...
  contentApiUrlOverride: '/api/tina/gql',
  authProvider: isLocal ? new LocalAuthProvider() : new ClerkAuthProvider(),
  //...
})
```

Note that we're checking if the signed-in user's email exists in a hardcoded array. There are a few ways to do this in a more maintainable way:

- Create an organization in Clerk, and check to see if the signed-in user is part of the org for this project
- Create an ["allow-list"](https://clerk.com/docs/authentication/allowlist). Note that this is a paid feature.

## Update the Tina Backend

Add the following to your `pages/api/tina/[...routes].{ts,js}` file

```ts
import { TinaNodeBackend, LocalBackendAuthentication } from '@tinacms/datalayer'
import { ClerkBackendAuthentication } from 'tinacms-clerk'

import databaseClient from '../../../tina/__generated__/databaseClient'

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === 'true'

const handler = TinaNodeBackend({
  authentication: isLocal
    ? LocalBackendAuthentication()
    : ClerkBackendAuthentication({
        /**
         * For premium Clerk users, you can use restrictions
         * https://clerk.com/docs/authentication/allowlist
         */
        allowList: [process.env.TINA_PUBLIC_ALLOWED_EMAIL],
        secretKey: process.env.CLERK_SECRET,
      }),
  databaseClient,
})

export default (req, res) => {
  // Modify the request here if you need to
  return handler(req, res)
}
```
