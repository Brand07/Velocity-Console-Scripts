function onScan(event) {
    if (event.data.startsWith("TOT") && event.data.length === 7) {
        View.toast("Valid Tote ID Scanned.");
        Device.sendKeys("{return}");
    }else{
        event.data = "";
        View.toast("Invalid Tote ID.");
        Scanner.scanTerminator("NoAuto");
    }
}


WLEvent.on("Scan", onScan);