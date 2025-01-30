/*
Author: Brandon Y
Date: 1/30/2025
Purpose: To prevent a user from overriding a container with a different container number.
Target Screen: "Container_Override"
 */

if (Screen.getText(3,0,12) === "2169.1.01016:") {
    View.toast("Bruh, we ain't doing that here.");
} else {
    View.toast("Are we on the right screen?");
}


