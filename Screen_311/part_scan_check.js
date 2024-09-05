/*
This script checks the part number scanned by the user.
The part number should either be the UPC (12 digits long) 
or the EAN (13 digits long) of the product. If the scanned
part number is neither of these, the script displays an
error message and prompts the user to rescan the barcode.
This is simillar to the serial_check.js script, but with
different length and format requirements.

Note: The keyboard input is disabled on this specific field
on the screen. The user can only scan the barcode to input.

8-15-2024
*/

function onScan(event) {
    // Check the length of the scanned data
    const length = event.data.length;

    // Check if the scanned data is < 12 or > 13 characters long
    if (length < 12 || length > 13) {
        Device.beep(50, 50, 50);
        View.toast("Please Scan a valid UPC or EAN number.");
        event.data = "";
    }
    
    else if (length === 12) {
        setTimeout(function () {
            //View.toast("Sending Enter Key");
            Device.beep(50, 50, 50)
            Device.sendKeys('{return}');
            //View.toast("Enter Key Sent");
        }, 100);
    }
    
        else if (length === 13) {
            setTimeout(function () {
                //View.toast("Sending Enter Key");
                Device.beep(50, 50, 50)
                Device.sendKeys('{return}');
                //View.toast("Enter Key Sent");
            }, 100);
        }
}

// Register the onScan function to handle scan events
WLEvent.on("Scan", onScan);