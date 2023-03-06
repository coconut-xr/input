import { useThree } from "@react-three/fiber";
import React, { ReactNode } from "react";

export function Fullscreen({
  children,
  camera,
}: {
  camera: ((ratio: number) => ReactNode) | undefined;
  children: (width: number, height: number) => JSX.Element;
}) {
  const ratio = useThree((s) => s.size.width / s.size.height);
  return (
    <>
      {camera == null ? undefined : camera(ratio)}
      {children(ratio, 1)}
    </>
  );
}
