/*
The purpose of this script is to prevent users from only using
a wildcard character in the Workzone fields. The user should at least
enter 1 or 2 characters after the wildcard character. If the user
only enters the wildcard character, the script will display an error
message and prompt the user to enter more characters.
*/


// Test disabling auto-enter
View.toast("Test");

function onScan(event) {
    View.toast("Set the cursor position");
    Screen.setCursorPosition(4, 6);


    }
WLEvent.on("Scan", onScan);