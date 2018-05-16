/*
  Скрипт для генерации кодмапа из массива команд  
*/
// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        commands: { //команды для отрисовки
            default: null,
            type: cc.Node
        },
        selectParentNode: { //радительский элемент к которому добавляем и сортируем команды
            default: null,
            type: cc.Node
        },
    },

    declaration() {
        this.node.FBP = { //Точки по которым проверяется выход за границы области для отрисовки поля
            ul: {
                x: this.node.x - (this.node.width / 4),
                y: this.node.y + (this.node.height / 4)
            }, //Левая верхняя граница поля
            dr: {
                x: this.node.x + this.node.width,
                y: this.node.y - this.node.height
            } //Правая нижняя граница поля
        };
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    onLoad() {
        // this.declaration();
        // this.generation();
    },

    start() {
    },
    clear() {
        //чистим весь кодмап
        if (this.node.children.length > 0) {
            for (var i = 0; i < this.node.children.length; i++) {
                this.node.removeChild(this.node.children[i]);
            }
        }
    },
    setCommands(arr) {
        this.commands = arr;
    },
    generation() {
        var road = this.node.parent.getChildByName("GameNode").getComponent("GlobalVariables").selectedRoad;
        if (road) {
            this.clear();
            var roadCommands = road.getComponent("RoadScript").roadCommands;
            if (roadCommands.length > 0) {
                var x = this.node.x;
                var y = this.node.y;
                for(var i=0;i<roadCommands.length;i++)
                    {
                        var el = roadCommands[i];
//                        el.anchorX = 0;
//                        el.anchorY = 2;

                        var itemWH = el.width;
                        if(el.name == "command_if")
                            {
                                itemWH = el.height
                            }
                        this.node.addChild(el)
                        el.resetTransform
                        el.setPosition(x,y)
                        y+=itemWH;
                    }
            }
        }
        //        this.node.anchorX = 0;
        //        this.node.anchorY = 1;
        //        //  var x = this.node.FBP.dr.x;
        //        // var y = this.node.FBP.dr.y;
        //        //        var x = this.node.x;
        //        //        var y = this.node.y;
        //        var itemWH = 100;
        //        var iter = 0;
        //        this.node.addChild(this.selectParentNode)
        //        this.selectParentNode.resetTransform;
        //        this.selectParentNode.anchorX = 0;
        //        this.selectParentNode.anchorY = 1;
        //        var x = this.selectParentNode.x;
        //        var y = this.selectParentNode.y;
        //        for (var i = 0; i < this.selectParentNode.children.length; i++) {
        //            var el = this.selectParentNode.children[i];
        //            el.anchorX = 0;
        //            el.anchorY = 1;
        //            el.x = x;
        //            el.y = y;
        //            if (el.name == "command_if") {
        //                y -= (itemWH * 4)
        //                iter += 4;
        //            } else {
        //                y -= itemWH
        //                iter++;
        //            }
        //            //  this.node.addChild(el)
        //        }
        //        this.node.setContentSize(itemWH * iter, itemWH * iter)
        //        var plusCHild = this.node.children[0];
        //        plusCHild.x = x;
        //        plusCHild.y = this.selectParentNode.y - this.node.height;
        //        this.node.scaleX = 0.3
        //        this.node.scaleY = 0.3
    },
    // update (dt) {},
});
