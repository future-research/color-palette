import { Color } from "../../src/Color";

const black = Color.fromHex("#111111");
const gray = Color.fromColor(black, { shade: 0.5 });

const Colors = {
  White: Color.fromPalette({
    base: Color.fromRgba("rgba(255, 255, 255)"),
    // Every color is a palette of colors, and each palette is a color.
    // Thus, a palette can have infinite sub-palettes.
    OffWhite: Color.fromPalette({
      lighter: Color.fromHex("#fbfbfb"),
      light: Color.fromHex("#f8f9f9"),
      base: Color.fromHex("#f4f6f6"),
      dark: Color.fromHex("#f2f3f4"),
    }),
  }),
  Black: Color.fromPalette({ base: black }),
  Blue: Color.fromPalette({
    base: Color.fromHex("#5271FF"),
    light: Color.fromHex("#5271FF"),
    dark: Color.fromHex("#0652DD"),
  }),
  Green: Color.fromPalette({
    base: Color.fromHex("#1abc9c"),
    dark: Color.fromHex("#16a085"),
  }),
  Red: Color.fromPalette({
    base: Color.fromHex("#e74c3c"),
    dark: Color.fromHex("#c0392b"),
  }),
  // The base is optional
  Pink: Color.fromPalette({
    fuchsia: Color.fromHex("#FF5733"),
    hot: Color.fromHex("#FF69B4"),
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
};

console.log(Colors.White.OffWhite.light);
