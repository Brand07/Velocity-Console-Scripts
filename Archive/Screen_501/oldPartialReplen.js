//0,0,3 = "501"
//14,0,5 = "Conf:"
//15,0,17 = "Confirm Repl From"
//10,6,7 = Quantity to replenish
//10,18,7 = load quantity for item

//-------------------------------------------
var text1 = Screen.getText(0, 0, 3);
var text2 = Screen.getText(14, 0, 5);
var text3 = Screen.getText(15, 0, 17);
var text4 = Screen.getText(10,6,7);
var text5 = Screen.getText(10,18,7);
var position= Screen.getCursorPosition();

if(text1 === "501" && text2 === "Conf:" && text3 === "Confirm Repl From" && position.row === 14 && (parseInt(text4)<parseInt(text5)))

{
    Device.beep(2000,1000,50);
    //View.toast('Attention, partial quantity being replenished!!!', true);
    Prompt.prompt("Attention","This is a partial replenishtment!",'' ,null,function (message) {
        if(message) {
            View.toast(message, false);
        }})

};
