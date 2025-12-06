/*
Author - Brandon Yates
Date - 5/29/2025
Purpose - Implements logic to scan a QR code that contains both the SN and SKU.
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


function checkPartNumber(partNumber) {
    const length = partNumber.data.length;    
    
    if (length === 32) {
        //Extract the part number from the barcode (skip first 5 chars, take next 12)
        var extractedPartNumber = partNumber.data.substring(5, 17);
        partNumber.data = extractedPartNumber;
        View.toast("Extracted Part Number: " + extractedPartNumber, true);
        setTimeout(function () {
            Device.sendKeys("{return}");
        }, 100);
        return;
    }

    //Check if the scanned data is 12 or 13 characters long
    if (length < 12 || length > 14) {
        Device.beep(1000, 50, 50);
        partNumber.data = "";
        View.toast("Please scan a valid UPC or EAN number.")
    } else if (length === 12) {
        setTimeout(function () {
            Device.beep(50, 100, 50);
            Device.sendKeys("{return}");

        }, 100);
    } else if (length === 13) {
        setTimeout(function () {
            Device.beep(50, 100, 50);
            Device.sendKeys("{return}");
        }, 100);
    }else if (length === 14){
        setTimeout(function (){
            Device.beep(50, 100, 50);
            Device.sendKeys("{return}");
        }, 100);
    }


}

function onScan(event) {
    // Serial Capture Screen
    var text1 = Screen.getText(0, 0, 14); // "Serial Capture"
    var text2 = Screen.getText(1, 0, 5); // "Part:"
    var text3 = Screen.getText(6, 1, 5); // "SerN:"

    // Part Number Capture Screen (311 Cluster Pick)
    var text4 = Screen.getText(0, 0, 16); // "311 Cluster Pick"
    var text5 = Screen.getText(2, 0, 4); // "FLoc"
    var text6 = Screen.getText(15, 0, 17); // "Confirm Pick From"

    if (text1 === "Serial Capture" && text2 === "Part:" && text3 === "SerN:") {
        // Normalize the symbology type
        var type = normalizeType(event.type);// Check if the symbology is a QR Code
        if (type !== "QRCODE") {
            // Validate the scanned data first
            const length = event.data.length;
            
            if (length > 10) {
                setTimeout(function () {
                    Device.beep(1000, 1000, 50);
                    View.toast("Serial Number is too long!");
                    Scanner.scanTerminator("NoAuto");
                }, 100);
                event.data = "";
                return;
            } else if(length < 8){
                setTimeout(function () {
                    Device.beep(1000, 1000, 50);
                    View.toast("Serial Number is too short!");
                    Scanner.scanTerminator("NoAuto");
                }, 100);
                event.data = "";
                return;
            } else if(event.data.startsWith("1923")) {
                setTimeout(function () {
                    Device.beep(1000, 1000, 50);
                    View.toast("That's a UPC Number.")
                    Scanner.scanTerminator("NoAuto");
                }, 100);
                event.data = "";
                return;
            } else if(event.data.startsWith("T")) {
                setTimeout(function () {
                    Device.beep(1000, 1000, 50);
                    View.toast("That's a Tag number.")
                    Scanner.scanTerminator("NoAuto");
                }, 100);
                event.data = "";
                return;
            } else if(event.data.startsWith("PLT")) {
                setTimeout(function () {
                    Device.beep(1000, 1000, 50);
                    View.toast("That's a PLT number.")
                    Scanner.scanTerminator("NoAuto");
                }, 100);
                event.data = "";
                return;
            } else if(event.data.startsWith("PID")) {
                setTimeout(function () {
                    Device.beep(1000, 1000, 50);
                    View.toast("That's a PID.")
                    Scanner.scanTerminator("NoAuto");
                }, 100);
                event.data = "";
                return;
            } else {
                setTimeout(function () {
                    View.toast("Valid Scan")
                    //Device.sendKeys("{return}");
                }, 100);
            }
        } else {            // Extract only the serial number after SN: and before SKU or end
            var snMatch = event.data.match(/SN[:\s]*([A-Za-z0-9\-]+)(?=\s*SKU:|\r|\n|$)/i);
            if (snMatch && snMatch[1]) {
                var serialNumber = snMatch[1].trim();
                event.data = serialNumber;
                View.toast("Serial Number: " + serialNumber, true);
                setTimeout(function () {
                    //Device.sendKeys("{return}");
                }, 100);
                Logger.debug("Extracted Serial Number: " + serialNumber);
            } else {
                Logger.warn("Could not extract serial number after SN:");
                View.toast("Could not extract serial number from QR.", true);
                return;
            }
        }
        Logger.debug("Scan - Replace - Script Ending: Event = " + JSON.stringify(event));
    // Part Number check
    } else if (text4 === "311 Cluster Pick" && text5 === "FLoc" && text6 === "Confirm Pick From") {
        //Normalize the symbology type
        var type = event.type.replace(/[_\s]/g, "").toUpperCase();
        View.toast("Symbology: " + type, true);

        // Check if it's a QR code
        if (type !== "QRCODE") {
            checkPartNumber(event);        
        } else {            // Extract only the SKU after SKU:
            var skuMatch = event.data.match(/SKU[:\s]*([A-Za-z0-9\-]+)/i);
            if (skuMatch && skuMatch[1]) {
                var sku = skuMatch[1].trim();
                event.data = sku;
                setTimeout(function () {
                    Device.sendKeys("{return}");
                }, 100);
                View.toast("SKU: " + sku, true);
                Logger.debug("Extracted SKU: " + sku);
            } else {
                View.toast("Unable to extract SKU...");
                Logger.warn("Could not extract SKU after SKU:");
                return;
            }
        }
        Logger.debug("Scan - Replace - Script Ending: Event = " + JSON.stringify(event));
    } else {
        return;
    }
}

WLEvent.on("Scan", onScan);