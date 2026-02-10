/*
The control all of the pick logic for SDR
Date: 2/9/2026
Screens Covered: 314, 315, 301a, etc.
 */


// ============ Custom Functions ============

//Show toast messages
function showMessage(message) {
    View.toast(message);
}

//Sends an enter after a delay
function sendEnter(delay = 300) {
    Device.sendKeys(`{pause:${delay}}{return}`);
}

//Sends a tab key after a delay
function sendTab(delay = 300){
    Device.sendKeys(`{pause:${delay}}{tab}`);
}

function playSound(sound) {
    Device.beepPlayFile(sound);
}

//Disable the scanner for 1 second on an invalid scan
function disableScanner(){
    //Disable the scanner for 1 second
    Scanner.enable(false);
    setTimeout(function (){
        Scanner.enable(true);
    }, 1000);
}

// ============ End Custom Functions ============

// ============ Variables ============

// ============ End Variables ============

// ============ Main Function ============

function checkScan(scan_data){
    var screenNumber = Screen.getText(0, 0, 4); //Get the screen number
    var position = Screen.getCursorPosition(); // Get the cursor position
    var row = position.row; // Get the current row
    //var deviceIp = getDeviceIp();
    var originalScanData = scan_data.data;

    // ==== Screen 314 Start ====

    //Container/Batch ID Field
    if (screenNumber === "314 " && row === 3){
        if (scan_data.data.length <= 20){
            sendTab(150);
        }else{
            disableScanner()
            scan_data.data = "";
            showMessage("Invalid Batch or Cont. ID.")
        }
        // Tote ID Field
    }else if(screenNumber === "314 " && row === 6){
        if (!scan_data.data.startsWith("TOT")){
            disableScanner()
            scan_data.data = "";
            showMessage("Invalid Tote ID.")
        }else{
            sendEnter(150);
        }
        // ==== Screen 314 End ====


        // ==== Screen 315 Start ====
    }else if(screenNumber === "315 " && row === 3){
        // Tote ID Field
        if(!scan_data.data.startsWith("TOT")){
            disableScanner();
            scan_data.data = "";
            showMessage("Invalid Tote ID.")
        }else{
            sendEnter(150);
        }
        // WMS Work Zone Field
    }else if(screenNumber === "315 " && row === 6){
        if(scan_data.data.length !== 0){
            sendEnter(150);
        }else{
            showMessage("Please Enter a Work Zone.");
        }
        // === Screen 315 End ====

        // ==== 301 Pick Part From Start ====
    }else if(screenNumber === "301 " && row === 14){
        //Check for ODS2 label
        if(scan_data.data.length === 32){
            //Extract the part number from the barcode
            var extractedPartNumber = scan_data.data.substring(5, 17);
            scan_data.data = extractedPartNumber;
            sendEnter(150);

            //Check against regular part numbers
        }else if(screenNumber === "301 " && row === 14){
            //Check if the scanned part number is between 12 and 13 characters
            if(scan_data.data.length < 12 || scan_data.data.length > 13){
                disableScanner();
                scan_data.data = "";
                showMessage("Incorrect SKU");

                //Allow scans that are 12 or 13 characters long
            }else if(scan_data.data.length === 12 || scan_data.data.length === 13){
                sendEnter(150);
            }
            // ==== 301 Pick Part From End ====

        }
        // === 301a Pick Part To START ====
    }else if(screenNumber === "301a" && row === 14){
        if(scan_data.data.startsWith("TOT")){
            sendEnter(150);
        }else{
            scan_data.data = "";
            showMessage("Tote ID doesn't match.");
        }
    }
}

WLEvent.on("Scan", checkScan);