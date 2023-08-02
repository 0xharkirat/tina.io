---
id: '/docs/self-hosted/authentication-provider/next-auth'
title: NextAuth Authentication Provider
prev: '/docs/self-hosted/authentication-provider/overview'
next: '/docs/self-hosted/authentication-provider/tina-cloud'
---

[Clerk](https://clerk.com) is a user management service which you can use for any self-hosted Tina setup.

## Getting Started

To get started you will need to install the following dependencies:

```bash
yarn add @clerk/clerk-js @clerk/backend
```

## Setup

Visit [clerk.com](https://clerk.com/) to create an account and an "application". Once you've done that, navigate to the API Keys tab to find your credentials and store them in the .env file in your project.

![Clerk API Keys screenshot](/img/clerk-api-keys-screenshot.png)

```bash
CLERK_SECRET=sk_test_my-clerk-secret
TINA_PUBLIC_CLERK_PUBLIC_KEY=pk_test_my-clerk-public-key
TINA_PUBLIC_IS_LOCAL=false
```

> Note: In order to test the Clerk flow locally `TINA_PUBLIC_IS_LOCAL` is set to true. You can set that to false when not testing the Clerk integration.

## Update your Tina Config

Add the following to your `tina/config.{ts.js}` file, be sure to replace "my-email@gmail.com" with the email you're signing in with:

```ts
import Clerk from '@clerk/clerk-js'

const clerk = new Clerk(process.env.TINA_PUBLIC_CLERK_PUBLIC_KEY)

/**
 * For premium Clerk users, you can use restrictions
 * https://clerk.com/docs/authentication/allowlist
 */
export const isUserAllowed = (emailAddress: string) => {
  const allowList = ['my-email@gmail.com']
  if (allowList.includes(emailAddress)) {
    return true
  }
  return false
}

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === 'true'

export default defineConfig({
  //...
  contentApiUrlOverride: '/api/gql',
  admin: {
    auth: {
      useLocalAuth: isLocal,
      customAuth: !isLocal,
      /**
       * A falsey response here will prompt the login screen to be displayed
       */
      getUser: async () => {
        await clerk.load()
        if (clerk.user) {
          if (isUserAllowed(clerk.user.primaryEmailAddress.emailAddress)) {
            return true
          }
          // Handle when a user is logged in outside of the org
          clerk.session.end()
        }
        return false
      },
      /**
       * Prompts the Clerk auth
       */
      authenticate: async () => {
        clerk.openSignIn({
          redirectUrl: '/admin/index.html', // This should be the Tina admin path
          appearance: {
            elements: {
              // Tina's sign in modal is in the way without this
              modalBackdrop: { zIndex: 20000 },
            },
          },
        })
      },
      /**
       * Generates a short-lived token when Tina makes a request
       */
      getToken: async () => {
        await clerk.load()
        if (clerk.session) {
          return { id_token: await clerk.session.getToken() }
        }
      },
      logout: async () => {
        await clerk.load()
        await clerk.session.remove()
      },
    },
  },
  //...
})
```

Note that we're checking if the signed-in user's email exists in a hardcoded array. There are a few ways to do this properly:

- Create an organization in Clerk, and check to see if the signed-in user is part of the org for this project
- Create an ["allow-list"](https://clerk.com/docs/authentication/allowlist). Note that this is a paid feature.

## Protect your GraphQL API endpoint

Add the following to your `pages/api/gql.ts` file

```ts
import { NextApiHandler, NextApiRequest } from 'next'
import { databaseRequest } from '../../lib/databaseConnection'
import { Clerk } from '@clerk/backend'
// The same logic here is used during auth
import { isUserAllowed } from '../../tina/config'

const secretKey = process.env.CLERK_SECRET
const clerk = Clerk({
  secretKey,
})

const isAuthorized = async (req: NextApiRequest) => {
  if (process.env.TINA_PUBLIC_IS_LOCAL === 'true') {
    return true
  }

  const requestState = await clerk.authenticateRequest({
    headerToken: req.headers['authorization'],
  })
  if (requestState.status === 'signed-in') {
    const user = await clerk.users.getUser(requestState.toAuth().userId)
    const primaryEmail = user.emailAddresses.find(
      ({ id }) => id === user.primaryEmailAddressId
    )
    if (primaryEmail && isUserAllowed(primaryEmail.emailAddress)) {
      return true
    }
  }
  return false
}

const nextApiHandler: NextApiHandler = async (req, res) => {
  if (await isAuthorized(req)) {
    const { query, variables } = req.body
    const result = await databaseRequest({ query, variables })
    return res.json(result)
  } else {
    return res.status(401).json({ error: 'Unauthorized' })
  }
}

export default nextApiHandler
```
