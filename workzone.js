/*
The purpose of this script is to prevent users from only using
a wildcard character in the Workzone fields. The user should at least
enter 1 or 2 characters after the wildcard character. If the user
only enters the wildcard character, the script will display an error
message and prompt the user to enter more characters.
*/


// Test disabling auto-enter
View.toast("Script working");

var position = Screen.getCursorPosition();

if(position.row == 4) {
    View.toast("Row 4");
} else if (position.row == 5) {
    View.toast("Row 5");
} else if (position.row == 6) {
    View.toast("Row 6");
}