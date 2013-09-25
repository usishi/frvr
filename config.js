exports.config={
	port : 8000,
	logfolder : '/tmp',
	restartInterval : 5000,
	projects : [
		{
			title	 		: 'App 1 (crashes every 20 seconds, dont watch file changes)',
			folder 		: '/Users/fatih/projects/node/frver/tests/app1',
			startup	 	: 'node app.js',
			watch	 		: false,
			stdout	 	: 'app.log',
			stderr	 	:	'err.log',
			ignorepatterns	: ''
		},
		{
			title	 		: 'App 2 ( watch file changes)',
			folder 		: '/Users/fatih/projects/node/frver/tests/app2',
			startup	 	: 'node app.js',
			watch	 		: true,
			stdout	 	: 'app.log',
			stderr	 	:	'err.log',
			ignorepatterns	: ''
		}
	]
}
