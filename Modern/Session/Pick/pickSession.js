/*
Purpose: A single file to control all of the scan checks for the Pick devices
Date: 8/13/2025
*/

function normalizeType(type) {
    if(!type) return "UNKNOWN";
    const t = type.replace(/[_\s\-]/g, "").toUpperCase();
    if (["QRCODE", "QRC", "QR", "QRCODEMODEL1", "QRCODEMODEL2"].includes(t)) return "QRCODE";
    if (["DATAMATRIX", "DM"].includes(t)) return "DATAMATRIX";
    if (["MICROQR", "MICROQRCODE"].includes(t)) return "MICROQR";
    if (["AZTEC"].includes(t)) return "AZTEC";
    if (["PDF417"].includes(t)) return "PDF417";
    return t;
}

function disableScanner() {
    //Disable the scanner for 1 second
    Scanner.enable(false);
    //View.toast("Scanner Disabled"); //Remove from Prod
    setTimeout(function() {
        Scanner.enable(true);
        //View.toast("Scanner Enabled"); //Remove from Prod
    }, 1000);
}

function playSound(sound){
    Device.beepPlayFile(sound);
}

function sendEnter(delay = 300) {
    Device.sendKeys(`{pause:${delay}}{return}`);
}

function sendTab(delay = 300) {
    Device.sendKeys(`{pause:${delay}}{TAB}`);
}

// Function to check the container number
function checkContainer(scan_data) {
    if (scan_data.length === 20 && scan_data.startsWith("0000")) {
        return scan_data;
    } else {
        playSound("not_correct_container.mp3");
        return;
    }
}

function checkSerialNumber(scan_data) {
    // Validate the scan data length first
    var length = scan_data.data.length;
    if (length > 10) {
        scan_data.data = "";
        Scanner.scanTerminator("NoAuto");
        View.toast("Serial # is too long!");
        playSound("invalid_serial.mp3");
        return;
    } else if (length < 8) {
        scan_data.data = "";
        View.toast("Serial # is too short!");
        Scanner.scanTerminator("NoAuto");
        playSound("invalid_serial.mp3");
        return;
    } else if (scan_data.data.startsWith("1923")) {
        // Check against scanning UPC numbers
        scan_data.data = "";
        View.toast("That's a UPC Number,");
        Scanner.scanTerminator("NoAuto");
        playSound("invalid_serial.mp3");
        return;
    } else if (scan_data.data.startsWith("T")) {
        // Check against scanning Tags
        scan_data.data = "";
        View.toast("That's a Tag.");
        Scanner.scanTerminator("NoAuto");
        playSound("invalid_serial.mp3");
        // Add a sound file
    } else if (scan_data.data.startsWith("PLT")) {
        // Check against PLT numbers
        scan_data.data = "";
        View.toast("That's a PLT number.");
        Scanner.scanTerminator("NoAuto");
        playSound("invalid_serial.mp3");
    } else if (scan_data.data.startsWith("PID")) {
        // Check against PID numbers
        scan_data.data = "";
        View.toast("That's a PID.");
        Scanner.scanTerminator("NoAuto");
        playSound("invalid_serial.mp3");
        return;
    } else {
        sendEnter(300);
        View.toast("Valid Scan!"); // Remove from prod
        return scan_data;
    }
}

