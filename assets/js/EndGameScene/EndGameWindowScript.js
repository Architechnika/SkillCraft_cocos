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
        achivement_delay: 2000,
        _counter: 0,
        _activeAchivementPageIndxes: [],
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.calcExp();
        this._counter = 0;
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
            cc.director._globalVariables.player_nLvlExp *= 3;
            cc.director._globalVariables.player_lvl++; //Повышаем уровень
            //При повышении уровня, повышаем и сложность лабиринта
            cc.director._globalVariables.currentLabSize += 2;
        }
        //Увеличиваем счетчик лабиринтов
        cc.director._globalVariables.player_totalLabs++;
        //Отображаем результаты на экране
        this._showResultsOnScreen();
        //Очищаем временные переменные
        cc.director._globalVariables.player_cellCounter = 0;
        cc.director._globalVariables.player_totalSeconds = 0;
        cc.director._globalVariables.player_totalBoxes = 0;
        cc.director._globalVariables.player_totalErrors = 0;
    },

    //Обработчик кнопок
    buttonEventHandler(event) {
        if (event.target.name == "nextButton") { //Переход на следующий уровень
            cc.director.loadScene("GameScene");
        } else if (event.target.name == "reloadButton") {
            this.reLoadSerrings();
            if(this.reLoadSerrings())
                cc.sys.localStorage.setItem("isNewGame", false)
            cc.director.loadScene("GameScene");
        }
    },
    //Отображает значения всех нужных переменных на экране(время пррохождения, ошибки, опыт и тд)
    _showResultsOnScreen(){
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
    },
    reLoadSerrings() {
        //функция, которая вызываеться когда идет перезагрузка уровня, она чистить те данные которые перезагружать не нужно
        if (cc.sys.localStorage.getItem("save"))
            this.saveData = JSON.parse(cc.sys.localStorage.getItem("save"));
        else return false;
        this.saveData.cellCounter = 0
        this.saveData.gExp = 0
        this.saveData.pLvlExp = 0
        this.saveData.nLvlExp = 0
        this.saveData.lvl = 1
        this.saveData.time = 0;
        this.saveData.arrayRoadGameObjectsNames = this.saveData.reLoadGameObjectsNames;
        this.saveData.arrayRoadCommandsNames = this.saveData.arrayBinRoad;
        //  this.saveData.totalBoxes = cc.director._globalVariables.player_totalBoxes;
        this.saveData.totalErrors = 0
        cc.sys.localStorage.setItem("save", JSON.stringify(this.saveData))
        return true;
    },
    //Проверка полученных ачивок
    _checkAchivements() {
        var allPages = this.pageview_achiv.getPages();
        for (var i = 0; i < allPages; i++) {
            var isRemove = false;
            switch (allPages[i].name) {
                case "page_noErrors":
                    if (cc.director._globalVariables.player_totalErrors > 0)
                        isRemove = true;
                    break;
                case "page_allBoxes":
                    break;
                case "page_shortWay":
                    break;
                case "page_firstTry":
                    break;
            }
            if (isRemove)
                this.pageview_achiv.removePage(allPages[i]);
        }
    },

    update(dt) {
        this._counter += dt * 1000;
        if (this._counter > this.achivement_delay) {
            this._counter = 0;
            //Рассчитываем индекс следующей странички
            var currIndx = this.pageview_achiv.getCurrentPageIndex();
            var lastIndx = this.pageview_achiv.getPages().length;
            currIndx = currIndx + 1 >= lastIndx ? 0 : currIndx + 1;
            //Перелистываем страничку в achivement pageView
            this.pageview_achiv.scrollToPage(currIndx, 2); //PageScrollTime
        }
    },
});
