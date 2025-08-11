/*
Purpose: Play sounds depending on the screen/scenario. The idea is to get the attention of the operator with audio cues/warnings.
*/


function playSound(sound) {
    Device.beepPlayFile(sound);
}


var screenText = screen.GetText();

if(screenText(3,0,12) === "2160.1.01016") {
    playSound("no_override_allowed.mp3");
}