cc.Class({
    extends: cc.Component,

    properties: {
        ifBlock: {
            default: null,
            type: cc.Prefab
        },
        repeatIfBlock: {
            default: null,
            type: cc.Prefab
        },
        counterBlock: {
            default: null,
            type: cc.Prefab
        },
    },
    objScr: null,
    e: null,

    // LIFE-CYCLE CALLBACKS:

    _onRightScrollClick(event) {
        var road = this.globalVar.selectedRoad;
        var commandAddState = this.globalVar.commandAddState;
        var parentAdd = this.globalVar.parentAdd;
        if (commandAddState == "road") {
            if (road != undefined) {
                var roadComm = road.getComponent("RoadScript").roadCommands;
                if (roadComm != null) {
                    //Если команд ещё не добавлено чистим скролл от префабов сохранений
                    if (roadComm.length == 0) cc.director._globalVariables.scrollNode.getComponent("ScrollScript").clearLeftScroll();
                    var element = cc.instantiate(this);
                    //Проверяем добавляемый префаб на сложность
                    var obj = this._getComplexCommandFromSimple(element);
                    //Если это сложная команда - то открываем скролл
                    if (obj !== element)
                        cc.director._setScrollVisible(false, true);
                    element = obj;
                    roadComm.push(element);
                    //  cc.director._globalVariables.codeMapNode.getComponent("GenCodeMap").addCommand(element)
                    cc.director._globalVariables.scrollNode.getComponent("ScrollScript").addToLeftScroll(element);
                }
            }
        } else if (commandAddState == "commands") {
            if (parentAdd) {
                var element = cc.instantiate(this);
                var par = null;
                if (parentAdd.parent.getComponent("command_if_script")) {
                    par = parentAdd.parent.getComponent("command_if_script")
                }
                if (parentAdd.parent.parent.getComponent("command_if_script")) {
                    par = parentAdd.parent.parent.getComponent("command_if_script")
                }
                if (parentAdd.parent.getComponent("command_repeatif_script")) {
                    par = parentAdd.parent.getComponent("command_repeatif_script")
                }
                if (parentAdd.parent.getComponent("command_counter_script")) {
                    par = parentAdd.parent.getComponent("command_counter_script")
                }
                //Проверяем добавляемый префаб на сложность
                var obj = this._getComplexCommandFromSimple(element);
                //Если это сложная команда - то открываем скролл
                if (obj !== element)
                    cc.director._setScrollVisible(false, true);
                element = obj;
                par.addCommand(element);
                cc.director._globalVariables.scrollNode.getComponent("ScrollScript").addToLeftScroll(element);
            }
        } else if (commandAddState == "elseCommands") {
            if (parentAdd) {
                var element = cc.instantiate(this);
                var par = null;
                if (parentAdd.parent.getComponent("command_if_script")) {
                    par = parentAdd.parent.getComponent("command_if_script")
                }
                if (parentAdd.parent.parent.getComponent("command_if_script")) {
                    par = parentAdd.parent.parent.getComponent("command_if_script")
                }
                //Проверяем добавляемый префаб на сложность
                var obj = this._getComplexCommandFromSimple(element);
                //Если это сложная команда - то открываем скролл
                if (obj !== element)
                    cc.director._setScrollVisible(false, true);
                element = obj;
                //roadComm.push(element);
                par.addElseCommand(element);
                cc.director._globalVariables.scrollNode.getComponent("ScrollScript").addToLeftScroll(element);
            }
        }
        cc.director._globalVariables.codeMapNode.getComponent("GenCodeMap").generation();
    },

    //Возвращает инстанс сложной команды из простой
    _getComplexCommandFromSimple(simple) {
        if (simple != null) {
            if (simple.name == "command_block_if") {
                simple = cc.instantiate(this.ifBlock);
                var ifScript = simple.getChildByName("command_block_if").getComponent("command_if_script")
                ifScript.gameNode = this.parent.parent.parent.parent.parent.getChildByName("GameNode");
            } else if (simple.name == "command_block_repeatif") {
                simple = cc.instantiate(this.repeatIfBlock);
                var repeatifScript = simple.getChildByName("command_block_repeatif").getComponent("command_repeatif_script")
                repeatifScript.gameNode = this.parent.parent.parent.parent.parent.getChildByName("GameNode");
            } else if (simple.name == "command_block_repeat") {
                simple = cc.instantiate(this.counterBlock);
                var repeatifScript = simple.getChildByName("command_block_repeat").getComponent("command_counter_script")
                repeatifScript.gameNode = this.parent.parent.parent.parent.parent.getChildByName("GameNode");
            }
        }
        return simple;
    },

    _onLeftScrollClick(event) {
        //Клик правой кнопкой мышки
        if (event._button && event._button == 2) {
            //Удаление элемента
            //this.globalVar.scrollNode.getComponent("ScrollScript").removeFromLeftScroll(this);
        }
        //_onCodeViewCommandClick()
    },

    _onCodeViewCommandClick(event) {
        this.codeViewCommandClickHandler(event.target.name, cc.director._globalVariables.nodeCommandToInit);
    },

    //Обработчик нажатий на сохраненный скрипт
    onSavedCommandClick(event) {
        var container = cc.director._globalVariables.selectedRoad.getComponent("RoadScript");
        var container = container.roadCommands;
        if(container.length > 0) return;
        for (var i = 0; i < event.target.loadedCommands._children.length; i++) {
            event.target.loadedCommands._children[i]._parent = null;
            container.push(event.target.loadedCommands._children[i]);
        }
    },

    //Обработчик удаления сохранения команды
    onSavedCommandDeleteClick(event) {
        var node = event.target.parent.loadedCommands; //Получаем нужный нам обьект
        var delIndex = cc.director._globalVariables.localStorageScript.arrayLoadCommandBlocks.indexOf(node); //Получаем индекс этого элемента в массиве сохранений
        //Удаляем обьект из локал сторейджа
        var saveData = cc.director._globalVariables.localStorageScript.saveData;
        saveData.arraySaveCommands.splice(delIndex - 1, 1);
        saveData.arraySaveCommands.splice(delIndex - 1, 1);
        cc.sys.localStorage.setItem(cc.director._globalVariables.localStorageScript.key, JSON.stringify(saveData))
        //Удаляем обьект из буфера сохраненных команд
        cc.director._globalVariables.localStorageScript.arrayLoadCommandBlocks.splice(delIndex - 1, 1); //Удаляем имя сохранение
        cc.director._globalVariables.localStorageScript.arrayLoadCommandBlocks.splice(delIndex - 1, 1); //Удаляем само сохранение
        //Перезагружаем левый скролл
        cc.director._globalVariables.scrollNode.getComponent("ScrollScript").addSavedCommands(cc.director._globalVariables.localStorageScript.arrayLoadCommandBlocks);
    },

    onLoad() {

        this.node.ifBlock = this.ifBlock;
        this.node.repeatIfBlock = this.repeatIfBlock;
        this.node.counterBlock = this.counterBlock;
        this.node.commandMenu = this.commandMenu;
        this.node._commandAddState = this._commandAddState;
        this.node.globalVar = cc.director._globalVariables;
        this.node._onLeftScrollClick = this._onLeftScrollClick;
        this.node._onRightScrollClick = this._onRightScrollClick;
        this.node._onCodeViewCommandClick = this._onCodeViewCommandClick;
        this.node._clC = 0; //Счетчик кликов по элементам скрола(нужен для отмены срабатывания на один клик, когда жмешь на кодмап и скорл сразу нажимается тоже)
        this.node.codeViewCommandClickHandler = this.codeViewCommandClickHandler;
        this.node.counterAddHandler = this.counterAddHandler;
        this.node.codeViewElementClickHandler = this.codeViewElementClickHandler;
        this.node._getComplexCommandFromSimple = this._getComplexCommandFromSimple
        this.node.getScript = this.getScript;
        //
        this.node.on('mouseup', function (event) {
            if (this.name == "command_saved") return false; //Не обрабатываем нажатия на кнопку с сохраненными командами тут(обработчик висит в сцене)
            if (cc.director._globalVariables.codeMapNode.getComponent("ResizeScript").isDowned) //Это для того чтобы клики не срабатывали при смещениях
                return false;
            if (cc.director._globalVariables.eventDownedOn == "CodeMapNode" && event.target.parent.name == "content") //Если нажатие было начато в кодмапе а завершено в скроле то не обрабатываем
                return false;
            if (cc.director._globalVariables.eventDownedOn == "command_menu")
                return false;
            if (cc.director._globalVariables.addCommandMode) { //Если включен режим добавления команды после существующей команды ИЛИ замены команды в кодмапе
                if (cc.director._globalVariables.eventDownedOn != "command_menu") { //Это флаг проверки чтобы не было срабатываний пересекающихся ивентов
                    //Если режим ДОБАВЛЕНИЯ команды после существующей команды isAdd = true, Если режим ЗАМЕНЫ команды в кодмапе isAdd = false
                    var isAdd = cc.director._globalVariables.addCommandMode == "add" ? true : false;
                    var objScr = cc.director._globalVariables.codeMapMenu.getScriptComplexCommand();
                    if (objScr.obj.node) { //ЭТО В МАССИВЕ ВЛОЖЕННЫХ КОМАНД
                        if (objScr.obj.node.name == "command_block_if" || objScr.obj.node.name == "command_block_repeat" || objScr.obj.node.name == "command_block_repeatif") {
                            objScr.obj.insertCommand(cc.director._globalVariables.codeMapMenu._targetNode, this._getComplexCommandFromSimple(event.target), isAdd, false);
                        }
                    } else {
                        cc.director._globalVariables.codeMapNode.getComponent("GenCodeMap").insertCommand(cc.director._globalVariables.codeMapMenu._targetNode, this._getComplexCommandFromSimple(event.target), isAdd, false);
                    }
                    cc.director._globalVariables.codeMapNode.getComponent("GenCodeMap").generation();
                    cc.director._globalVariables.addCommandMode = false;
                    cc.director._setScrollVisible(false, true);
                }
            } else if (cc.director._globalVariables.nodeCommandToInit) {
                this._onCodeViewCommandClick(event);
            } else if (this.parent.parent.parent.name == "leftScroll") { //Обработчик клика по команде на левом скроле
                this._onLeftScrollClick(event);
            } else if (this.parent.parent.parent.name == "rightScroll") {
                this._onRightScrollClick(event);
            } else if (event.target.name !== "command_plus" && event.target.name !== "command_line" && event.target.name !== "command_plusCM") { //Это если нажали на команду которая находится в codeMapNode
                this.codeViewElementClickHandler(event);
            }
            cc.director._globalVariables.eventDownedOn = undefined;
            cc.director._globalVariables.codeMapNode.getComponent("ResizeScript").isMoved = false;
        });

        this.node.on('mousedown', function (event) {
            cc.director._globalVariables.eventDownedOn = this.parent.parent.parent.name;
        });
    },

    //Метод обработчик измения blockA blockB и counterBlock в сложных командах
    //Name - имя добавляемой команды
    //Obj - указатель на команду которую меняем
    codeViewCommandClickHandler(name, obj) {
        //Инитим значение, если нужно
        if (obj) {
            if (obj.name == "command_counter") { //Если вводим количество итераций для блока count
                //Вызываем обработчик для добавления итерации в countblock
                this.counterAddHandler(name == "command_backspace" ? "-1" : name.split("_")[2], obj.parent.getComponent("command_counter_script"));
                return;
            } else if (obj.name == "command_ifandor_add" && name !== "command_interact_delete") { //Если пользователь нажал на кнопку добавления условия blockB    
                var isNoBCommands = false;
                for (var i = 0; i < obj.parent._children.length; i++) {
                    if (obj.parent._children[i].name == "command_block_b") {
                        if (obj.parent._children[i].active)
                            isNoBCommands = obj.parent._children[i];
                        break;
                    }
                }
                if (isNoBCommands) { //Если blockB еще не был инициализирован
                    obj.parent._children[i].active = false;
                    for (var i = 0; i < obj.parent._children.length; i++) {
                        if (obj.parent._children[i].name == name) {
                            obj.parent._children[i].active = true;
                        }
                    }
                } else { //Иначе добавляем копию команды которую выбрали
                    var copy = undefined;
                    for (var i = 0; i < obj.parent._children.length; i++) {
                        if (obj.parent._children[i].name == name) {
                            copy = cc.instantiate(obj.parent._children[i]);
                            break;
                        }
                    }
                    if (copy === undefined) {
                        console.log("AHTUNG ERROR COPY IS UNDEFINED");
                    } else {
                        var x = obj.x;
                        obj.x += copy.width;

                        copy.x = x;
                        copy.y = obj.y;
                        copy.width = obj.width;
                        copy.height = obj.height;
                        copy.active = true;
                        copy.isCopy = true;

                        obj.parent.addChild(copy);
                        obj.parent.parent.width += copy.width;
                        cc.director._globalVariables.codeMapNode.getComponent("GenCodeMap").generation();
                    }
                }
            } else if (name == "command_interact_delete") { //Если выбрано удаление элемента
                //Проверяем - сколько элементов уже в условиях, если только один, то его надо удалить и на его место поместить command_block_b
                var thereIsOnlyOne = true;
                var activeInteractElems = [];
                for (var i = 0; i < obj.parent._children.length; i++) {
                    if (obj.parent._children[i].active) {
                        if (obj.parent._children[i].name == "command_block_b") { //Если элемент command_block_b активен то ничего делать не надо
                            break;
                        } else {
                            var spl = obj.parent._children[i].name.split("_");
                            if (spl && spl.length > 1 && spl[1] == "interact") { //Если это элемент interact 
                                activeInteractElems.push(obj.parent._children[i]); //Записываем его в массив активных элементов
                                if (activeInteractElems.length > 1) { //Если насчитали больше одного элемента то выходим
                                    thereIsOnlyOne = false;
                                    break;
                                }
                            }
                        }
                    }
                }
                if (!thereIsOnlyOne) { //Если там не один элемент, то применяем алгоритм удаления
                    var plusObj = obj.parent.getChildByName("command_ifandor_add"); //Ищем элемент с плюсиком
                    //Смещаем все элементы справа от удаляемого на величину удаляемого элемента
                    for (var i = 0; i < obj.parent._children.length; i++) {
                        if (obj.parent._children[i].x > obj.x)
                            obj.parent._children[i].x -= obj.width;
                    }
                    //Уменьшаем ширину всего блока команды на ширину удаляемого обьекта
                    obj.parent.parent.width -= obj.width;
                    //Удаляем элемент
                    if (obj.isCopy) {
                        obj.parent.removeChild(obj);
                        var n = obj.name;
                        obj.destroy();
                    } else obj.active = false;
                } else if (activeInteractElems.length == 1) { //Иначе если там один элемент и это не command_block_b
                    activeInteractElems[0].active = false; //То делаем его не активным
                    obj.parent.getChildByName("command_block_b").active = true; //А command_block_b делаем активным
                }
            } else { //Если добавление происходит при клике на command_block_b
                for (var i = 0; i < obj.parent._children.length; i++) {
                    if (obj.parent._children[i].name == name) {
                        obj.active = false;
                        obj.parent._children[i].x = obj.x;
                        obj.parent._children[i].y = obj.y;
                        obj.parent._children[i].active = true;
                        break;
                    }
                }
            }
            cc.director._globalVariables.nodeCommandToInit = undefined;
            cc.director._setScrollVisible(false, true);
        }
        if (this)
            this._cLC = 0;
    },

    getScript(obj) {
        if (obj.name == "CodeMapNode")
            return obj.getComponent("GenCodeMap");
        if (obj.parent.parent.name == "CodeMapNode")
            return obj.parent.parent.getComponent("GenCodeMap");
        if (obj.name == "commands") {
            obj = obj.parent;
        } else if (obj.name == "elseCommands") {
            obj = obj.parent.parent;
        } else {
            obj = obj.parent.parent.parent;
        }
        var objScr = obj.getComponent("command_if_script") ? obj.getComponent("command_if_script") : undefined;
        objScr = obj.getComponent("command_repeatif_script") ? obj.getComponent("command_repeatif_script") : objScr;
        objScr = obj.getComponent("command_counter_script") ? obj.getComponent("command_counter_script") : objScr;
        return objScr;
    },

    //Обработчик нажатия на элементы в кодмапе(Отрисовка меню управления элементами)
    codeViewElementClickHandler(event) {
        //Если включен режим перемещения элементов кодмапа, то перемещаем
        if (cc.director._globalVariables.codeMapMenu.isMove) {
            console.log("перемещаем")
            this.objScr = cc.director._globalVariables.codeMapMenu.getScriptComplexCommand();
            cc.director._globalVariables.codeMapMenu._targetNode.active = true; //Делаем команду видимой
            if (this.objScr.obj.node) { //ЭТО В МАССИВЕ ВЛОЖЕННЫХ КОМАНД
                if (this.objScr.obj.node.name == "command_block_if" || this.objScr.obj.node.name == "command_block_repeat" || this.objScr.obj.node.name == "command_block_repeatif") {
                    //                    this.objScr.obj.deleteCommand(cc.director._globalVariables.codeMapMenu._targetNode);
                    this.e = event;
                    //  cc.director._globalVariables.isMove = true
                    if (this.e.target.name.split("_")[1] == "block") {
                        var par = null;
                        if (this.e.target.parent.parent.parent.name == "CodeMapNode") {
                            par = this.e.target.parent.parent.parent
                            this.objScr.obj.deleteCommand(cc.director._globalVariables.codeMapMenu._targetNode);
                        } else par = this.e.target.parent;
                        this.getScript(par).insertCommand(this.e.target.parent.parent, cc.director._globalVariables.codeMapMenu._targetNode, true, true);
                    } else {
                        this.getScript(this.e.target.parent).insertCommand(this.e.target, cc.director._globalVariables.codeMapMenu._targetNode, true, true);
                    }
                    this.objScr.obj.deleteCommand(cc.director._globalVariables.codeMapMenu._targetNode);
                }
            } else {
                cc.director._globalVariables.codeMapNode.getComponent("GenCodeMap").deleteCommand(cc.director._globalVariables.codeMapMenu._targetNode);
                //  cc.director._globalVariables.codeMapNode.getComponent("GenCodeMap").insertCommand(this._getComplexCommandFromSimple(event.target), cc.director._globalVariables.codeMapMenu._targetNode, true, true);
                this.e = event;
                //  cc.director._globalVariables.isMove = true
                if (this.e.target.name.split("_")[1] == "block") {
                    this.getScript(this.e.target.parent).insertCommand(this.e.target.parent.parent, cc.director._globalVariables.codeMapMenu._targetNode, true, true);
                } else {
                    this.getScript(this.e.target.parent).insertCommand(this.e.target, cc.director._globalVariables.codeMapMenu._targetNode, true, true);
                }
                // cc.director._globalVariables.codeMapNode.getComponent("GenCodeMap").deleteCommand(cc.director._globalVariables.codeMapMenu._targetNode);
            }
            cc.director._globalVariables.codeMapNode.getComponent("GenCodeMap").generation();
            cc.director._globalVariables.codeMapMenu.isMove = false;
            return;
        }
        var elem = event.target;
        var menuObj = cc.director._globalVariables.codeMapMenu;
        var wElem = elem.getBoundingBoxToWorld(); //Получаем координаты элемента в мировых координатах
        //Инициализируем его размеры
        var spl = event.target.name.split("_")[1];
        if (spl && spl == "block") { //Если это блок со сложной командой то меню надо располагать не в центре а в левом верхнем элементе
            menuObj.x = wElem.x + (wElem.width / 2);
            menuObj.y = wElem.y + (wElem.height / 2.2);
            menuObj._targetNode = elem.parent.parent; //Запоминаем элемент к которому привязываем меню
        } else { //Если простая команда то располагаем меню в позиции команды
            menuObj.x = wElem.x + (wElem.width / 1.5);
            menuObj.y = wElem.y + (wElem.height / 2.2);
            menuObj._targetNode = elem; //Запоминаем элемент к которому привязываем меню
        }
        menuObj.width = elem.width;
        menuObj.height = elem.height;
        menuObj.scaleX = cc.director._globalVariables.codeMapNode.scaleX;
        menuObj.scaleY = cc.director._globalVariables.codeMapNode.scaleY;
        //Проверяем не выходит ли меню за экран

        //Делаем элемент активным
        menuObj.active = true;
        //Останавливаем дальнейшее распространение события
        event._propagationStopped = true;
    },

    //Функция обрабатывающая ввод числа в counter блок
    counterAddHandler(digit, objScript) {
        var intDigit = parseInt(digit);
        var label = cc.director._globalVariables.scrollNode.getChildByName("label_counter")._components[0];
        //Если надо стереть символ
        if (intDigit == -1) {
            var str = objScript._counter.toString();
            str = str.substring(0, str.length - 1);
            str = str.length == 0 ? "0" : str;
            objScript._counter = parseInt(str);
        } else if (label.string.length < 4) { //Если символов меньше 4
            //Добавляем число в переменную счетчика
            objScript._counter = parseInt(objScript._counter + "" + intDigit);
        }
        //Отображаем ее на label текста
        label.string = objScript._counter.toString();
        //Меняем значение на label-а на самой команде
        //objScript.node.getChildByName("command_counter").getChildByName("label_counter")._components[0].string = label.string;
    },

    setParentAddItem(par) {
        //this._parentAdd = par;
        // this._commandAddState = "commands";
    },

    start() {

    },
    //    update(dt) {
    //    },
});
