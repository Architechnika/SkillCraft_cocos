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

    onLoad() {
        
        this.node.roadCommands = this.roadCommands
        this.node.on('mouseup', function (event) {
            var t = this.parent.getComponent("GenMap");
            if (t.node.isMoved) return;
            var tmp = cc.director._globalVariables.oldSelectRoad;
            if (tmp != undefined && tmp != this)
                tmp.getChildByName("sprite").getComponent(cc.Sprite).enabled = false;
            cc.director._globalVariables.oldSelectRoad = this;
            cc.director._globalVariables.selectedRoad = this;
            this.getChildByName("sprite").getComponent(cc.Sprite).enabled = true
            if (this.roadCommands.length > 0) {
                this.parent.parent.getChildByName("CodeMapNode").getComponent("GenCodeMap").generation();
                var rScroll = this.parent.parent.getChildByName("ScrollsNode").getChildByName("rightScroll");
            } else {
                var rScroll = this.parent.parent.getChildByName("ScrollsNode").getChildByName("rightScroll");
            }
        });
        /*this.node.on('mousedown', function (event) {
            event.stopPropagation();
        });*/
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