// Function to check the screen name
function checkScan(event) {
    var screenNumber = Screen.getText(0, 0, 4); // Get the screen number
    var position = Screen.getCursorPosition(); // Get the cursor position
    var row = position.row; // Get the current row

    // 311 Cluster Bld/Rls
    if (screenNumber === "311 " && row === 10) {
        disableScanner();
        var container = checkContainer(event.data);
        if (container) {
            View.toast("Container Validated!");
            sendEnter(300);
        } else {
            disableScanner();
            // Nullify the scan data
            event.data = "";
            View.toast("Container Not Validated!");
        }
    } else if (screenNumber === "311 " && row === 14) {
        disableScanner();
        // 311 Cluster Pick (Scanning part number)
        if (event.data.length === 32) {
            // Extract the part number from the barcode. (Skip 5, take next 12)
            var extractedPartNumber = event.data.substring(5, 17);
            event.data = extractedPartNumber;
            View.toast("Extracted PN: " + extractedPartNumber, true); // Remove this from Prod
            sendEnter(300);
            return;
        }
        // Checking the part number here
        if (event.data.length < 12 || event.data.length > 13) {
            event.data = "";
            Scanner.scanTerminator("NoAuto");
            disableScanner();
            View.toast("Please scan a valid UPC or EAN number.");
            playSound("invalid_part.mp3")
            // Add a sound file
        } else if (event.data.length === 12 || event.data.length === 13) {
            View.toast("Valid Part Number.");
            disableScanner();
            sendEnter(300);
        }
    } else if (screenNumber === "Seri" && row === 7) {
        disableScanner();
        // SERIAL NUMBER CHECK
        var type = normalizeType(event.type);
        // Show symbology type toast
        View.toast("Symbology: " + type, true);
        if (type !== "QRCODE") {
            var serialNumber = checkSerialNumber(event);
            if (serialNumber) {
                View.toast("Valid Serial Number");
            }
        } else if (type === "QRCODE") {
            disableScanner();
            // Extract only the serial number after SN:
            var snMatch = event.data.match(/SN[:\s]*([A-Za-z0-9\-]+)(?=\s*SKU:|\r|\n|$)/i);
            if (snMatch && snMatch[1]) {
                var serialNumber = snMatch[1].trim();
                event.data = serialNumber;
                View.toast("Serial Number: " + serialNumber, true);
                sendEnter(300);
            } else {
                View.toast("Unable to extract serial.");
            }
        }
    } else if (screenNumber === "314 " && row === 3) {
        disableScanner();
        // 314 STARTS HERE
        // Verify a container number is scanned
        //var containerNumber = checkContainer(event.data);
        if (event.data.length > 1) {
            sendTab(300);
        } else {
            disableScanner();
            event.data = "";
            View.toast("Invalid Scan.");
            return;
        }
    } else if (screenNumber === "314 " && row === 6) {
        disableScanner();
        if (!event.data.startsWith("TOT")) {
            event.data = "";
            View.toast("Invalid Tote ID");
            playSound("invalid_tote.mp3");
            return;
        } else {
            disableScanner();
            View.toast("Valid Tote Scanned.");
            sendEnter(300);
        }
    } else if (screenNumber === "315 " && row === 3) {
        disableScanner();
        // 315 TOTE PICK STARTS HERE
        // Verify that a valid Tote ID is scanned
        if (!event.data.startsWith("TOT")) {
            event.data = "";
            View.toast("Scan a valid Tote ID.");
            playSound("invalid_tote.mp3");
            return;
        } else {
            disableScanner();
            sendEnter(300);
            return;
        }
    } else if (screenNumber === "311a" && row === 11) {
        disableScanner();
        // Verifying the same container is scanned on 311a Confirmation
        var containerNumber = checkContainer(event.data);
        if (containerNumber && Screen.getText(8, 6, 20) === containerNumber) {
            View.toast("Container Confirmed.");
            sendEnter(300);
            return;
        } else {
            disableScanner();
            playSound("not_correct_container.mp3");
            event.data = "";
            View.toast("Incorrect Container.");
        }
    //310 Pick Cont 
    }else if(screenNumber === "310 " && row === 2){
        disableScanner();
        var container = checkContainer(event.data);
        if(container){
            sendEnter(300);
        }else{
            disableScanner();
            event.data = "";
            View.toast('Invalid Container');
        }
    }else if(screenNumber === "301 " && row === 10){
        //TODO - correct row and implement logic for the 301 screen
        //They scan the part number here.
        //TODO - implement sound to signal an invalid UPC/Part Number
        return;
    }else if(screenNumber === "301a" && row === 10){
        //TODO - correct row and implement logic for the 301a screen
        //Confirming Tote ID here.
        //TODO - add a scan check against the Tote ID already on-screen.
        return;
    }
}

WLEvent.on("Scan", checkScan);