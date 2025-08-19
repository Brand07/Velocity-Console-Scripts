/*
Purpose: Controls all of the scan checks for the Cycle Count devices
Date: 8/19/2025
 */

const validChars = ["T", "R", "U"];

//Function to play sound files
function playSound(sound){
    Device.beepPlayFile(sound);
}

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
    //901t Starts Here
    if (screenNumber === "901t" && row === 4){
        //Check for scans that are valid tags.
        if(validChars.includes(event.data.charAt(0))){
            sendEnter(300);
            View.toast("Tag Validated");
        }else{
            event.data = "";
            playSound("invalid_tag.mp3");
            View.toast("Invalid Tag");
        }//End 901t
    //903 Demand Count Start
    }else if(screenNumber === "903 " && row === 2){
        //Check against blank scans
        if(event.data === ""){
            Scanner.scanTerminator("NoAuto");
            View.toast("Please scan the location.");
        }else{
            sendEnter(300);
        }
    }
}