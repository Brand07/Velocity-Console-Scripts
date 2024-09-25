/* Prompt the user to enter a message to be displayed as a toast and insert it into a field.
 */

function insertIntoField(message) {
    // Assuming you have a function or method to set the text of a field
    Screen.setText(8, 6, message); // Example: setting text at row 1, column 1
}

Prompt.prompt("Prompt Title", "Enter something to show as a toast:", "", null, function (message) {
    if (message) {
        View.toast(message, false);
        insertIntoField(message);
    }
});