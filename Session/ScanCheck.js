//Let's create a function to process the scan
function onScan(event)
{
    if (event.data.length === 0) {
        // If the scan data is empty, do not send enter.
        Scanner.scanTerminator("NoAuto");
        return; // Ensure no further processing occurs
    }


    Logger.debug("Scan - Append - Script Beginning: Event = " + JSON.stringify(event) + " | Arguments = " + minLength + ", " + maxLength + ", " + allowedType + ", " + appendData );

    //Make sure we meet the min and max length requirement. We do allow maxLength to be 0 which means no max length
    if( event.data.length < minLength || (maxLength != 0 && event.data.length > maxLength) )
        return;

    //Sometimes the scanner sends through a symbology with an "_" or spaces on the end. Lets make sure we fix this.
    var type = event.type.replace("_", "").replace(" ", "");

    //Verify the symbology if it is not "ALL" and does not match then we need to return
    if( allowedType !== "ALL" && allowedType !== type )
        return;


    //This is where we modify the scan data (remove)
    //event.data += appendData;


    //“AutoTab” - Sends a tab after a scan.
    //“AutoEnter” - Sends an enter after a scan.
    //“AutoEnterAndTab” - Sends an enter and then a tab after a scan.
    //“AutoTabAndEnter” - Sends a tab and then an enter after a scan.
    //“NoAuto” - does not send a tab or an enter after a scan.

    //-------------------------------------------
    //screen: PartNumber
    //cursor row 14

    //0,0,3 = "311"
    //14,0,5 = "Conf:"
    //15,0,17 = "Confirm Pick From"
    //-------------------------------------------
    var text1 = Screen.getText(0, 0, 3);
    var text2 = Screen.getText(14, 0, 5);
    var text3 = Screen.getText(15, 0, 17);

    //-------------------------------------------
    //screen: Serial Number

    //0,0,14 = Serial Capture
    //1,0,5 = Part:
    //2,1,4 = Pkg:
    //3,0,5 = Ownr:
    //6,1,5 = SerN:
    //-------------------------------------------

    var text1SN = Screen.getText(0,0,14);
    var text2SN = Screen.getText(1,0,5);
    var text3SN = Screen.getText(6,1,5);

// added by Rick - Start

    //-------------------------------------------
    //screen: Directed Nest

    //0,0,17 = "704 Directed Nest"
    //1,2,12 = "Matl To Nest"
    //4,2,12 = "Cnfrm To Loc"
    //6,1,4 = "Typ:"
    //
    //-------------------------------------------

    var text1DN = Screen.getText(0,0,17);
    var text2DN = Screen.getText(1,2,12);
    var text3DN = Screen.getText(4,2,12);
    var text4DN = Screen.getText(6,1,4);

    //View.toast(text1DN, true);
    //View.toast(text2DN, true);
    //View.toast(text3DN, true);
    //View.toast(text4DN, true);

// added by Rick - End

    //-------------------------------------------
    //screen: ContainerIDWrkEmpty

    //0,0,3 = "311"
    //4,0,5 = "WkZ1:"
    //10,0,5 = "Cont:"
    //Cursor row = 10
    //-------------------------------------------
    var text1CN = Screen.getText(0,0,3);
    var text2CN = Screen.getText(4,0,5);
    var text3CN = Screen.getText(10,0,5);

    var position= Screen.getCursorPosition();


    if(text1 === "311" && text2 === "Conf:" && text3 === "Confirm Pick From" && position.row === 14){
        //Device.sendKeys("{pause:300}{return}" );
        //View.toast("Auto-Enter Disabled");
    }

    //screen: ContainerIDWrkEmpty
    else if(text1CN === "311" && text2CN === "WkZ1:" && text3CN === "Cont:" && position.row === 10){
        //store the last 4 digits of the container ID for use on the Confirm Container screen
        var ScanData = event.data;
        var container = ScanData.substr(ScanData.length - 4);

        View.toast(container, false);
        Storage.setItem("ContLast4", container);

        Scanner.scanTerminator("AutoEnter");
        Device.sendKeys("{pause:300}{return}" );
    }

    else if( Screen.getText(6,7,7) === "Sign-On"){
        //login screen
        View.toast("login: tab", false);

        //block the scanner data from being sent Does not work!
        Scanner.scanTerminator("NoAuto");
        Device.sendKeys("{pause:300}{tab}" );

        //====================== REMOVE TESTING ONLY
        View.toast("BlockZoneScanContPrompt: TRUE", false);
        Storage.setItem('BlockZoneScanContPrompt', true);
        //======================
    }

    else if(text1SN === "Serial Capture" && text2SN === "Part:" && text3SN === "SerN:" ){

        //Add logic to re enable the auto enter when they finish scanning
        Storage.setItem("StopSerialEnter", false);


        Scanner.scanTerminator("NoAuto");
        Device.sendKeys("{pause:300}{tab}" );
    }

    // 704 start
    else if(text1DN === "704 Directed Nest" && text2DN === "Matl To Nest" && text3DN === "Cnfrm To Loc" && text4DN === "Typ:" ){

        if (position.row === 2){
            Scanner.scanTerminator("NoAuto");
            Device.sendKeys("{pause:300}{tab}" );
        }

        if (position.row === 3){
            Scanner.scanTerminator("NoAuto");
            Device.sendKeys("{pause:300}{tab}" );
        }

        if (position.row === 5){
            /*			if (!Storage.getItem("LastPID")){
                            Storage.setItem("LastPID", "00000000000000000000");
                        }
                        var sLastPID = Storage.getItem("LastPID");
                                var sEventData = event.data;
                               if(sLastPID == sEventData){
            */		    		Scanner.scanTerminator("NoAuto");
            Device.sendKeys("{pause:300}{return}");
            /*	    	       } else {
                                   Storage.setItem("LastPID", sEventData);
                                   Scanner.scanTerminator("NoAuto");
                                   Device.sendKeys("{pause:300}{tab}");
                        }
            */       	}
    }
    // 704 End


        // Added by Brandon Yates - April 30th, 2025
        //Screen -- 402 Relocate Query
        //0,0,3 = "402"
        //5,0,4 = "Part"

    else if (Screen.getText(0,0,18) === "402 Relocate Query" && event.data.length > 0){ //Tag Field
        View.toast("Movinng to the Container Field.");
        Scanner.scanTerminator("NoAuto");
        Device.sendKeys("{pause:150}{tab}");
    }

    else {
        //do nothing, could add append if needed
        //event.data += Device.sendKeys("/0D");
        event.data = event.data
        //View.toast(event.data, false);

        //Scanner.scanTerminator("AutoEnter");
        //Device.sendKeys("{pause:300}{return}" );
    }


    Logger.debug("Scan - Append- Script Ending: Event = " +  JSON.stringify(event) );
}

//Register the onScan function to be called when a scan occurs. Without this it will never run.
WLEvent.on("Scan", onScan);
