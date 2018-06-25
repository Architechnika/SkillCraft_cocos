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
        achivement_delay: 3000, //Задержка с которой сменяются ачивки на экране
        anim_delayTime: 3000, //Время на анимацию времени с опытом
        anim_delayTotal: 250, //Время на анимацию всего лабиринтов пройдено
        anim_delayErrs: 1000, //Время на анимацию ошибок допущено
        _expK: 3, //Коэффициент прироста опыта - во сколько раз увеличивается необъходимое количество опыта для повышение уровня при каждом повышении уровня
        _counter: 0, //Счетчик времени
        _animTimeShowed: false, //Флаг анимации времени прохождения
        _animTotalLabsShowed: false, //Флаг анимации всего лабиринтов пройдено
        _animErrsShowed: false, //Флаг анимации ошибок допущено
        _animTimeBuff: 0, //Буфер для анимации времени прохождения
        _animErrsBuff: 0, //Буфер для анимации ошибок
        _diffExp: 0, //Буфер для хранения прироста опыта
        _diffExpConst: 0, //Буфер хранящий эталонное количество опыта которое прирастает
        _errorExp: 0, //Количество опыта которое вычитаетс когда есть ошибки(рассчитывается в calcExp)
        _errorExpConst: 0, //Буфер хранящий эталонное количество опыта которое вычитается из-за ошибок
        _totalLabsBuff: 0, //Буфер для хранения всего лабиринтов пройдено
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.calcExp();
        this._counter = 0;
    },

    //Обработчик кнопок
    buttonEventHandler(event) {
        if (event.target.name == "nextLevelButton") { //Переход на следующий уровень
            //Очищаем временные переменные
            cc.director._globalVariables.player_cellCounter = 0;
            cc.director._globalVariables.player_totalSeconds = 0;
            cc.director._globalVariables.player_totalBoxes = 0;
            cc.director._globalVariables.player_totalErrors = 0;
            cc.director._globalVariables.player_totalTry = 0;
            if (this.getComponent("EndGameWindowScript")._errorExp !== 0) { //Если отрицательный опыт остался надо его применить(это происходит если пользователь не досмотрел анимации)
                this._setExp(this.getComponent("EndGameWindowScript")._errorExp);
            }
            if (this.getComponent("EndGameWindowScript")._diffExp > 0) {
                //Применяем прирост опыта
                this._setExp(this.getComponent("EndGameWindowScript")._diffExp);
            }
            cc.director.loadScene("GameScene");
        } else if (event.target.name == "reloadLevelButton") {
            if (this.reLoadSettings())
                cc.sys.localStorage.setItem("isNewGame", false)
            cc.director.loadScene("GameScene");
        }
    },
    //Функция, которая вызывается когда идет перезагрузка уровня, она чистит те данные которые перезагружать не нужно
    reLoadSettings() {
        if (cc.sys.localStorage.getItem("save"))
            this.saveData = JSON.parse(cc.sys.localStorage.getItem("save"));
        else return false;
        cc.director._globalVariables.player_cellCounter = 0;
        cc.director._globalVariables.player_totalSeconds = 0;
        cc.director._globalVariables.player_totalBoxes = 0;
        cc.director._globalVariables.player_totalErrors = 0;
        cc.director._globalVariables.player_totalTry = 0;
        this.saveData.cellCounter = 0
        this.saveData.gExp = this.saveData.reLoadGExp
        this.saveData.pLvlExp = this.saveData.reLoadPLvlExp
        this.saveData.nLvlExp = this.saveData.reLoadNLvlExp
        this.saveData.lvl = this.saveData.reLoadLvl
        this.saveData.time = 0;
        this.saveData.arrayRoadGameObjectsNames = this.saveData.reLoadGameObjectsNames;
        this.saveData.arrayRoadCommandsNames = this.saveData.arrayBinRoad;
        this.saveData.totalErrors = 0;
        this.saveData.totalLabs = this.saveData.reLoadTotalLabs;
        this.saveData.totalBoxes = this.saveData.reLoadTotalBoxes;
        cc.sys.localStorage.setItem("save", JSON.stringify(this.saveData))
        return true;
    },

    //Рассчитывает прирост опыта из глобальных статических параметров
    calcExp() {
        var maxC = cc.director._globalVariables.currentLabSize * 2; //Просчитываем максимально допустимое для бонуса количество клеток
        var totalB = cc.director._globalVariables.player_totalBoxes == 0 ? 1 : cc.director._globalVariables.player_totalBoxes;
        //Рассчитываем дискрет опыта
        this._diffExp = ((totalB * cc.director._globalVariables.player_cellCounter) / cc.director._globalVariables.player_totalSeconds) * 100;
        if (cc.director._globalVariables.player_totalErrors == 0) { //Если лабиринт пройден без ошибок, то применяем бонусы
            //Если лабиринт пройден оптимальным способом, то увеличивыаем дискрет опыта в два раза
            this._diffExp *= cc.director._globalVariables.player_cellCounter > maxC ? 1 : 2;
        } else {
            //this._diffExp *= cc.director._globalVariables.player_totalErrors < 10 ? (cc.director._globalVariables.player_totalErrors / 10) : 0; //Если ошибки были, то уменьшаем опыт
            //Расчитываем дискрет отрицательного опыта от количества допущенных ошибок
            this._errorExp = cc.director._globalVariables.player_gExp * (cc.director._globalVariables.player_totalErrors < 10 ? (cc.director._globalVariables.player_totalErrors / 10) : 1);
            this._errorExp *= -1;
            this._errorExpConst = this._errorExp;
        }
        this._totalLabsBuff = cc.director._globalVariables.player_totalLabs; //Запоминаем сколько лабиринтов пройдено
        this._diffExpConst = this._diffExp;
        this._checkAchivements();
    },

    //Проверка полученных ачивок
    _checkAchivements() {
        //Если ошибки были допущены - то удаляем ачивку БЕЗ ОШИБОК
        if(cc.director._globalVariables.player_totalErrors !== 0){
            this._deleteAchivFromPageView("page_noErrors");
        }
        //Если собраны не все ящики - то удаляем ачивку СОБРАНЫ ВСЕ ЯЩИКИ
        if(cc.director._globalVariables.totalBoxesOnMap !== cc.director._globalVariables.player_totalBoxes){
            this._deleteAchivFromPageView("page_allBoxes");
        }
        //Если лабиринт пройден не оптимальным способом - то удаляем ачивку КРАТЧАЙШИЙ ПУТЬ
        if(cc.director._globalVariables.player_cellCounter >= (cc.director._globalVariables.currentLabSize * 2)){
            this._deleteAchivFromPageView("page_shortWay");
        }
        //Если лабиринт пройден не за одну попытку - то удаляем ачивку С ПЕРВОГО РАЗА
        if(cc.director._globalVariables.player_totalTry > 1){
            this._deleteAchivFromPageView("page_firstTry");
        }
        //Если ачивки вообще есть - то удаляем ачивку БЕЗ АЧИВКИ
        if(this.pageview_achiv.getPages().length > 1){
            this._deleteAchivFromPageView("page_noAchiv");
        }
    },
    //Удаляет ачивку из pageview_achiv
    _deleteAchivFromPageView(name){
        var allPages = this.pageview_achiv.getPages();
        for(var i = 0 ; i < allPages.length; i++){
            if(allPages[i].name == name){
                this.pageview_achiv.removePage(allPages[i]);
                break;
            }
        }
    },
    
    //Функция обработчик для добавления опыта(и его вычитания)
    _setExp(diff) {
        //Если опыт игрока на первом уровне не применяем отрицательный дискрет
        if (diff < 0 && cc.director._globalVariables.player_gExp <= 100) return;

        cc.director._globalVariables.player_gExp += diff;
        if (cc.director._globalVariables.player_gExp >= cc.director._globalVariables.player_nLvlExp) { //Если уровень поднялся
            cc.director._globalVariables.player_pLvlExp = cc.director._globalVariables.player_nLvlExp;
            cc.director._globalVariables.player_nLvlExp *= this._expK;
            cc.director._globalVariables.player_lvl++; //Повышаем уровень
            //При повышении уровня, повышаем и сложность лабиринта
            cc.director._globalVariables.currentLabSize += 2;
        } else if (cc.director._globalVariables.player_gExp < cc.director._globalVariables.player_pLvlExp) { //Если уровень опустился
            cc.director._globalVariables.player_nLvlExp = cc.director._globalVariables.player_pLvlExp;
            cc.director._globalVariables.player_pLvlExp = cc.director._globalVariables.player_pLvlExp > 100 ? cc.director._globalVariables.player_pLvlExp / this._expK : 0;
            cc.director._globalVariables.player_lvl--; //Понижаем уровень
            //При понижении уровня, понижаем и сложность лабиринта
            cc.director._globalVariables.currentLabSize -= 2;
        }
    },

    update(dt) {
        this._counter += dt * 1000;
        if (!this._makeAnimStep()) {
            if (this._counter > this.achivement_delay) {
                this._counter = 0;
                //Рассчитываем индекс следующей странички
                var currIndx = this.pageview_achiv.getCurrentPageIndex();
                var lastIndx = this.pageview_achiv.getPages().length;
                currIndx = currIndx + 1 >= lastIndx ? 0 : currIndx + 1;
                //Перелистываем страничку в achivement pageView
                this.pageview_achiv.scrollToPage(currIndx, 2); //PageScrollTime
            }
        }
    },

    //Функция выполняет шаг анимации прогресса на окне. Вызывается в update
    //возвращает false если анимация закончена, true - если анимация продолжается
    //Работает по счетчику _counter. 
    _makeAnimStep() {
        if (!this._animTimeShowed) { //-----------------------------------КОД АНИМАЦИИ ВРЕМЕНИ И ПРИРОСТА ОПЫТА
            var ticks = this.anim_delayTime / 40; //Считаем количество тиков
            var time_step = cc.director._globalVariables.player_totalSeconds / ticks; //Считаем шаг прироста времени
            var exp_step = this._diffExpConst / ticks; //Считаем шаг прироста опыта
            //Прибавляем время
            this._animTimeBuff = this._animTimeBuff + time_step > cc.director._globalVariables.player_totalSeconds ? cc.director._globalVariables.player_totalSeconds : this._animTimeBuff + time_step;
            //Проверяем, если осталось опыта меньше чем шаг, то меняем шаг на эту величину
            exp_step = this._diffExp - exp_step < 0 ? this._diffExp : exp_step;
            //Применяем прирост опыта
            this._setExp(exp_step);
            this._diffExp -= exp_step;
            //Выводим параметры на экран
            this._showResultsOnScreen(this._animTimeBuff,
                cc.director._globalVariables.player_totalLabs,
                cc.director._globalVariables.player_lvl,
                undefined, //
                cc.director._globalVariables.player_pLvlExp,
                cc.director._globalVariables.player_nLvlExp,
                cc.director._globalVariables.player_gExp);
            if (this._counter >= this.anim_delayTime) { //Если время на анимацию прироста опыта и времени вышло
                //Выводим параметры на экран
                this._showResultsOnScreen(cc.director._globalVariables.player_totalSeconds,
                    cc.director._globalVariables.player_totalLabs,
                    cc.director._globalVariables.player_lvl,
                    undefined,
                    cc.director._globalVariables.player_pLvlExp,
                    cc.director._globalVariables.player_nLvlExp,
                    cc.director._globalVariables.player_gExp);
                this._counter = 0;
                this._animTimeShowed = true;
            }
            return true;
        } else if (!this._animTotalLabsShowed) { //-------------------------------КОД АНИМАЦИИ ВСЕГО ЛАБИРИНТОВ ПРОЙДЕНО
            if (this._totalLabsBuff == cc.director._globalVariables.player_totalLabs) {
                //Увеличиваем счетчик лабиринтов
                cc.director._globalVariables.player_totalLabs++;
                //Выводим количество пройденных лабиринтов на экран
                this._showResultsOnScreen(undefined, cc.director._globalVariables.player_totalLabs);
            }
            if (this._counter >= this.anim_delayTotal) { //Время на анимацию вышло
                this._counter = this.anim_delayErrs;
                this._animTotalLabsShowed = true;
            }
            return true;
        } else if (!this._animErrsShowed && cc.director._globalVariables.player_totalErrors > 0) { //----------------------------КОД АНИМАЦИИ ОШИБОК ДОПУЩЕНО
            if (this._counter >= this.anim_delayErrs) { //Если пришло время показать анимацию
                if (this._animErrsBuff < cc.director._globalVariables.player_totalErrors) { //Ещё не вся анимация выведена то выводим
                    this._animErrsBuff++; //Увеличиваем счетчик
                    //Применяем отрицательный эффект к опыту
                    var exp_step = this._errorExpConst / cc.director._globalVariables.player_totalErrors;
                    //Применяем уменьшение опыта
                    this._setExp(exp_step);
                    this._errorExp -= exp_step;
                    this._showResultsOnScreen(undefined, undefined, //Отображаем на экране
                        cc.director._globalVariables.player_lvl,
                        this._animErrsBuff,
                        cc.director._globalVariables.player_pLvlExp,
                        cc.director._globalVariables.player_nLvlExp,
                        cc.director._globalVariables.player_gExp);
                } else {
                    this._animErrsShowed = true;
                }
                this._counter = 0;
            }

            return true;
        }
        return false;
    },

    //Отображает значения всех нужных переменных на экране(время пррохождения, ошибки, опыт и тд)
    _showResultsOnScreen(time, pTotalLabs, pLvl, pTotalErrs, pPLvlExp, pNLvlExp, pGExp) {
        if (time !== undefined) {
            var secS = time;
            var sec = Math.floor(secS % 60);
            var min = Math.floor(secS / 60);
            var text = (min < 10 ? "0" + min : min) + ":" + (sec < 10 ? "0" + sec : sec);
            this.label_time.string = text;
        }
        if (pTotalLabs !== undefined) {
            this.label_totalLabs.string = pTotalLabs; //Сколько всего лабиринтов пройдено   
        }
        if (pLvl !== undefined) {
            this.label_level.string = pLvl; //Уровень игрока   
        }
        if (pTotalErrs !== undefined) {
            this.label_errors.string = pTotalErrs; //Всего ошибок допущено при прохождении   
        }
        if (pPLvlExp !== undefined && pNLvlExp !== undefined && pGExp !== undefined) {
            var onePerc = (pNLvlExp - pPLvlExp) / 100; //Дискрет опыта для прогрессБара(1%)
            var gExp_perc = (pGExp - pPLvlExp) / onePerc; //Рассчитываем сколько опыта у игрока в процентах
            this.progress_exp.progress = gExp_perc / 100; //Выводим проценты на прогресс бар   
        }
    },
});
