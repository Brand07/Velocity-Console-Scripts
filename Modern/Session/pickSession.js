/*
Purpose: A single file to cotrol all of the scan checks for the Pick devices
Date: 8/13/2025
*/

//Function to check the screen name

function checkScan(event){
    var screenNumber = Screen.getText(0, 0, 4); //Get the screen number
    var position = Screen.getCursorPosition(); // Get the cursor position
    var row = position.row; //Get the current row

    //311 Cluster Bld/Rls
    if(screenNumber === "311 " && row === 10)
}