const vscode 					 = require('vscode');
const propertiesReader = require('properties-reader');
const path 						 = require('path');
const child						 = require('child_process');

//Constants of extension
const optionsOpenDialog 			= { canSelectFiles: false						, canSelectFolders: true };
const optionsProjectName 		  = { placeHolder: "Project Name"			, prompt: "Please, input the Project Name (without special characters)" };
const optionCreateDomainClass = { placeHolder: "Domain Class Name", prompt: "Please, input the Domain Class Name" };
const optionCreateController	= { placeHolder: "Controller Name"	, prompt: "Please, input the Controller Name (without 'Controller' in their name)." };

//Global vars
let application_name = '';
let grails_version 	 = '';
let outputChannel;
let outputFilter = '';
let infoCatcher = '';
let createCatcher = '';
let urlCatcher = '';
let statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);

async function activate(context) 
{
	console.log('Your extension "Grails Commands for VSCode" is now active!');

	//Create a Output Channel for Grails
	getOutputChannel();

	/** Test */
	context.subscriptions.push(
		vscode.commands.registerCommand('grails-commands-for-vscode.teste', () => {

		})
	);

	/** Grails Create App Method*/
	context.subscriptions.push(
		vscode.commands.registerCommand('grails-commands-for-vscode.create-app',() =>	{
			vscode.window.showOpenDialog(optionsOpenDialog).then(folders => {
				if (folders != null && folders.length > 0){
					vscode.window.showInputBox(optionsProjectName).then(appName => {
						if(appName != null && appName.length > 0){
							const terminal = vscode.window.createTerminal({cwd: folders[0]});
							application_name = appName
							let command = `grails create-app ${appName}`;
							terminal.sendText(command);
							command = `code -r ${appName}`
							terminal.sendText(command);
							terminal.dispose;
							vscode.window.showInformationMessage(`The application '${appName}' was created.`);
						}
					});
				}
			})
		})
	);

	/** Grails Run App Method */
	context.subscriptions.push(vscode.commands.registerCommand('grails-commands-for-vscode.run-app', async function() {
		runApp(`grails run-app ${application_name}`);
	}));

	/** Grails Create Domain Class Method */
	context.subscriptions.push(vscode.commands.registerCommand('grails-commands-for-vscode.create-domain-class', function() {
		vscode.window.showInputBox(optionCreateDomainClass).then(domainName =>{
			if(domainName != null && domainName.length > 0){
				const terminal = vscode.window.createTerminal({cwd: getWorkspaceDir()});
				let command = `grails create-domain-class ${domainName}`;
				terminal.sendText(command);
				terminal.dispose;
				vscode.window.showInformationMessage(`The Domain Class '${domainName}' was created.`);
			}
		})
	}));

  /** Grails Create Controller Method */
	context.subscriptions.push(
		vscode.commands.registerCommand('grails-commands-for-vscode.create-controller', function() {
			vscode.window.showInputBox(optionCreateController).then(
				controllerName => {
					if(controllerName != null && controllerName.length > 0) {
						const terminal = vscode.window.createTerminal({cwd: getWorkspaceDir()});
						let command = `grails create-controller ${controllerName}`;
						terminal.sendText(command);
						terminal.dispose;
						vscode.window.showInformationMessage(`The Controller '${controllerName}Controller' was created.`);
					}
				}
			)
		})
	);
}

function setApplicationProperties() {
	let properties = propertiesReader(path.join(getWorkspaceDir(), 'application.properties'));
	grails_version = properties.get("app.grails.version");
	application_name = properties.get("app.name");
	vscode.window.showInformationMessage(`Grails Version Project detected: ${grails_version}\nGlobal application_name value: ${application_name}`);	
}

function getWorkspaceDir() { return path.resolve(vscode.workspace.workspaceFolders[0].uri.fsPath);}

function runApp(command) {
	setApplicationProperties();
	setStatusBarItem('init');
	outputChannel.show();
	let promise = new Promise(resolve => {
		vscode.window.showInformationMessage(`Running App '${application_name}'...`);	
		let result = child.exec(command, {cwd: getWorkspaceDir()});
		result.stdout.on("data", (data) => {
			outputFilter = data;
			infoCatcher = outputFilter.match(/\w.+/gi);
			if(infoCatcher != null)outputChannel.append(`${infoCatcher[0]}\n`);
			urlCatcher = outputFilter.match(/(http|https)?:\/\/.+/gi);
			if(urlCatcher != null){
				setStatusBarItem('running');
				vscode.env.openExternal(vscode.Uri.parse(urlCatcher[0]));
			}
			resolve(); 
		});
	});
	return promise;
}

function getOutputChannel(){ outputChannel = vscode.window.createOutputChannel(`Grails`); }

function destroyOutputChannel(){ outputChannel.dispose; }

function setStatusBarItem(status){
	if(status != 'dispose'){
		if(status == 'init'){ 
			statusBarItem.color = '#0400ff';
			statusBarItem.text = `Performing Grails Application Init...`; 
		}
		else if(status == 'running'){
			statusBarItem.color = '#00ff44';
			statusBarItem.text = `Grails Application Running...`; 
		}
		else if(status == 'stopping'){
			statusBarItem.color = '#ff0022';
			statusBarItem.text = `Performing Grails Application Stop...`;
		}
		statusBarItem.show();
	}else{
		statusBarItem.hide();
	}
}

function deactivate() { destroyOutputChannel(); }

module.exports = {
	activate,
	deactivate
}
