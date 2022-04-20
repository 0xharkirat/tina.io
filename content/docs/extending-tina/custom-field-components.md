---
title: 'Custom field components'
id: '/docs/extending-tina/custom-field-components'
prev: /docs/extending-tina/validation
next: /docs/extending-tina/customize-list-ui
---

A custom component can be passed and rendered by setting the `ui.component` property on a field. This component completely overrides the original component, providing the user with the ability to fully customize the field.

## Providing your own component

A fields `ui.component` property is a React component that accepts three props:

- `field`: The [field definition](https://tinacms.org/docs/reference/toolkit/fields) for the current field.
- `input`: The data and callbacks necessary to make an input.
- `meta`: Metadata about the field in the form. (e.g. `dirty`, `valid`)

Checkout the [react-final-form](https://github.com/final-form/react-final-form#fieldrenderprops) docs for a more detailed description of the `input` and `meta` props.


Let's create a basic slider component:


```tsx
// .tina/schema.{js,tsx}

//.. other fields
{
  name: 'saturation',
  type: 'number',
  ui:{
    parse: (val) => Number(val),
    component: ({ field, input, meta }) => {
      return (
        <>
          <div>
            <label htmlFor="saturation">Image Saturation</label>
          </div>
          <div>
            <input
              name="saturation"
              id="saturation"
              type="range"
              min="0"
              max="10"
              step=".1"
// This will pass along props.input.onChange to set our form values as this input changes.
              {...input} 
            />
           Value: {input.value}
          </div>
        </>
      )
    }
  }
}
```


![A basic slider custom component](https://res.cloudinary.com/forestry-demo/image/upload/v1649941211/tina-io/docs/extending-tina/Extending_Tina_Custom_Component.png)


> Note in this example parse is also needed. [Read more about parse here](/docs/extending-tina/format-and-parse.md)


## Using pre-build components

If you do not want to provide your own component we have a few prebuilt components. The `ui.component` property is a string in this case and can be any registered field

Below is a list of default fields.
### Default Field Plugins

- [text](/docs/reference/toolkit/fields/text/)
- [textarea](/docs/reference/toolkit/fields/textarea/)
- [number](/docs/reference/toolkit/fields/number/)
- [image](/docs/reference/toolkit/fields/image/)
- [color](/docs/reference/toolkit/fields/color/)
- [toggle](/docs/reference/toolkit/fields/toggle/)
- [radio-group](/docs/reference/toolkit/fields/radio-group/)
- [select](/docs/reference/toolkit/fields/select/)
- [tags](/docs/reference/toolkit/fields/tags/)
- [list](/docs/reference/toolkit/fields/list/)
- [group](/docs/reference/toolkit/fields/group/)
- [group-list](/docs/reference/toolkit/fields/group-list/)
- [blocks](/docs/reference/toolkit/fields/blocks/)
- [date](/docs/reference/toolkit/fields/date/)

Tina also supports some extra field plugins, that need to be imported and registered from separate packages:

- [markdown](/docs/reference/toolkit/fields/markdown/)
- [html](/docs/reference/toolkit/fields/html/)



### Configuring a field plugin

Each of these fields has a unique set of properties that can be configured within the `.tina/schema.ts` file.

If you take a look at the color field plugin's definition, it takes a `colorFormat` property. We can configure that in our `.tina/schema.ts` like so:

```ts
// ...
        {
          type: 'string',
          label: 'Background Color',
          name: 'color',
          ui: {
            component: "color",
            colorFormat: "rgb"
          }
        },
// ...
```

