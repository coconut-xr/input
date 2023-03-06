# @coconut-xr/input

[![Version](https://img.shields.io/npm/v/@coconut-xr/input?style=flat-square)](https://npmjs.com/package/@coconut-xr/input)
[![License](https://img.shields.io/github/license/coconut-xr/input.svg?style=flat-square)](https://github.com/coconut-xr/input/blob/master/LICENSE)
[![Twitter](https://img.shields.io/twitter/follow/coconut_xr?style=flat-square)](https://twitter.com/coconut_xr)

input fields for 3D UIs with `@coconut-xr/koestlich`

`npm i @coconut-xr/input`

## Usage

[CodeSandbox](https://codesandbox.io/s/koestlich-input-example-4ubrt0?file=/src/app.tsx)

![Screenshot](./example.gif)

```tsx
const [text1, setText1] = useState("Input Field");
const [text2, setText2] = useState("Text Area\nMultiline");
return (
  <Canvas {...inputCanvasProps}>
    <OrbitControls enableRotate={false} />
    <RootContainer backgroundColor="green" loadYoga={loadYoga}>
      <Input value={text1} onChange={setText1} />
      <TextArea value={text2} onChange={setText2} />
    </RootContainer>
  </Canvas>
);
```

`inputCanvasProps` sets `onPointerDown` on the canvas to prevent the default behavior which is required to prevent deselecting the currently selected input field.
