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
    },

    start() {},
    clear() {
        //чистим весь кодмап
        if (this.node.children.length > 1) {
            for (var i = this.node.children.length - 1; i > 0; i--) {
                if (this.node.children[i].name != "command_plusCM")
                    this.node.removeChild(this.node.children[i], false);
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
            //this.clear();
            this.node.resetTransform;
            var roadCommands = road.getComponent("RoadScript").roadCommands;
            if (roadCommands.length > 0) {
                //cc.director._globalVariables.codeMapNode.width = 0;
                //this._changeAnchor(0.5);
                var x = 0;//this.node.x + ();
                var y = 0;
                var itemWH = 0;
                for (var i = 0; i < roadCommands.length; i++) {
                    var el = roadCommands[i];
                    el.anchorX = 0;
                    el.anchorY = 1;
                    el.scaleX = el.scaleY = this.defaultElementScale;
                    itemWH = (el.height * el.scaleY);
                    el._parent = null;
                    this.node.addChild(el);
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
                var bB = this.node.getBoundingBoxToWorld().size;
                var k = Math.floor(bB.height / bB.width);
                console.log(bB.height / bB.width);
                cc.director._globalVariables.codeMapNode.width = bB.height;//(this.plus.width * this.plus.scaleX) * k;
                cc.director._globalVariables.codeMapNode.height = Math.abs(this.plus.y - (this.plus.height * this.plus.scaleY));
            }
            //else cc.director._globalVariables.codeMapNode.getComponent("").resetNode();
        }
    },

    _changeAnchor(anch) {
        this.node.anchorX = anch;
        this.node.anchorY = anch;
        this.node.x += (this.node.width * this.scaleX) / 2;
        this.node.y += (this.node.height * this.scaleY) / 2;
    },
    _getMaxWFromNode(nd) {
        var maxw = 0;
        var wsp = nd.convertToWorldSpace(cc.p(nd.x, nd.y));
        console.log("wsp: ", wsp);
        for (var i = 0; i < nd.childrenCount; i++) {
            maxw = this._getMaxWFromChild(nd._children[i], maxw, wsp);
        }
        return maxw == 0 ? nd.width : maxw;
    },

    _getMaxWFromChild(p, w, wsp) {
        var ws = p.convertToWorldSpace(cc.p(p.x, p.y));
        var width = Math.abs((ws.x + (p.width * p.scaleX) - wsp.x));
        console.log("WS: ", ws, " width: ", width);
        if (width > w) w = width;
        for (var i = 0; i < p._children.length; i++) {
            if (p._children[i]._name != "Label")
                w = this._getMaxWFromChild(p._children[i], w, wsp);
        }
        return w;
    },
});
