---
title: Bring your own Authentication Provider
id: '/docs/reference/self-hosted/authentication-provider/bring-your-own'
prev: '/docs/reference/self-hosted/authentication-provider/tina-cloud'
next: null
---

To self host your own authentication, you will need to do do two things.

## 1. Create a custom Authentication Provider Class

You can do so by extending the `AbstractAuthProvider` class and implementing the following functions:

### Required Functions

`authenticate`: This function is called when the user goes into `/admin` and they are not logged in (determined by `getUser`). This function should redirect the user to the login page or do whatever is necessary to authenticate the user.

`getUser`: This function is called when the user goes into `/admin` and is used to determine if the user is logged in. If it returns a truthy value, the user is logged in and if it returns a falsy value the user is not logged in.

`getToken`: This function is called when a request is made to the GraphQL endpoint. It should return an object with an `id_token` property. This will be passed as an `Authorization` header in the format `Bearer <id_token>`

`logOut`: This function is called when the user clicks the logout button in the admin.

### Optional Functions

`getSessionProvider`: Return a React context provider to that will wrap the admin

```ts
import { AbstractAuthProvider } from 'tinacms'

export class CustomAuthProvider extends AbstractAuthProvider {
  constructor() {
    super()
    // Do any setup here
  }
  async authenticate(props?: {}): Promise<any> {
    // Do any authentication here
  }
  getToken() {
    // Return the token here. The token will be passed as an Authorization header in the format `Bearer <token>`
  }
  async getUser() {
    // Returns a truthy value, the user is logged in and if it returns a falsy value the user is not logged in.
  }
  logout() {
    // Do any logout logic here
  }
  async authorize(context?: any): Promise<any> {
    // Do any authorization logic here
  }
  getSessionProvider() {
    // OPTIONALLY Return a React context provider to that will wrap the admin
  }
}
```

Now you can add your custom auth provider to your config file:

```javascript
export default defineConfig({
  authProvider: isLocal ? new LocalAuthProvider() : new CustomAuthProvider(),
  //...
})
```

## 2. Add Authentication to your Tina Backend

`TinaNodeBackend` takes an `authentication` Prop.

```ts
export interface BackendAuthentication {
  initialize?: () => Promise<void>
  isAuthorized: (
    req: IncomingMessage,
    res: ServerResponse
  ) => Promise<
    | {
        isAuthorized: true
      }
    | {
        isAuthorized: false
        errorMessage: string
        errorCode: number
      }
  >
  // You can use this if you need to attach any extra routes to the backend. Ex, a callback route for OAuth
  extraRoutes?: {
    [key: string]: {
      // If secure is true the `isAuthorized` function will be called before the handler is called
      secure?: boolean
      handler: (req: IncomingMessage, res: ServerResponse) => Promise<void>
    }
  }
}
```

This Interface must be passed to the `authentication` prop of `TinaNodeBackend`. You can get the token from the request by calling `req.headers.authorization`.This token should be validated in the `isAuthorized` function.

```ts
const CustomBackendAuth = () => {
  return {
    isAuthorized: async (req, res) => {
      const token = req.headers.authorization
      // Validate the token here
      return {
        isAuthorized: true,
      }
    },
  }
}
```

For an example of how to do this, see the [AuthJS Backend]()

Once you have created an object that implements the `BackendAuthentication` interface, you can pass it to the `authentication` prop of `TinaNodeBackend`

`/pages/api/tina/[...routes].{ts,js}`

```ts
const handler = TinaNodeBackend({
  authentication: isLocal ? LocalBackendAuthentication() : CustomBackendAuth(),
  databaseClient,
})
```
