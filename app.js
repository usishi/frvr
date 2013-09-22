var Config 		= global.Config  = require('./config.js').config
		,http 		= require('http')
		,spawn    = require('child_process').spawn
		,fs 			= require('fs')
		,timespan = require('timespan')
		,watch 		= require('watch')
		;

var jobs=[];
var lastid=0;


var testPatterns=function(patterns,file,cb){
	var arrPattern = patterns.split(',');
	var pcount=arrPattern.length;
	if (pcount<=0){
		cb(true);
	} else {
		arrPattern.forEach(function(pattern){
			if (file.indexOf(pattern)>0){
				cb(false);
				return;
			}
			pcount--;
			if (pcount<=0){
				cb(true);
			}
		});
	}
}

Config.projects.forEach(function(prj){
	if (prj.id==undefined){
		prj.id=lastid++;
	}
	var prm = prj.startup.split(' ');
	var runner = prm.shift();	
	
	var ps=spawn(runner,prm,{cwd:prj.folder}).on('error',function(e){
		console.log("error"+e);
		fs.appendFile(Config.logfolder+'/frvr.log', '\nProject '+prj.title+' has got error : '+e, 'utf8');
		setTimeout(function(){
			jobs.push(prj);
		}, 1000);
	});
	prj.starttime=new Date();
	fs.appendFile(Config.logfolder+'/frvr.log', '\nProject '+prj.title+' started ', 'utf8');

	ps.on('exit',function(r){
		fs.appendFile(Config.logfolder+'/frvr.log', '\nProject '+prj.title+' exited with code '+r, 'utf8');
	});
	ps.stdout.on('data',function(data){ 
		fs.appendFile(Config.logfolder+'/frvr'+prj.id+prj.stdout, data, 'utf8');
		prj.lastLog=data;
	});
	ps.stderr.on('data',function(data){
		fs.appendFile(Config.logfolder+'/frvr'+prj.id+prj.stderr, data, 'utf8');
		prj.lastLog=data;
	});
	if (prj.watch){
		watch.watchTree(prj.folder, function (f, curr, prev) {
	    if (!(curr === null && prev === null && typeof f === 'object')) {
	    	testPatterns(prj.ignorepatterns,f,function(changed){
	    		if (changed){
		    		fs.appendFile(Config.logfolder+'/frvr.log', '\nProject '+prj.title+' filechanged '+f, 'utf8');
		      	console.log(f+' changed');	
		    	} else {
		    		console.log('ignored'+ f);
		    	}
	    	});    	
	    }
	  });
	}
});


http.createServer(function (req, res) {
	fs.appendFile(Config.logfolder+'/frvr.log', '\nWeb request', 'utf8');
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.write('<table border=1><th>ID</th><th>Title</th><th>UpTime</th><th>LastMessage</th><th>Log</th><th>ELog</th>');
	Config.projects.forEach(function(prj){
		res.write('<tr><td>'+prj.id+'</td><td>'+prj.title+'</td><td>'+timespan.fromDates(new Date(prj.starttime), new Date()).toString()+'</td><td>'+prj.lastLog+'</td></tr>');
	});
	res.end('</table>');
  
}).listen(Config.port);