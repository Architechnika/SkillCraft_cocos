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
        var t = cc.director._globalVariables.codeMapNode;
        //Если начали нажатие в кодмапе а закончили на поле то не обрабатываем это нажатие
        if (t.isMoved || (cc.director._globalVariables.eventDownedOn && cc.director._globalVariables.eventDownedOn !== "GameNode")) 
            return;
        //Если мы отпускаем клик после того как подвигали поле то не обрабатываем его
        if (this.parent.isMoved)
            return;
        cc.director._globalVariables.commandAddState = "road";
        //Отображаем кодмап
        if(!cc.director._globalVariables.codeMapNode.active)
            cc.director._globalVariables.codeMapNode.active = true;
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
            cc.director._globalVariables.codeMapNode.getComponent("GenCodeMap").generation();
            var rScroll = cc.director._globalVariables.scrollNode.getChildByName("rightScroll");
            cc.director._setScrollVisible(false, true);
        } else {
            var rScroll = cc.director._globalVariables.scrollNode.getChildByName("rightScroll");
            cc.director._globalVariables.codeMapNode.getComponent("GenCodeMap").clear();
            cc.director._setScrollVisible(true, true);
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
