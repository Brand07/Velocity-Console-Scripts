//View.toast("Script Loaded..")

function onScan(event) {
    // Screen validation
    var text1 = Screen.getText(0, 0, 16);
    var text2 = Screen.getText(2, 0, 4);
    var text3 = Screen.getText(15, 0, 17);

    //View.toast("text1: '" + text1 + "'", true);
    //View.toast("text2: '" + text2 + "'", true);
    //View.toast("text3: '" + text3 + "'", true);

    if (text1 === "311 Cluster Pick" && text2 === "FLoc" && text3 === "Confirm Pick From") {
        // Normalize symbology type
        var type = event.type.replace(/[_\s]/g, "").toUpperCase();
        View.toast("Symbology: " + type, true);

        // Check if it's a QR code
        if (type !== "QRCODE") {
            View.toast("Not a QR code: " + type, true);
            return;
        }

        View.toast("Raw Data: " + event.data, true);

        // Extract data after SKU: and before a line break, space, or end of string
        var skuMatch = event.data.match(/SKU[:\s]*([A-Za-z0-9\-]+)/i);
        if (skuMatch && skuMatch[1]) {
            var sku = skuMatch[1].trim();
            event.data = sku;
            View.toast("SKU: " + sku, true);
            Logger.debug("Extracted SKU: " + sku);
        } else {
            View.toast("Unable to extract SKU...");
            Logger.warn("Could not extract SKU after SKU:");
            return;
        }

        Logger.debug("Scan - Replace - Script Ending: Event = " + JSON.stringify(event));
    } else {
        View.toast("Screen validation failed", true);
    }
}

// Register the scan handler
WLEvent.on("Scan", onScan);