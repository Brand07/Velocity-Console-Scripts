/*
Author - Brandon Yates
Date - 9/24/20225
Purpose - To capture 'logs' of invalid scans, invalid entry, and screens reached by users
            due to negligence.
 */

//Custom functions for remapping methods.
function showMessage(message){
    View.toast(message);
}

function getScreen(){
    const screen = Screen.getText(0, 0, 4);
    return screen;
}

const TEAMS_WEBHOOK_URL = "" //Insert the URL here.

function sendTeamsNotification(message,scanData ="Null", screen = "Null"){
    //Debug messages to be removed from prod
    showMessage("Send To Teams function called.");

    //Format the message the way the webhook wants
    var payload = {
        "attachments": [
            {
                "contentType": "application/vnd.microsoft.card.adaptive",
                "content": {
                    "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
                    "type": "AdaptiveCard",
                    "version": "1.0",
                    "body": [
                        {
                            "type": "TextBlock",
                            "text": "**Scan Completed - Screen 402**",
                            "weight": "Bolder",
                            "size": "Medium"
                        },
                        {
                            "type": "TextBlock",
                            "text": "Time: " + new Date().toLocaleString(),
                            "wrap": true
                        },
                        {
                            "type": "TextBlock",
                            "text": "Scan Type: " + scanType,
                            "wrap": true
                        },
                        {
                            "type": "TextBlock",
                            "text": "Scan Data: " + scanData,
                            "wrap": true
                        },
                        {
                            "type": "TextBlock",
                            "text": "Status: " + message,
                            "wrap": true
                        }
                    ]
                }
            }
        ]
    };

    // Callback for successful completion
    function completeCallback(response, textStatus) {
        if (response != null) {
            showMessage("Teams notification sent successfully!", true); //Remove from prod
            showMessage("Response: " + response.data, true); //Remove from prod
        } else {
            showMessage("Teams notification failed: " + textStatus, true); //Remove from prod
        }
    }

    // Callback for errors
    function errorCallback(response) {
        View.toast("Teams notification error: " + response.status, true);
    }

    try {
        // Check what's available
        if (typeof Network !== 'undefined') {
            showMessage("Network object exists", true); //Remove from prod

            if (Network.sendWebRequest) {
                showMessage("sendWebRequest method exists - sending...", true); //Remove from prod

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

                showMessage("Teams webhook request initiated", true); //Remove from prod
            } else {
                showMessage("sendWebRequest method NOT available", true); //Remove from prod
            }
        } else {
            showMessage("Network object NOT available", true); //Remove from prod
        }
    } catch (error) {
        showMessage("Teams notification ERROR: " + error.toString(), true); //Remove from prod
        // Use Logger if available
        if (typeof Logger !== 'undefined') {
            Logger.debug("Teams webhook error: " + error.toString());
        }
    }



}

