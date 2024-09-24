/* Prompt the user to enter a message to be displayed as a toast.
 */

Prompt.prompt("Prompt Title","Enter something to show as a toast:", "I like toast!", null, function (message) {
    if(message) {
        View.toast(message, false);
    }
});