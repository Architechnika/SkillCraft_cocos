/*
  Скрипт для генерации кодмапа из массива команд  
*/

cc.Class({
    extends: cc.Component,

    properties: {
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
    _H:0,
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
        this.plus = this.node.getChildByName("command_plusCM");
    },

    start() {},
    clear() {
        //чистим весь кодмап
        if (this.node.children.length > 0) {
            for (var i = 0; i < this.node.children.length; i++) {
                if (this.node.children[i].name != "command_plusCM")
                    this.node.removeChild(this.node.children[i]);
            }
        }
    },
    setCommands(arr) {
        this.commands = arr;
    },
    generation() {
        var road = cc.director._globalVariables.selectedRoad;
        if (road) {
            this.clear();
            this.node.resetTransform
            var roadCommands = road.getComponent("RoadScript").roadCommands;
            if (roadCommands.length > 0) {
                var x = 0;
                var y = 0;

                for (var i = 0; i < roadCommands.length; i++) {
                    var el = roadCommands[i];
                    el.anchorX = 0;
                    el.anchorY = 1;

                    var itemWH = el.height;
                    if (el.name == "command_if") {
                        itemWH = el.height
                    }

                    this.node.addChild(el)
                    el.resetTransform;
                    el.x = x;
                    el.y = y;
                    y -= itemWH;
                }
                // var plus = this.node.getChildByName("command_plusCM");
                this.plus.anchorX = 0;
                this.plus.anchorY = 1;
                this.plus.x = x
                this.plus.y = y;
                this.node.scaleX = 0.2
                this.node.scaleY = 0.2
            }
        }
    },
//    update(dt) {
//
//    },
});
