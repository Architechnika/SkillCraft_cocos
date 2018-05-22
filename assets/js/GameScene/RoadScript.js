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
    },

    // LIFE-CYCLE CALLBACKS:

    _onRoadClick(event) {
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
            if (this != cc.director._globalVariables.selectedRoad)
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
    },
});
