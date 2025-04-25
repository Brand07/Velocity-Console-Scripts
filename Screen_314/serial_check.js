/*
This script applies to a screen that asks the user
to scan the serial number barcode of a product.
The barcode is a string of numbers that can be
between 8 and 9 characters long. The script checks
the length of the barcode and displays a message
if the barcode is too long or too short. The script
also checks if the barcode starts with a specific
character sequence and displays a message if it does.
The script also checks if the barcode contains any
special characters and displays a message if it does.
If the barcode passes all checks, the scan is allowed
to pass.

In this specific scenario, there are multiple barcodes
in the same scan vicinity. Essentially, this script
ensures that the correct barcode is scanned and captured.
*/

function onScan(event) {
    // Check the length of the data
    const length = event.data.length;
    Scanner.enable(false);

    // Check if the barcode length is greater than 9
    if (length > 9) {
        Device.beep(2000, 1000, 50);
        View.toast("Barcode is too long!");
        event.data = "";
        setTimeout(function() {
            // Enable the scanner after the delay
            Scanner.enable(true);
        }, 4000);

    }
    // Check if the barcode length is smaller than 8
    else if (length < 8) {
        Device.beep(2000, 1000, 50);
        View.toast("Barcode is too short!");
        event.data = "";
        setTimeout(function() {
            // Enable the scanner after the delay
            Scanner.enable(true);
        }, 4000);
    }
    // Check if the barcode starts with "0000"
    else if (event.data.startsWith("0000")) {
        Device.beep(2000, 1000, 50);
        View.toast("That's a container number.");
        event.data = "";
        setTimeout(function() {
            // Enable the scanner after the delay
            Scanner.enable(true);
        }, 4000);
        //return false;
    }

    else if (event.data.startsWith("1923")) {
        Device.beep(2000, 1000, 50);
        View.toast("That's a UPC number.");
        event.data = "";
        setTimeout(function() {
            // Enable the scanner after the delay
            Scanner.enable(true);
        }, 4000);
        
    }
    else if (event.data.startsWith("T")) {
        Device.beep(2000, 1000, 50);
        View.toast("That's a Tag number.");
        event.data = "";
        setTimeout(function() {
            // Enable the scanner after the delay
            Scanner.enable(true);
        }, 4000);
    }

    else if (event.data.startsWith("PLT")) {
        Device.beep(2000, 1000, 50);
        View.toast("That's a PLT number.");
        event.data = "";
        setTimeout(function() {
            // Enable the scanner after the delay
            Scanner.enable(true);
        }, 4000);
    }

    else if (event.data.startsWith("PID")) {
        Device.beep(2000, 1000, 50);
        View.toast("That's a PID number.");
        event.data = "";
        setTimeout(function() {
            // Enable the scanner after the delay
            Scanner.enable(true);
        }, 4000);
    }
    // Check if the barcode contains any special characters
    const specialChars = /[!@#$%^&*()_+={}|[\]\\';,.<>/?]/;
    if (specialChars.test(event.data)) {
        Device.beep(2000, 1000, 50);
        View.toast("Barcode contains special characters.");
        event.data = "";
        setTimeout(function() {
            // Enable the scanner after the delay
            Scanner.enable(true);
        }, 4000);
        //return false;
    }
    // If all checks pass, the barcode is valid
    //View.toast("Barcode is valid.");
    //return true;

    else { setTimeout(function() {
        // Enable the scanner after the delay
        Scanner.enable(true);
        }, 4000);
    }
}

// Example usage:
WLEvent.on("Scan", onScan);
