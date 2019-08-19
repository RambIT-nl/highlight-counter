import { window, workspace, StatusBarAlignment, StatusBarItem } from 'vscode';

let alignment: number;
let priority: number;
let caseSensitive: boolean;
let msg: StatusBarItem;

workspace.onDidChangeConfiguration((event) => {
    if (
        event.affectsConfiguration('highlight-counter.alignment') ||
        event.affectsConfiguration('highlight-counter.priority') ||
        event.affectsConfiguration('highlight-counter.caseSensitive')
    ) {
        // Reactivate the extension to apply the new configuration
        deactivate();
        activate();
    }
});

export function activate() {
    alignment = getAlignmentValue();
    priority = getPriorityValue();
    caseSensitive = getCaseSensitiveValue();
    msg = window.createStatusBarItem(alignment, priority);

    let matchFlags = 'gi';

    if (caseSensitive) {
        matchFlags = 'g';
    }

    window.onDidChangeTextEditorSelection(() => {
        let editor = window.activeTextEditor;

        if (editor !== undefined) {
            let text = editor.document.getText(editor.selection);

            if (text.length >= 1 && text.indexOf('\n') === -1) {
                text = text.replace(/\\/g, '\\\\');

                let matches = editor.document
                    .getText()
                    .match(new RegExp(text, matchFlags));

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
    let alignment: string | undefined = workspace
        .getConfiguration('highlight-counter')
        .get('alignment');

    return alignment ===
        StatusBarAlignment[StatusBarAlignment.Left].toLowerCase()
        ? StatusBarAlignment.Left
        : StatusBarAlignment.Right;
}

/**
 * Get the configured priority value.
 */
function getPriorityValue(): number {
    let priority: number | undefined = workspace
        .getConfiguration('highlight-counter')
        .get('priority');

    return Number(priority);
}

/**
 * Get the configured case sensitive value.
 */
function getCaseSensitiveValue(): boolean {
    let caseSensitive: boolean | undefined = workspace
        .getConfiguration('highlight-counter')
        .get('caseSensitive');

    return caseSensitive ? caseSensitive : false;
}
