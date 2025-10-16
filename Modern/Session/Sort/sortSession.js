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
- 402 - 
- 402b - 
- 310a -
- 401 - 


*/

View.toast("")

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

function onScan(event) {
  var screenNumber = Screen.getText(0, 0, 4); // Get the screen number
  var position = Screen.getCursorPosition(); // Get the cursor position
  var row = position.row; // Get the current row

  // ========= 704 Start =========
  
  //This correctly reflects old session code.
  if (screenNumber === "704 " && row === 3) {
    var containerNumber = checkContainer(event.data);
    if (containerNumber) {
      sendTab(300);
    }
  } else if (screenNumber === "704 " && row === 5) {
    if (event.data.startsWith("PID" || "PLT")) {
      //Tab down to the 'Type' field.
      sendTab(300);
      Device.sendKeys("PALS");
      sendEnter(300);
      return;
    } else {
      //Clear the scan data
      event.data = "";
      Scanner.scanTerminator("NoAuto");
      View.toast("Invalid PID/PLT.");
      playSound("invalid_pid.mp3");
      return;
    }
    
    // ========= 704 End =========

    // ========= 702 Start =========
    //Container Unpack Screen
  } else if (screenNumber === "702 " && row === 2) {
    if (event.data === "") {
      View.toast("Blank Scan");
      Scanner.scanTerminator("NoAuto");
    } else {
      sendTab(300);
    }
  } else if (screenNumber === "702 " && row === 3) {
    var containerNumber = checkContainer(event.data);
    if (containerNumber) {
      sendTab(300);
      //Type "PALS" into the 'CnTp' field and hit enter
      Device.sendKeys("PALS");
      sendEnter(300);
    } else {
      View.toast("Invalid Container");
      event.data = "";
    }
    //702a Unpack Container
    // User can scan either the container, PID, or PLT.
  } else if (screenNumber === "702a" && row === 5) {
    if (event.data.startsWith("PID" || "PLT" || "0000")) {
      sendEnter(300);
    } else {
      Scanner.scanTerminator("NoAuto");
      View.toast("Invalid Scan.");
    }
    // ========= 702 End =========
  
     // ========= 701 Start =========
  } else if (screenNumber === "701 " && row === 2){
    //Container field
    var containerNumber = checkContainer(event.data);
    //Check if the scan is a container, a 'PLT', or a 'PID'
    if (containerNumber || event.data.startsWith("PLT") || event.data.startsWith("PID")) {
      //Tab down to the 'Cont. Type' field
      sendTab(300);
      //Send 'PALS' as the container Type
      Device.sendkeys("PALS");
      //Tab down to the 'location' field
      sendTab(300);
    }else{
      //Don't proceed
      Scanner.scanTerminator("NoAuto");
      //Clear the scan data
      event.data = "";
      //Notify the User
      View.toast("Invalid Scan.");
    }
    // ========= 701 END =========
    // 
    // ========= 703 Start =========
    
    //Container field
  }else if (screenNumber === "703 " && row === 2){
    var containerNumber = checkContainer(event.data);
    if (containerNumber){
      sendEnter(300);
    }else{
      //Clear the scan data and notify the user.
      event.data === "";
      View.toast("Invalid Container");
    }
    // ========= 703 END =========
    // 
    // ========= 402 Start =========
  } else if (screenNumber === "402" && row === 3){
    var containerNumber = checkContainer(event.data);
    if (containerNumber){
      sendEnter(300);
    }else{
      //Clear the scan data and notify the user, don't tab or enter
      event.data = "";
      View.toast("Invalid Container.");
    }
    // ========= 402b Start =========
  }else if (screenNumber === "402b" && row === 2){
    var containerNumber = checkContainer(event.data);
    if (containerNumber) {
      sendTab(300);
    }else{
      //Clear the scan data, notfiy the user, don't send tab or enter
      event.data = "";
      View.toast("Invalid Scan.");
    }
  }else if (screenNumber === "402b" && row === 4){
    //Send an enter if the scan data isn't blank.
    if (!event.data === ""){
      sendEnter(300);
    }else{
      View.toast("Blank Scan."); // remove from PROD.
    }
  }
  
}

WLEvent.on("Scan", onScan);
