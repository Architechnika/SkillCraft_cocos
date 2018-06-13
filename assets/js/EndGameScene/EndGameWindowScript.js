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

        var maxC = cc.director._globalVariables.currentLabSize * 2; //Просчитываем максимально допустимое для бонуса количество клеток
        if(cc.director._globalVariables.player_totalBoxes == 0) cc.director._globalVariables.player_totalBoxes = 1;
        //Рассчитываем дискрет опыта
        var diff = ((cc.director._globalVariables.player_totalBoxes * cc.director._globalVariables.player_cellCounter) / cc.director._globalVariables.player_totalSeconds) * 100;
        if (cc.director._globalVariables.player_totalErrors == 0) {//Если лабиринт пройден без ошибок, то применяем бонусы
            //Если лабиринт пройден оптимальным способом, то увеличивыаем дискрет опыта в два раза
            diff *= cc.director._globalVariables.player_cellCounter > maxC ? 1 : 2;
        } else diff *= cc.director._globalVariables.player_totalErrors < 10 : (cc.director._globalVariables.player_totalErrors / 10) : 0;//Если ошибки были, то уменьшаем опыт
        console.log("DIFF: " + diff);
        cc.director._globalVariables.player_gExp += diff;
        if (cc.director._globalVariables.player_gExp >= cc.director._globalVariables.player_nLvlExp) {
            cc.director._globalVariables.player_pLvlExp = cc.director._globalVariables.player_nLvlExp;
            cc.director._globalVariables.player_nLvlExp *= 2;
            cc.director._globalVariables.player_lvl++; //Повышаем уровень
            //При повышении уровня, повышаем и сложность лабиринта
            cc.director._globalVariables.currentLabSize += 2;
        }
        //Очищаем временные переменные
        cc.director._globalVariables.player_cellCounter = 0;
        cc.director._globalVariables.player_totalSeconds = 0;
        cc.director._globalVariables.player_totalBoxes = 0;
        cc.director._globalVariables.player_totalErrors = 0;
    }
    // update (dt) {},
});
