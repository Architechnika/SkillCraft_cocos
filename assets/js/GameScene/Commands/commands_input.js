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

    // LIFE-CYCLE CALLBACKS:

    _onRightScrollClick(event) {
        var road = this.globalVar.selectedRoad;
        var commandAddState = this.globalVar.commandAddState;
        var parentAdd = this.globalVar.parentAdd;
        if (commandAddState == "road") {
            if (road != undefined) {
                var roadComm = road.getComponent("RoadScript").roadCommands;
                if (roadComm != null) {
                    var element = cc.instantiate(this);
                    if (element.name == "command_block_if") {
                        element = cc.instantiate(this.ifBlock);
                        var ifScript = element.getChildByName("command_block_if").getComponent("command_if_script")
                        ifScript.gameNode = this.parent.parent.parent.parent.parent.getChildByName("GameNode");
                        cc.director._setScrollVisible(false, true);
                    } else if (element.name == "command_block_repeatif") {
                        element = cc.instantiate(this.repeatIfBlock);
                        var repeatifScript = element.getChildByName("command_block_repeatif").getComponent("command_repeatif_script")
                        repeatifScript.gameNode = this.parent.parent.parent.parent.parent.getChildByName("GameNode");
                        cc.director._setScrollVisible(false, true);
                    } else if (element.name == "command_block_repeat") {
                        element = cc.instantiate(this.counterBlock);
                        var repeatifScript = element.getChildByName("command_block_repeat").getComponent("command_counter_script")
                        repeatifScript.gameNode = this.parent.parent.parent.parent.parent.getChildByName("GameNode");
                        cc.director._setScrollVisible(false, true);
                    }
                    roadComm.push(element);
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
                if (element.name == "command_block_if") {
                    element = cc.instantiate(this.ifBlock);
                    var ifScript = element.getChildByName("command_block_if").getComponent("command_if_script")
                    ifScript.gameNode = this.parent.parent.parent.parent.parent.getChildByName("GameNode");
                    cc.director._setScrollVisible(false, true);

                } else if (element.name == "command_block_repeatif") {
                    element = cc.instantiate(this.repeatIfBlock);
                    var repeatifScript = element.getChildByName("command_block_repeatif").getComponent("command_repeatif_script")
                    repeatifScript.gameNode = this.parent.parent.parent.parent.parent.getChildByName("GameNode");
                    cc.director._setScrollVisible(false, true);
                }
                if (element.name == "command_block_repeat") {
                    element = cc.instantiate(this.counterBlock);
                    var repeatifScript = element.getChildByName("command_block_repeat").getComponent("command_counter_script")
                    repeatifScript.gameNode = this.parent.parent.parent.parent.parent.getChildByName("GameNode");
                    cc.director._setScrollVisible(false, true);
                }
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
                if (element.name == "command_block_if") {
                    element = cc.instantiate(this.ifBlock);
                    var ifScript = element.getChildByName("command_block_if").getComponent("command_if_script")
                    ifScript.gameNode = this.parent.parent.parent.parent.parent.getChildByName("GameNode");
                    cc.director._setScrollVisible(false, true);
                } else if (element.name == "command_block_repeatif") {
                    element = cc.instantiate(this.repeatIfBlock);
                    cc.director._setScrollVisible(false, true);
                } else if (element.name == "command_block_repeat") {
                    element = cc.instantiate(this.counterBlock);
                    cc.director._setScrollVisible(false, true);
                }
                //roadComm.push(element);
                par.addElseCommand(element);
                cc.director._globalVariables.scrollNode.getComponent("ScrollScript").addToLeftScroll(element);
            }
        }
        cc.director._globalVariables.codeMapNode.getComponent("GenCodeMap").generation();
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

    onLoad() {

        this.node.ifBlock = this.ifBlock;
        this.node.repeatIfBlock = this.repeatIfBlock;
        this.node.counterBlock = this.counterBlock;
        this.node._commandAddState = this._commandAddState;
        this.node.globalVar = cc.director._globalVariables;
        this.node._onLeftScrollClick = this._onLeftScrollClick;
        this.node._onRightScrollClick = this._onRightScrollClick;
        this.node._onCodeViewCommandClick = this._onCodeViewCommandClick;
        this.node._clC = 0; //Счетчик кликов по элементам скрола(нужен для отмены срабатывания на один клик, когда жмешь на кодмап и скорл сразу нажимается тоже)
        this.node.codeViewCommandClickHandler = this.codeViewCommandClickHandler;
        this.node.counterAddHandler = this.counterAddHandler;
        
        this.node.on('mouseup', function (event) {
            if (cc.director._globalVariables.codeMapNode.getComponent("ResizeScript").isDowned)
                return false;
            if (cc.director._globalVariables.eventDownedOn == "CodeMapNode" && event.target.parent.name == "content")
                return false;
            if (cc.director._globalVariables.nodeCommandToInit) {
                this._onCodeViewCommandClick(event);
            } else if (this.parent.parent.parent.name == "leftScroll") { //Обработчик клика по команде на левом скроле
                this._onLeftScrollClick(event);
            } else if (this.parent.parent.parent.name == "rightScroll") {
                this._onRightScrollClick(event);
            }
            event._propagationStopped = true;
        });

        this.node.on('mousedown', function (event) {
            cc.director._globalVariables.eventDownedOn = this.parent.parent.parent.name;
        });
    },
    
    //Метод обработчик измения blockA blockB и counterBlock в сложных командах
    //Name - имя добавляемой команды
    //Obj - указатель на команду которую меняем
    codeViewCommandClickHandler(name, obj){
        //Инитим значение, если нужно
        if (obj) {
            if (obj.name == "command_counter") {//Если вводим количество итераций для блока count
                //Вызываем обработчик для добавления итерации в countblock
                this.counterAddHandler(name == "command_backspace" ? "-1":name.split("_")[2], obj.parent.getComponent("command_counter_script"));
                return;
            } else if (obj.name == "command_ifandor_add") {//Если пользователь нажал на кнопку добавления условия blockB                
                var isNoBCommands = false;
                for (var i = 0; i < obj.parent._children.length; i++) {
                    if (obj.parent._children[i].name == "command_block_b") {
                        if (obj.parent._children[i].active)
                            isNoBCommands = obj.parent._children[i];
                        break;
                    }
                }
                if (isNoBCommands) {//Если blockB еще не был инициализирован
                    obj.parent._children[i].active = false; 
                    for (var i = 0; i < obj.parent._children.length; i++) {
                        if (obj.parent._children[i].name == name) {
                            obj.parent._children[i].active = true;    
                        }
                    }
                } else {//Иначе добавляем копию команды которую выбрали
                    var copy = undefined;
                    for (var i = 0; i < obj.parent._children.length; i++) {
                        if (obj.parent._children[i].name == name) {
                            copy = cc.instantiate(obj.parent._children[i]);
                            break;
                        }
                    }
                    var x = obj.x;
                    obj.x += copy.width;
                    
                    copy.x = x;
                    copy.y = obj.y;
                    copy.width = obj.width;
                    copy.height = obj.height;
                    copy.active = true;
                    
                    obj.parent.addChild(copy);
                    obj.parent.parent.width += copy.width;
                    cc.director._globalVariables.codeMapNode.getComponent("GenCodeMap").generation();
                }
            } else {
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
        if(this)
            this._cLC = 0;
    },
    
    //Функция обрабатывающая ввод числа в counter блок
    counterAddHandler(digit, objScript){
        var intDigit = parseInt(digit);
        var label = cc.director._globalVariables.scrollNode.getChildByName("label_counter")._components[0];
        //Если надо стереть символ
        if(intDigit == -1){
            var str = objScript._counter.toString();            
            str = str.substring(0,str.length - 1);
            str = str.length == 0 ? "0":str;
            objScript._counter = parseInt(str);
        }
        else if(label.string.length < 4){//Если символов меньше 4
            //Добавляем число в переменную счетчика
            objScript._counter = parseInt(objScript._counter + "" + intDigit);
        }
        //Отображаем ее на label текста
        label.string = objScript._counter.toString();
        //Меняем значение на label-а на самой команде
        objScript.node.getChildByName("command_counter").getChildByName("label_counter")._components[0].string = label.string;
    },
    
    setParentAddItem(par) {
        //this._parentAdd = par;
        // this._commandAddState = "commands";
    },

    start() {

    },
    // update (dt) {},
});
