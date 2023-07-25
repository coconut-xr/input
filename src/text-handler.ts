/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { InstancedGlypthMesh, measureGlyph } from "@coconut-xr/glyph";
import { TextNode, TextState } from "@coconut-xr/koestlich";
import { ThreeEvent } from "@react-three/fiber/dist/declarations/src/core/events.js";
import { PlaneGeometry } from "three";
import { setMeasureFunc } from "@coconut-xr/flex";

const geometry = new PlaneGeometry();
geometry.translate(0.5, -0.5, 0);

export type TextAreaState = TextState;

function getCursorPosition(e: ThreeEvent<PointerEvent>): number {
  const intersection = e.intersections.find((i) => i.object instanceof InstancedGlypthMesh);
  const charIdx = intersection?.instanceId ?? 0;
  const endOffset = ((intersection as any)?.uv2?.x ?? 0) < 0.5 ? 0 : 1;
  return charIdx + endOffset;
}

export abstract class TextHandler<
  T extends HTMLTextAreaElement | HTMLInputElement,
> extends TextNode {
  abstract htmlElement: T;
  private dragStartPoint?: number;
  onChange?: (value: string) => void;

  public setFocus(focus: boolean): void {
    const hasFocus = document.activeElement === this.htmlElement;
    if (hasFocus === focus) {
      return;
    }
    if (focus) {
      this.htmlElement.focus();
    } else {
      this.htmlElement.blur();
    }
  }

  private updateFocus(e: Event): void {
    this.hasFocus = document.activeElement === this.htmlElement;
  }

  onInit() {
    const style = this.htmlElement.style;
    style.setProperty("position", "absolute");
    style.setProperty("left", "-1000vw");
    style.setProperty("transform", "absolute");
    style.setProperty("touchAction", "translateX(-50%)");
    style.setProperty("pointerEvents", "none");
    style.setProperty("opacity", "0");
    this.htmlElement.addEventListener("focus", this.updateFocus.bind(this));
    this.htmlElement.addEventListener("blur", this.updateFocus.bind(this));
    this.htmlElement.addEventListener("input", this.handleChange.bind(this));
    this.htmlElement.addEventListener("keyup", this.handleSelect.bind(this));
    this.htmlElement.addEventListener("keydown", this.handleSelect.bind(this));
    this.htmlElement.addEventListener("selectionchange", this.handleSelect.bind(this));
    document.body.appendChild(this.htmlElement);
    super.onInit();
  }

  private handleChange = (e: Event) => {
    const htmlElement = this.htmlElement;
    if (e.target !== htmlElement || htmlElement == null) {
      return;
    }
    if (this.text != htmlElement.value && this.onChange != null) {
      this.onChange(htmlElement.value);
    }
    this.syncInput();
  };

  syncInput(): void {
    const text = this.htmlElement.value;
    if (this.text == text || this.glyphProperties == null) {
      return;
    }

    this.updateGlyphProperties(text, this.glyphProperties, true);
    const glyphProperties = this.glyphProperties;
    setMeasureFunc(this.yoga, this.precision, (w, wMode, h, hMode) =>
      measureGlyph(text, glyphProperties, w, h),
    );
    this.requestLayoutCalculation();
  }

  private handleSelect = (ev: Event) => {
    const htmlElement = this.htmlElement;
    if (ev.target !== htmlElement || htmlElement == null) {
      return;
    }
    // setTimeout ensures that we read the selection start/end values
    // once they have been updated.
    // If we were to read the selection on keydown events directly,
    // the value would be before the selection change from the keyboard
    // event happened.
    setTimeout(() => {
      const { selectionStart, selectionEnd } = htmlElement;
      if (selectionStart == null || selectionEnd == null) {
        return;
      }
      this.setSelection([selectionStart, selectionEnd]);
    }, 0);
  };

  private superOnDoubleClick = this.onDoubleClick;
  onDoubleClick = (e: ThreeEvent<MouseEvent>) => {
    this.superOnDoubleClick(e);
    if (e.defaultPrevented) {
      return;
    }
    const text = this.text;
    if (text == null) {
      return;
    }
    function isWhitespace(str: string): boolean {
      return !!str && str.trim() === "";
    }

    const caret = this.caretPosition ?? 0;
    let start = 0,
      end: number = text.length;

    for (let i = caret; i < text.length; i++) {
      if (isWhitespace(text[i])) {
        end = i;
        break;
      }
    }

    for (let i = caret; i > 0; i--) {
      if (isWhitespace(text[i])) {
        start = i > 0 ? i + 1 : i;
        break;
      }
    }

    this.setSelection([start, end]);
    this.htmlElement.setSelectionRange(start, end, "none");
  };

  private superOnPointerDown = this.onPointerDown;
  onPointerDown = (e: ThreeEvent<PointerEvent>) => {
    this.superOnPointerDown(e);
    if (e.defaultPrevented) {
      return;
    }
    const idx = getCursorPosition(e);
    this.dragStartPoint = idx;
    this.setFocus(true);
    this.setSelection([idx, idx]);
    this.htmlElement.setSelectionRange(idx, idx, "none");
  };

  private superOnPointerMove = this.onPointerMove;
  onPointerMove = (e: ThreeEvent<PointerEvent>) => {
    this.superOnPointerMove(e);
    if (e.defaultPrevented) {
      return;
    }
    const buttons = e.buttons;
    const content = this.text;
    if (content == null) {
      return;
    }

    // left click not held (i.e. not dragging)
    const dragging = buttons === 1 || buttons === 3;
    if (!dragging || !content) {
      return;
    }

    // TODO: Dragging always sets the first character as selection start
    const idx = getCursorPosition(e);
    let start: number, end: number, dir: "forward" | "backward" | "none";

    const caret = this.dragStartPoint ?? 0;
    if (idx < caret) {
      start = idx;
      end = caret;
      dir = "backward";
    } else if (idx > caret) {
      start = caret;
      end = idx;
      dir = "forward";
    } else {
      start = end = idx;
      dir = "none";
    }
    this.setSelection([start, end]);
    this.htmlElement.setSelectionRange(start, end, dir);
  };

  onCleanup(): void {
    super.onCleanup();
    this.htmlElement.remove();
  }
}
