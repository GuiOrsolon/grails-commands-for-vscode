const vscode = require('vscode');
const propertiesReader = require('properties-reader');
const path = require('path');

//Constants of extension
const optionsOpenDialog = { canSelectFiles: false, canSelectFolders: true};
const optionsProjectName = { placeHolder: "Project Name", prompt: "Please, input the Project Name (without special characters)"};
const optionCreateDomainClass = { placeHolder: "Domain Class Name", prompt: "Please, input the Domain Class Name"};
const optionCreateController = { placeHolder: "Controller Name", prompt: "Please, input the Controller Name (without 'Controller' in their name)."};

//Global vars
let   application_name = '';
let   grails_version = '';

async function activate(context) {

	console.log('Your extension "Grails Commands for VSCode" is now active!');

	/** Grails Create App Method*/
	context.subscriptions.push
	(
		vscode.commands.registerCommand
		('grails-commands-for-vscode.create-app', function()
			{
				vscode.window.showOpenDialog(optionsOpenDialog).then
				(
					folders => 
					{
						if (folders != null && folders.length > 0)
						{
							vscode.window.showInputBox(optionsProjectName).then
							(
								appName => 
								{
									if(appName != null && appName.length > 0)
									{
										const terminal = vscode.window.createTerminal({cwd: folders[0]});
										application_name = appName
										let command = `grails create-app ${appName}`;
										terminal.sendText(command);
										command = `code -r ${appName}`
										terminal.sendText(command);
										terminal.dispose;
										vscode.window.showInformationMessage(`The application '${appName}' was created.`);
									}
								}
							);
						}
					}
				)
			}
		)
	);

	/** Grails Run App Method */
	context.subscriptions.push
	(
		vscode.commands.registerCommand
		('grails-commands-for-vscode.run-app', function()
			{
				//Call function to set grails_version and application_name global variables
				setApplicationProperties();
				//Show informations of application.properties file in project
				vscode.window.showInformationMessage(`Grails Version Project detected: ${grails_version}\nGlobal application_name value: ${application_name}`);
				//Show information of running application
				vscode.window.showInformationMessage(`Running App '${application_name}'...`);
				//Create the terminal with the current project path
				const terminal = vscode.window.createTerminal(getWorkspaceDir());
				//Create and run project on terminal created.
				let command = `grails run-app ${application_name}`;
				terminal.sendText(command);
			}
		)
	);

	/** Grails Create Domain Class Method */
	context.subscriptions.push
	(
		vscode.commands.registerCommand
		('grails-commands-for-vscode.create-domain-class', function()
			{
				vscode.window.showInputBox(optionCreateDomainClass).then
				{
					domainName =>
					{
						if(domainName != null && domainName.length > 0)
						{
							const terminal = vscode.window.createTerminal({cwd: getWorkspaceDir()});
							let command = `grails create-domain-class ${domainName}`;
							terminal.sendText(command);
							terminal.dispose;
							vscode.window.showInformationMessage(`The Domain Class '${domainName}' was created.`);
						}
					}
				}
			}
		)
	);

  /** Grails Create Controller Method */
	context.subscriptions.push
	(
		vscode.commands.registerCommand
		('grails-commands-for-vscode.create-controller', function()
			{
				vscode.window.showInputBox(optionCreateController).then
				{
					controllerName =>
					{
						if(controllerName != null && controllerName.length > 0)
						{
							const terminal = vscode.window.createTerminal({cwd: getWorkspaceDir()});
							let command = `grails create-controller ${controllerName}`;
							terminal.sendText(command);
							terminal.dispose;
							vscode.window.showInformationMessage(`The Controller '${controllerName}' was created.`)
						}
					}
				}
			}
		)
	);

}

function setApplicationProperties(){
	let properties = propertiesReader(path.join(getWorkspaceDir(), 'application.properties'));
	grails_version = properties.get("app.grails.version");
	application_name = properties.get("app.name");
}

function getWorkspaceDir(){
	return path.resolve(vscode.workspace.workspaceFolders[0].uri.fsPath);
}

function deactivate() { }

module.exports = {
	activate,
	deactivate
}
