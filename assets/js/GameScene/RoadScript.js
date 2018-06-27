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
        //Если лейбл отображения итераций в блоке count виден - скрываем его
        if(cc.director._globalVariables.scrollNode.getChildByName("label_counter").active)
            cc.director._globalVariables.scrollNode.getChildByName("label_counter").active = false;
        cc.director._globalVariables.nodeCommandToInit = undefined;
        var t = cc.director._globalVariables.codeMapNode;
        //Если начали нажатие в кодмапе а закончили на поле то не обрабатываем это нажатие
        if (t.isMoved || (cc.director._globalVariables.eventDownedOn && cc.director._globalVariables.eventDownedOn !== "GameNode")) 
            return;
        var node = event.target;
        //Если мы отпускаем клик после того как подвигали поле то не обрабатываем его
        if (node.parent.isMoved)
            return;
        cc.director._globalVariables.commandAddState = "road";
         cc.director._globalVariables.lastAddCommandH = 0// зануляем, чтобы при загрузке команд лишний раз не заходил
        //Отображаем кодмап
        if(!cc.director._globalVariables.codeMapNode.active)
            cc.director._globalVariables.codeMapNode.active = true;
        var tmp = cc.director._globalVariables.oldSelectRoad;
        if (tmp != undefined && tmp != node) {
            tmp.getChildByName("sprite").getComponent(cc.Sprite).enabled = false;
            cc.director._globalVariables.scrollNode.getComponent("ScrollScript").clearLeftScroll();
        }
        cc.director._globalVariables.selectedRoad = node;
        if (cc.director._globalVariables.oldSelectRoad !== cc.director._globalVariables.selectedRoad) {
            cc.director._globalVariables.codeMapNode.getComponent("GenCodeMap").clear();
            cc.director._globalVariables.scrollNode.getComponent("ScrollScript").addToLeftScroll(node.roadCommands);
            node.getChildByName("sprite").getComponent(cc.Sprite).enabled = true
            cc.director._globalVariables.oldSelectRoad = node;
        }
        if (node.roadCommands.length > 0) {
            cc.director._globalVariables.codeMapNode.getComponent("GenCodeMap").generation();
            var rScroll = cc.director._globalVariables.scrollNode.getChildByName("rightScroll");
            cc.director._setScrollVisible(false, true);
        } else {
            var rScroll = cc.director._globalVariables.scrollNode.getChildByName("rightScroll");
            cc.director._globalVariables.guiNode.getChildByName("buttons").getChildByName("okButton").active = true;//Отображаем кнопку ОК
            cc.director._setScrollVisible(true, true);
        }
        cc.director._globalVariables.scrollNode.getComponent("ScrollScript").addToRightScroll(cc.director._globalVariables.scrollNode._rightScrollCommands);
        var playerReadedCommands = cc.director._globalVariables.gameNode.getChildByName("Player").getComponent("PlayerScript")._addedCommands;
        if(playerReadedCommands && playerReadedCommands.length > 0 && playerReadedCommands.includes(node)){
            playerReadedCommands.splice(playerReadedCommands.indexOf(node),1);
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
