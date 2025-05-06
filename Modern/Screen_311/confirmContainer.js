/*
Author - Brandon Yates
Date - 5-6-2025
Description - Runs a check on the scanned container to see if it matches the already captured container.
Screen - 311aClusterPick
 */

function onScan(event) {
    // Add a short delay before processing the scan
    setTimeout(function() {
        try {
            // Get the container value at scan time rather than at load time
            const capturedContainer = Screen.getText(8, 6, 20);

            if (!capturedContainer) {
                // Handle case where getText fails to retrieve data
                View.toast("Error: Unable to read container from screen");
                Device.beep(2000, 1000, 50); // Error beep
                return;
            }

            if (event.data !== capturedContainer) {
                // Container mismatch - negative feedback
                Device.beep(2000, 1000, 50); // Error beep
                View.toast("Container doesn't match!");
                Scanner.scanTerminator("NoAuto");

                // Don't modify event.data directly as it may be read-only
                // Instead just return without triggering further actions
            } else {
                // Container matches - positive feedback
                Device.beep(50, 100, 50); // Success beep
                View.toast("Container Validated!");

                // Send return key after successful validation
                setTimeout(function() {
                    Device.sendKeys("{return}");
                }, 100);
            }
        } catch (error) {
            // General error handling
            View.toast("Error validating container: " + error.message);
            Device.beep(2000, 1000, 50); // Error beep
        }
    }, 300); // 300ms delay before processing scan
}

// Register the scan event handler
WLEvent.on("Scan", onScan);