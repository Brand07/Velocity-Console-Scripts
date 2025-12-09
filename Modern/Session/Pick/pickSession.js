/*
Purpose: A single file to control all of the scan checks for the Pick devices
Date: 8/13/2025
*/

//Custom functions for remapping methods.
function showMessage(message) {
    View.toast(message);
}

const TEAMS_WEBHOOK_URL = ""; //Insert the URL here.

//Function to get the MAC of the device.
function getDeviceIp() {
    var ip = Network.getWifiIPAddress();
    //View.toast("Device IP fetched: " + ip, true); // Debug output
    if (!ip || ip === "0.0.0.0") {
        // Try alternative method if available
        if (Network.getIPAddress) {
            ip = Network.getIPAddress();
            //View.toast("Fallback IP: " + ip, true);
        }
    }
    return ip;
}

function sendTeamsNotification(
    message,
    scanData = "Null",
    screen = "Null",
    deviceIp
) {
    //Debug messages to be removed from prod
    //showMessage("Send To Teams function called.");

    // Ensure scanData is a string (ES5 compatible)
    var scanDataString;
    if (typeof scanData === "object") {
        scanDataString = JSON.stringify(scanData);
    } else {
        scanDataString = String(scanData);
    }

    var ipDisplay = deviceIp ? deviceIp : "Unknown";
    var deviceUrl = deviceIp ? "http://" + deviceIp + ":8080/#/device-control/index" : null;

    //Format the message the way the webhook wants
    var payload = {
        attachments: [
            {
                contentType: "application/vnd.microsoft.card.adaptive",
                content: {
                    $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
                    type: "AdaptiveCard",
                    version: "1.0",
                    body: [
                        {
                            type: "TextBlock",
                            text: "Scan Completed - Screen " + screen,
                            weight: "Bolder",
                            size: "Medium",
                        },
                        {
                            type: "TextBlock",
                            text: "Time: " + new Date().toISOString().slice(0, 10),
                            wrap: true,
                        },
                        {
                            type: "TextBlock",
                            text: "Device IP: " + ipDisplay,
                            wrap: true,
                        },
                        {
                            type: "TextBlock",
                            text: "Scan Data: " + scanDataString,
                            wrap: true,
                        },
                        {
                            type: "TextBlock",
                            text: "Status: " + message,
                            wrap: true,
                        },
                    ],
                    actions: deviceUrl
                        ? [
                            {
                                type: "Action.OpenUrl",
                                title: "Open Device Control",
                                url: deviceUrl,
                            },
                        ]
                        : [],
                },
            },
        ],
    };

    // Callback for successful completion
    function completeCallback(response, textStatus) {
        if (response != null) {
            //showMessage("Teams notification sent successfully!", true); //Remove from prod
            //showMessage("Response: " + response.data, true); //Remove from prod
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
        if (typeof Network !== "undefined") {
            //showMessage("Network object exists", true); //Remove from prod

            if (Network.sendWebRequest) {
                //showMessage("sendWebRequest method exists - sending...", true); //Remove from prod

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
                        500: errorCallback,
                    },
                });

                //showMessage("Teams webhook request initiated", true); //Remove from prod
            } else {
                showMessage("sendWebRequest method NOT available", true); //Remove from prod
            }
        } else {
            showMessage("Network object NOT available", true); //Remove from prod
        }
    } catch (error) {
        showMessage("Teams notification ERROR: " + error.toString(), true); //Remove from prod
        // Use Logger if available
        if (typeof Logger !== "undefined") {
            Logger.debug("Teams webhook error: " + error.toString());
        }
    }
}

function normalizeType(type) {
    if (!type) return "UNKNOWN";
    const t = type.replace(/[_\s\-]/g, "").toUpperCase();
    if (["QRCODE", "QRC", "QR", "QRCODEMODEL1", "QRCODEMODEL2"].includes(t))
        return "QRCODE";
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
    setTimeout(function () {
        Scanner.enable(true);
        //View.toast("Scanner Enabled"); //Remove from Prod
    }, 1000);
}

