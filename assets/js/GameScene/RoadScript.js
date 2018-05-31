/*
  Скрипт содержащий массив команд для клетки поля  
*/

cc.Class({
    extends: cc.Component,

    properties: {
        commandsArray: [],
        roadCommands: { //массив команд на дороге
            default: [],
            type: cc.Prefab
        },
        arri: 0, //положение данной дороги в массиве
        arrj: 0,
        isGameObjectName: null,
    },

    // LIFE-CYCLE CALLBACKS:

    _onRoadClick(event) {
<<<<<<< HEAD
        console.log(this.roadCommands.length)
=======
        if(!cc.director._globalVariables.codeMapNode.active)
            cc.director._globalVariables.codeMapNode.active = true;
>>>>>>> 2a1a8c8323989c97c912868ecb1d896fe25867da
        var t = this.parent.getComponent("GenMap");
        if (t.node.isMoved) return;
        var tmp = cc.director._globalVariables.oldSelectRoad;
        if (tmp != undefined && tmp != this) {
            tmp.getChildByName("sprite").getComponent(cc.Sprite).enabled = false;
            cc.director._globalVariables.scrollNode.getComponent("ScrollScript").clearLeftScroll();
        }
        cc.director._globalVariables.selectedRoad = this;
        if (cc.director._globalVariables.oldSelectRoad !== cc.director._globalVariables.selectedRoad) {
            cc.director._globalVariables.scrollNode.getComponent("ScrollScript").addToLeftScroll(this.roadCommands);
            this.getChildByName("sprite").getComponent(cc.Sprite).enabled = true
            cc.director._globalVariables.oldSelectRoad = this;
        }
        if (this.roadCommands.length > 0) {
<<<<<<< HEAD
            //  if (this != cc.director._globalVariables.selectedRoad)
=======
            /*cc.director._globalVariables.codeMapNode._children.splice(0,cc.director._globalVariables.codeMapNode.childrenCount);
            cc.director._globalVariables.codeMapNode.getComponent("ResizeScript").reset();*/
>>>>>>> 2a1a8c8323989c97c912868ecb1d896fe25867da
            cc.director._globalVariables.codeMapNode.getComponent("GenCodeMap").generation();
            var rScroll = cc.director._globalVariables.scrollNode.getChildByName("rightScroll");
            cc.director._setScrollVisible(false, true);
        } else {
            var rScroll = cc.director._globalVariables.scrollNode.getChildByName("rightScroll");
            cc.director._globalVariables.codeMapNode.getComponent("GenCodeMap").clear();
            cc.director._setScrollVisible(true);
        }
    },

    onLoad() {

        this.node.roadCommands = this.roadCommands
        this.node.on('mouseup', this._onRoadClick);
    },

    start() {
        // var ser = this.node.parent.getComponent("serializer");
        // var s = ser.serialize(this,"road");
        //var d = ser.deserialize(s);
        //  console.log(s)
    },
    setIJ(i, j) {//функция для установки позиции дороги в общем массиве
        this.arri = i;
        this.arrj = j;
    },
    getI() {
        if (this.arri !== null)
            return this.arri;
    },
    getJ() {
        if (this.arrj !== null)
            return this.arrj;
    },



    update(dt) {
        //для отрисовки на поле картинки обозначающей что тут есть команды
        if (this.roadCommands.length > 0) {
            if (this.node.getChildByName("isCommands").getComponent(cc.Sprite))
                this.node.getChildByName("isCommands").getComponent(cc.Sprite).enabled = true;
        } else if (this.roadCommands.length == 0) {
            if (this.node.getChildByName("isCommands").getComponent(cc.Sprite))
                this.node.getChildByName("isCommands").getComponent(cc.Sprite).enabled = false;
        }
        //
        // if(cc.director._globalVariables.selectedRoad)
        //  console.log(cc.director._globalVariables.selectedRoad.i+" "+cc.director._globalVariables.selectedRoad.j)
        //

        //
    },
});
