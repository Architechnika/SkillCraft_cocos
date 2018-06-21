cc.Class({
    extends: cc.Component,

    properties: {
        _timeCounter: 0,
    },

    start() {

        this.node._isMouseEntered = false; //БУФЕР ДЛЯ ХРАНЕНИЯ ФЛАГА О ТОМ ЗАШЛА ЛИ МЫШКА В НОДУ ИЛИ НЕТ
        this.node._mousePos = cc.p(0, 0); //БУФЕР ДЛЯ ХРАНЕНИЯ КООРДИНАТ МЫШИ
        this.node._showSelectingItem = this._showSelectingItem;
        this.node._hideSelectingItem = this._hideSelectingItem;
        this.toolTipText = this._getToolTipData("rus"); //ИНИЦИАЛИЗИРУЕМ МАССИВ ТЕКСТА ТУЛТИПОВ В ЗАВИСИМОСТИ ОТ ПАРАМЕТРОВ НАСТРОЕК ЯЗЫКА
        //Добавляем обработчики событий мыши
        this.node.on(cc.Node.EventType.MOUSE_LEAVE, this._onLeaveMouseEvent);
        this.node.on(cc.Node.EventType.MOUSE_ENTER, this._onEnterMouseEvent);
        this.node.on(cc.Node.EventType.MOUSE_MOVE, this._onMouseMoveEvent);
        this.node.on(cc.Node.EventType.MOUSE_UP, this._onMouseUpEvent);
        this.node.on(cc.Node.EventType.MOUSE_DOWN, this._onLeaveMouseEvent);
    },
    //Обработчики событий мыши
    _onEnterMouseEvent(event) {
        if (cc.director._globalVariables.isToolTipActive) //Если тултипы вообще включены
            this._isMouseEntered = true;
        if (cc.director._globalVariables.isSelectByMouseMove)
            this._showSelectingItem(this); //Отображаем выделение на обьекте
    },

    _onLeaveMouseEvent(event) {
        if (cc.director._globalVariables.isToolTipActive) {
            //Сбрасываем счетчик и обнуляем флаг
            this._timeCounter = 0;
            this._isMouseEntered = false;
            cc.director._globalVariables.toolTipNode.active = false;
        }
        this._hideSelectingItem(this); //Скрываем выделение на обьекте
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
            //Если флаг того что мышка над нодой true и тултип еще не показан другой нодой
            if (cc.director._globalVariables.toolTipNode && this.node._isMouseEntered && !cc.director._globalVariables.toolTipNode.active) {
                this._timeCounter += dt * 1000; //Отсчитываем милисекунды
                if (this._timeCounter > cc.director._globalVariables.toolTipDelay) { //Если прошло достаточно времени, то показываем тултип
                    //Показываем тултип
                    this._showToolTip(this._getToolTipText(this.node));
                    //Отображаем выделение на обьекте
                    this._showSelectingItem(this.node);
                    //Сбрасываем счетчик и обнуляем флаг
                    this._timeCounter = 0;
                    this._isMouseEntered = false;
                }
            }
        }
    },

    //Отображает выделение на ноде
    _showSelectingItem(node) {
        //Отрисовываем выделение на элементе
        var selSprite = node.getChildByName("selectingSprite");
        if (!selSprite) return; //Если у него нету спрайта выделения то ничего не делаем
        var ord = (node.name == "Player" || node.name == "gameObject_box") ? 2 : 1;
        node.setLocalZOrder(ord);
        selSprite.active = true; //Отображаем спрайт выделения
    },

    //Скрываем выделение на ноде
    _hideSelectingItem(node) {
        //Убираем выделение на элементе
        var selSprite = node.getChildByName("selectingSprite");
        if (!selSprite) return; //Если у него нету спрайта выделения то ничего не делаем
        var ord = (node.name == "Player" || node.name == "gameObject_box") ? 2 : 0;
        node.setLocalZOrder(ord);
        selSprite.active = false; //Скрываем спрайт выделения
    },

    //Выводит текст на тултип, позиционирует его по сохраненной точке и делает тултип активным
    _showToolTip(text) {
        var lNode = cc.director._globalVariables.toolTipNode.getChildByName("toolTipText");
        lNode.getComponent(cc.Label).string = text;
        cc.director._globalVariables.toolTipNode.x = this.node._mousePos.x + 10;
        cc.director._globalVariables.toolTipNode.y = this.node._mousePos.y - 10;
        //Проверяем - влезает ли тултип в экран
        var screenSZ = cc.view.getFrameSize(); //Получаем размеры экрана
        var tTW = cc.director._globalVariables.toolTipNode.getBoundingBoxToWorld(); //Получаем мировые координаты тултипа
        var rDP = cc.p(tTW.x + tTW.width, tTW.y - tTW.height); //Точка правого нижнего угла окна
        cc.director._globalVariables.toolTipNode.x -= rDP.x > screenSZ.width ? rDP.x - screenSZ.width : 0;
        cc.director._globalVariables.toolTipNode.y += rDP.y < 0 ? rDP.y * -1 : 0;
        cc.director._globalVariables.toolTipNode.active = true;
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
            switch (node.name) {
                case "gameObject_box":
                    return this.toolTipText.gameobjects.box; //Ящики
            }
        } else if (node.group == "GUI") { //Элементы пользовательского интерфейса
            switch (node.name) {
                case "menuButton":
                    return this.toolTipText.gui.menu;
                case "reloadButton":
                    return this.toolTipText.gui.reload;
                case "nextStepButton":
                    return this.toolTipText.gui.nextstep;
                case "prevStepButton":
                    return this.toolTipText.gui.prevstep;
                case "startButton":
                    return this.toolTipText.gui.start;
                case "stopButton":
                    return this.toolTipText.gui.stop;
                case "okButton":
                    return this.toolTipText.gui.ok;
            }
        } else if (node.group == "Commands") {
            switch (node.name) {
                case "command_and":
                    return this.toolTipText.commands.and;
                case "command_backward":
                    return this.toolTipText.commands.backward;
                case "command_block_a":
                    return this.toolTipText.commands.blockA;
                case "command_block_b_delete":
                    return this.toolTipText.commands.blockBDelete;
                case "command_block_b":
                    return this.toolTipText.commands.blockB;
                case "command_block_else":
                    return this.toolTipText.commands.else;
                case "command_block_if":
                    return this.toolTipText.commands.if;
                case "command_block_if_button":
                    return this.toolTipText.commands.if;
                case "command_repeatif":
                    return this.toolTipText.commands.repeatif;
                case "command_repeat":
                    return this.toolTipText.commands.repeat;
                case "command_block_repeatif":
                    return this.toolTipText.commands.repeatif;
                case "command_block_repeatif_button":
                    return this.toolTipText.commands.repeatif;
                case "command_block_repeat":
                    return this.toolTipText.commands.repeat;
                case "command_counter":
                    return this.toolTipText.commands.counter;
                case "command_drop":
                    return this.toolTipText.commands.drop;
                case "command_forward":
                    return this.toolTipText.commands.forward;
                case "command_ifandor_add":
                    return this.toolTipText.commands.addConditionB;
                case "command_interact_coin":
                    return this.toolTipText.commands.interactCoin;
                case "command_interact_entry":
                    return this.toolTipText.commands.interactEntry;
                case "command_interact_exit":
                    return this.toolTipText.commands.interactExit;
                case "command_interact_road":
                    return this.toolTipText.commands.interactRoad;
                case "command_interact_wall":
                    return this.toolTipText.commands.interactWall;
                case "command_look_center":
                    return this.toolTipText.commands.lookCenter;
                case "command_look_down":
                    return this.toolTipText.commands.lookDown;
                case "command_look_left":
                    return this.toolTipText.commands.lookLeft;
                case "command_look_right":
                    return this.toolTipText.commands.lookRight;
                case "command_look_up":
                    return this.toolTipText.commands.lookUp;
                case "command_onleft":
                    return this.toolTipText.commands.onLeft;
                case "command_onright":
                    return this.toolTipText.commands.onRight;
                case "command_or":
                    return this.toolTipText.commands.or;
                case "command_pickup":
                    return this.toolTipText.commands.pickup;
                case "command_plus":
                    return this.toolTipText.commands.plus;
                case "command_up":
                    return this.toolTipText.commands.up;
                case "command_down":
                    return this.toolTipText.commands.down;
                case "command_left":
                    return this.toolTipText.commands.left;
                case "command_right":
                    return this.toolTipText.commands.right;
            }
            return node.name;
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
                gameobjects: {
                    box: "Это ящики. Собирай их, чтобы набрать больше очков опыта",
                },
                gui: { //Текст для элементов интерфейса
                    menu: "Кнопка выхода в главное меню",
                    start: "Кнопка play. Нажми на нее и робот поедет",
                    stop: "Кнопка stop. Останавливает автоматическое движение робота",
                    ok: "Кнопка ok. При нажатии на нее закрывается выбор команд для робота",
                    reload: "Кнопка НА СТАРТ. При нажатии на нее робот вернется на старт",
                    nextstep: "Кнопка сделать шаг. При нажатии на нее робот выполнит одну команду",
                    prevstep: "Кнопка вернуться на шаг. При нажатии на нее робот вернется на шаг назад",
                },
                commands: {
                    and: "Логическое И в условиях",
                    or: "Логическое ИЛИ в условиях",
                    blockA: "Выбираем куда роботу посмотреть. Вперед, назад, влево или вправо.",
                    blockBDelete: "Удалить это условие",
                    blockB: "Выбираем что там должно быть",
                    if: "Команда условие. В первом условии выбираем куда смотреть роботу, во втором условии выбираем что там должно быть обнаружено.",
                    else: "Если условие не выполнится, робот будет обрабатывать команды в этой ветке",
                    repeatif: "Команда повторить пока выполняется условие. Эти команды будут выполняться все время пока робот обнаруживает те обьекты которые указаны в условиях.",
                    repeat: "Команда повторить указанное количество раз. Повторяем команды столько раз сколько укажешь.",
                    counter: "Количество повторений", //Блок с итерациями в блоке repeat
                    up: "Поехать вверх",
                    down: "Поехать вниз",
                    right: "Поехать вправо",
                    left: "Поехать влево",
                    onLeft: "Поехать налево по отношению к тому куда смотрит робот",
                    onRight: "Поехать направо по отношению к тому куда смотрит робот",
                    backward: "Поехать назад по отношению к тому куда смотрит робот",
                    forward: "Поехать вперед по отношению к тому куда смотрит робот",
                    drop: "Бросить обьект",
                    addConditionB: "Добавить ещё один обьект который может быть обнаружен в этом условии", //Кнопка + при добавлении условий(блоки B) в блок условий
                    interactCoin: "Ящик. Условие выполнится если на этой клетке находится ящик",
                    interactEntry: "Вход в лабиринт. Условие выполнится если на этой клетке находится вход в лабиринт",
                    interactExit: "Выход из лабиринта. Условие выполнится если на этой клетке находится выход из лабиринта",
                    interactRoad: "Дорога в лабиринте. Условие выполнится если на этой клетке находится дорога",
                    interactWall: "Стена в лабиринте. Условие выполнится если на этой клетке находится стена",
                    lookCenter: "Посмотреть на клетку на которой стоит робот",
                    lookDown: "Посмотреть назад по отношению к тому куда смотрит робот",
                    lookLeft: "Посмотреть налево по отношению к тому куда смотрит робот",
                    lookRight: "Посмотреть направо по отношению к тому куда смотрит робот",
                    lookUp: "Посмотреть вперед по отношению к тому куда смотрит робот",
                    pickup: "Подобрать обьект. Если обьекта под роботом нет, то будет ошибка",
                    plus: "При нажатии откроется меню добавления команд",
                },
                error: "Ошибка с тултипами, что-то пошло не так. Возможно программист забыл написать тултип для этого элемента",
            };
        } else {

        }
    }
});
