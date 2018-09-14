"use strict";

var loaderUtils = require("loader-utils");
var fs = require('fs');
var path = require("path");
module.exports = function(content) {
  var query = loaderUtils.parseQuery(this.query).path;
  var lang = loaderUtils.parseQuery(this.query).lang || 'sass';
  var rewrite = loaderUtils.parseQuery(this.query).rewrite 
  var queryString = JSON.stringify(query);
  var varPath = queryString.replace(/["']/g, '');
  this.cacheable();
  var contentPath = path.resolve(varPath);
  this.addDependency(contentPath);
  var obj =require(contentPath)
  function switchLang(lang,key,value){
    switch(lang){
      case 'sass' : return '$'+ key + ":" + value + ";\n";;break;
      case 'less' : return '@'+ key + ":" + value + ";\n";;break;
      case 'stylus' : return  key + "=" + value.replace(/["']/g, '') + ";\n";;break;
      default: break;
    }
  }
  function jsonToSassVars (obj, indent) {
    
    // Make object root properties into sass/less variables
    var newContent = "";
    for (var key in obj) {
      var prefix =(rewrite||switchLang)(lang,key,JSON.stringify(obj[key], null, indent))
      newContent += prefix 
    }

    if (!newContent) {
      return newContent
    }

    // Store string values (so they remain unaffected)
    var storedStrings = [];
    newContent = newContent.replace(/(["'])(?:(?=(\\?))\2.)*?\1/g, function (str) {

      var id = "___JTS" + storedStrings.length;
      storedStrings.push({id: id, value: str});
      return id;
    });

    // Convert js lists and objects into sass lists and maps
    newContent = newContent.replace(/[{\[]/g, "(").replace(/[}\]]/g, ")");

    // Put string values back (now that we're done converting)
    storedStrings.forEach(function (str) {
      str.value = str.value.replace(/["']/g, '');
      newContent = newContent.replace(str.id, str.value);
    });

    return newContent;
  }


  var  preCss= jsonToSassVars(obj);

  return preCss ? preCss + '\n' + content : content;
}
