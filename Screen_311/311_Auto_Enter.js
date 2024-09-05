function onScan(event) {
    setTimeout(function () {
        //View.toast("Sending Enter Key");
        Device.sendKeys('{return}');
        //View.toast("Enter Key Sent");
    }, 100);
}

WLEvent.on("Scan", onScan);