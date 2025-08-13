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

function checkPartNumber(scan_data){
    
    //Validate the scan data length first
    var length = scan_data.data.length;
    if(length > 10){
        scan_data.data = "";
        Scanner.scanTerminator("NoAuto");
        View.toast("Serial # is too long!");
        // Add a sound file
        return;
    }else if(length < 8){
        scan_data.data = "";
        View.toast("Serial # is too short!");
        Scanner.scanTerminator("NoAuto");
        // Add a sound file
        return;
    //Check against scanning UPC numbers
    }else if(scan_data.startsWith("1923")){
        scan_data.data = "";
        View.toast("That's a UPC Number,");
        Scanner.scanTerminator("NoAuto");
        // Add a sound file
        return;
    //Check against scanning Tags
    }else if(scan_data.data.startsWith("T")){
        scan_data.data ="";
        View.toast("That's a Tag.");
        Scanner.scanTerminator("NoAuto");
        // Add a sound file
    //Check against PLT numbers
    }else if(scan_data.data.startsWith("PLT")){
        scan_data.data = "";
        View.toast("That's a PLT number.");
        Scanner.scanTerminator("NoAuto");
        // Add a sound file
    //Check against PID numbers
    }else if(scan_data.data.startsWith("PID")){
        scan_data.data = "";
        View.toast("That's a PID.");
        Scanner.scanTerminator("NoAuto");
        // Add a sound file
        return;
    }else{
        View.toast("Valid Scan!");
        return(scan_data);
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
        //SERIAL NUMBER CHECK
    }else if(screenNumber === "Seri" && row === 7){
        //Need to check if the scan data is a QR code.
        var type = event.type.replace(/[_\s]/g, "").toUpperCase();
        if (type !== "QRCODE"){
    }

    }
}
WLEvent.on("Scan", checkScan);