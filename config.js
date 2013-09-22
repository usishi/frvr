exports.config={
	port : 8000,
	logfolder : '/tmp',
	projects : [
		{
			title						: 'usishi web',
			folder 					: '../usishicom',
			startup					: 'node app.js',
			watch						: true,
			stdout					: 'app.log',
			stderr					:	'err.log',
			ignorepatterns	: '.git,static,node_modules'
		}
	]
}