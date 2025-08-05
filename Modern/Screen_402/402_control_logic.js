/*
Author: Brandon Yates
Date: 8/5/2025
Purpose: To speed the 402 -> 401 Process
*/


// REMEMBER TO DISABLE KEYBOARD INPUT

function onScan(event) {
    var text1 = Screen.getText(0,0,4); //
    var text2 = Screen.getText(); // 
    var position = Screen.getCursorPosition();
    var row = position.row;

    if (text1 === "402 " && row === 2){
        if (event.data.startsWith("T")){
            View.toast("Valid Tag");
            Device.sendKeys("{return");
        }else if(event.data.startsWith("0000") && row ===3){
            View.toast("Valid Cont.");
            Device.sendKeys("{return}");

        }else{
            View.toast("Invalid Scan.");
            Scanner.scanTerminator("NoAuto");
            event.data = "";
            return;
        }
            
    }
}


WLEvent.on("Scan", onScan);