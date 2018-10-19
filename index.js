"use strict";

var loaderUtils = require("loader-utils");
var {getContent , switchLang} = require('./utils');
module.exports = function(content) {
  // 获取路径、语言、rewrite
  var query = loaderUtils.getOptions(this).path;
  var lang = loaderUtils.getOptions(this).lang || 'sass';
  var transform = loaderUtils.getOptions(this).rewrite  || switchLang
  //获取json
  var json = getContent(query,this)

  this.cacheable();


  function jsonToSassVars (obj, indent) {
    
    // 把json的属性转换成对应css预处理器的变量
    var newContent = "";
    for (var key in obj) {
      var prefix =transform(lang,key,JSON.stringify(obj[key]))
      newContent += prefix 
    }
    return newContent
  }

  var  preCss= jsonToSassVars(json);

  return preCss ? preCss + '\n' + content.replace(/^\s+/g,'') : content;
}
