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

export type TextAreaState = TextState;

export class TextAreaNode extends TextHandler<HTMLTextAreaElement> {
  htmlElement = document.createElement("textarea");
}

const colorHelper = new Color();

export type TextAreaProperties = TextProperties & {
  value?: string;
  onChange?: (e: string) => void;
};

export function useTextArea(
  node: TextAreaNode,
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
  }: TextAreaProperties,
): undefined {
  const font = useFont(fontFamily);

  const glyphProperties = useMemo<GlyphProperties>(
    () => ({
      letterSpacing: letterSpacing ?? textDefaults["letterSpacing"],
      lineHeightMultiplier: lineHeightMultiplier ?? textDefaults["lineHeightMultiplier"],
      fontSize: fontSize ?? textDefaults["fontSize"],
      wrapper: resolveGlyphWrapper(wrapper ?? textDefaults["wrapper"]),
      horizontalAlign: horizontalAlign ?? textDefaults["horizontalAlign"],
      verticalAlign: verticalAlign ?? textDefaults["verticalAlign"],
      font,
    }),
    [letterSpacing, lineHeightMultiplier, fontSize, wrapper, horizontalAlign, verticalAlign, font],
  );

  useEffect(() => {
    //update must happen in useEffect to respect the lifeclycles when reusing nodescolorHelper.set(color ?? textAreaDefaults["color"])

    updateContainerProperties(node, props);
    updateEventProperties(node, props);

    colorHelper.set(color ?? textDefaults["color"]);
    node.target.color.set(colorHelper.r, colorHelper.g, colorHelper.b);
    node.target.opacity.set(opacity ?? textDefaults["opacity"]);
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

export const TextArea = buildComponent(TextAreaNode, useTextArea, flexAPI);
export const RootTextArea = buildRoot(TextAreaNode, useTextArea, flexAPI);
