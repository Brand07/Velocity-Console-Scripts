/*
The purpose of this script is to enforce the user to enter
a WorkZone instead of searching across all zones using
a wildcard character.

Author: Brandon Yates
Date: 9/23/2024
 */

// Define the workzones based upon position on the screen
var workZoneOne = Screen.getText(4,5,3);
var workZoneTwo = Screen.getText(5,5,3);
var workZoneThree = Screen.getText(6,5,3);
var workZoneFour = Screen.getText(7,5,3);
var workZoneFive = Screen.getText(8,5,3);