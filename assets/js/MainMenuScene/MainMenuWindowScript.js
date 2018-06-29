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
            cc.sys.localStorage.setItem("isNewGame", true);
            if (cc.director._globalVariables) {
                if (cc.director._globalVariables.currentLabSize) {
                    cc.director._globalVariables.currentLabSize = 3;
                    cc.director._globalVariables.player_totalLabs = 0;
                    cc.director._globalVariables.player_cellCounter = 0;
                    //Переменные связанные с уровнем робота-----------------------------------------------------
                    cc.director._globalVariables.player_gExp = 0; //Этот параметр будет загружен из сохранения
                    cc.director._globalVariables.player_pLvlExp = 0; //Количество опыта для предыдущего уровня
                    cc.director._globalVariables.player_nLvlExp = 100; //Количество опыта для следующего уровня
                    cc.director._globalVariables.player_lvl = 1;
                    //------------------------------------------------------------------------------------------
                    cc.director._globalVariables.player_totalSeconds = 0; //Время которое потребовалось роботу для прохождения лабиринта
                    cc.director._globalVariables.player_totalBoxes = 0;
                    cc.director._globalVariables.player_totalErrors = 0;
                    cc.director._globalVariables.player_totalLabs = 0;
                }
            }
            cc.director.loadScene("GameScene");
        }
    },

    onContinueButtonClick(button) {
        cc.sys.localStorage.setItem("isNewGame", false)
        cc.director.loadScene("GameScene");
    },

    onSettingsButtonClick(button) {
        cc.director.loadScene("SettingsScene");
    },

    start() {

    },

});
