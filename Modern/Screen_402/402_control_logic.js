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
    // Tag field
    if (text1 === "402 " && row === 2){
        if(event.data.startsWith("T")) {
            View.toast("Tag Scanned");
            Device.sendKeys("{pause:300}{return}")

        }else{
            View.toast("Invalid Scan");
            event.data = "";
            Scanner.scanTerminator("NoAuto");
        }
    // Container field
    }else if(text1 ==="402 " && row === 3){
        if(event.data.startsWith("0000")){
            View.toast("Container Scanned");
            Device.sendKeys("{pause:300}{return}");
        }else{
            event.data = "";
            View.toast("Invalid Scan");
            Scanner.scanTerminator("NoAuto");
        }
    // 402a Relocate Screen
    }else if(text1 === "402a" && row === 11){
        if(event.data === ""){
            View.toast("No Scan Data");
            Scanner.scanTerminator("NoAuto");
        }else{
            Device.sendKeys("{pause:300}{return}");
        }
    }
}


WLEvent.on("Scan", onScan);