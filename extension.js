// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
	const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
	let timer;
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.startTimer', function () {
		// The code you place here will be executed every time your command is executed
		statusBarItem.show();

		vscode.window.showInputBox({
			placeHolder: 'Number',
			prompt: 'Enter minutes',
			value: '30',
			ignoreFocusOut: true,
		}).then(value=> {
			const minimumNumber = parseInt(value);
			if (isNaN(minimumNumber)) {
				vscode.window.showErrorMessage('You must insert a number');
				return;
			}
			const duration = 60 * value;
			let currentTime = duration;
			let minutes, seconds;
			
			if(timer) clearInterval(timer);

			timer = setInterval(function () {
				minutes = parseInt(currentTime / 60, 10)
				seconds = parseInt(currentTime % 60, 10);
		
				minutes = minutes < 10 ? '0' + minutes : minutes;
				seconds = seconds < 10 ? '0' + seconds : seconds;
		
				const timerText = minutes + ':' + seconds;
				statusBarItem.text = `Time left: ${timerText}`;
		
				if (--currentTime < 0) {
					currentTime = duration;
					clearInterval(timer);
					vscode.window.showInformationMessage('Your time is over!')
						.then(() => statusBarItem.hide());
				}
			}, 1000);
		});
	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;