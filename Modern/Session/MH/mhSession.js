/*
Purpose: Controls all  the Material Handling logic
Date: 11/26/2025
 */

//Function to send an enter key after a defined delay
function sendEnter(delay=300){
    Device.sendKeys(`{pause:${delay}}{return}`);
}

//Function to send a tab key after a defined delay
function sendTab(delay=300){
    Device.sendKeys(`{pause:${delay}}{tab}`);
}

function onScan(event){
    var screenNumber = Screen.getText(0, 0, 4);
    var position = Screen.getCursorPosition();
    var row = position.row;


}