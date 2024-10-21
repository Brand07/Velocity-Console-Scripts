function onScan(event) {
    setTimeout(function() {
        Device.sendKeys("{return}");
    }, 250);
}