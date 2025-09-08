/*
Author: Brandon Yates
Date: 9/8/2025
Purpose: To give the user an option to return to the 402 screen after using 401.
*/

View.toast("On the 401a screen.")

function openPrompt(){
    View.toast("Function Called.");

    /*
    Display a prompt box asking the user
    if they would like to be navigated
    back to the 402 screen. (Yes/No)
     */
    Prompt.promptOptions("Alert", "Would you like to go back to 402?", "Yes|No", function(result) {
        if (result === "Yes") {
            View.toast("Yes");
            // TODO: Add navigation to 402 screen here, e.g. Screen.goto("402");
        } else if (result === "No") {
            View.toast("No");
        }
    });
    View.toast("After prompt.")
}

WLEvent.on("OnKey<000D>", openPrompt); // Moved outside the function
