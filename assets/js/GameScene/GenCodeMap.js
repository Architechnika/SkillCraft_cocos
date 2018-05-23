/*
  Скрипт для генерации кодмапа из массива команд  
*/

cc.Class({
    extends: cc.Component,

    properties: {
        defaultElementScale: 0.5,
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
        // this.declaration();
        // this.generation();
        this.plus = this.node.getChildByName("command_plusCM");
    },

    start() {},
    clear() {
        //чистим весь кодмап
        if (this.node.children.length > 1) {
            for (var i = this.node.children.length - 1; i > 0; i--) {
                if (this.node.children[i].name != "command_plusCM")
                    this.node.removeChild(this.node.children[i],false);
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
            this.clear();
            this.node.resetTransform
            var roadCommands = road.getComponent("RoadScript").roadCommands;
            if (roadCommands.length > 0) {
                var x = 0;
                var y = 0;
                var itemWH = 0;
                for (var i = 0; i < roadCommands.length; i++) {
                    var el = roadCommands[i];
                    el.resetClip
                    el.anchorX = 0;
                    el.anchorY = 1;
                    el.scaleX = el.scaleY = this.defaultElementScale;
//                    if(el.getChildByName("command_block_if"))
//                        {
//                            el.getChildByName("command_block_if").getComponent("command_if_script").onLoad();
//                        }
                    itemWH = (el.height * el.scaleY);
                    if (el.name == "command_if") {
                       // itemWH = el.height
                    }
                    el._parent = null;
                    this.node.addChild(el)
                    el.resetTransform;
                    
                    el.x = x;
                    el.y = y;
                    /*if(Math.abs((el.x + el.width)) > Math.abs(p.x))
                        p.x = el.x + el.width;*/
                    var bC = el.getComponent(cc.BoxCollider);
                    if(bC)
                        bC.offset.x = 50;
                    y -= itemWH;
                }
                //Добавляем плюсик вниз
                this.plus.anchorX = 0;
                this.plus.anchorY = 1;
                this.plus.x = x;
                this.plus.y = y;
                //Задаем анкор для смещения кодмапа по Y правой нижней точки
                var py = this.plus.y - itemWH;
                //this.node.getComponent("ResizeScript").node.FBP.dr.y = py;
                if (py < (this.node.y - (this.node.height * this.node.scaleY))) {
                    this.node.scaleX = this.node.scaleY = Math.abs((py - this.node.y) / this.node.height);
                }
                // var plus = this.node.getChildByName("command_plusCM");
                //this.node.scaleX = 0.2
                //this.node.scaleY = 0.2
            }
        }
    },
    //    update(dt) {
    //
    //    },
//    update(dt) {
//    },
});
