/*
Author: Brandon Yates
Date: 10/8/2025
Purpose: A check to ensure that the scan data in the 'SKID' field starts with 'PLB'
*/

function onScan(event) {
  if (!event.data.startsWith("PLB")) {
    View.toast("Invalid scan data");
    //Interrupt the scan and do not pass the value.
    Scanner.scanTerminator("NoAuto");
    event.data = "";
  } else {
    View.toast("Valid scan data");
  }
}

WLEvent.on("Scan", onScan);
