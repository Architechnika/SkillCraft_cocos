cc.Class({
    extends: cc.Component,

    properties: {
        commandType: "counter",
        _counter: 0,
        _commCounterLabel: cc.Label,
    },
    _isNeedGeneration: false,


    onLoad() {
        this._H = 200;
        this._W = 200;
        this._maxW = 400;
        this._isNeedGeneration = false;
    },
    addLine() {
        var element = cc.instantiate(this.node.getChildByName("command_line"));
        if (element != null) {
            var itemWH = element.width;
            element.anchorX = 0;
            element.anchorY = 1;
            var bott = this.node.getChildByName("nodeCommandPos")
            element.x = bott.x;
            element.y = bott.y - itemWH;
            bott.y -= itemWH;
            this.node.addChild(element);
        }
    },
    deleteLine() {
        var element = this.node.getChildByName("command_line");
        if (element != null) {
            var itemWH = element.width;
            var bott = this.node.getChildByName("nodeCommandPos")
            bott.y += itemWH;
            this.node.removeChild(element);
            for (var i = 0; i < this.node.children.length; i++) {
                var el = this.node.children[i];
                if (el.name == "command_line") {
                    el.y += itemWH
                }
            }
        }
    },
    addCommand(comm) {
        if (comm != null) {
            var commands = this.node.getChildByName("commands");
            if (commands != null) {
                comm.anchorX = 0;
                comm.anchorY = 1;
                var itemWH = comm.height;
                var h = 100;
                var w = 0;
                if (comm.name == "command_if" || comm.name == "command_repeat" || comm.name == "command_repeatif") {
                    h = comm.children[0].height;
                    //Если добавляем команду с шириной выходящей за ширину родителя, то инициализируем дискрет ширины
                    if (comm.name == "command_if" || comm.name == "command_repeatif")
                        w = this.node.parent.width >= this._maxW ? 0 : 200;
                    else w = 100;
                }
                var codeMapPlus = cc.director._globalVariables.codeMapNode.getChildByName("command_plusCM");
                codeMapPlus.y -= itemWH

                commands.height += itemWH;
                this.node.parent.height += itemWH;
                //Увеличиваем ширину родителя на заданный дискрет
                this.node.parent.width += w;
                var x = 0;
                var y = 0;
                var plus = commands.children[0];
                x = plus.x;
                y = plus.y;
                plus.y -= itemWH;
                var lineCount = itemWH / h;
                for (var i = 0; i < lineCount; i++) {
                    this.addLine();
                }
                commands.anchorX = 0;
                commands.anchorY = 1;
                comm.x = x;
                comm.y = y;
                commands.addChild(comm);
                cc.director._globalVariables.lastAddCommandH = comm.height
            }
        }
    },
    deleteCommand(comm) {
        var commands = this.node.getChildByName("commands");
        //var elseCommands = this.node.getChildByName("bottom").getChildByName("elseCommands");
        var arr = undefined;
        if (comm.parent == commands)
            arr = commands;
        //if(comm.parent == elseCommands)
        //  arr = elseCommands;
        if (arr) {
            var itemH = comm.height;
            var itemW = comm.width;
            var h = 100;
            var x = 0;
            var y = 0;
            arr.height -= itemH;
            this.node.parent.height -= itemH

            var lineCount = itemH / h;
            for (var i = 0; i < lineCount; i++) {
                if (arr.name == "commands")
                    this.deleteLine();
                // else this.deleteElseLine();
            }

            var isGo = false; //переменная которая означает что можно уже изменять координаты элементов
            for (var i = 0; i < arr.children.length; i++) {
                //если удаляем элемент то нужно нижние элементы сдвинуть наверх
                var el = arr.children[i];
                if (isGo || el.name == "command_plus") {
                    el.y += itemH
                }
                if (el == comm) {
                    isGo = true;
                }

            }
            cc.director._globalVariables.lastDeleteCommandH = itemH;
            arr.removeChild(comm);

        } else {

        }
    },
    start() {

    },

    //Обработчик событий клика по кнопкам внутри команды counter
    onCommandElementClick(event) {
        var script = cc.director._globalVariables.scrollNode.getComponent("ScrollScript");
        var labelNode = cc.director._globalVariables.scrollNode.getChildByName("label_counter");
        var label = labelNode._components[0];
        //Запоминаем эту ноду для инициализации
        cc.director._globalVariables.nodeCommandToInit = event.target;
        label.string = this._counter.toString(); //Инитим лэйбл отображением итераций
        labelNode.active = true;
        script.addToRightScroll(script.blockCountCommands); //Добавляем в правый скролл набор команд для ввода цифр
        cc.director._setScrollVisible(true); //Отображаем правый скролл
    },

    update(dt) {
        if (this.node.parent.name != "content" && (this.node.parent.parent.name == "commands" || this.node.parent.parent.name == "elseCommands") && this._H < this.node.parent.height) {
            var itemWH = this.node.height;
            if (this._H)
                var d = this.node.parent.height - this._H

            var lineCount = cc.director._globalVariables.lastAddCommandH / 100; //количество линий которые нужно добавить родителю данного элемента в зависимости от того кого мы добавили ему в дочерние"его размеров"
            //  console.log(cc.director._gobalVariables.lastAddCommandH)
            this.node.parent.parent.height += this.H
            if (this.node.parent.parent.name == "commands") {
                for (var i = 0; i < lineCount; i++) {
                    if (this.node.parent.parent.parent.getComponent("command_if_script"))
                        this.node.parent.parent.parent.getComponent("command_if_script").addLine();
                    else if (this.node.parent.parent.parent.getComponent("command_repeatif_script"))
                        this.node.parent.parent.parent.getComponent("command_repeatif_script").addLine();
                    else if (this.node.parent.parent.parent.getComponent("command_counter_script"))
                        this.node.parent.parent.parent.getComponent("command_counter_script").addLine();
                    this.node.parent.parent.parent.parent.height += itemWH
                }
            } else if (this.node.parent.parent.name == "elseCommands") {
                for (var i = 0; i < lineCount; i++) {
                    this.node.parent.parent.parent.parent.getComponent("command_if_script").addElseLine();
                    this.node.parent.parent.parent.parent.parent.height += itemWH
                }
            }
            var isGo = false;
            for (var j = 0; j < this.node.parent.parent.children.length; j++) {
                var el = this.node.parent.parent.children[j]
                if (el == this.node.parent) {
                    isGo = true
                    continue;
                }
                if (isGo || el.name == "command_plus")
                    el.y -= cc.director._globalVariables.lastAddCommandH;
            }
            this._H = this.node.parent.height;
            if (this.node.parent.parent.parent.parent.parent.name == "CodeMapNode" || this.node.parent.parent.parent.parent.parent.parent.name == "CodeMapNode") {
                this._isNeedGeneration = true;
                return;
            }
        }
        
                        //
        if (this.node.parent.name != "content" && (this.node.parent.parent.name == "commands" || this.node.parent.parent.name == "elseCommands") && this._H > this.node.parent.height) {
            var itemWH = this.node.height;
            var lineCount = cc.director._globalVariables.lastDeleteCommandH / 100; //количество линий которые нужно добавить родителю данного элемента в зависимости от того кого мы добавили ему в дочерние"его размеров"

            // this.node.parent.parent.height += cc.director._globalVariables.lastAddCommandH;
            if (this.node.parent.parent.name == "commands") {
                for (var i = 0; i < lineCount; i++) {
                    if (this.node.parent.parent.parent.getComponent("command_if_script"))
                        this.node.parent.parent.parent.getComponent("command_if_script").deleteLine();
                    else if (this.node.parent.parent.parent.getComponent("command_repeatif_script"))
                        this.node.parent.parent.parent.getComponent("command_repeatif_script").deleteLine();
                    else if (this.node.parent.parent.parent.getComponent("command_counter_script"))
                        this.node.parent.parent.parent.getComponent("command_counter_script").deleteLine();
                    this.node.parent.parent.parent.parent.height -= itemWH
                }
            } else if (this.node.parent.parent.name == "elseCommands") {
                for (var i = 0; i < lineCount; i++) {
                    this.node.parent.parent.parent.parent.getComponent("command_if_script").deleteElseLine();
                    this.node.parent.parent.parent.parent.parent.height -= itemWH
                }
            }
            var isGo = false;
            for (var j = 0; j < this.node.parent.parent.children.length; j++) {
                var el = this.node.parent.parent.children[j]
                if (el == this.node.parent) {
                    isGo = true
                    continue;
                }
                if (isGo || el.name == "command_plus") {
                    el.y += cc.director._globalVariables.lastDeleteCommandH;
                }
            }
            this._H = this.node.parent.height;
            if (this.node.parent.parent.parent.parent.parent.name == "CodeMapNode" || this.node.parent.parent.parent.parent.parent.parent.name == "CodeMapNode") {
                this._isNeedGeneration = true;
                return;
            }
        }
        //
        
        if (this.node.parent.name != "content" && (this.node.parent.parent.name == "commands" || this.node.parent.parent.name == "elseCommands") && this._W != this.node.parent.width) {
            var d = this.node.parent.width - this._W;
            this._W += d;
            this.node.parent.parent.parent.parent.width += d;
            if (this.node.parent.parent.parent.parent.parent.name == "CodeMapNode" || this.node.parent.parent.parent.parent.parent.parent.name == "CodeMapNode") {
                this._isNeedGeneration = true;
                return;
            }
        }
        if (this.node.parent.name !== "content")
            this.node.getChildByName("command_counter").getChildByName("label_counter")._components[0].string = parseInt(this._counter);
        if (this._isNeedGeneration == true) {
            cc.director._globalVariables.codeMapNode.getComponent("GenCodeMap").generation();
            this._isNeedGeneration = false;
        }
    },

    //Функция
    getCommand(playerObj) {
        var resultArr = [];
        if (this._counter > 0) {
            var container = this.node.getChildByName("commands")._children;
            for (var i = 0; i < container.length > 0; i++) {
                if (container[i].name !== "command_plus")
                    resultArr.push(cc.instantiate(container[i]));
            }
            this._counter--;
        }
        return resultArr;
    }
});
