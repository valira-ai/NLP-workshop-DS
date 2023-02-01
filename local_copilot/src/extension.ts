// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import fetch from 'node-fetch';

const editor = vscode.window.activeTextEditor;
const URL = "https://55e1-34-66-229-37.ngrok.io";

async function summarize() {
	const selection = editor?.selection;
	const position = editor?.selection.active;
	if (selection && !selection.isEmpty) {
		// const selectionRange = new vscode.Range(selection.start.line, selection.start.character, selection.end.line, selection.end.character);
		const highlighted = editor.document.getText(selection);
		const insertPosition = position?.with(undefined, 0);

		const content = {'text': highlighted};
		const myUrl = URL + "/summarization";

		const response = await fetch(myUrl, {
			method: 'POST',
			body: JSON.stringify(content),
			headers: {'Content-Type': "application/json"}
		}).then((response: any) => response.json());
		
		editor.edit(editBuilder => {
			editBuilder.replace(new vscode.Range(selection.start.line-1, selection.start.character, selection.start.line, 0), 
			"# " + response.summary + "\n");
		});
	}else{
		vscode.window.showInformationMessage("No Highlighted Text!");
	}
}

async function complete() {
	const selection = editor?.selection;
	const position = editor?.selection.active;
	if (selection && !selection.isEmpty) {
		// const selectionRange = new vscode.Range(selection.start.line, selection.start.character, selection.end.line, selection.end.character);
		const highlighted = editor.document.getText(selection);
		const insertPosition = position?.with(undefined, 0);
		
		const content = {'text': highlighted};
		const myUrl = URL + "/completion";

		const response = await fetch(myUrl, {
			method: 'POST',
			body: JSON.stringify(content),
			headers: {'Content-Type': "application/json"}
		}).then((response: any) => response.json());
		  
		editor.edit(editBuilder => {
			editBuilder.replace(new vscode.Range(selection.start.line, selection.start.character, selection.end.line+1, 0), 
			response.completion + "\n");
		});
	}else{
		vscode.window.showInformationMessage("No Highlighted Text!");
	}
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "nlp-showcase" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let sum = vscode.commands.registerCommand('nlp-showcase.Summarize', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		summarize();
	});

	let com = vscode.commands.registerCommand('nlp-showcase.Complete', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		complete();
	});

	context.subscriptions.push(sum);
	context.subscriptions.push(com);
}

// This method is called when your extension is deactivated
export function deactivate() {}
