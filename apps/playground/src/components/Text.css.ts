import { style, styleVariants } from "@vanilla-extract/css";

export const root = style({
  fontFamily: "Comic Sans Ms",
  color: "blue",
});

export const size = styleVariants({
  small: { fontSize: 16 },
  medium: { fontSize: 24 },
  large: { fontSize: 32 },
});
