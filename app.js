var Config 		= global.Config  = require('./config.js').config
		,http 		= require('http')
		,spawn    = require('child_process').spawn
		,fs 			= require('fs')
		,timespan = require('timespan')
		,watch 		= require('watch')
		;

var jobs=[];
var lastid=0;


var newLine=function(pname){
	return '\n'+(new Date())+' : ['+pname+']';
}



var checkConfig=function(cb){
	var isOk=true;
	var kalan=Config.projects.length;
	Config.projects.forEach(function(prj){
		//check project folder
		fs.stat(prj.folder,function(err,stats){
			if (err) {
				isOk=false;
				fs.appendFileSync(Config.logfolder+'/frvr.log', '\nConfig Error : \n'+prj.folder+' does not exists or permission denied', 'utf8');
			}

			var prm = prj.startup.split(' ');
			var runner = prm.shift();

			kalan--;
			if (kalan<=0){
				cb(isOk);
			}
		});
	});
}

var testPatterns=function(patterns,file,cb){
	if (patterns.length<1){
		cb(true);
		return;
	}
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

var runProject=function(prj){
	if (prj.id==undefined){
		prj.id=lastid++;
	}
	var prm = prj.startup.split(' ');
	var runner = prm.shift();	
	
	prj.process=spawn(runner,prm,{cwd:prj.folder}).on('error',function(e){
		fs.appendFile(Config.logfolder+'/frvr.log', newLine(prj.title)+' has got error : '+e, 'utf8');
		setTimeout(function(){
			if (jobs.indexOf(prj)<0){
				jobs.push(prj);	
			}
		}, 1000);
	});
	prj.starttime=new Date();
	fs.appendFile(Config.logfolder+'/frvr.log', newLine(prj.title)+' starting ', 'utf8');

	prj.process.on('exit',function(r){
		if (r!==143){
			fs.appendFile(Config.logfolder+'/frvr.log', newLine(prj.title)+' exited with code '+r, 'utf8');
			if (jobs.indexOf(prj)<0){
				jobs.push(prj);	
			}
		}
	});
	prj.process.stdout.on('data',function(data){ 
		fs.appendFile(Config.logfolder+'/frvr'+prj.id+prj.stdout, data, 'utf8');
		prj.lastLog=data;
	});
	prj.process.stderr.on('data',function(data){
		fs.appendFile(Config.logfolder+'/frvr'+prj.id+prj.stderr, data, 'utf8');
		prj.lastLog=data;
	});
	if (prj.watch){
		fs.appendFile(Config.logfolder+'/frvr.log', "\nwatch folder", 'utf8');
		watch.watchTree(prj.folder,{ignoreDotFiles:true}, function (f, curr, prev) {
	    if (!(curr === null && prev === null && typeof f === 'object')) {
	    	testPatterns(prj.ignorepatterns,f,function(changed){
	    		if (changed){
		    		fs.appendFile(Config.logfolder+'/frvr.log', newLine(prj.title)+' filechanged '+f, 'utf8');
		      	setTimeout(function(){
		      		if (jobs.indexOf(prj)<0){
		      			jobs.push(prj);	
		      		}
						}, 500);
		    	} else {
		    		fs.appendFile(Config.logfolder+'/frvr.log', newLine(prj.title)+' filechanged but ignored'+f, 'utf8');
		    	}
	    	});    	
	    }
	  });//watchtree
	  fs.appendFile(Config.logfolder+'/frvr.log', "\nwatch folder end", 'utf8');
	}
}

checkConfig(function(status){
	if (status){
		fs.appendFileSync(Config.logfolder+'/frvr.log', '\n'+(new Date())+' -------- FRVR Started ', 'utf8');
		Config.projects.forEach(function(prj){
			runProject(prj);
		});

		http.createServer(function (req, res) {
			fs.appendFile(Config.logfolder+'/frvr.log', '\nWeb request', 'utf8');
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.write('<table border=1><th>ID</th><th>Title</th><th>UpTime</th><th>LastMessage</th><th>Log</th><th>ELog</th>');
			Config.projects.forEach(function(prj){
				res.write('<tr><td>'+prj.id+'</td><td>'+prj.title+'</td><td>'+timespan.fromDates(new Date(prj.starttime), new Date()).toString()+'</td><td>'+prj.lastLog+'</td></tr>');
			});
			res.end('</table><br>Config location: /opt/local/lib/node_modules/frvr/config.js<br>');
		}).listen(Config.port);

		setInterval(function(){
			console.log("pending starts "+jobs.length);
			if (jobs.length<1){
				return;
			}
			var proj = jobs.shift();
			try{
				proj.process.kill();
				proj.process=null;
			} catch(e){
				console.log("kapatma: "+e);
			}
			runProject(proj);
		},Config.restartInterval);

	} else {
		process.exit("SIGTERM");
	}
})

process.on("SIGUSR1", function() {
	fs.writeFileSync("/tmp/aaaa.txt", new Date(),'utf8');
});