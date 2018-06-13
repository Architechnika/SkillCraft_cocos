/*
    Скрипт описывающий обработчики для всех элементов на экране прохождения уровня
*/


cc.Class({
    extends: cc.Component,

    properties: {},

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.calcExp();
        cc.director.loadScene("GameScene");
    },
    
    //Рассчитывает прирост опыта из глобальных статических параметров
    calcExp() {
        cc.director._globalVariables.player_cellCounter = 0;
        cc.director._globalVariables.player_gExp = 0; //Этот параметр будет загружен из сохранения
        cc.director._globalVariables.player_totalSeconds = 0; //Время которое потребовалось роботу для прохождения лабиринта
        cc.director._globalVariables.player_totalBoxes = 0;
    }
    // update (dt) {},
});
