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

}