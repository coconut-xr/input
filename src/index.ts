export * from "./input.js";
export * from "./area.js";

export const inputCanvasProps = {
  onPointerDown: (e: { preventDefault: () => void }) => e.preventDefault(),
};
