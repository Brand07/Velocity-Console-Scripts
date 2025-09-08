/*
Author: Brandon Yates
Date: 9/8/2025
Purpose: To give the user an option to return to the 402 screen after using 401.
*/

View.toast("On the 401a screen.")

function goToScreen(){
    Device.sendKeys("{pause:2000}{F2}"); // GOTO Screen
    Device.sendKeys("{pause:300}{402}{return}");
}

function openPrompt(){
    /*
    Display a prompt box asking the user
    if they would like to be navigated
    back to the 402 screen. (Yes/No)
     */
    Prompt.promptOptions("Alert", "Would you like to go back to 402?", "Yes|No", function(result) {
        if (result === "Yes") {
            View.toast("Navigating to 402.");
            goToScreen();
        } else if (result === "No") {
            View.toast("Not going back to 402.");
        }
    });
    View.toast("After prompt.")
}

WLEvent.on("OnKey<000D>", openPrompt); // Moved outside the function
