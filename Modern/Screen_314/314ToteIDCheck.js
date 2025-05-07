function onScan(event) {
    setTimeout(function () {
        if (event.data.startsWith("TOT") && event.data.length === 7) {
            setTimeout(function () {
                Device.sendKeys("{return}");
                //View.toast("Enter Key Sent");
            }, 100);
        } else {
            View.toast("Not a Tote ID or Invalid Length");
            event.data = "";
        }
    }, 200);
}

WLEvent.on("Scan", onScan);