// 0,0,3   = "501"
// 14,0,5  = "Conf:"
// 15,0,17 = "Confirm Repl From"
// 10,6,7  = Quantity to replenish
// 10,18,7 = Load quantity for item
//-------------------------------------------

var text1 = Screen.getText(0, 0, 3).trim();
var text2 = Screen.getText(14, 0, 5).trim();
var text3 = Screen.getText(15, 0, 17).trim();
var text4 = Screen.getText(10, 6, 7).trim();
var text5 = Screen.getText(10, 18, 7).trim();

var position = Screen.getCursorPosition();

if (
    text1 === "501" &&
    text2 === "Conf:" &&
    text3 === "Confirm Repl From" &&
    position.row === 14 &&
    parseInt(text4, 10) < parseInt(text5, 10)
) {
    Device.beep(2000, 1000, 50);

    Prompt.promptOptions(
        "Alert",
        "This is a partial replenishment!",
        "OK|CLOSE",
        function (result) {
            if (result === "OK" || result === "CLOSE") {
                Device.errorBeep(25, 25, 20);
            }
        }
    );
}
