# esformula

Evaluate EcmaScript expression safely (without `eval()` call)

## Install

```
$ npm install esformula
```

## Usage

```javascript
import { parse } from 'esformula';

const formula = parse('x * 2');
formula.evaluate({ x: 3 }) // => 6
```
