cc.Class({
    extends: cc.Component,

    properties: {
        _timeCounter: 0,
    },

    start() {
        if (cc.director._globalVariables.isToolTipActive) { //Если тултипы вообще включены
            this.node._isMouseEntered = false; //БУФЕР ДЛЯ ХРАНЕНИЯ ФЛАГА О ТОМ ЗАШЛА ЛИ МЫШКА В НОДУ ИЛИ НЕТ
            this.node._mousePos = cc.p(0, 0); //БУФЕР ДЛЯ ХРАНЕНИЯ КООРДИНАТ МЫШИ
            this.toolTipText = this._getToolTipData("rus"); //ИНИЦИАЛИЗИРУЕМ МАССИВ ТЕКСТА ТУЛТИПОВ В ЗАВИСИМОСТИ ОТ ПАРАМЕТРОВ НАСТРОЕК ЯЗЫКА
            //Добавляем обработчики событий мыши
            this.node.on(cc.Node.EventType.MOUSE_LEAVE, this._onLeaveMouseEvent);
            this.node.on(cc.Node.EventType.MOUSE_ENTER, this._onEnterMouseEvent);
            this.node.on(cc.Node.EventType.MOUSE_MOVE, this._onMouseMoveEvent);
            this.node.on(cc.Node.EventType.MOUSE_UP, this._onMouseUpEvent);
            this.node.on(cc.Node.EventType.MOUSE_DOWN, this._onLeaveMouseEvent);
        }
    },
    //Обработчики событий мыши
    _onEnterMouseEvent(event) {
        this._isMouseEntered = true;
    },

    _onLeaveMouseEvent(event) {
        //Сбрасываем счетчик и обнуляем флаг
        this._timeCounter = 0;
        this._isMouseEntered = false;
        cc.director._globalVariables.toolTipLabel.node.active = false;
    },

    //В этом скрипте нужен свой обработчик mouseUp потому что события мыши тут перехватываются и не доходят до нужной ноды(потому что робот, ящики и все кроме поля, это отдельные элементы)
    _onMouseUpEvent(event) {
        var isCall = false;
        //Если это обьект робота или ящика, то событие mouseUp надо пробросить на нужный элемент
        if (event.target.name == "gameObject_box") {
            //Если это ящик, то его parent и есть дорога на которую надо пробросить событие
            if (event.target.roadNode) {
                event.target = event.target.roadNode
                isCall = true;
            }
        } else if (event.target.name == "Player") {
            //Получаем ноду на которой стоит робот, ноду дороги
            var evNode = event.target.getComponent("PlayerScript")._currentFieldElement;
            event.target = evNode;
            isCall = true;
        }
        if (isCall) { //Если определились что надо пробросить событие на дорогу
            //Получаем скрипт этой ноды
            var evNodeScript = event.target.getComponent("RoadScript");
            //Вызываем обработчик клика по этой ноде
            evNodeScript._onRoadClick(event);
        }
    },

    _onMouseMoveEvent(event) {
        this._mousePos = cc.p(event._x, event._y); //ПРИ ДВИЖЕНИИ МЫШИ НАД НОДОЙ ПЕРЕЗАПИСЫВАЕМ БУФЕР КООРДИНАТ МЫШИ
    },
    //----------------------------------------------------------------------------------
    update(dt) {
        if (cc.director._globalVariables.isToolTipActive) { //Если тултипы вообще включены
            //Если флаг того что мышка над нодой true и тултип ещё не показан другой нодой
            if (this.node._isMouseEntered && !cc.director._globalVariables.toolTipLabel.node.active) {
                this._timeCounter += dt * 1000; //Отсчитываем милисекунды
                if (this._timeCounter > cc.director._globalVariables.toolTipDelay) { //Если прошло достаточно времени, то показываем тултип
                    //Показываем тултип
                    cc.director._globalVariables.toolTipLabel.string = this._getToolTipText(this.node);
                    cc.director._globalVariables.toolTipLabel.node.x = this.node._mousePos.x;
                    cc.director._globalVariables.toolTipLabel.node.y = this.node._mousePos.y;
                    cc.director._globalVariables.toolTipLabel.node.active = true;
                    //Сбрасываем счетчик и обнуляем флаг
                    this._timeCounter = 0;
                    this._isMouseEntered = false;
                }
            }
        }
    },

    //Возвращает нужный текст для тултипа в зависимости от типа и имени ноды
    _getToolTipText(node) {
        if (node.group == "Player") { //Сам робот
            return this.toolTipText.player;
        } else if (node.group == "Entry") { //Входы
            return this.toolTipText.entry;
        } else if (node.group == "Exit") { //Выходы
            return this.toolTipText.exit;
        } else if (node.group == "Wall") { //Стены
            return this.toolTipText.wall;
        } else if (node.group == "Road") { //Дороги
            return this.toolTipText.road;
        } else if (node.group == "GameObjects") { //Игровые обьекты
            if (node.name == "gameObject_box") //Ящики
                return this.toolTipText.box;
        }
        return this.toolTipText.error;
    },

    //Текст для тултипов всех элементов
    _getToolTipData(lang) {
        if (lang == "rus") { //РУССКИЙ ЯЗЫК
            return {
                player: "Это робот. Он выполняет команды на клетках. Для того чтобы он поехал нажми play",
                entry: "Это вход. На этой клетке робот начинает свой путь в лабиринте",
                exit: "Это выход. Сюда роботу нужно доехать",
                wall: "Это стена. При шаге в нее робот врезается и переносится на клетку входа",
                road: "Это дорога. По этим клеткам робот может двигаться до выхода",
                box: "Это ящики. Собирай их, чтобы набрать больше очков опыта",
                error: "Ошибка с тултипами, что-то пошло не так. Возможно программист забыл написать тултип для этого элемента",
            };
        } else {

        }
    }
});
