---
title: Collections
id: collections
last_edited: '2021-07-27T15:51:56.737Z'
next: /docs/reference/fields
prev: /docs/reference/schema
---


Collections represent a type of content (EX, blog post, page, author, etc). It is recommended to use singular naming in a collection.


| Property     | Description              |
|--------------|--------------------------|
| `name` | The name of the collection |
| `path` | The path to a folder of where the content is stored. (relative to where the CLI is running) |
| `label` | A human friendly label that will be displayed to the user|
| `fields` | An array of [fields](/docs/reference/fields/) |
| `templates` | An array of [templates](/docs/reference/templates/) |

> Note: you can only provide fields or templates but never both

## Example

```ts
const schema = defineSchema({
    collections: [
      {
       name: "posts",
       label: "Blog Posts",
       path: "content/posts",
       fields: [
        // An array of fields
       ],
      },
    ]
}) 

// ...

export default schema
```
