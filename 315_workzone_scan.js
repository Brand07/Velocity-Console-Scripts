
/*
Author: Brandon Yates
Date: 08/26/2024

This script will auto-enter after a scan on the 315 workzone screen.
The user can manually enter the workzone, but it will auto-enter
if they choose to scan it.
*/

function onScan(event) {
    setTimeout(function() {
        // Send an enter key after a scan after a 150ms delay
        Device.sendKeys("{return}");
    }, 150);
}