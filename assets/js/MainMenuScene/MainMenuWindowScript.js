/*
    Скрипт описывающий обработчики для всех элементов на экране главного меню
*/

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    onNewGameButtonClick(button) {
        if (button.currentTarget._name == "newGameButton") {
            cc.sys.localStorage.setItem("isNewGame",true)
            cc.director.loadScene("GameScene");
        }
    },
    
    onContinueButtonClick(button){
        console.log("Continue button pressed");
    },
    
    onSettingsButtonClick(button){
        console.log("Settings button pressed");
    },
    
    start() {

    },

});
