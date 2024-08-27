function onScreenLoad(event) {
 setTimeout(function() {
  Device.sendKeys("1");
 }, 150); // 150ms delay
}

// Register the onScreenLoad function to handle the screen load event
WLEvent.on("ScreenLoad", onScreenLoad);