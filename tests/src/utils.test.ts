import {
  getRgbaByConfig,
  genRandomRgbaConfig,
  genRandomChromaColor,
  validateHex,
  genRandomHex,
  genRandomRgba,
  validateRgba,
  validateShade,
  convertColorToChromaSafe,
  validateChromaColor,
  convertHexToRgba,
  getRgbaConfig,
  shadeHex,
  transformHex,
  validateAlpha,
} from "../../src/utils";
import { getValueWithDateNow } from "../helpers";

// npm run test -- colors/utils.test.ts
describe("colors: utils", () => {
  describe("#genRandomChromaColor()", () => {
    it("should return a random chroma color", () => {
      const chromaColor = genRandomChromaColor();
      expect(validateChromaColor(chromaColor)).toEqual(true);
      expect(validateHex(chromaColor.hex())).toEqual(true);
    });
  });

  describe("#genRandomHex()", () => {
    it("should return a random chroma color", () => {
      const hex = genRandomHex();
      expect(validateHex(hex)).toEqual(true);
    });
  });

  describe("#genRandomRgba()", () => {
    it("should return a random chroma color", () => {
      const rgba = genRandomRgba();
      expect(validateRgba(rgba)).toEqual(true);
    });
  });

  describe("#getRgbaConfig()", () => {
    const minColorValue = 0;
    const maxColorValue = 255;

    it("should return a valid rgba config map", () => {
      const rgba = genRandomRgba();
      const config = getRgbaConfig(rgba);

      const colorComponents = ["red", "blue", "green"];
      colorComponents.forEach((component) => {
        const value = config[component];
        expect(value >= minColorValue && value <= maxColorValue).toEqual(true);
      });

      expect(config.blue >= 0 && config.blue <= maxColorValue).toEqual(true);
      expect(config.alpha > 0 && config.alpha <= 1).toEqual(true);
      // Ensure we can get a valid rgba using the config
      expect(validateRgba(getRgbaByConfig(config))).toEqual(true);
    });
  });

  describe("#getRgbaByConfig()", () => {
    it("should return an rgba color string", () => {
      const config = genRandomRgbaConfig();
      const { red, green, blue, alpha } = config;

      const rgba = getRgbaByConfig(config);
      expect(rgba).toEqual(`rgba(${red}, ${green}, ${blue}, ${alpha})`);
    });

    describe("when a valid alpha is provided", () => {
      it("should return a valid rgba", () => {
        const initialConfig = genRandomRgbaConfig();

        let alphaOpt = 0.5;
        while (alphaOpt === initialConfig.alpha) {
          alphaOpt = Math.random();
        }

        const rgba = getRgbaByConfig(initialConfig, alphaOpt);

        expect(validateRgba(rgba)).toEqual(true);

        const rgbaConfig = getRgbaConfig(rgba);
        expect(rgbaConfig.alpha).toEqual(alphaOpt);
      });
    });
  });

  describe("#convertHexToRgba()", () => {
    describe("when a valid hex is provided", () => {
      it("should return a valid rgba", () => {
        const hex = genRandomHex();
        const rgba = convertHexToRgba(hex);
        expect(validateRgba(rgba)).toEqual(true);
      });

      describe("when a valid alpha is provided", () => {
        it("should return a valid rgba", () => {
          const hex = genRandomHex();
          const alpha = 0.5;
          const rgba = convertHexToRgba(hex, { alpha });

          expect(validateRgba(rgba)).toEqual(true);
          const rgbaConfig = getRgbaConfig(rgba);
          expect(rgbaConfig.alpha).toEqual(alpha);
        });
      });
    });

    describe("when an invalid hex is provided", () => {
      it("should return a valid rgba", () => {
        const invalidHex = getValueWithDateNow("abc");
        const rgba = convertHexToRgba(invalidHex);
        expect(validateRgba(rgba)).toEqual(false);
      });
    });
  });

  describe("#validateChromaColor()", () => {
    describe("when a valid color is provided", () => {
      it(`should return true`, () => {
        const color = convertColorToChromaSafe(genRandomHex());
        const result = validateChromaColor(color);
        expect(result).toEqual(true);
      });
    });

    describe("when an invalid color is provided", () => {
      const values = [getValueWithDateNow("abc"), 123];

      values.forEach((value) => {
        it("should return undefined", () => {
          // @ts-ignore
          const result = validateChromaColor(value);
          expect(result).toEqual(false);
        });
      });
    });
  });

  describe("#convertColorToChromaSafe()", () => {
    describe("when a valid color is provided", () => {
      const colors = [genRandomHex(), genRandomRgba()];
      colors.forEach((colorCode) => {
        it(`should return true for ${colorCode}`, () => {
          const color = convertColorToChromaSafe(colorCode);
          expect(validateChromaColor(color)).toEqual(true);
        });
      });
    });

    describe("when an invalid color and valid fallback color is provided", () => {
      it(`should return true`, () => {
        const color = convertColorToChromaSafe(
          getValueWithDateNow("abc"),
          genRandomHex()
        );
        expect(validateChromaColor(color)).toEqual(true);
      });
    });

    describe("when an invalid color is provided", () => {
      it("should return undefined", () => {
        const hex = getValueWithDateNow("abc");
        // @ts-ignore
        expect(convertColorToChromaSafe(hex)).toBeUndefined();
      });
    });
  });

  describe("#validateHex()", () => {
    describe("when a valid hex is provided", () => {
      const values = [genRandomHex(), genRandomHex().substring(0, 4)];
      values.forEach((hex) => {
        it("should return true", () => {
          expect(validateHex(hex)).toEqual(true);
        });
      });
    });

    describe("when an invalid hex is provided", () => {
      const values = [getValueWithDateNow("abc"), ""];
      values.forEach((hex) => {
        it("should return false", () => {
          expect(validateHex(hex)).toEqual(false);
        });
      });
    });
  });

  describe("#validateRgba()", () => {
    describe("when a valid rgba is provided", () => {
      it("should return true", () => {
        const rgba = genRandomRgba();
        expect(validateRgba(rgba)).toEqual(true);
      });
    });

    describe("when an invalid rgba is provided", () => {
      it("should return false", () => {
        const rgba = getValueWithDateNow("abc");
        // @ts-ignore
        expect(validateRgba(rgba)).toEqual(false);
      });
    });
  });

  describe("#validateShade()", () => {
    describe("when a valid shade is provided", () => {
      const shades = [1, 0.1, 0.99].reduce((list, value) => {
        return [...list, value, -value];
      }, [] as number[]);

      shades.forEach((shade) => {
        it(`should return true for ${shade}`, () => {
          expect(validateShade(shade)).toEqual(true);
        });
      });
    });

    describe("when an invalid shade is provided", () => {
      it("should return false", () => {
        const shade = getValueWithDateNow("abc");
        // @ts-ignore
        expect(validateShade(shade)).toEqual(false);
      });
    });
  });

  describe("#validateAlpha()", () => {
    describe("when a valid alpha is provided", () => {
      const alphas = [0, 1, 0.1, 0.99];

      alphas.forEach((alpha) => {
        it(`should return true for ${alpha}`, () => {
          expect(validateAlpha(alpha)).toEqual(true);
        });
      });
    });

    describe("when an invalid alpha is provided", () => {
      const invalidAlphas = [-0.01, getValueWithDateNow("abc")];
      invalidAlphas.forEach((alpha) => {
        it(`should return false for ${alpha}`, () => {
          // @ts-ignore
          expect(validateAlpha(alpha)).toEqual(false);
        });
      });
    });
  });

  describe("#shadeHex()", () => {
    const shades = [Math.random(), -Math.random()];
    shades.forEach((shade) => {
      it("should return new hex", () => {
        const hex = genRandomHex();
        const shadedHex = shadeHex(hex, shade);

        expect(validateHex(shadedHex)).toEqual(true);
        expect(shadeHex).not.toEqual(hex);
      });
    });
  });

  describe("#transformHex()", () => {
    describe("when valid hex is provided", () => {
      describe("when valid transformation options are provided", () => {
        const transformations = [
          { shade: Math.random() },
          { shade: Math.random(), opacity: Math.random() },
        ];

        transformations.forEach((opts) => {
          it(`should return new hex with the transformations ${JSON.stringify(
            opts
          )}`, () => {
            const hex = genRandomHex();
            const transformedHex = transformHex(hex, opts);

            expect(validateHex(transformedHex)).toEqual(true);
            expect(transformedHex).not.toEqual(hex);
          });
        });
      });

      describe("when invalid transformation options are provided", () => {
        const transformations = [
          {},
          { opacity: 1 + Math.random() },
          { opacity: 0 },
          { opacity: -Math.random() },
          { shade: 1 + Math.random() },
          { shade: 0 },
          { shade: -(1 + Math.random()) },
        ];

        transformations.forEach((opts) => {
          it(`should return the original hex for ${JSON.stringify(
            opts
          )}`, () => {
            const hex = genRandomHex();
            const transformedHex = transformHex(hex, {});

            expect(validateHex(transformedHex)).toEqual(true);
            expect(transformedHex).toEqual(hex);
          });
        });
      });
    });
  });
});
