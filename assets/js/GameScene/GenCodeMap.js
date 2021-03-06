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
            var buffCoord = {
                x: this.node.x,
                y: this.node.y,
                scaleX: this.node.scaleX,
                scaleY: this.node.scaleY,
            };
            this.node.getComponent("ResizeScript").reset();
            var roadCommands = road.getComponent("RoadScript").roadCommands;
            if (roadCommands.length > 0) {
                var x = 0; //this.node.x + ();
                var y = 0;
                var itemWH = 0;
                var maxW = 0;
                for (var i = 0; i < roadCommands.length; i++) {
                    var el = roadCommands[i];
                    var isChild = false;
                    for (var j = 0; j < this.node.children.length; j++) {
                        var ch = this.node.children[j];
                        if (el == ch) {
                            isChild = true;
                            //  break;
                        }
                    }
                    if (!isChild) {
                        this.addCommand(el)
                    }

                    el.anchorX = 0;
                    el.anchorY = 1;
                    el.scaleX = el.scaleY = this.defaultElementScale;
                    itemWH = (el.height * el.scaleY);
                    if (el.width > maxW)
                        maxW = el.width;
                    el.resetTransform;
                    el.x = x;
                    el.y = y;
                    var bC = el.getComponent(cc.BoxCollider);
                    if (bC)
                        bC.offset.x = 50;
                    y -= itemWH;
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
                cc.director._globalVariables.codeMapNode.width = maxW + 100;
                cc.director._globalVariables.codeMapNode.height = Math.abs(this.plus.y - (this.plus.height * this.plus.scaleY));
                this.node.x = buffCoord.x;
                this.node.y = buffCoord.y;
                //Тут при необходимости можно сдвинуть ноду на величину новых добавленных элементов
                this.node.scaleX = buffCoord.scaleX;
                this.node.scaleY = buffCoord.scaleY;
                //else cc.director._globalVariables.codeMapNode.getComponent("").resetNode();
            } else {
                this.plus.y = this.plus.x = 0;
                cc.director._globalVariables.codeMapNode.width = this.plus.width;
                cc.director._globalVariables.codeMapNode.height = this.plus.height;
            }
        }
    },
    addCommand(comm) {
        if (comm) {
            this.node.addChild(comm);
        }
    },
    loadedCommands() {
        var road = cc.director._globalVariables.selectedRoad;
        if (road) {
            var roadCommands = road.getComponent("RoadScript").roadCommands;
            for (var i = 0; i < roadCommands.length; i++) {
                var el = roadCommands[i];
                this.addCommand(el)
            }
        }
    },
    insertCommand(upCommand, newCommand, isInsert, isReplace) {
        //        console.log(cc.director._globalVariables.codeMapNode.getChildByName("command_plusCM").parent.children)
        var newCommand = cc.instantiate(newCommand)
        var roadCommands = cc.director._globalVariables.selectedRoad.getComponent("RoadScript").roadCommands;
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
            if (itemWH > 400)
                itemWH = 0;
            var h = 100;
            var w = 0;
            if (newCommand.name == "command_if" || newCommand.name == "command_repeat" || newCommand.name == "command_repeatif") {
                h = newCommand.children[0].height;
                //Если добавляем команду с шириной выходящей за ширину родителя, то инициализируем дискрет ширины
                if (newCommand.name == "command_if" || newCommand.name == "command_repeatif")
                    w = newCommand.width;
            }


            // this.node.width += w;

            //
            var x = 0;
            var y = 0;
            if (isInsert) {

                var isGo = false;
                var isCheckPos = false;
                var index = 0;
                arr.height += itemWH;
                this.node.height += itemWH;
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
                    //  y = arr.children[arr.children.length - 1].y - itemWH;
                    //y = arr.children[arr.children.length - 1].y - 100;
                    var endEl = arr.children[arr.children.length - 1];
                    y = (endEl.y - endEl.height);
                }
                if (!isReplace)
                    codeMapPlus.y -= itemWH
                newCommand.x = x;
                newCommand.y = y;
                arr.insertChild(newCommand, index + 1);
                roadCommands.splice(index, 0, newCommand)
                cc.director._globalVariables.lastAddCommandH = newCommand.height;
            } else {
                var index = arr.children.indexOf(upCommand);
                var com = arr.children[index - 1]
                this.insertCommand(com, newCommand, true, true);
                this.deleteCommand(upCommand);
                return;
            }
        }
        console.log(this.node.height + " 1")
        cc.director._globalVariables.codeMapNode.getComponent("GenCodeMap").generation();
        console.log(this.node.height + " 1")
    },
    deleteCommand(comm) {
        var arr = cc.director._globalVariables.codeMapNode;
        var roadCommands = cc.director._globalVariables.selectedRoad.getComponent("RoadScript").roadCommands;
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
                    // var p = this.node.getChildByName("command_ifandor_add");
                    // w = this.node.parent.width - (p.x + p.width); //Вычисляем разность между + и крайней правой точкой элемента(дискрет)
                }
            }


            arr.height -= itemH;
            this.node.height -= itemH
            // this.node.parent.width -= w;
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
            for (var i = 0; i < roadCommands.length; i++) {
                var el = roadCommands[i]
                if (el == comm) {
                    roadCommands.splice(i, 1)
                    break;
                }
            }
            arr.removeChild(comm);
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
