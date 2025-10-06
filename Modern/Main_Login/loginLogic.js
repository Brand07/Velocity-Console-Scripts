/*
Controls the login logic when scanning user credentials.
This is applied at the main login screen.
*/

function onScan(event) {
  if (event.data === "") {
    Scanner.scanTerminator("NoAuto");
    View.toast("Please scan your credentials");
  } else {
    Device.sendKeys({ tab });
  }
}

WLEvent.on("Scan", onScan);
