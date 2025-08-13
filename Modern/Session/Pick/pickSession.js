/*
Purpose: A single file to control all of the scan checks for the Pick devices
Date: 8/13/2025
*/


function sendEnter(delay = 300){
    Device.sendKeys(`{pause:${delay}}{return}`)
}

function sendTab(delay = 300){
    Device.sendKeys(`{pause:${delay}}{TAB}`)
}

//Function to check the container number
function checkContainer(scan_data){
    if(scan_data.length === 20 && scan_data.startsWith("0000")){
        return(scan_data);
    }else{
        Device.beepPlayFile("not_correct_container.mp3");
    }
}

//Function to check the screen name
function checkScan(event){
    var screenNumber = Screen.getText(0, 0, 4); //Get the screen number
    var position = Screen.getCursorPosition(); // Get the cursor position
    var row = position.row; //Get the current row

    //311 Cluster Bld/Rls
    if(screenNumber === "311 " && row === 10){
       var container = checkContainer(event.data);
       if(container){
        View.toast("Container Validated!");
        sendEnter(300)
       }else{
        //Nullify the scan data
        event.data = "";
        View.toast("Container Not Validated!");
       }
       //311 Cluster Pick (Scanning part number)
    }else if(screenNumber === "311 " && row === 14){
        //Check for ODS2 label
        if(event.data.legnth === 32){
            //Extract the part number from the barcode. (Skip 5, take next 12)
            var extractedPartNumber = event.data.substring(5, 17);
            event.data = extractedPartNumber;
            View.toast("Extracted PN: " + extractedPartNumber, true); //Remove this from Prod
            sendEnter(300);
            return;
        }
    }
}

WLEvent.on("Scan", checkScan);