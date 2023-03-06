/* eslint-disable react/no-unknown-property */
import React, { Suspense } from "react";
import { Text, DefaultStyleProvider, clippingEvents, RootContainer } from "@coconut-xr/koestlich";
import { Canvas } from "@react-three/fiber";
import { Fullscreen } from "./fullscreen";
import { OrbitControls } from "@react-three/drei";
import { MOUSE } from "three";
import { loadYoga } from "@coconut-xr/flex";
import { inputCanvasProps, Input, TextArea } from "@coconut-xr/input";
import { useState } from "react";
import { tailwindAPI } from "@coconut-xr/koestlich";

export default function Index() {
  const [text, setText] = useState("Text");

  return (
    <Canvas
      {...inputCanvasProps}
      events={clippingEvents}
      shadows
      dpr={window.devicePixelRatio}
      gl={{ localClippingEnabled: true }}
      style={{ height: "100vh" }}
    >
      <directionalLight shadow-mapSize={2048} castShadow intensity={0.5} position={[0.1, 0.1, 1]} />
      <ambientLight color={0xffffff} intensity={0.5} />
      <Fullscreen
        camera={(ratio) => (
          <OrbitControls
            target={[0.5 * ratio, -0.5, 0]}
            enableZoom={false}
            enablePan={false}
            minDistance={1}
            maxDistance={1}
            mouseButtons={{
              LEFT: MOUSE.RIGHT,
              MIDDLE: MOUSE.MIDDLE,
              RIGHT: MOUSE.LEFT,
            }}
          />
        )}
      >
        {(width, height) => (
          <RootContainer
            loadYoga={loadYoga}
            backgroundColor={0}
            border={0.02}
            padding={0.03}
            borderRadius={0.1}
            overflow="scroll"
            borderColor={0xffffff}
            backgroundOpacity={1}
            id="root"
            width={width}
            height={height}
          >
            <DefaultStyleProvider<any, typeof tailwindAPI> bgColor={0x0}>
              <Suspense>
                <Text color="white" onClick={() => setText("hallo")}>
                  Test
                </Text>
              </Suspense>
              <Suspense fallback={null}>
                <Input
                  color={0xffff}
                  value={text}
                  border={0.0025}
                  onChange={setText}
                  borderColor={0xffff00}
                ></Input>
              </Suspense>
              <Suspense fallback={null}>
                <TextArea
                  color={0xffff}
                  value={text}
                  onChange={setText}
                  border={0.0025}
                  borderColor={0xffff00}
                />
              </Suspense>
            </DefaultStyleProvider>
          </RootContainer>
        )}
      </Fullscreen>
    </Canvas>
  );
}
