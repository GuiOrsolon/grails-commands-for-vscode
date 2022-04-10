const vscode = require('vscode');

async function activate(context) {

	console.log('Your extension "Grails Commands for VSCode" is now active!');

	context.subscriptions.push(
	vscode.commands.registerCommand('grails-commands-for-vscode.create-app', function(){
		vscode.window.showInformationMessage('Criando seu projeto Grails');

		vscode.window.showOpenDialog({
			canSelectFiles: false,
			canSelectFolders: true
		}
		).then(
			folders => {
				if (folders != null && folders.length > 0) {
					vscode.window.showInputBox({
						placeHolder: "Project Name",
						prompt:			 "Please, input the Project Name"
					}).then(appName => {
						if(appName != null && appName.length > 0){
							const terminal = vscode.window.createTerminal({
								cwd: folders[0]
							});
							let command = `grails create-app ${appName}`;
							console.log(command);
							terminal.sendText(command);
							//abrindo a pasta do projeto recém criado
							command = `code -r ${appName}`
							terminal.sendText(command);
							terminal.dispose;
						}
					});
				}
			}
		)
	}));

	context.subscriptions.push(
	vscode.commands.registerCommand('grails-commands-for-vscode.run-app', function(){
		vscode.window.showInformationMessage('Rodando seu aplicativo');
	}));

	context.subscriptions.push(vscode.commands.registerCommand('grails-commands-for-vscode.create-domain-class', function(){
		vscode.window.showInformationMessage('Criando uma Domain Class');
	}));

	context.subscriptions.push(vscode.commands.registerCommand('grails-commands-for-vscode.create-controller', function(){
		vscode.window.showInformationMessage('Criando um controller');
	}));

}

function deactivate() { }

module.exports = {
	activate,
	deactivate
}
