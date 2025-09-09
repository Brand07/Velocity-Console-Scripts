/*
Author: Brandon Yates
Date: 9/8/2025
Purpose: To give the user an option to return to the 402 screen after using 401.
*/

View.toast("On the 401a screen.")

function goToScreen(){
    Device.sendKeys("{pause:2000}{F2}");
    Device.sendKeys("{pause:300}{402}{return}");
}

function openPrompt() {
    WLEvent.off("OnKey<000D>", openPrompt);

    Device.beepPlayFile("attention.mp3");

    setTimeout(function() {
        Prompt.promptOptions("Alert", "Would you like to go back to 402?", "Yes|No", function(result) {
            if (result === "Yes" || result === "ok") {
                View.toast("Navigating to 402.");
                goToScreen();
            } else if (result === "No") {
                View.toast("Not going back to 402.");
            }
            WLEvent.on("OnKey<000D>", openPrompt);
        });
    }, 300); // 300ms delay
}

WLEvent.on("OnKey<000D>", openPrompt);
