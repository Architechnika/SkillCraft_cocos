cc.Class({
    extends: cc.Component,

    properties: {
        commandType: "repeatif",
    },
    _H: 200,
    _W: 300,
    _isNeedGeneration: false,
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this._H = 200;
        this._W = 300;
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
            for(var i=0;i<this.node.children.length;i++)
                {
                    var el = this.node.children[i];
                    if(el.name == "command_line")
                        {
                            el.y +=itemWH
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
                        w = this.node.parent.width >= this._maxW ? 0 : 100;
                }
                var codeMapPlus = cc.director._globalVariables.codeMapNode.getChildByName("command_plusCM");
                codeMapPlus.y -= itemWH

                commands.height += itemWH;
                this.node.parent.height += itemWH;
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
                cc.director._globalVariables.lastAddCommandH = comm.height
            }
        }
    },
        deleteCommand(comm) {
        var commands = this.node.getChildByName("commands");
        //var elseCommands = this.node.getChildByName("bottom").getChildByName("elseCommands");
        var arr = undefined;
        if(comm.parent == commands)
            arr = commands;
        //if(comm.parent == elseCommands)
          //  arr = elseCommands;
        if (arr) {
            var itemH = comm.height;
            var itemW = comm.width;
            var h = 100;
            var x = 0;
            var y = 0;
            var w = 0;
            if (comm.name == "command_if" || comm.name == "command_repeat" || comm.name == "command_repeatif") {
                //  h = comm.children[0].height;
                //Если добавляем команду с шириной выходящей за ширину родителя, то инициализируем дискрет ширины
                if (comm.name == "command_if" || comm.name == "command_repeatif") {
                    var p = this.node.getChildByName("command_ifandor_add");
                    w = this.node.parent.width - (p.x + p.width); //Вычисляем разность между + и крайней правой точкой элемента(дискрет)
                }
            }
            
            arr.height -= itemH;
            this.node.parent.height -= itemH
            this.node.parent.width -= w;
            
            var lineCount = itemH / h;
            for (var i = 0; i < lineCount; i++) {
                if(arr.name == "commands")
                this.deleteLine();
               // else this.deleteElseLine();
            }
            
            var isGo = false; //переменная которая означает что можно уже изменять координаты элементов
            for (var i = 0; i < arr.children.length; i++) 
                 //если удаляем элемент то нужно нижние элементы сдвинуть наверх
            {
                var el = arr.children[i];
                if(isGo || el.name=="command_plus")
                    {
                        el.y+=itemH
                    }
                if(el == comm)
                    {
                        isGo = true;
                    }
                
            }
            cc.director._globalVariables.lastDeleteCommandH = itemH;
            arr.removeChild(comm);

        } else {

        }
    },
    
    insertCommand(upCommand, newCommand, isInsert,isReplace) {
        console.log(upCommand.name + " " + newCommand.name)
        var newCommand = cc.instantiate(newCommand)
        var commands = this.node.getChildByName("commands");
        var bottomChild = this.node.getChildByName("bottom");
        var elseCommands = bottomChild ? bottomChild.getChildByName("elseCommands") : undefined;
        var codeMapPlus = cc.director._globalVariables.codeMapNode.getChildByName("command_plusCM");
        var arr = undefined;
        if (upCommand.parent == commands)
            arr = commands;
        else if (upCommand.parent == elseCommands)
            arr = elseCommands;
        if (arr) {
            newCommand.anchorX = upCommand.anchorX
            newCommand.anchorY = upCommand.anchorY
            newCommand.x = upCommand.x
            newCommand.y = upCommand.y
            var itemWH = newCommand.height;

            var h = 100;
            var w = 0;
            if (newCommand.name == "command_if" || newCommand.name == "command_repeat" || newCommand.name == "command_repeatif") {
                h = newCommand.children[0].height;
                //Если добавляем команду с шириной выходящей за ширину родителя, то инициализируем дискрет ширины
                if (newCommand.name == "command_if" || newCommand.name == "command_repeatif")
                    w = this.node.parent.width >= this._maxW ? 0 : 100;
            }

            
            this.node.parent.width += w;

            //
            var x = 0;
            var y = 0;
        if (isInsert) {

                var isGo = false;
                var isCheckPos = false;
                var index = 0;
            arr.height += itemWH;
            this.node.parent.height += itemWH;
                for (var i = 0; i < arr.children.length; i++) {
                    var el = arr.children[i];
                    if (isGo || el.name == "command_plus") {
                        if (!isCheckPos && el.name != "command_plus") {
                            x = el.x;
                            y = el.y;
                            isCheckPos = true;
                        }
                        el.y -= itemWH;
                    }
                    if (el == upCommand) {
                        isGo = true;
                        index = arr.children.indexOf(el);
                    }
                }
                if (!isCheckPos) {
                    //если инсертим к последнему элементу,
                   // y =  arr.children[arr.children.length-1].y-itemWH;
                    y =arr.children[arr.children.length - 1].y-100;
                }
                if(!isReplace)
                codeMapPlus.y -= itemWH
                var lineCount = itemWH / h;
                for (var i = 0; i < lineCount; i++) {
                    this.addLine();
                }
                newCommand.x = x;
                newCommand.y = y;
                arr.insertChild(newCommand, index + 1);
                cc.director._globalVariables.lastAddCommandH = newCommand.height;
            }else{
                var index = arr.children.indexOf(upCommand);
                var com =  arr.children[index-1]
                this.deleteCommand(upCommand);
                this.insertCommand(com,newCommand,true,true)
            }
        }

    },
    start() {

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
        if (this._isNeedGeneration == true) {
            cc.director._globalVariables.codeMapNode.getComponent("GenCodeMap").generation();
            this._isNeedGeneration = false;
        }
    },

    //Обработчик событий клика по кнопкам внутри команды repeatif
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
        var blockB = undefined;
        //Ищем текущие blockA и blockB
        for (var i = 0; i < this.node._children.length; i++) {
            var spl = this.node._children[i].name.split('_');
            if (spl && spl.length == 3) {
                if (this.node._children[i].active) {
                    if (spl[1] == "look") {
                        blockA = spl[2];
                    } else if (spl[1] == "interact") {
                        blockB = spl[2];
                    }
                }
            }
        }
        //Проверяем условие
        var isTrue = false;
        if (blockB == "entry") { //ВХОД-----------------------------------------------------------------------
            if (blockA == "center" && playerObj._currentFieldElement.group == "Entry") isTrue = true;
            else if (blockA == "left" && playerObj._leftFieldElement.group == "Entry") isTrue = true;
            else if (blockA == "right" && playerObj._rightFieldElement.group == "Entry") isTrue = true;
            else if (blockA == "up" && playerObj._frontFieldElement.group == "Entry") isTrue = true;
            else if (blockA == "down" && playerObj._backFieldElement.group == "Entry") isTrue = true;
        } else if (blockB == "coin") { //ИГРОВОЙ ОБЬЕКТ-----------------------------------------------------------------------
            if (blockA == "center" && playerObj._underFieldElements.length > 0) isTrue = true;
        } else if (blockB == "exit") { //ВЫХОД-----------------------------------------------------------------------
            if (blockA == "center" && playerObj._currentFieldElement.group == "Exit") isTrue = true;
            else if (blockA == "left" && playerObj._leftFieldElement.group == "Exit") isTrue = true;
            else if (blockA == "right" && playerObj._rightFieldElement.group == "Exit") isTrue = true;
            else if (blockA == "up" && playerObj._frontFieldElement.group == "Exit") isTrue = true;
            else if (blockA == "down" && playerObj._backFieldElement.group == "Exit") isTrue = true;
        } else if (blockB == "road") { //ДОРОГА-----------------------------------------------------------------------
            if (blockA == "center" && playerObj._currentFieldElement.group == "Road") isTrue = true;
            else if (blockA == "left" && playerObj._leftFieldElement.group == "Road") isTrue = true;
            else if (blockA == "right" && playerObj._rightFieldElement.group == "Road") isTrue = true;
            else if (blockA == "up" && playerObj._frontFieldElement.group == "Road") isTrue = true;
            else if (blockA == "down" && playerObj._backFieldElement.group == "Road") isTrue = true;
        } else if (blockB == "wall") { //СТЕНА-----------------------------------------------------------------------
            if (blockA == "center" && playerObj._currentFieldElement.group == "Wall") isTrue = true;
            else if (blockA == "left" && playerObj._leftFieldElement.group == "Wall") isTrue = true;
            else if (blockA == "right" && playerObj._rightFieldElement.group == "Wall") isTrue = true;
            else if (blockA == "up" && playerObj._frontFieldElement.group == "Wall") isTrue = true;
            else if (blockA == "down" && playerObj._backFieldElement.group == "Wall") isTrue = true;
        }
        var resultArr = [];
        //Если условие выполнилось возвращаем команды из commands
        if (isTrue) {
            var container = this.node.getChildByName("commands")._children;
            for (var i = 0; i < container.length > 0; i++) {
                if (container[i].name !== "command_plus")
                    resultArr.push(container[i]);
            }
        }
        return resultArr;
    }
});
