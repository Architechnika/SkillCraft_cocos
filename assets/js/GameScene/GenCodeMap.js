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
<<<<<<< HEAD
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
=======
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
>>>>>>> dc74553caa48b3f2429ac5d691eee9e4832c2da1
    },

    // LIFE-CYCLE CALLBACKS:

<<<<<<< HEAD
    // onLoad () {},
=======
    onLoad() {
        this.declaration();
        this.generation();
    },
>>>>>>> dc74553caa48b3f2429ac5d691eee9e4832c2da1

    start () {

    },
<<<<<<< HEAD

=======
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

        this.node.scaleX = 0.3
        this.node.scaleY = 0.3
    },
>>>>>>> dc74553caa48b3f2429ac5d691eee9e4832c2da1
    // update (dt) {},
});
