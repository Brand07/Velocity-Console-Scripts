View.toast("704 Directed Nest", false);

WLEvent.on("OnKey<000D>", function(eventReturn) {				// Return Key - Interupted
    View.toast("Return Key - Interupted", false);
    setTimeout(function(){
        var vTag = Screen.getText(2,6,20);
        var vCont = Screen.getText(3,6,20);
        var vConf = Screen.getText(5,6,20);
        var vType = Screen.getText(6,7,4);
        var vPosition= Screen.getCursorPosition();				// New for ver. 1.2.5   7/19/2021

        if (vCont.trim() === '') {
            if (vTag.trim() === '') {
                Device.errorBeep(400,200,50);
                View.toast("No Container or Tag", false);
            } else {
                if (vConf.substring(0, 4) === '0000') {
                    if (vConf.trim().length === 20) {
                        WLEvent.off("OnKey<000D>");
                        View.toast("vConf Passed", false);
                        Device.sendKeys("{f20}");
                    } else {
                        Device.errorBeep(400,200,50);
                        View.toast("Confirmation container must be 20 characters long", false);
                    }
                } else {
                    Device.errorBeep(400,200,50);
                    View.toast("Confirmation container must begin with 0000", false);
                }
            }
        } else {
            //if (vConf.substring(0, 3) === 'PID') { -- Changed per request from B.Hefley on 11/14/2023 to support sortation project --JP
            // allowed for the prefix "T" to be acceptable - Per Brandon Hefley - BY
            if (vConf.substring(0, 1) === 'P' || vConf.substring(0, 1) === 'T') {
                if (vConf.trim().length === 12) {
                    if (vType === 'PALS') {
                        WLEvent.off("OnKey<000D>");
                        View.toast("vType = PALS", false);+
                            Device.sendKeys("{f20}");
                    } else {
                        var vRow = vPosition.row
                        if          (vRow === 2){
                            WLEvent.off("OnKey<000D>");
                            Device.sendKeys("{tab}{tab}{tab}{BS}PALS{pause:200}{f20}");
                        } else if (vRow === 3) {
                            WLEvent.off("OnKey<000D>");
                            Device.sendKeys("{tab}{tab}{BS}PALS{pause:200}{f20}");
                        } else if (vRow === 5) {
                            WLEvent.off("OnKey<000D>");
                            Device.sendKeys("{tab}{BS}PALS{pause:200}{f20}");
                        } else if (vRow === 6) {
                            WLEvent.off("OnKey<000D>");
                            Device.sendKeys("{BS}PALS{pause:200}{f20}");
                        } else {
                            Device.errorBeep(400,200,50);
                            View.toast("Cursor not expected in this location", false);
                        }
                    }
                } else {
                    Device.errorBeep(400,200,50);
                    View.toast("Confirmation container must be 12 characters long", false);
                }
            } else {
                Device.errorBeep(400,200,50);
                View.toast("Confirmation container must begin with P", false);
                //View.toast("Confirmation container must begin with PID", false); -- changed to check if Pallet id is starting with P instead of PID based on request from B.Hefley
            }
        }
    }, 300);
    eventReturn.eventHandled = true;
});


WLEvent.on("OnKey<E012>", function(eventEnter) {				// Enter Key - Interupted
    setTimeout(function(){
        var vTag = Screen.getText(2,6,20);
        var vCont = Screen.getText(3,6,20);
        var vConf = Screen.getText(5,6,20);
        var vType = Screen.getText(6,7,4);

        if (vCont.trim() === '') {
            if (vTag.trim() === '') {
                Device.errorBeep(400,200,50);
                View.toast("No Container or Tag", false);
            } else {
                if (vConf.substring(0, 4) === '0000') {
                    if (vConf.trim().length === 20) {
                        WLEvent.off("OnKey<000D>");
                        View.toast("vConf Passed", false);
                        Device.sendKeys("{f20}");
                    } else {
                        Device.errorBeep(400,200,50);
                        View.toast("Confirmation container must be 20 characters long", false);
                    }
                } else {
                    Device.errorBeep(400,200,50);
                    View.toast("Confirmation container must begin with 0000", false);
                }
            }
        } else {
            //Allow for the string to start with 'P' or 'T' & and be 12 characters long.
            if (vConf.substring(0, 1) === 'P' || vConf.substring(0, 1) === 'T') { //Request by Brandon H - BY
                //if (vConf.substring(0, 3) === 'PID') {
                if (vConf.trim().length === 12) {
                    if (vType === 'PALS') {
                        WLEvent.off("OnKey<000D>");
                        View.toast("vType = PALS", false);
                        Device.sendKeys("{f20}");
                    } else {
                        Device.errorBeep(400,200,50);
                        View.toast("Confirmation container type must be PALS", false);
                    }
                } else {
                    Device.errorBeep(400,200,50);
                    View.toast("Confirmation container must be 12 characters long", false);
                }
            } else {
                Device.errorBeep(400,200,50);
                View.toast("Confirmation container must begin with P", false);
                //View.toast("Confirmation container must begin with PID", false);
            }
        }
    }, 300);
    eventEnter.eventHandled = true;
});



