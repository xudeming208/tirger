'use strict'

//后续做成npm包
const fs = require('fs'),
	path = require('path'),
	exec = require('child_process').exec;

//执行之前确保已经全局安装了pm2
// execFun
const execFun = (todo, msg, cbk) => {
	!Array.isArray(todo) && (todo = [todo]);
	let t = '';
	let progressFun = () => {
		process.stdout.write(`\n"${msg}" starting\n wait.`);
		t = setInterval(function() {
			process.stdout.write('.');
		}, 500);
	}
	progressFun();
	exec(todo.join(' && '), function(error, stdout, stderr) {
		if (error) {
			console.dir(error);
		}
		t && clearInterval(t);
		console.log(`\n"${msg}" finised\n`);
		cbk && typeof cbk == 'function' && cbk();
	})
}

// install pm2
// const installPm2 = () => {
// 	execFun('sudo npm install -g pm2', 'install pm2', false, installPackage);
// }

// install package
const installPackage = () => {
	execFun(['cd mid', 'rm -rf tmp', 'cd nest', 'rm -rf node_modules', 'npm install'], 'install package', config);
}

// config
const config = () => {
	let midPath = path.resolve(__dirname, './mid/nest');
	let fileName = path.resolve(midPath, './config/config.json');
	let content = require(fileName);
	let serverPort = Math.random() * 1000 | 0 + 6000;
	let jserverPort = serverPort + 1;
	let ip = require(midPath + '/server/base/getIp')();
	let staticHost = `http://${ip}:${jserverPort}`;
	content.etc.serverPort = serverPort;
	content.etc.jserverPort = jserverPort;
	content.site.staticHost = staticHost;
	fs.writeFile(fileName, JSON.stringify(content), 'utf-8', (err) => {
		if (err) {
			console.dir(err);
		}
		// exec framework
		execFun(['cd mid/nest', 'npm run start'], 'framework start', function() {
			const CFonts = require('./mid/nest/node_modules/cfonts');
			const open = require('./mid/nest/node_modules/open');
			require('./mid/nest/node_modules/colors');
			CFonts.say('MID', {
				font: '3d',
				align: 'left',
				colors: ['white', 'black'],
				background: 'Black',
				letterSpacing: 1,
				lineHeight: 1,
				space: true,
				maxLength: '0'
			});
			open(`http://${ip}:${serverPort}`);
			console.log(`In the browser input`, `127.0.0.1:${serverPort}`.green.underline, `or`, `${ip}:${serverPort}`.green.underline, `, and then can see the pages.\n`);
		});
	})
}


execFun('git clone https://github.com/xudeming208/mid.git', 'git clone', installPackage);