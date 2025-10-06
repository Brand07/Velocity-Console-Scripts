/*
Controls the login logic when scanning user credentials.
This is applied at the main login screen.
*/

function sendTab(delay = 300) {
  Device.sendKeys(`{pause:${delay}}{TAB}`);
}

function onScan(event) {
  if (event.data === "") {
    Scanner.scanTerminator("NoAuto");
    View.toast("Please scan your credentials");
  } else {
    sendTab();
  }
}

WLEvent.on("Scan", onScan);
