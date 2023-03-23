---
title: TinaCMS Version 1.4
date: '2023-03-23T04:00:00.000Z'
last_edited: '2023-03-23T04:00:00.000Z'
author: Logan Anderson
---

Today we are excited to release `tinacms@1.4.0` and `@tinacms/graphql@1.4.0` these new versions add a match property (used for excluding an including a subset of documents), a massive update to out CLI and various big fixes and other improvements.  The full list of changes can be found [in the changeset PR](https://github.com/tinacms/tinacms/pull/3706 "Changset pull request").

## The `match` property on a collection

Now if you want to only include a subset of your documents in your collection this can be done with the match property.

For example,

```typescript
import { defineConfig } from 'tinacms'

export default defineConfig({
  schema: {
    collections: [
      {
        path: 'content/posts',
        match: {
          include: '*',
        },
        format: 'md'
      }
    ]
  }
})
```

this will not match on subdirectories. It will match `collections/posts/foo.md` but not `collections/posts/nested/bar.md`.

\
CLI updates
-----------

The GraphQL playground is now hosted at \<YourDevUrl>/admin/index.html#/graphql (It was previously on the same port as the local GraphQL server). This allows the playground to be used in production and allows us to customize more in the feature. We have also updated are entire CLI to a more typesafe system allowing us to develop quicker and safer.  \
\
Other improvements
