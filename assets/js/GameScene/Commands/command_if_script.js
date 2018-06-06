/*
    Скрипт для отработки команды IF
*/
cc.Class({
    extends: cc.Component,

    properties: {
        commandType: "if",
        gameNode: null,
    },
    _lastAddCommandH: 0,
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this._H = 400;
        this._W = 300;
        this._maxW = 400;
    },

    start() {console.log(this.node.parent.name)},
    addLine() {
        var element = cc.instantiate(this.node.getChildByName("command_line"));
        if (element != null) {
            var itemWH = element.width;
            element.anchorX = 0;
            element.anchorY = 1;
            var bott = this.node.getChildByName("bottom")
            element.x = bott.x;
            element.y = bott.y - itemWH;
            bott.y -= itemWH;
            this.node.addChild(element);
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
                        w = this.node.parent.width >= this._maxW ? 0 : 100;
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
                x = plus.x
                y = plus.y
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
                cc.director._globalVariables.lastAddCommandH = comm.height;
                //Меняем щирину содержимого кодмапа, для ресайза и перемещения
                //cc.director._globalVariables.codeMapNode.width += (comm.width * comm.scaleX) / 3;
            }
        }
    },
    addElseCommand(comm) {
        if (comm != null) {
            var commands = this.node.getChildByName("bottom").getChildByName("elseCommands");
            if (commands != null) {
                comm.anchorX = 0;
                comm.anchorY = 1;
                var itemWH = comm.height;
                var h =itemWH;
                var w = 0;
                if (comm.name == "command_if" || comm.name == "command_repeat" || comm.name == "command_repeatif") {
                    h = comm.children[0].height;
                    //Если добавляем команду с шириной выходящей за ширину родителя, то инициализируем дискрет ширины
                    if (comm.name == "command_if" || comm.name == "command_repeatif")
                        w = this.node.parent.width >= this._maxW ? 0 : 100;
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
                x = plus.x
                y = plus.y
                plus.y -= itemWH;
                var lineCount = itemWH / h;
                for (var i = 0; i < lineCount; i++) {
                    this.addElseLine();
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
    addElseLine() {
        var element = cc.instantiate(this.node.getChildByName("command_line"));
        if (element != null) {
            var itemWH = element.width;
            element.anchorX = 0;
            element.anchorY = 1;
            var bott = this.node.getChildByName("bottom")
            var pos = this.node.getChildByName("bottom").getChildByName("elseLineNode")
            element.x = pos.x;
            element.y = pos.y - itemWH;
            pos.y -= itemWH;
            bott.addChild(element);
        }
    },
    update(dt) {
        if (this.node.parent.name != "content" && (this.node.parent.parent.name == "commands" || this.node.parent.parent.name == "elseCommands") && this._H != this.node.parent.height) {
            var itemWH = this.node.height;
            var lineCount = cc.director._globalVariables.lastAddCommandH / 100; //количество линий которые нужно добавить родителю данного элемента в зависимости от того кого мы добавили ему в дочерние"его размеров"

            // this.node.parent.parent.height += cc.director._globalVariables.lastAddCommandH;
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
                if (isGo || el.name == "command_plus") {
                    el.y -= cc.director._globalVariables.lastAddCommandH;
                }
            }
            this._H = this.node.parent.height;
            cc.director._globalVariables.codeMapNode.getComponent("GenCodeMap").generation();
        }
        if (this.node.parent.name != "content" && (this.node.parent.parent.name == "commands" || this.node.parent.parent.name == "elseCommands") && this._W != this.node.parent.width) {
            var d = this.node.parent.width - this._W;
            this._W += d;
            if (this.node.parent.parent.parent.parent.name == "command_if")
                this.node.parent.parent.parent.parent.width += d;
            cc.director._globalVariables.codeMapNode.getComponent("GenCodeMap").generation();
        }
    },

    //Обработчик событий клика по кнопкам внутри команды if
    onCommandElementClick(event) {
        var script = cc.director._globalVariables.scrollNode.getComponent("ScrollScript");
        //Инитим скролл нужными значениями
        if (event.target.name == "command_block_a") { //Если blockA
            script.addToRightScroll(script.blockACommands);
        } else if (event.target.name == "command_block_b") { //Если blockB
            script.addToRightScroll(script.blockBCommands);
        } else if (event.target.name == "command_ifandor_add") { //Если нажали на блок добавления blockB в условия
            script.addToRightScroll(script.blockBCommands);
        } else {
            var spl = event.target.name.split('_');
            if (spl && spl.length >= 2) {
                if (spl[1] == "look")
                    script.addToRightScroll(script.blockACommands);
                else if (spl[1] == "interact")
                    script.addToRightScroll(script.blockBCommands);
            }
        }
        //Запоминаем эту ноду для инициализации
        cc.director._globalVariables.nodeCommandToInit = event.target;
        cc.director._setScrollVisible(true);
    },
    //Функция
    getCommand(playerObj) {
        var blockA = undefined;
        var blockB = [];
        //Ищем текущие blockA и blockB
        for (var i = 0; i < this.node._children.length; i++) {
            var spl = this.node._children[i].name.split('_');
            if (spl && spl.length == 3) {
                if (this.node._children[i].active) {
                    if (spl[1] == "look") {
                        blockA = spl[2];
                    } else if (spl[1] == "interact") {
                        blockB.push(spl[2]);
                    }
                }
            }
        }
        //Проверяем условие
        var isTrue = false;
        //Пока только реализация множественных условия с логикой ИЛИ-------------------------------------------------------------------
        for (var i = 0; i < blockB.length; i++) {
            if (blockB[i] == "entry") { //ВХОД-----------------------------------------------------------------------
                if (blockA == "center" && playerObj._currentFieldElement.group == "Entry") isTrue = true;
                else if (blockA == "left" && playerObj._leftFieldElement.group == "Entry") isTrue = true;
                else if (blockA == "right" && playerObj._rightFieldElement.group == "Entry") isTrue = true;
                else if (blockA == "up" && playerObj._frontFieldElement.group == "Entry") isTrue = true;
                else if (blockA == "down" && playerObj._backFieldElement.group == "Entry") isTrue = true;
            } else if (blockB[i] == "coin") { //ИГРОВОЙ ОБЬЕКТ-----------------------------------------------------------------------
                if (blockA == "center" && playerObj._underFieldElements.length > 0) isTrue = true;
            } else if (blockB[i] == "exit") { //ВЫХОД-----------------------------------------------------------------------
                if (blockA == "center" && playerObj._currentFieldElement.group == "Exit") isTrue = true;
                else if (blockA == "left" && playerObj._leftFieldElement.group == "Exit") isTrue = true;
                else if (blockA == "right" && playerObj._rightFieldElement.group == "Exit") isTrue = true;
                else if (blockA == "up" && playerObj._frontFieldElement.group == "Exit") isTrue = true;
                else if (blockA == "down" && playerObj._backFieldElement.group == "Exit") isTrue = true;
            } else if (blockB[i] == "road") { //ДОРОГА-----------------------------------------------------------------------
                if (blockA == "center" && playerObj._currentFieldElement.group == "Road") isTrue = true;
                else if (blockA == "left" && playerObj._leftFieldElement.group == "Road") isTrue = true;
                else if (blockA == "right" && playerObj._rightFieldElement.group == "Road") isTrue = true;
                else if (blockA == "up" && playerObj._frontFieldElement.group == "Road") isTrue = true;
                else if (blockA == "down" && playerObj._backFieldElement.group == "Road") isTrue = true;
            } else if (blockB[i] == "wall") { //СТЕНА-----------------------------------------------------------------------
                if (blockA == "center" && playerObj._currentFieldElement.group == "Wall") isTrue = true;
                else if (blockA == "left" && playerObj._leftFieldElement.group == "Wall") isTrue = true;
                else if (blockA == "right" && playerObj._rightFieldElement.group == "Wall") isTrue = true;
                else if (blockA == "up" && playerObj._frontFieldElement.group == "Wall") isTrue = true;
                else if (blockA == "down" && playerObj._backFieldElement.group == "Wall") isTrue = true;
            }
        }
        var resultArr = [];
        //Если условие выполнилось возвращаем команды из commands
        if (isTrue) {
            var container = this.node.getChildByName("commands")._children;
            for (var i = 0; i < container.length > 0; i++) {
                if (container[i].name !== "command_plus")
                    resultArr.push(cc.instantiate(container[i]));
            }
        } else { //Иначе из блока elseCommands
            var container = this.node.getChildByName("bottom").getChildByName("elseCommands")._children;
            for (var i = 0; i < container.length > 0; i++) {
                if (container[i].name !== "command_plus")
                    resultArr.push(cc.instantiate(container[i]));
            }
        }
        return resultArr;
    }
});
