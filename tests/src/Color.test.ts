import { Color } from "../../src/Color";
import {
  getRgbaByConfig,
  getRgbaConfig,
  convertHexToRgba,
  validateHex,
  genRandomHex,
  genRandomRgba,
  genRandomRgbaConfig,
  validateRgba,
} from "../../src/utils";

import { getValueWithDateNow, clearAllMocks } from "../helpers";
import { ColorFromPaletteOptions } from "../../src/types";

const testToString = (values) => {
  values.forEach(({ create, getExpectedColor, validateColor }) => {
    it("should return the color string", () => {
      const color = create();

      // @ts-ignore
      expect(`${color.zPalette}`).toEqual(getExpectedColor());
      // @ts-ignore
      expect(validateColor(color.zPalette.toString())).toEqual(true);
    });
  });
};

// npm run test -- colors/Color.test.ts
describe("Color", () => {
  beforeEach(() => {
    clearAllMocks();
  });

  afterEach(() => {
    clearAllMocks();
  });

  describe("constructor", () => {
    describe("when the private constructor key is not provided", () => {
      const configs = [{ hex: genRandomHex() }, { rgba: genRandomRgba() }];

      configs.forEach((config) => {
        it(`should throw an error for config ${JSON.stringify(config)}`, () => {
          const func = () => {
            return new Color(config);
          };

          expect(func).toThrow(
            "Use one of the factory functions to construct a new Color instance."
          );
        });
      });
    });
  });

  describe("#isDebuggingEnabled", () => {
    it("should be true", () => {
      const color = Color.fromHex(genRandomHex());

      expect(color.isDebuggingEnabled).toEqual(true);
    });
  });

  describe("#fromHex()", () => {
    describe("when valid hex is provided", () => {
      it("should create a new instance", () => {
        const hex = genRandomHex();
        const color = Color.fromHex(hex);

        expect(color.toHex()).toEqual(hex);
        expect(color.base).toEqual(color);
      });
    });
  });

  describe("#fromRgba()", () => {
    describe("when valid rgba is provided", () => {
      it("should create a new instance", () => {
        const rgba = genRandomRgba();
        const color = Color.fromRgba(rgba);

        expect(color.toRgba()).toEqual(rgba);
        expect(color.base).toEqual(color);
      });
    });
  });

  describe("#toString()", () => {
    testToString([
      (() => {
        const hex = genRandomHex();
        return {
          create: () => Color.fromHex(hex),
          getColor: (color) => color,
          getExpectedColor: () => hex,
          validateColor: validateHex,
        };
      })(),
      (() => {
        const rgba = genRandomRgba();
        return {
          create: () => Color.fromRgba(rgba),
          getColor: (color) => color,
          getExpectedColor: () => rgba,
          validateColor: validateRgba,
        };
      })(),
    ]);
  });

  describe("#palette", () => {
    describe("#toString()", () => {
      testToString([
        (() => {
          const hex = genRandomHex();
          return {
            create: () => Color.fromHex(hex),
            getColor: (color) => color.palette,
            getExpectedColor: () => hex,
            validateColor: validateHex,
          };
        })(),
        (() => {
          const rgba = genRandomRgba();
          return {
            create: () => Color.fromRgba(rgba),
            getColor: (color) => color.palette,
            getExpectedColor: () => rgba,
            validateColor: validateRgba,
          };
        })(),
      ]);
    });

    describe("when mutation is attempted", () => {
      it("should throw an error", () => {
        const randomKeyA = getValueWithDateNow("abc");
        const randomKeyB = getValueWithDateNow("xyz");

        const color = Color.fromPalette({
          base: Color.fromHex(genRandomHex()),
          [randomKeyA]: Color.fromHex(genRandomHex()),
          Nested: Color.fromPalette({
            base: Color.fromRgba(genRandomRgba()),
            abc: Color.fromRgba(genRandomRgba()),
            xyz: Color.fromPalette({
              base: Color.fromHex(genRandomHex()),
              def: Color.fromHex(genRandomHex()),
            }),
            [randomKeyB]: Color.fromHex(genRandomHex()),
          }),
        });

        expect(() => {
          // @ts-ignore
          color.zPalette.base = getValueWithDateNow("123");
        }).toThrow(
          `Cannot assign to read only property 'base' of object '[object Object]'`
        );

        expect(() => {
          // @ts-ignore
          color.zPalette[randomKeyA] = getValueWithDateNow("456");
        }).toThrow(
          `Cannot assign to read only property '${randomKeyA}' of object '[object Object]'`
        );
        expect(() => {
          // @ts-ignore
          color.zPalette.Nested[randomKeyB] = getValueWithDateNow("xyz");
        }).toThrow(
          `Cannot assign to read only property '${randomKeyB}' of object '[object Object]'`
        );
      });
    });
  });

  describe("#setDebug()", () => {
    const cases = [false, true];

    cases.forEach((status) => {
      it(`should set #isDebuggingEnabled to ${status}`, () => {
        const hex = genRandomHex();
        const color = Color.fromHex(hex);

        color.setDebug(!status);
        expect(color.isDebuggingEnabled).toEqual(!status);

        color.setDebug(status);
        expect(color.isDebuggingEnabled).toEqual(status);
      });
    });
  });

  describe("#toHex()", () => {
    describe("when hex is configured", () => {
      it("should return the hex string", () => {
        const hex = genRandomHex();
        const color = Color.fromHex(hex);

        expect(color.toHex()).toEqual(hex);
      });
    });

    describe("when rgba is configured", () => {
      it("should return the hex string representation", () => {
        const color = Color.fromRgba(genRandomRgba());

        const hex = color.toHex();
        expect(hex.startsWith("#")).toEqual(true);
        expect(validateHex(hex)).toEqual(true);
      });
    });
  });

  describe("#toRgba()", () => {
    describe("when rgba is configured", () => {
      it("should return the rgba string", () => {
        const rgbaConfig = genRandomRgbaConfig();
        const color = Color.fromRgba(getRgbaByConfig(rgbaConfig));

        const rgba = color.toRgba();
        const extractedConfig = getRgbaConfig(rgba);
        expect(extractedConfig).toStrictEqual(rgbaConfig);
      });
    });

    describe("when hex is configured", () => {
      it("should return the rgba string representation", () => {
        const hex = genRandomHex();
        const color = Color.fromHex(hex);

        const extractedConfig = getRgbaConfig(color.toRgba());
        expect(extractedConfig).toStrictEqual(
          getRgbaConfig(convertHexToRgba(hex))
        );
      });
    });
  });

  describe("#fromPalette()", () => {
    describe("when a palette with a base is provided", () => {
      it("should return a color with the provided palette", () => {
        const randomKeyA = getValueWithDateNow("abc");
        const randomKeyB = getValueWithDateNow("xyz123");

        const paletteEntries = [
          { key: "base", value: Color.fromRgba(genRandomRgba()) },
          { key: "light", value: Color.fromHex(genRandomHex()) },
          { key: randomKeyA, value: Color.fromHex(genRandomHex()) },
          { key: randomKeyB, value: Color.fromRgba(genRandomRgba()) },
        ];

        const colorPalette = paletteEntries.reduce((map, { key, value }) => {
          return { ...map, [key]: value };
        }, {} as ColorFromPaletteOptions);

        const color = Color.fromPalette(colorPalette);

        paletteEntries.forEach(({ key: paletteKey, value: paletteColor }) => {
          expect(color[paletteKey]).toStrictEqual(paletteColor);
        });
      });
    });

    describe("when palette with no base is provided", () => {
      it("should default to a transparent base color", () => {
        const randomKeyA = getValueWithDateNow("abc");
        const randomKeyB = getValueWithDateNow("xyz123");
        const paletteEntries = [
          { key: "light", value: Color.fromHex(genRandomHex()) },
          { key: randomKeyA, value: Color.fromHex(genRandomHex()) },
          { key: randomKeyB, value: Color.fromRgba(genRandomRgba()) },
        ];

        const colorPalette = paletteEntries.reduce((map, { key, value }) => {
          return { ...map, [key]: value };
        }, {} as ColorFromPaletteOptions);

        const factoryConsoleWarnSpy = spyOnMockConsoleWarn();

        const color = Color.fromPalette(colorPalette);

        expect(factoryConsoleWarnSpy).toHaveBeenCalledTimes(0);

        paletteEntries.forEach(({ key: paletteKey, value: paletteColor }) => {
          expect(color[paletteKey]).toStrictEqual(paletteColor);
        });

        const consoleWarnSpy = spyOnMockConsoleWarn();

        expect(color.base.isTransparentBase).toEqual(true);
        expect(expectFixedAlpha({ color, consoleWarnSpy })).toBe(true);
      });

      it("should prevent opacity transformations on the generated transparent base", () => {
        const color = Color.fromPalette({
          light: Color.fromHex(genRandomHex()),
        });
        const consoleWarnSpy = spyOnMockConsoleWarn();

        expect(expectFixedAlpha({ color, consoleWarnSpy })).toBe(true);
      });

      const expectFixedAlpha = ({ color, consoleWarnSpy }) => {
        expect(getRgbaConfig(color.base.toRgba()).alpha).toEqual(0);
        expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
        expect(consoleWarnSpy).toHaveBeenLastCalledWith(
          `You're attempting to use a transparent base color. This is likely an error.`,
          color.base
        );

        expect(color.base.toHex({ opacity: 1 })).toEqual(color.base.toHex());
        expect(color.base.toRgba({ opacity: 1 })).toEqual(color.base.toRgba());

        return true;
      };
    });
  });
});

const spyOnMockConsoleWarn = () => {
  return jest.spyOn(console, "warn").mockImplementation(() => "");
};
