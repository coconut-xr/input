# @coconut-xr/input

[![Version](https://img.shields.io/npm/v/@coconut-xr/input?style=flat-square)](https://npmjs.com/package/@coconut-xr/input)
[![License](https://img.shields.io/github/license/coconut-xr/input.svg?style=flat-square)](https://github.com/coconut-xr/input/blob/master/LICENSE)
[![Twitter](https://img.shields.io/twitter/follow/coconut_xr?style=flat-square)](https://twitter.com/coconut_xr)

input fields in 3D UIs for @coconut-xr/koestlich

`npm i @coconut-xr/input`

## Usage

[CodeSandbox]()

![Screenshot]()

```tsx
const [text, setText] = useState("")

return <Canvas {...inputCanvasProps}>
    <RootContainer>
        <Input value={text} onChange={setText}/>
    </RootContainer>
</Canvas>
```

`inputCanvasProps` sets `onPointerDown` on the canvas to prevent the default behavior which is required to prevent deselecting the currently selected input field.