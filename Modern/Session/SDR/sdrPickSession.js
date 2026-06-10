/*
The control all of the pick logic for SDR
Date: 2/9/2026
Screens Covered: 314, 315, 301a, etc.
 */

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
 
   //Prevent empty or blank scans data from sending a notification
   if (!scanData || (typeof scanData === "string" && scanData.trim() === "")){
     return;
   }
 
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
       //showMessage("Teams notification failed: " + textStatus, true); //Remove from prod
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