/*
Author: Brandon Yates
Date: 8/5/2025
Purpose: To speed the 402 -> 401 Process
*/

validCharacters = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
]

// Teams webhook URL - Replace with your actual webhook URL
const TEAMS_WEBHOOK_URL = "";

// Function to send Teams notification
function sendTeamsNotification(message, scanType, scanData) {
    // Debug: Show that function was called
    View.toast("sendTeamsNotification called: " + scanType, true);
    
    // Teams message format for webhook
    var payload = {
        "text": "**Scan Completed - Screen 402**\n\n" +
               "**Time:** " + new Date().toLocaleString() + "\n" +
               "**Scan Type:** " + scanType + "\n" +
               "**Scan Data:** " + scanData + "\n" +
               "**Status:** " + message
    };

    // Callback for successful completion
    function completeCallback(response, textStatus) {
        if (response != null) {
            View.toast("Teams notification sent successfully!", true);
            View.toast("Response: " + response.data, true);
        } else {
            View.toast("Teams notification failed: " + textStatus, true);
        }
    }

    // Callback for errors
    function errorCallback(response) {
        View.toast("Teams notification error: " + response.status, true);
    }

    try {
        // Check what's available
        if (typeof Network !== 'undefined') {
            View.toast("Network object exists", true);
            
            if (Network.sendWebRequest) {
                View.toast("sendWebRequest method exists - sending...", true);
                
                // Use the correct Network.sendWebRequest syntax from documentation
                Network.sendWebRequest(TEAMS_WEBHOOK_URL, {
                    method: "POST",
                    data: JSON.stringify(payload),
                    contentType: "application/json",
                    cache: false,
                    timeout: 8000,
                    complete: completeCallback,
                    statusCode: {
                        404: errorCallback,
                        400: errorCallback,
                        500: errorCallback
                    }
                });
                
                View.toast("Teams webhook request initiated", true);
            } else {
                View.toast("sendWebRequest method NOT available", true);
            }
        } else {
            View.toast("Network object NOT available", true);
        }
    } catch (error) {
        View.toast("Teams notification ERROR: " + error.toString(), true);
        // Use Logger if available
        if (typeof Logger !== 'undefined') {
            Logger.debug("Teams webhook error: " + error.toString());
        }
    }
}

function sendEnter(delay = 250) {

    if (typeof delay !== "number" || delay < 0) {
        console.log("Invalid delay value");
    }
    Device.sendKeys(`{pause:${delay}}{return}`);
}

function showDebugMessage(message) {
    View.toast(message);
}

d = showDebugMessage;

// REMEMBER TO DISABLE KEYBOARD INPUT

function onScan(event) {
    var text1 = Screen.getText(0, 0, 4); //
    var text2 = Screen.getText(); // 
    var position = Screen.getCursorPosition();
    var row = position.row;

    // Tag field
    if (text1 === "402 " && row === 2) {
        if (validCharacters.includes(event.data.charAt(0))) {
            d("Valid Scan");
            sendEnter(300);
            
            // Debug: Check if function exists
            //View.toast("Attempting to send Teams notification...");
            sendTeamsNotification("Tag Successfully Scanned", "Tag", event.data);

        } else {
            d("Invalid Scan");
            event.data = "";
            Scanner.scanTerminator("NoAuto");
            sendTeamsNotification("Invalid Tag Scan", "Tag", event.data);
        }
        // Container field
    } else if (text1 === "402 " && row === 3) {
        if (event.data.startsWith("0000")) {
            d("Container Scanned")
            sendEnter(300);
            sendTeamsNotification("Container Successfully Scanned", "Container", event.data);
        } else {
            event.data = "";
            d("Invalid Scan");
            Scanner.scanTerminator("NoAuto");
            sendTeamsNotification("Invalid Container Scan", "Container", event.data);
        }
        // 402a Relocate Screen
    } else if (text1 === "402a" && row === 11) {
        if (event.data === "") {
            d("Try again");
            Scanner.scanTerminator("NoAuto");
            sendTeamsNotification("Empty Scan on Relocate Screen", "Relocate", "Empty");
        } else {
            sendEnter(300);
            d("Valid Scan");
            sendTeamsNotification("Relocate Scan Completed", "Relocate", event.data);
        }
        // 201a Putaway Comp
    } else if (text1 === "201a" && row === 13) {
        sendEnter(300); // Enter after initial scan
        sendEnter(300); // is this the final dest.?
        Device.beepPlayFile("moving_to_401.mp3");
        Device.sendKeys("{pause:2000}{F2}") // GOTO Screen
        Device.sendKeys("{pause:300}{401}{return}") // Enter 401
        sendTeamsNotification("Putaway Process Completed - Navigating to 401", "Putaway", "Process Complete");
    }
}


WLEvent.on("Scan", onScan);