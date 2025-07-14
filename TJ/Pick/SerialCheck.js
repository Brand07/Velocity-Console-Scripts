function onScan(event) {
    var text1 = Screen.getText(0, 0, 14); //Serial Capture

    if (text1 === "Serial Capture") {
        var type = event.type.replace(/[_\s]/g, "").toUpperCase();
        setTimeout(function() {
            if (type === "QRCODE") {
                Device.sendKeys("{return}");
            } else {
                // Check for N##AA### pattern
                var pattern = /^[0-9][A-Z0-9]{2}[A-Z]{2}[A-Z0-9]{3}$/;
                if (pattern.test(event.data)) {
                    Device.sendKeys("{return}")
                } else {
                    event.data = "";
                    
                    Prompt.promptOptions("Alert!","Not a Valid Serial #", "Okay|Close");
                }
            }
        }, 100);
    }
}

WLEvent.on("Scan", onScan);