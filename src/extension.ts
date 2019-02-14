import { window, StatusBarAlignment, StatusBarItem } from 'vscode';

export function activate() {
    let msg: StatusBarItem = window.createStatusBarItem(StatusBarAlignment.Right, 100);

    window.onDidChangeTextEditorSelection(() => {
        let editor = window.activeTextEditor;

        if (editor !== undefined) {
            let text = editor.document.getText(editor.selection);
            
            if (text.length >= 1) {
                let matches = editor.document.getText().match(new RegExp(text, 'g'));

                if (matches !== null && matches.length >= 1) {
                    msg.text = 'Highlighted: ' + matches.length;
                    msg.show();
                } else {
                    msg.hide();
                }
            } else if (msg) {
                msg.hide();
            }
        } else if (msg) {
            msg.hide();
        }
    });
}

// this method is called when your extension is deactivated
export function deactivate() {}
