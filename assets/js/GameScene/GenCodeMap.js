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
        /*this.declaration();
        this.generation();*/
    },

    start () {

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
        this.node.anchorX = 0;
        this.node.anchorY = 1;
        var x = this.node.FBP.dr.x;
        var y = this.node.FBP.dr.y;
        var itemWH = 100;
        this.node.addChild(this.commands)
        this.commands.anchorX = 0;
        this.commands.anchorY = 1;
        this.commands.x = x;
        this.commands.y = y;
        for (var i = 0; i < this.commands.children.length; i++) {
            var el = this.commands.children[i];
            el.x = x;
            el.y = y;
            if (el.name == "command_block_if") {
                y -= (itemWH * 4)
            } else {
                y -= itemWH
            }
            //  this.node.addChild(el)
        }
        this.node.scaleX = 0.3
        this.node.scaleY = 0.3
    },
    // update (dt) {},
});
