function onScan(event) {
    setTimeout(function () {
        if (event.data === "") {
            View.toast("Please scan the container number.");
            Scanner.scanTerminator("NoAuto");
            return;
        }

        if (event.data.startsWith("0000") &&
            event.data.length === 20 &&
            screenNumber === "311" &&
            position.row === 10) {

            Scanner.scanTerminator("AutoEnter");
            // Send return key after a short delay
            Device.sendKeys("{return}");
        } else {
            // If the scan data is not valid, clear it
            event.data = "";
            Scanner.scanTerminator("NoAuto");
            View.toast("Not a container number");
        }
    }, 1000);
}