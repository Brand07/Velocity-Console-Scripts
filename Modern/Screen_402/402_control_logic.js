/*
Author: Brandon Yates
Date: 8/5/2025
Purpose: To speed the 402 -> 401 Process
*/

validCharacters = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
]



// REMEMBER TO DISABLE KEYBOARD INPUT

function onScan(event) {
    var text1 = Screen.getText(0, 0, 4); //
    var text2 = Screen.getText(); // 
    var position = Screen.getCursorPosition();
    var row = position.row;

    // Tag field
    if (text1 === "402 " && row === 2) {
        if (validCharacters.includes(event.data.charAt(0))) {
            View.toast("Tag Scanned");
            Device.sendKeys("{pause:300}{return}")
            
            // Debug: Check if function exists
            //View.toast("Attempting to send Teams notification...");
            //sendTeamsNotification("Tag Successfully Scanned", "Tag", event.data);

        } else {
            View.toast("Invalid Scan");
            event.data = "";
            Scanner.scanTerminator("NoAuto");
            //sendTeamsNotification("Invalid Tag Scan", "Tag", event.data);
        }
        // Container field
    } else if (text1 === "402 " && row === 3) {
        if (event.data.startsWith("0000")) {
            View.toast("Container Scanned");
            Device.sendKeys("{pause:300}{return}");
            //sendTeamsNotification("Container Successfully Scanned", "Container", event.data);
        } else {
            event.data = "";
            View.toast("Invalid Scan");
            Scanner.scanTerminator("NoAuto");
            //sendTeamsNotification("Invalid Container Scan", "Container", event.data);
        }
        // 402a Relocate Screen
    } else if (text1 === "402a" && row === 11) {
        if (event.data === "") {
            View.toast("Try again");
            Scanner.scanTerminator("NoAuto");
            //sendTeamsNotification("Empty Scan on Relocate Screen", "Relocate", "Empty");
        } else {
            Device.sendKeys("{pause:300}{return}");
            View.toast("Valid Scan");
            //sendTeamsNotification("Relocate Scan Completed", "Relocate", event.data);
        }
        // 201a Putaway Comp
    } else if (text1 === "201a" && row === 13) {
        Device.sendKeys("{pause:300}{return}") // Enter after initial scan
        Device.sendKeys("{pause:300}{return}") // is this the final dest.?
        Device.sendKeys("{pause:2000}{F2}") // GOTO Screen
        Device.sendKeys("{pause:300}{401}{return}") // Enter 401
        //sendTeamsNotification("Putaway Process Completed - Navigating to 401", "Putaway", "Process Complete");
    }
}


WLEvent.on("Scan", onScan);