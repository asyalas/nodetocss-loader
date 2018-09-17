## [nodetocss-loader](https://github.com/asyalas/nodetocss-loader)

Loads a js file and injected variable in sass/less/stylus

### Install

npm install nodetocss-loader --save-dev

### Basic Usage

```js
//./build/scss-env.js
'use strict';
const [,,lang] = process.argv
module.exports = {
  'lang-env':lang || 'all',
  ...
};
// webpack.config.js
module.exports = {
	...
    module: {
        rules: [{
            test: /\.scss$/,
            use: [
                "style-loader", // creates style nodes from JS strings
                "css-loader", // translates CSS into CommonJS
                "sass-loader", // compiles Sass to CSS, using Node Sass by default
                {
                  loader: 'nodetocss-loader',
                  options: {
                    // Provide path to the file with resources
                    path: './build/scss-env.js'
                  }
                }
            ]
        }]
    }
};

```
The default precompiler language is sass, if you use less or stylus, you use add 'lang' attributes,just like : 

```js
 options: {
   // Provide path to the file with resources
   path: './build/scss-env.js',
   lang: 'less'
  }
```

### extend
if will have ohters css precompiler,you can rewrite the function ,just do :
```js

 options: {
   // Provide path to the file with resources
   path: './build/scss-env.js',
   rewrite:(lang,key,value){
      switch(lang){
        case 'sass' : return '$'+ key + ":" + value + ";\n";;break;
        case 'less' : return '@'+ key + ":" + value + ";\n";;break;
        case 'stylus' : return  key + "=" + value.replace(/["']/g, '') + ";\n";;break;
        default: break;
      }
    }
  }
```
### Reference

https://github.com/EdwardIrby/jsontosass-loader

### Finally
please give me a star 😊