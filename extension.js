const vscode = require('vscode');
const propertiesReader = require('properties-reader');
const path = require('path');

async function activate(context) {

	console.log('Your extension "Grails Commands for VSCode" is now active!');
	//Constants of extension
	const optionsOpenDialog = { canSelectFiles: false, canSelectFolders: true};
	const optionsInputBox = { placeHolder: "Project Name", prompt: "Please, input the Project Name (without special characters)"};
	
	//Global vars
	let   application_name = '';
	let   grails_version = '';

	/** Grails Create App Method*/
	context.subscriptions.push
	(
		vscode.commands.registerCommand
		('grails-commands-for-vscode.create-app', function()
			{
				//Open dialog for select folder to create app
				vscode.window.showOpenDialog(optionsOpenDialog).then
				(
					folders => 
					{
						//Check if the folder selected on Open Dialog is not null
						if (folders != null && folders.length > 0)
						{
							//if true, show Input Box for user input the name of Project(Name of Application Grails)
							vscode.window.showInputBox(optionsInputBox).then
							(
								appName => 
								{
									//Check if the Name of Project is not null
									if(appName != null && appName.length > 0)
									{
										//if true, create a terminal with initial dir is the path of Open Dialog selected
										const terminal = vscode.window.createTerminal({cwd: folders[0]});
										//Set the global variable 'application_name'
										application_name = appName
										//show Information Message of execution method
										let command = `grails create-app ${appName}`;
										//Send command to terminal and execute it
										terminal.sendText(command);
										//Open the folder project on VSCode to work
										command = `code -r ${appName}`
										terminal.sendText(command);
										//Dispose the terminal created
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
				//Resolve the path of properties file
				let dirPath = path.resolve(vscode.workspace.workspaceFolders[0].uri.fsPath);
				//Declare reader for properties file in grails project
				let properties = propertiesReader(path.join(dirPath, 'application.properties'));
				//Read the Grails Version Propertie
				grails_version = properties.get("app.grails.version");
				//Read the Application Name and set global var 'application_name'
				application_name = properties.get("app.name");
				//Show informations of application.properties file in project
				vscode.window.showInformationMessage(`Grails Version Project detected: ${grails_version}\nGlobal application_name value: ${application_name}`);
				//Show information of running application
				vscode.window.showInformationMessage(`Running App '${application_name}'...`);
				//Create the terminal with the current project path
				const terminal = vscode.window.createTerminal(dirPath);
				//Create and run project on terminal created.
				let command = `grails run-app ${application_name}`;
				terminal.sendText(command);
			}
		)
	);

	context.subscriptions.push
	(
		vscode.commands.registerCommand
		('grails-commands-for-vscode.create-domain-class', function()
			{
				vscode.window.showInformationMessage('Criando uma Domain Class');
			}
		)
	);

	context.subscriptions.push
	(
		vscode.commands.registerCommand
		('grails-commands-for-vscode.create-controller', function()
			{
				vscode.window.showInformationMessage('Criando um controller');
			}
		)
	);

}

function deactivate() { }

module.exports = {
	activate,
	deactivate
}
