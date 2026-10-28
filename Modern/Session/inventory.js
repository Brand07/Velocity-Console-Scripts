/*
Date: 10/28/2026
Purpose: Controls all of the logic for the 900 series screens for inventory counting.
*/

// Variables

var screenNumber = Screen.getText(0, 0, 4);
var position = Screen.getCursorPosition();
var row = position.row;

// END Variables

//Custom functions for remapping methods

function showMessage(message) {
    View.toast(message);
}

function disableScanner() {
    //Disable the scanner for 1 second
    Scanner.enable(false);
    setTimeout(function (){
        Scanner.enable(true);
    }, 1000);
}

function sendEnter(delay=300) {
    Device.sendKeys(`{pause:${delay}}{return}`)
}

function sendTab(delay=300) {
    Device.sendKeys(`{pause:${delay}}{tab}`)
}

