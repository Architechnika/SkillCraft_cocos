/*
  Скрипт для генерации кодмапа из массива команд  
*/

cc.Class({
    extends: cc.Component,

    properties: {
        defaultElementScale: 1,
        plus: { //команды для отрисовки
            default: null,
            type: cc.Prefab
        },
        selectParentNode: { //радительский элемент к которому добавляем и сортируем команды
            default: null,
            type: cc.Node
        },
        plusObjetc: null,
    },
    _H: 0,
    declaration() {
        /* this.node.FBP = { //Точки по которым проверяется выход за границы области для отрисовки поля
             ul: {
                 x: this.node.x - (this.node.width / 4),
                 y: this.node.y + (this.node.height / 4)
             }, //Левая верхняя граница поля
             dr: {
                 x: this.node.x + this.node.width,
                 y: this.node.y - this.node.height
             } //Правая нижняя граница поля
         };*/
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    onLoad() {
        //
        // this.declaration();
        // this.generation();
        this.plus = this.node.getChildByName("command_plusCM");
        this.node.active = false;
    },

    start() {},
    clear() {
        //чистим весь кодмап
        if (this.node.children.length > 1) {
            for (var i = this.node.children.length - 1; i > 0; i--) {
                if (this.node.children[i].name != "command_plusCM") {
                    var el = this.node.children[i];
                    el.active = false
                    // this.node.removeChild(this.node.children[i], false);

                }
            }
            var plus = this.node.getChildByName("command_plusCM");
            plus.y = 0;
        }
    },
    setCommands(arr) {
        this.commands = arr;
    },
    generation() {
        var road = cc.director._globalVariables.selectedRoad;
        if (road) {
            //  this.clear();
            this.node.resetTransform;
            this.node.getComponent("ResizeScript").reset();
            var roadCommands = road.getComponent("RoadScript").roadCommands;
            if (roadCommands.length > 0) {
                console.log(cc.director._globalVariables.codeMapNode.getChildByName("command_plusCM").parent.children)
                //cc.director._globalVariables.codeMapNode.width = 0;
                //this._changeAnchor(0.5);
                var x = 0; //this.node.x + ();
                var y = 0;
                var itemWH = 0;
                var maxW = 0;
                for (var i = 0; i < roadCommands.length; i++) {
                    var el = roadCommands[i];
                    el.anchorX = 0;
                    el.anchorY = 1;
                    el.scaleX = el.scaleY = this.defaultElementScale;
                    itemWH = (el.height * el.scaleY);
                 //   el._parent = null;
                    if (el.width > maxW)
                        maxW = el.width;
                    el.resetTransform;

                    el.x = x;
                    el.y = y;
                    var bC = el.getComponent(cc.BoxCollider);
                    if (bC)
                        bC.offset.x = 50;
                    y -= itemWH;
                    //cc.director._globalVariables.codeMapNode.width = this._getWFromChildren(el, cc.director._globalVariables.codeMapNode.width, el);//Math.abs(el.x + (el.width * el.scaleX));
                }
                //Добавляем плюсик вниз
                this.plus.anchorX = 0;
                this.plus.anchorY = 1;
                this.plus.x = x;
                this.plus.y = y;
                // console.log(y+" "+itemWH)
                var bB = this.node.getBoundingBoxToWorld().size;
                var k = Math.floor(bB.height / bB.width);
                //console.log(bB.height / bB.width);
                cc.director._globalVariables.codeMapNode.width = maxW;
                cc.director._globalVariables.codeMapNode.height = Math.abs(this.plus.y - (this.plus.height * this.plus.scaleY));
            }
            //else cc.director._globalVariables.codeMapNode.getComponent("").resetNode();
        }
    },
    addCommand(comm) {
        if (comm) {
            this.node.addChild(comm);
        }
    },
    insertCommand(upCommand, newCommand, isInsert) {
        //        console.log(cc.director._globalVariables.codeMapNode.getChildByName("command_plusCM").parent.children)
        var newCommand = cc.instantiate(newCommand)
        //var commands = this.node.getChildByName("commands");
        //var elseCommands = this.node.getChildByName("bottom").getChildByName("elseCommands");
        var codeMapPlus = cc.director._globalVariables.codeMapNode.getChildByName("command_plusCM");
        var arr = codeMapPlus.parent;
        /*if (upCommand.parent == commands)
            arr = commands;
        else if (upCommand.parent == elseCommands)
            arr = elseCommands;*/
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
                    y = arr.children[arr.children.length - 1].y - itemWH;
                }

                codeMapPlus.y -= itemWH
                /*var lineCount = itemWH / h;
                for (var i = 0; i < lineCount; i++) {
                    this.addLine();
                }*/
                newCommand.x = x;
                newCommand.y = y;
                arr.insertChild(newCommand, index + 1);
                cc.director._globalVariables.lastAddCommandH = newCommand.height;
            } else {
                var index = arr.children.indexOf(upCommand);
                var com = arr.children[index - 1]
                this.deleteCommand(upCommand);
                this.insertCommand(com, newCommand, true)
            }
        }

    },
    
        deleteCommand(comm) {
        var arr  = cc.director._globalVariables.codeMapNode;
       // var bottomChild = this.node.getChildByName("bottom");
//        if (comm.parent == commands)
//            arr = commands;
//        if (comm.parent == elseCommands)
//            arr = elseCommands;
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
//            var lineCount = itemH / h;
//            for (var i = 0; i < lineCount; i++) {
//                if (arr.name == "commands")
//                    this.deleteLine();
//                else this.deleteElseLine();
//            }

            var isGo = false; //переменная которая означает что можно уже изменять координаты элементов
            for (var i = 0; i < arr.children.length; i++) {
                //если удаляем элемент то нужно нижние элементы сдвинуть наверх
                var el = arr.children[i];
                if (isGo || el.name == "command_plusCM") {
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
    update(dt) {
        //         var ls = cc.director._globalVariables.localStorageScript
        //         if(cc.director._globalVariables.selectedRoad && cc.director._globalVariables.selectedRoad.getComponent("RoadScript").roadCommands.length>0)
        //             {
        //                 var r = ls.generationArrayRoadCommands(cc.director._globalVariables.selectedRoad.getComponent("RoadScript").roadCommands,ls.arrayRoadCommandsNames);
        //                 console.log(r)
        //                 r.length = 0;
        //                 ls.arrayRoadCommandsNames.length = 0;
        //             }
    },
});
