# `cleanup-html`
> A command-line utility which automatically helps you to clean up dirty HTML.

## Features
- Convert inline `style` attributes to CSS rules
- Convert inline `on...` attributes to JS event listeners
- Format HTML, CSS, and JS

## Usage
```
Usage: cleanup-html [options]

Options:
  -v, -V, --version    output the version number
  -i, --input <path>   input file path
  -o, --output <path>  output file path
  --short-listeners    reference callbacks in addEventListener
  -h, --help           display help for command
```

## Other useful tools
 - [UnCSS](https://github.com/uncss/uncss) - Remove unused styles from CSS
 - [Lebab](https://github.com/lebab/lebab) - Transform ES5 code to ES6/7
