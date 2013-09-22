exports.config={
	port : 8000,
	logfolder : '/var/adm',
	projects : [
		{
			title						: 'Root Proxy',
			folder 					: '/node/',
			startup					: 'node rootapp.js',
			watch						: false,
			stdout					: 'app.log',
			stderr					:	'err.log',
			ignorepatterns	: ''
		},
		{
			title						: 'usishi web',
			folder 					: '../../projects/8081.usishicom',
			startup					: 'node app.js',
			watch						: true,
			stdout					: 'app.log',
			stderr					:	'err.log',
			ignorepatterns	: '.git,static,node_modules,views'
		},
	  {
			title						: 'Repoxplorer',
			folder 					: '../../projects/8082.repoxplorer',
			startup					: 'node app.js',
			watch						: true,
			stdout					: 'app.log',
			stderr					:	'err.log',
			ignorepatterns	: '.git,static,node_modules,views'
		},
		{
			title						: 'Gıda Havuzu',
			folder 					: '../../projects/8083.gidahavuzu',
			startup					: 'node app.js',
			watch						: false,
			stdout					: 'app.log',
			stderr					:	'err.log',
			ignorepatterns	: '.git,static,node_modules,views'
		},
		{
			title						: 'Ebabil',
			folder 					: '../../projects/8085.ebabil',
			startup					: 'node app.js',
			watch						: true,
			stdout					: 'app.log',
			stderr					:	'err.log',
			ignorepatterns	: '.git,static,node_modules,views'
		},
		{
			title						: 'Ikinuu',
			folder 					: '../../projects/8089.ikinuu',
			startup					: 'node app.js',
			watch						: true,
			stdout					: 'app.log',
			stderr					:	'err.log',
			ignorepatterns	: '.git,static,node_modules,views'
		},
		{
			title						: 'Fatih Test (streamer)',
			folder 					: '../../projects/8090.sanalalem.co',
			startup					: 'node app.js',
			watch						: true,
			stdout					: 'app.log',
			stderr					:	'err.log',
			ignorepatterns	: '.git,static,node_modules,views'
		},
	]
}
