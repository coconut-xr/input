import { GlyphProperties, getPropertyChanges } from "@coconut-xr/glyph";
import {
  buildComponent,
  buildRoot,
  ContainerProperties,
  flexAPI,
  InvertOptional,
  resolveGlyphWrapper,
  textDefaults,
  TextProperties,
  TextState,
  updateContainerProperties,
  updateEventProperties,
  useFont,
} from "@coconut-xr/koestlich";
import { useEffect, useMemo } from "react";
import { Color, PlaneGeometry } from "three";
import { TextHandler } from "./text-handler.js";

const geometry = new PlaneGeometry();
geometry.translate(0.5, -0.5, 0);

export type InputState = TextState;

function createTextInputElement() {
  const el = document.createElement("input");
  el.type = "text";
  return el;
}

export class InputNode extends TextHandler<HTMLInputElement> {
  htmlElement = createTextInputElement();
}

const colorHelper = new Color();

export const inputDefaults: Omit<
  InvertOptional<InputProperties>,
  "fontFamily" | "onChange" | "value" | keyof ContainerProperties
> = {
  ...textDefaults,
  wrapper: "nowrap",
};

export type InputProperties = TextProperties & {
  value?: string;
  onChange?: (e: any) => void;
};

export function useInput(
  node: InputNode,
  {
    color,
    opacity,
    fontFamily,
    letterSpacing,
    lineHeightMultiplier,
    fontSize,
    wrapper,
    horizontalAlign,
    verticalAlign,
    value,
    ...props
  }: InputProperties,
): undefined {
  const font = useFont(fontFamily);

  const glyphProperties = useMemo<GlyphProperties>(
    () => ({
      letterSpacing: letterSpacing ?? inputDefaults["letterSpacing"],
      lineHeightMultiplier: lineHeightMultiplier ?? inputDefaults["lineHeightMultiplier"],
      fontSize: fontSize ?? inputDefaults["fontSize"],
      wrapper: resolveGlyphWrapper(wrapper ?? inputDefaults["wrapper"]),
      horizontalAlign: horizontalAlign ?? inputDefaults["horizontalAlign"],
      verticalAlign: verticalAlign ?? inputDefaults["verticalAlign"],
      font,
    }),
    [letterSpacing, lineHeightMultiplier, fontSize, wrapper, horizontalAlign, verticalAlign, font],
  );

  useEffect(() => {
    //update must happen in useEffect to respect the lifeclycles when reusing nodescolorHelper.set(color ?? inputDefaults["color"])

    updateContainerProperties(node, props);
    updateEventProperties(node, props);

    colorHelper.set(color ?? inputDefaults["color"]);
    node.target.color.set(colorHelper.r, colorHelper.g, colorHelper.b);
    node.target.opacity.set(opacity ?? inputDefaults["opacity"]);
    node.onChange = props.onChange;

    const { hasStructuralChanges } = getPropertyChanges(node.glyphProperties, glyphProperties);

    node.updateGlyphProperties(node.text ?? "", glyphProperties, hasStructuralChanges);

    node.setProperties(props);

    if (value != null) {
      node.htmlElement.value = value;
    }
    node.syncInput();
  });

  return undefined;
}

export const Input = buildComponent(InputNode, useInput, flexAPI);
export const RootInput = buildRoot(InputNode, useInput, flexAPI);
