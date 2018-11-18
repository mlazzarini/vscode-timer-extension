const vscode = require('vscode');

let isOver;
let isPaused = false;
let timer;
let statusBarItem;
let value = 30;

function startTimer(value, barItem) {
	const duration = 60 * value;
	let currentTime = duration;
	let minutes, seconds;
	if (timer) clearInterval(timer);
	timer = setInterval(() => {
		if (!isPaused) {
			minutes = parseInt(currentTime / 60, 10)
			seconds = parseInt(currentTime % 60, 10);
	
			minutes = minutes < 10 ? '0' + minutes : minutes;
			seconds = seconds < 10 ? '0' + seconds : seconds;
	
			const timerText = minutes + ':' + seconds;
			barItem.text = `Time left: ${timerText}`;
	
			if (--currentTime < 0) {
				isOver = true;
				currentTime = duration;
				clearInterval(timer);
				vscode.window.showInformationMessage('Your time is over! Click on the time to resume the timer');
			}	
		}
	}, 1000);
}

function activate(context) {
	vscode.commands.registerCommand('extension.pauseTimer', () => {
		if (isOver) {
			isOver = false;
			startTimer(value, statusBarItem);
		} else {
			isPaused = !isPaused;
			const message = isPaused ? 'Timer paused' : 'Timer resumed'
			vscode.window.showInformationMessage(message);
		}
	});
	statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
	let disposable = vscode.commands.registerCommand('extension.startTimer', () => {
		// The code you place here will be executed every time your command is executed
		statusBarItem.command = 'extension.pauseTimer';
		statusBarItem.show();

		vscode.window.showInputBox({
			placeHolder: 'Number',
			prompt: 'Enter minutes',
			value: '30',
			ignoreFocusOut: true,
		}).then(enteredValue => {
			const minimumNumber = parseInt(enteredValue);
			if (isNaN(minimumNumber)) {
				vscode.window.showErrorMessage('You must insert a number');
				return;
			}
			value = enteredValue;
			isOver = false;
			startTimer(value, statusBarItem);
		});
	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;
