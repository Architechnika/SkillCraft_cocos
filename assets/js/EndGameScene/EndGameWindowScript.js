/*
    Скрипт описывающий обработчики для всех элементов на экране прохождения уровня
*/


cc.Class({
    extends: cc.Component,

    properties: {
        label_time: cc.Label,
        label_totalLabs: cc.Label,
        label_level: cc.Label,
        label_errors: cc.Label,
        pageview_achiv: cc.PageView,
        progress_exp: cc.ProgressBar,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.calcExp();
    },

    //Рассчитывает прирост опыта из глобальных статических параметров
    calcExp() {

        var maxC = cc.director._globalVariables.currentLabSize * 2; //Просчитываем максимально допустимое для бонуса количество клеток
        if (cc.director._globalVariables.player_totalBoxes == 0) cc.director._globalVariables.player_totalBoxes = 1;
        //Рассчитываем дискрет опыта
        var diff = ((cc.director._globalVariables.player_totalBoxes * cc.director._globalVariables.player_cellCounter) / cc.director._globalVariables.player_totalSeconds) * 100;
        if (cc.director._globalVariables.player_totalErrors == 0) { //Если лабиринт пройден без ошибок, то применяем бонусы
            //Если лабиринт пройден оптимальным способом, то увеличивыаем дискрет опыта в два раза
            diff *= cc.director._globalVariables.player_cellCounter > maxC ? 1 : 2;
        } else diff *= cc.director._globalVariables.player_totalErrors < 10 ? (cc.director._globalVariables.player_totalErrors / 10) : 0; //Если ошибки были, то уменьшаем опыт

        cc.director._globalVariables.player_gExp += diff;
        if (cc.director._globalVariables.player_gExp >= cc.director._globalVariables.player_nLvlExp) {
            cc.director._globalVariables.player_pLvlExp = cc.director._globalVariables.player_nLvlExp;
            cc.director._globalVariables.player_nLvlExp *= 1.5;
            cc.director._globalVariables.player_lvl++; //Повышаем уровень
            //При повышении уровня, повышаем и сложность лабиринта
            cc.director._globalVariables.currentLabSize += 2;
        }
        //Увеличиваем счетчик лабиринтов
        cc.director._globalVariables.player_totalLabs++;
        //Отображаем результаты на экране
        var secS = cc.director._globalVariables.player_totalSeconds;
        var sec = Math.floor(secS % 60);
        var min = Math.floor(secS / 60);
        var text = (min < 10 ? "0" + min : min) + ":" + (sec < 10 ? "0" + sec : sec);
        this.label_time.string = text;
        this.label_totalLabs.string = cc.director._globalVariables.player_totalLabs;
        this.label_level.string = cc.director._globalVariables.player_lvl;
        this.label_errors.string = cc.director._globalVariables.player_totalErrors;
        var onePerc = (cc.director._globalVariables.player_nLvlExp - cc.director._globalVariables.player_pLvlExp) / 100;
        var gExp_perc = (cc.director._globalVariables.player_gExp - cc.director._globalVariables.player_pLvlExp) / onePerc;
        this.progress_exp.progress = gExp_perc / 100;
        //Очищаем временные переменные
        cc.director._globalVariables.player_cellCounter = 0;
        cc.director._globalVariables.player_totalSeconds = 0;
        cc.director._globalVariables.player_totalBoxes = 0;
        cc.director._globalVariables.player_totalErrors = 0;
    },
    
    //Обработчик кнопок
    buttonEventHandler(event) {
        if (event.target.name = "nextButton") { //Переход на следующий уровень
            cc.director.loadScene("GameScene");
        } else if (event.target.name = "reloadButton") {
            cc.director.loadScene("GameScene");
        }
    },

    update (dt) {
    },
});
