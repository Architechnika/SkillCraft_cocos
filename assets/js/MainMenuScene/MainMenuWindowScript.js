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
            cc.sys.localStorage.setItem("isNewGame",true);
            if(cc.director._globalVariables){
                if(cc.director._globalVariables.currentLabSize)
                    cc.director._globalVariables.currentLabSize = 3;
            }
            cc.director.loadScene("GameScene");
        }
    },
    
    onContinueButtonClick(button){
        cc.sys.localStorage.setItem("isNewGame",false)
        cc.director.loadScene("GameScene");
        console.log("Continue button pressed");
    },
    
    onSettingsButtonClick(button){
        console.log("Settings button pressed");
    },
    
    start() {

    },

});
