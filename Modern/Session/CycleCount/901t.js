/*
Purpose: Checks the tag scan; only allowing tags to start with "T", "R", or "U". Deny everything else.
*/

const validChars = ["T", "R", "U"];

function onScan(event){
    // Define the screen
    var screenNumber = Screen.getText(0, 0, 4); // Get the screen number
    var position = Screen.getCursorPosition(); // Get the cursor position
    var row = position.row; // Get the current row

    if(screenNumber === "901t" && row === 4){
        if(validChars.includes(event.data.charAt(0))){
            Device.sendKeys("{pause:300}{return}");
            View.toast("Tag Validated!");
        } else {
            event.data = ""; //Clear the scan data.
            Device.playBeepFile("invalid_tag.mp3"); //Play an audio cue
            View.toast("Invalid Tag");
        }
    }
        
}

WLEvent.on("Scan", onScan);

