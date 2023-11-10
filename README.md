# Color Palette

A powerful, simple, and convenient library for defining, manipulating, and using colors.

![demo](https://github.com/future-research/dashboard/assets/5778798/4b325457-0d48-404f-963b-f446f1cab0ce)

```
npm install --save @future-research/color-palette
```

## Type safety all the way through

<img width="866" alt="Screen Shot 2023-03-04 at 11 44 56 AM" src="https://user-images.githubusercontent.com/5778798/222918282-2de50e30-a30e-4c15-bf55-1bd24094e6ed.png">

## Usage

First, we'll define colors and color palettes. Then, we'll dive into how they work and how you can make the most of them.

Note that every instance of `Color` has a `#toString()` method, which enables automatic coercion to a string. Also, every palette is an instance of `Color`.

### Define Your Colors

```js
const black = Color.fromHex('#111111')
const gray = Color.fromColor(black, { shade: 0.5 })

const Colors = {
  White: Color.fromPalette({
    base: Color.fromRgba('rgba(255, 255, 255)'),
    // Every color is a palette of colors, and each palette is a color.
    // Thus, a palette can have infinite sub-palettes.
    OffWhite: Color.fromPalette({
      lighter: Color.fromHex('#fbfbfb'),
      light: Color.fromHex('#f8f9f9'),
      base: Color.fromHex('#f4f6f6'),
      dark: Color.fromHex('#f2f3f4'),
    }),
  }),
  Black: Color.fromPalette({ base: black }),
  Blue: Color.fromPalette({
    base: Color.fromHex('#5271FF'),
    light: Color.fromHex('#5271FF'),
    dark: Color.fromHex('#0652DD'),
  }),
  Green: Color.fromPalette({
    base: Color.fromHex('#1abc9c'),
    dark: Color.fromHex('#16a085'),
  }),
  Red: Color.fromPalette({
    base: Color.fromHex('#e74c3c'),
    dark: Color.fromHex('#c0392b'),
  }),
  // The base is optional
  Pink: Color.fromPalette({
    fuchsia: Color.fromHex('#FF5733'),
    hot: Color.fromHex('#FF69B4'),
  }),
  Gray: Color.fromPalette({
    base: gray,
    // In this example, "s" stands for scale.
    // The larger the shade percentage, the lighter the color
    s10: Color.fromColor(black),
    s9: Color.fromColor(black, { shade: 0.1 }),
    s8: Color.fromColor(black, { shade: 0.2 }),
    s7: Color.fromColor(black, { shade: 0.3 }),
    s6: Color.fromColor(black, { shade: 0.4 }),
    s5: gray,
    s4: Color.fromColor(black, { shade: 0.6 }),
    s3: Color.fromColor(black, { shade: 0.7 }),
    s2: Color.fromColor(black, { shade: 0.8 }),
    s1: Color.fromColor(black, { shade: 0.9 }),
    s0: Color.fromColor(black, { shade: 0.95 }),
  }),
}

// Apply opacity
const seeThroughBlack = Colors.black.toHex({ opacity: 0.2 })
// This is the same as Color.fromHex('#000000', { opacity: 0.2 })
// This is the same as Color.fromHex('#000000').toRgba({ opacity: 0.2 })
```

### Use Your Colors

With a color defined, we can use it in JS or any css-in-js libraries with ease.

Because a `Color` instance has `#toString()` defined to return its hex (or rgba) representation, we can serialize any color or color palette. By default the `#base` color will be used in a palette.

```tsx
// In SomeComponent.tsx
// Assuming you're using something like styled-components in React JS

export const SomeComponent = () => {
  return <div css={styles.wrapper}>Hello, world!</div>
}

const styles = {
  wrapper: css<{ isAwesome: boolean }>`
    background-color: ${Colors.Black};

    // A transparent gray border
    border: 2px solid ${Colors.Gray.toHex({ opacity: 0.8 })};

    color: ${({ isAwesome }) => {
      if (isAwesome) {
        // From the White palette, use the OffWhite palette's "light" color 😎
        return Colors.White.OffWhite.light
      }

      // Or darken the light color:
      return Colors.White.OffWhite.light.toHex({ shade: -0.3 })
    }};
  `,
}
```

### Conveniences

Because each color is a palette and each palette is a color, the following operations yield equal results:

```js
const grayHex = Colors.Gray.toHex()
const grayBaseHex = Colors.Gray.base.toHex()
const grayHex2 = `${Colors.Gray}`
const grayBaseHex2 = Colors.Gray.base.toString()
```

Similarly, these operations yield equal values:

```js
const offWhiteLightColor = Colors.White.OffWhite.light
const offWhiteLightBaseColor = Colors.White.OffWhite.light.base
```

# Contributing

1. Make your changes
2. Add tests to maintain ~100% coverage given how critical this package is.
3. Open a pull request

## How to manually test changes locally

To manually test your changes in a dependent project before releasing, you can follow these steps:

1. Build this package: `npm run build`
2. `cd` into the dependent project directory.
3. Assuming this package is a sibling of the dependent project in your local system,
   run `sudo [npm link](https://docs.npmjs.com/cli/v9/commands/npm-link) ../web`
4. Use your changes in the dependent project's code
5. Run the dependent project to ensure your changes work as expected
6. If you need to make changes to this package, make sure to run steps #1, #4, and #5 again.

Once you're done testing, you can unlink the local package from your dependent project by running the following from your dependent project's directory:
`sudo npm unlink ../web`
