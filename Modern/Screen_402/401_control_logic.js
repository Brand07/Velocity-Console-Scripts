/*
Author: Brandon Yates
Date: 9/8/2025
Purpose: To give the user an option to return to the 402 screen after using 401.
*/

function sendToPrevScreen(event){
    var screenNumber = screen.GetText(0, 0, 4); //Screen Number
    var position = Screen.getCursorPosition(); // Get the cursor position
    var row = position.row(); // Get the cursor row from the cursor position

    /*
    Display a prompt box asking the user
    if they would like to be navigated
    back to the 402 screen. (Yes/No)
     */

    if(screenNumber === "401a" && row === 16){
        //Prompt the user here
    }
}
