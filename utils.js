
var path = require("path");
const chalk = require('chalk')

//获取json内容
const getContent =(paths,context)=>{
  var pathString = JSON.stringify(paths);
  var varPath = pathString.replace(/["']/g, '');
  var contentPath = path.resolve(varPath);
  context.addDependency(contentPath);
  return require(contentPath)
}

//css预处理转换
const switchLang = (lang,key,value)=>{
  //如果是对象，则进行转换
  if(/^{(.+?)}$/.test(value)){
    value = transformMap(lang,value)
  }
  //如果是数组，则进行转换
  if(/^\[(.+?)\]$/.test(value)){
    value = transformList(lang,value)
  }
  value = value.replace(/["']/g, '')
  switch(lang){
    case 'sass' : return '$'+ key + ":" + value + ";\n";;break;
    case 'less' : return '@'+ key + ":" + value + ";\n";;break;
    case 'stylus' : return  key + "=" + value + ";\n";;break;
    default: break;
  }
}

//css预处理map的转换

const transformMap = (lang,value)=>{
  switch(lang){
    //为了解决多个对象嵌套
    case 'sass' : return value.replace(/{/g, "(").replace(/}/g, ")") ;;break;
    case 'less' : return value.replace(/,/g,";");break;
    case 'stylus' :  
      console.log((`\n${chalk.red('Stylus')} does not support list and map variable types\n`))
      process.exit(1) 
    ;break;
    default: break;
  }
}
//css预处理List的转换

const transformList = (lang,value)=>{
  switch(lang){
    case 'sass' : return value.replace(/\[/gm, "(").replace(/\]/gm, ")");;break;
    case 'less' : return value.match(/(?<=\[)(.+?)(?=\])/g)[0];break;
    case 'stylus' :  
      console.log((`\n${chalk.red('Stylus')} does not support list and map variable types\n`))
      process.exit(1) 
    ;break;
    default: break;
  }
}
module.exports = {
  getContent,
  switchLang
}