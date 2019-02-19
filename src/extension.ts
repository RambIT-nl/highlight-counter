import { window, workspace, StatusBarAlignment, StatusBarItem } from 'vscode';

let alignment: number;
let msg: StatusBarItem;

workspace.onDidChangeConfiguration((event) => {
    if (event.affectsConfiguration('highlight-counter.alignment')) {
        // Reactivate the extension to apply the new configuration
        deactivate();
        activate();
    }
});

export function activate() {
    alignment = getAlignmentValue();
    msg = window.createStatusBarItem(alignment, 100);

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

export function deactivate() {
    msg.dispose();
}

/**
 * Get the configured alignment value and
 * determine the StatusBarAlignment value to use.
 */
function getAlignmentValue(): number {
    let alignment: string | undefined = workspace.getConfiguration('highlight-counter').get('alignment');

    return alignment === StatusBarAlignment[StatusBarAlignment.Left].toLowerCase() ? StatusBarAlignment.Left : StatusBarAlignment.Right;
}
