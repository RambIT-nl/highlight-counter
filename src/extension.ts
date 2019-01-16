import { window } from 'vscode';

export function activate() {
	let msg: any = null;

	window.onDidChangeTextEditorSelection(() => {
		let editor = window.activeTextEditor;

		if (editor !== undefined) {
			let text = editor.document.getText(editor.selection);
			
			if (text.length > 1) {
				let matches = editor.document.getText().match(new RegExp(text, 'g'));

				if (matches) {
					msg = window.setStatusBarMessage('Highlighted: ' + matches.length);
				}
			} else if (msg) {
				msg.dispose();
			}
		} else if (msg) {
			msg.dispose();
		}
	});
}

// this method is called when your extension is deactivated
export function deactivate() {}
