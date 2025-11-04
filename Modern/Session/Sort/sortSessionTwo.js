const TEAMS_WEBHOOK_URL = "";
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

function sendEnter(delay = 300) {
    Device.sendKeys(`{pause:${delay}}{return}`);
}

function sendTab(delay = 300) {
    Device.sendKeys(`{pause:${delay}}{TAB}`);
}


function showMessage(message){
    View.toast(message);
}


//Main event function
function onScan(event){
    //Get the screen number and cursor row
    var screenNumber = Screen.getText(0, 0, 4);
    var position = Screen.getCursorPosition();
    var row = position.row;

    //Get the device's IP
    var deviceIp = getDeviceIp();

    /*
    401 Start
    Tag - Row 2 - WORKING
    Container - Row 4 - WORKING
    Pallet ID - Row 6
     */
    if(screenNumber === "401 " && row === 2){
        //Ensure something is scanned into the tag field (no blank scans)
        if(event.data !== ""){
            sendEnter(300);
            showMessage("Valid Scan"); //remove from prod
        }else{
            showMessage("Blank Scan!");
            //Not going to send a message here.
        }
    }else if(screenNumber === "401 " && row === 4){
        //Make sure a 'PLT', 'PID' 'Container' or trailer # is scanned here.
        if(event.data.startsWith("PID") || event.data.startsWith("PLT") || event.data.startsWith("0000")
            || event.data.startsWith("T") || event.data.startsWith("FEDZ")){
            sendEnter(300);
        }else{
            //Clear the scan data
            event.data = "";
            Scanner.scanTerminator("NoAuto");
            sendTeamsNotification("Invalid Entry - Container Field", event.data, screenNumber, deviceIp);
            showMessage("Invalid Entry!");
        }
    }else if(screenNumber === "401 " && row === 6){
        if(event.data.startsWith("PID") || event.data.startsWith("PLT") || event.data.startsWith("T")
            || event.data.startsWith("FEDZ")){
            sendEnter(300);
        }else{
            event.data = "";
            sendTeamsNotification("Invalid Entry - Pallet ID", event.data, screenNumber, deviceIp);
            showMessage("Invalid Entry!");
        }

        /*
        402/402b Start
        Tag - Row 2 - WORKING
        Container - Row 3 - WORKING
        Part - Row 5 - WORKING

        402b
        Location - Row 4
         */
    }else if(screenNumber === "402 " && row === 2){
        if(event.data !== ""){
            sendEnter(300);
        }else{
            showMessage("Blank Scan!");
        }
    }else if(screenNumber === "402 " && row === 3){
        //Ensure a container number is scanned.
        if(event.data.startsWith("0000") && event.data.length === 20 || event.data.startsWith("PID")
            || event.data.startsWith("PLT") || event.data.startsWith("T") || event.data.startsWith("FEDZ")){
            sendEnter(300);
        }else{
            //Clear the scan and notify the user/send message
            event.data = "";
            View.toast("Invalid Entry!");
            Scanner.scanTerminator("NoAuto");
            sendTeamsNotification("Invalid Entry - Container Field", event.data, "402", deviceIp);
        }
    }else if(screenNumber === "402 " && row === 5){
        if(event.data !== ""){
            sendEnter(300);
        }else{
            showMessage("Blank Scan!");
            //Not sending a message here.
        }
    }else if(screenNumber === "402b" && row === 4){
        if(event.data !== ""){
            sendEnter(300);
        }else{
            showMessage("Blank Scan!");
            //Not sending a message here.
        }
        /*
        701 Start
        Container - Row 2 - DONE - WORKING
        Location - Row 4 - DONE - WORKING
         */
    }else if(screenNumber === "701 " && row === 2){
        if(event.data.startsWith("0000") && event.data.length === 20){
            sendTab(300);
            //Set the container type as 'PALS'
            Device.sendKeys("PALS");
            sendTab(300);
        }else{
            event.data = "";
            showMessage("Invalid Container!");
            Scanner.scanTerminator("NoAuto");
            sendTeamsNotification("Invalid Entry - Container", event.data, "701", deviceIp);
        }

    }else if(screenNumber === "701 " && row === 4){
        if(event.data !== ""){
            sendEnter(300);
        }else{
            showMessage("Blank Scan!");
            //No need to send a message here
        }
        /*
        702 Start
        Location - Row 2 - DONE - WORKING
        Container - Row 3 - DONE - WORKING
        Location - Row 4 - DONE - WORKING
         */

    }else if(screenNumber === "702 " && row === 2){
        if(event.data !== ""){
            sendTab(300);
        }else{
            showMessage("Blank Scan!");
            //No need to send a message
        }
    }else if(screenNumber === "702 " && row === 3) {
        //check for valid container/PID/PLT
        if (event.data !== ""){
            //Send a tab and then send 'PALS' into the 'CnTp' field, then send enter.
            sendTab(300);
            Device.sendKeys("PALS");
            sendEnter(300);
        } else {
            event.data = "";
            showMessage("Invalid Entry!");
            sendTeamsNotification("702 - Container Field", event.data, "702", deviceIp);
        }

    }else if(screenNumber === "702a" && row === 5) {
        if (event.data !== ""){
            //Check if 'All Contents' is set to "Y" or "N".
            if(Screen.getText(7,7,1) === "Y"){
                Device.beep(200, 200, 50);
                //Prompt the user to make sure they get the desired result
                Prompt.promptOptions("Alert!", "Are you sure you want to unpack the entire PID/PLT?", "YES|NO", function(result){
                    if(result === "YES"){
                        sendEnter(150);
                    }else{
                        sendTab(150);
                        Device.sendKeys("N");
                        sendEnter(150);
                    }
                });
            }else{
                sendEnter(300);
            }
        }else{
            showMessage("Invalid Entry!");
            event.data = "";
            sendTeamsNotification("702a - Container Field", event.data, "702a", deviceIp);
        }
    } else if (screenNumber === "702b" && row === 4) {
        if (event.data !== "") {
            sendEnter(150);
        } else {
            showMessage("Blank Scan!");
        }

        /*
        703 Start
        Tag or Container - Row 2 - DONE
        Location - Row 3 - DONE
        LFmt(?) - Row 5 - Not applicable
         */
    }else if(screenNumber === "703 " && row === 2){
        //Scanning a Tag or a Container here
        if(event.data !== ""){
            sendTab(300);
        }else{
            showMessage("Blank Scan!");
        }
    }else if(screenNumber === "703 " && row === 3){
        if(event.data !== ""){
            sendEnter(300);
        }else{
            showMessage("Blank Scan!");
        }

        /*
        704 Start
        Tag - Row 2 (Not Used)
        Container - Row 3 - DONE
        Confirm - Row 5 - DONE
        To Location - Row 8
         */
    }else if(screenNumber === "704 " && row === 3){
        //Container, PID, or PLT is scanned here
        if(event.data.startsWith("0000") || event.data.startsWith("PLT") || event.data.startsWith("PID")){
            sendTab(300);
        }else{
            showMessage("Invalid Entry!");
            event.data = "";
            sendTeamsNotification("704 - Invalid Entry", event.data, "704", deviceIp);
        }
    }else if(screenNumber === "704 " && row === 5){
        if(event.data.startsWith("PID") || event.data.startsWith("PLT")){
            sendTab(300);
            //Send 'PALS' into the 'Type' field
            Device.sendKeys("PALS");
            //Send a Tab to move to the 'Location Field'
            sendEnter(150);
        }else{
            showMessage("Invalid Scan!");
            event.data = "";
            sendTeamsNotification("704 - Confirm", event.data, "704", deviceIp);
        }
    }else if(screenNumber === "704 " && row === 8){
        if(!event.data.startsWith("0000")){
            sendEnter(150);
        }else{
            event.data = "";
            showMessage("Invalid Scan!");
            sendTeamsNotification("704 - To location", event.data, "704", deviceIp);
        }
    }else if(screenNumber === "310a" && row === 12){
        if(event.data !== ""){
            sendEnter(300);
        }else{
            showMessage("Blank Scan!");
        }
    } else if (screenNumber === "310 " && row === 7) {
        if (event.data !== "") {
            sendEnter(300);
        } else {
            showMessage("Invalid Scan!");
        }
    }
}

WLEvent.on("Scan", onScan);
