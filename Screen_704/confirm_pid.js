/*
The purpose of this script is to ensure that the
user is scanning the PID when confirming what
pallet they have placed product on.

9-11-2024
Brandon
 */
//Toast message for debugging
View.toast("Confirm we are in the right spot.")

//Create a function to parse the PID scan
function onScan(event) {
    //Check the length of the scanned data
    const length = event.data.length;

    //Check if the scanned data starts with "PID"
    //and that it is exactly 12 characters
    if (!event.data.startsWith("PID"))
    {
        View.toast("That's not a PID");
        Device.beep(1000, 500, 50);
        event.data="";
    }

    else if (length !== 12)
    {
        View.toast("Was that a PID?")
    }


}