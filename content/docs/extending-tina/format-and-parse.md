---
title: Format and parse input
id: '/docs/extending-tina/format-and-parse'
prev: null
next: null
---

Format and parse can be used together to customize the value of the form (What the users see's) and the value of the data being saved. See the following example,

```ts
// .tina/schema.{js,ts,tsx}
// ...fields
{
 name: "username",
 type: "string",
 label: "Username",
 ui: {
// is called on every form change but result is stored in data and not in the form value (saved to file but not displayed to the user)
   parse: (val?: string)=>val && val.toUpperCase(),
// Is called on every form change and the result is put back into the value of the form (displayed to the user)           
   format: (val?: string)=> (val ? val.toLowerCase() : ""),
 },
},
```

As you type you will see all lowercase but when it is saved it will be all uppercase.

We can also use this to cast inputs to numbers that might have otherwise been saved as strings. See [this example] for more details.



<!-- TODO add this back in when this bug is fixed -->
<!-- Combining this with a custom input we can make fields that are automatically updated. For example we have have a "Last edited" field that will automatically update when the form was last updated.

```tsx
// .tina/schema.ts

// ...other fields
{
 name: "lastUpdated",
 type: "string",
 ui: {
   parse: (val?: string)=>val || "",
   format: ()=> {
     return (new Date()).toLocaleDateString()
   },
   component: ({input})=>{
     return <div>Last updated: {input.value}</div>
   }
 },
},
``` -->
