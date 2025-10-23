/*
Purpose: Controls all the logic for the Sort related screens.
Date: 8/15/2025
*/

/*
Screens Covered:
- 701 - DONE
- 702 - DONE
- 703 - DONE
- 704 - DONE
- 705 - NOT USED
- 706 - NOT USED
- 402 - DONE
- 402b - DONE
- 310a -
- 401 - 


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
  var cardBody = [
    {
      type: "TextBlock",
      text: "Scan Issue On " + screen,
      weight: "Bolder",
      size: "Medium",
    },
    {
      type: "TextBlock",
      text: "Time: " + new Date().toLocaleString(),
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
    }
  ].filter(Boolean);

  var payload = {
    attachments: [
      {
        contentType: "application/vnd.microsoft.card.adaptive",
        content: {
          $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
          type: "AdaptiveCard",
          version: "1.0",
          body: cardBody,
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
  if (typeof scan_data !== "string") scan_data = String(scan_data || "");
  if (scan_data.length === 20 && scan_data.startsWith("0000")) {
    return scan_data;
  } else {
    //playSound("not_correct_container.mp3");
    Scanner.scanTerminator("NoAuto");
    return null;
  }
}

function clearScanBuffer(event) {
  // Try to clear event.data if possible
  if (event && typeof event === "object" && "data" in event) {
    try { event.data = ""; } catch (e) {}
  }
  // Always call scanner API as fallback
  try { Scanner.scanTerminator("NoAuto"); } catch (e) {}
}

function onScan(event) {
  var screenNumber = (Screen.getText(0, 0, 4) || "").trim(); // Get the screen number
  var position = Screen.getCursorPosition(); // Get the cursor position
  var row = position.row; // Get the current row

  var deviceIP = getDeviceIp();
  // Normalize scan data
  var scanData = event && event.data !== undefined ? event.data : "";
  if (typeof scanData !== "string") scanData = String(scanData || "");

  // ========= 704 Start =========
  if (screenNumber === "704" && row === 3) {
    var containerNumber = checkContainer(scanData);
    if (containerNumber) {
      sendTab(300);
    } else {
      sendTeamsNotification("Invalid Container", scanData, "704", deviceIP);
      clearScanBuffer(event);
    }
  } else if (screenNumber === "704" && row === 5) {
    if (scanData.startsWith("PID") || scanData.startsWith("PLT")) {
      //Tab down to the 'Type' field.
      sendTab(300);
      Device.sendKeys("PALS");
      sendEnter(300);
      return;
    } else {
      sendTeamsNotification("Invalid PID/PLT", scanData, "704", deviceIP);
      clearScanBuffer(event);
      View.toast("Invalid PID/PLT.");
      playSound("invalid_pid.mp3");
      return;
    }
    // ========= 704 End =========
    // ========= 702 Start =========
    //Container Unpack Screen
  } else if (screenNumber === "702" && row === 2) {
    if (scanData === "") {
      View.toast("Blank Scan");
      clearScanBuffer(event);
    } else {
      sendTab(300);
    }
  } else if (screenNumber === "702" && row === 3) {
    //Allow the user to scan either the container, PID, or PLT in the 'container' field.
    var containerNumber = checkContainer(scanData);
    if (containerNumber || scanData.startsWith("PLT") || scanData.startsWith("PID")) {
      sendTab(300);
      //Type "PALS" into the 'CnTp' field and hit enter
      Device.sendKeys("PALS");
      sendEnter(300);
    } else {
        sendTeamsNotification("Invalid Entry", scanData, "702", deviceIP);
      View.toast("Invalid Entry");
      clearScanBuffer(event);
    }
    //702a Unpack Container
    // User can scan either the container, PID, or PLT.
  } else if (screenNumber === "702a" && row === 5) {
    if (scanData.startsWith("PID") || scanData.startsWith("PLT") || scanData.startsWith("0000")) {
      sendEnter(300);
    } else {
      sendTeamsNotification("Invalid Scan", scanData, "702a", deviceIP);
      clearScanBuffer(event);
      View.toast("Invalid Scan.");
    }
    // ========= 702 End =========
    // ========= 701 Start =========
  } else if (screenNumber === "701" && row === 2){
    var containerNumber = checkContainer(scanData);
    //Check if the scan is a container, a 'PLT', or a 'PID'
    if (containerNumber || scanData.startsWith("PLT") || scanData.startsWith("PID")) {
      //Tab down to the 'Cont. Type' field
      sendTab(300);
      //Send 'PALS' as the container Type
      Device.sendKeys("PALS");
      //Tab down to the 'location' field
      sendTab(300);
    }else{
      sendTeamsNotification("Invalid Scan", scanData, "701", deviceIP);
      clearScanBuffer(event);
      View.toast("Invalid Scan.");
    }
    // ========= 701 END =========
    // ========= 703 Start =========
  }else if (screenNumber === "703" && row === 2){
    var containerNumber = checkContainer(scanData);
    if (containerNumber){
      sendEnter(300);
    }else{
      sendTeamsNotification("Invalid Container", scanData, "703", deviceIP);
      clearScanBuffer(event);
      View.toast("Invalid Container");
    }
    // ========= 703 END =========
    // ========= 402 Start =========
  } else if (screenNumber === "402" && row === 3) {
      var containerNumber = checkContainer(scanData);
      if (containerNumber) {
          sendEnter(300);
      } else {
          sendTeamsNotification("Invalid Container", scanData, "402", deviceIP);
          clearScanBuffer(event);
          View.toast("Invalid Container.");
      }
  }else if(screenNumber === "402" && row === 5){
      if(scanData.startsWith("PID")|| scanData.startsWith("PLT")){
          sendEnter(300);
      }else{
          View.toast("Invalid PID/PLT!");
          clearScanBuffer(event);
          sendTeamsNotification("Invalid PID/PLT", scanData, "402", deviceIP)
      }
    // ========= 402b Start =========
  }else if (screenNumber === "402b" && row === 2){
    var containerNumber = checkContainer(scanData);
    if (containerNumber) {
      sendTab(300);
    }else{
      sendTeamsNotification("Invalid Container", scanData, "402b", deviceIP);
      clearScanBuffer(event);
      View.toast("Invalid Scan.");
    }
  }else if (screenNumber === "402b" && row === 4){
    //Send an enter if the scan data isn't blank.
    if (scanData !== ""){
      sendEnter(300);
    }else{
      View.toast("Blank Scan."); // remove from PROD.
    }
    // ========= 402b End =========
    // The next screen is 310a - Logic for this screen is handled by the pickSession.js file.
      //401 Pallet ID Field
  }else if(screenNumber === "401" && row === 6){
      if(scanData.startsWith("PID") || scanData.startsWith("PLT")){
          sendEnter(300);
      }else{
          View.toast("Invalid Entry!");
          clearScanBuffer(event);
          sendTeamsNotification("Invalid Entry", scanData, "401 - Pallet ID", deviceIP);
      }
  }
}

WLEvent.on("Scan", onScan);
