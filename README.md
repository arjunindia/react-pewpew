# react-pewpew

![badge-npm-version](https://img.shields.io/npm/v/react-pewpew)

`react-pewpew` is a set of react components made for easily rendering an instance of PewEngine in react.<br/>

## Prerequisites

You need to have the latest version of PewEngine on your public folder - inside the wasm folder.<br/>

```bash
public
└── wasm
    ├── pewengine.js
    ├── pewengine.wasm
    └── index.html 
```

Then replace index.html with [This HTML file](https://raw.githubusercontent.com/arjunindia/react-pewpew/main/public/wasm/index.html).<br/>
## Installation

`npm install react-pewpew`<br/>

## Usage

```jsx
import React from 'react';
import { PewPewString } from 'react-pewpew'; // Or any other component

const App = () => {
  return (
    <PewPewString
      level="pewpew.set_level_size(500fx, 500fx) pewpew.new_player_ship(10fx, 10fx, 0)"
      style={{width:"100%",height:"90vh"}}
    />
  );
};

export default App;
```
