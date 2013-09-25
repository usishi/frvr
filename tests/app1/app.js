var fs = require('fs');

console.log("\033[41m\033[33m >>  APP1 \033[0m");

setInterval(function(){
	console.log(new Date());
	console.log(fs.readFileSync('app1.txt','utf8'));	
},2000);


setInterval(function(){
	console.log("i will die");
	console.log(nullobject.blabla);
},20000);