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
    try {
        View.toast("Set the cursor position");
        Screen.setCursorPosition(4, 6);
    } catch (error) {
        View.toast("Error setting cursor position: " + error.message);
        // Error message indicates that this is not a valid function...
        // Only available on 3270 and 5250 TE hosts
    }
}

WLEvent.on("Scan", onScan);