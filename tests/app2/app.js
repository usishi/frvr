var fs = require('fs');


console.log("\033[41m\033[33m >>APP2 \033[0m");

setInterval(function(){
	console.log((new Date()));
	console.log(fs.readFileSync('app2.txt','utf8'));	
},2000);