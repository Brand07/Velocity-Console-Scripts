/*
Purpose: A single file to control all of the scan checks for the Pick devices
Date: 8/13/2025
*/


//Function to check the container number
function checkContainer(scan_data){
    if(scan_data.length === 20 && scan_data.startsWith("0000")){
        return(scan_data);
    }else{
        Device.beepPlayFile("not_correct_container.mp3");
    }
}

//Function to check the screen name
function checkScan(event){
    var screenNumber = Screen.getText(0, 0, 4); //Get the screen number
    var position = Screen.getCursorPosition(); // Get the cursor position
    var row = position.row; //Get the current row

    //311 Cluster Bld/Rls
    if(screenNumber === "311 " && row === 10){
       var container = checkContainer(event.data);
       if(container){
        View.toast("Container Validated!");
       }else{
        event.data = "";
        View.toast("Container Not Validated!");
       }
    }
}