function playSound(sound) {
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
    deviceIp = getDeviceIp();
    // Validate the scan data length first
    var length = scan_data.data.length;
    if (length > 10) {
        scan_data.data = "";
        Scanner.scanTerminator("NoAuto");
        View.toast("Serial # is too long!");
        playSound("invalid_serial.mp3");
        sendTeamsNotification(
            "Invalid Serial Scanned",
            scan_data,
            "Serial Capture",
            deviceIp
        );
        return;
    } else if (length < 8) {
        scan_data.data = "";
        View.toast("Serial # is too short!");
        Scanner.scanTerminator("NoAuto");
        playSound("invalid_serial.mp3");
        sendTeamsNotification(
            "Invalid Serial Scanned",
            scan_data,
            "Serial Capture",
            deviceIp
        );
        return;
    } else if (scan_data.data.startsWith("1923")) {
        // Check against scanning UPC numbers
        scan_data.data = "";
        View.toast("That's a UPC Number,");
        Scanner.scanTerminator("NoAuto");
        playSound("invalid_serial.mp3");
        sendTeamsNotification(
            "Invalid Serial Scanned",
            scan_data,
            "Serial Capture",
            deviceIp
        );
        return;
    } else if (scan_data.data.startsWith("T")) {
        // Check against scanning Tags
        scan_data.data = "";
        View.toast("That's a Tag.");
        Scanner.scanTerminator("NoAuto");
        playSound("invalid_serial.mp3");
        sendTeamsNotification(
            "Invalid Serial Scanned",
            scan_data,
            "Serial Capture",
            deviceIp
        );
        // Add a sound file
    } else if (scan_data.data.startsWith("PLT")) {
        // Check against PLT numbers
        scan_data.data = "";
        View.toast("That's a PLT number.");
        Scanner.scanTerminator("NoAuto");
        playSound("invalid_serial.mp3");
        sendTeamsNotification(
            "Invalid Serial Scanned",
            scan_data,
            "Serial Capture",
            deviceIp
        );
    } else if (scan_data.data.startsWith("PID")) {
        // Check against PID numbers
        scan_data.data = "";
        View.toast("That's a PID.");
        Scanner.scanTerminator("NoAuto");
        playSound("invalid_serial.mp3");
        sendTeamsNotification(
            "Invalid Serial Scanned",
            scan_data,
            "Serial Capture",
            deviceIp
        );
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
    var deviceIp = getDeviceIp();
    //View.toast(mac_address);

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
        if (event.data.length < 12 || event.data.length > 14) {
            var originalScanData = event.data; // Save before overwriting
            event.data = "";
            Scanner.scanTerminator("NoAuto");
            disableScanner();
            View.toast("Please scan a valid UPC or EAN number.");
            playSound("invalid_part.mp3");
            sendTeamsNotification(
                "Invalid Part Number Scanned",
                originalScanData,
                "Part Number Capture",
                deviceIp
            );
            // Add a sound file
        } else if (event.data.length === 12 || event.data.length === 13) {
            View.toast("Valid Part Number.");
            disableScanner();
            sendEnter(300);
        } else if (event.data.length === 14) {
            event.data = event.data.substring(1, 13);
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
            var snMatch = event.data.match(
                /SN[:\s]*([A-Za-z0-9\-]+)(?=\s*SKU:|\r|\n|$)/i
            );
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
        var originalScanData = event.data; // Save before overwriting
        disableScanner();
        // 314 STARTS HERE
        // Verify a container number is scanned
        //var containerNumber = checkContainer(event.data);
        if (event.data.length > 1) {
            sendTab(300);
        } else {
            disableScanner();
            sendTeamsNotification(
                "Invalid Batch ID Scanned",
                originalScanData,
                "Part Number Capture",
                deviceIp
            );
            event.data = "";
            View.toast("Invalid Scan.");
            return;
        }
    } else if (screenNumber === "314 " && row === 6) {
        disableScanner();
        if (!event.data.startsWith("TOT")) {
            sendTeamsNotification(
                "Invalid Tote ID Scanned",
                event.data,
                "314 Tote Induction",
                deviceIp
            );
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
            sendTeamsNotification(
                "Invalid Tote ID Scanned",
                event.data,
                "Tote Induction",
                deviceIp
            );
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
            sendTeamsNotification(
                "Container Mismatch",
                event.data,
                "Confirm Container (311a)",
                deviceIp
            );
            playSound("not_correct_container.mp3");
            event.data = "";
            View.toast("Incorrect Container.");
        }

        //310 Pick Cont
    } else if (screenNumber === "310 " && row === 2) {
        disableScanner();
        if(event.data !== ""){
            sendEnter(300);
        }else{
            showMessage("Invalid Scan!");
        }

        //301 Pick Part From
    } else if (screenNumber === "301 " && row === 14) {
        if (event.data.length < 12 || event.data.length > 13) {
            var originalScanData = event.data;
            event.data = "";
            disableScanner();
            playSound("invalid_part.mp3");
            View.toast("Invalid Part #");
            Scanner.scanTerminator("NoAuto");
            sendTeamsNotification(
                "Invalid Part Number Scanned",
                originalScanData,
                "301 Pick Part From",
                deviceIp
            );
        } else {
            sendEnter(300);
        }
        //301a Pick Part To
    } else if (screenNumber === "301a" && row === 14) {
        //TODO - correct row and implement logic for the 301a screen
        var toteId = Screen.getText(14, 6, 7);
        if (event.data === toteId) {
            View.toast("Validated!");
            sendEnter(300);
        } else {
            sendTeamsNotification(
                "Invalid Tote Confirmation",
                event.data,
                "301a Pick Part To",
                deviceIp
            );
            event.data === "";
            View.toast("Incorrect Tote");
            playSound("invalid_tote.mp3");
            Scanner.scanTerminator("NoAuto");
        }
    }
}

WLEvent.on("Scan", checkScan);
