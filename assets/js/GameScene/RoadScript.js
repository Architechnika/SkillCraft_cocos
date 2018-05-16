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
        this.node.on('mouseup', function (event) {
            var t = this.parent.getComponent("GenMap");
            if (t.node.isMoved) return;
            var tmp = this.parent.getComponent("GlobalVariables").oldSelectRoad;
            if (tmp != undefined && tmp != this)
                tmp.getChildByName("sprite").getComponent(cc.Sprite).enabled = false;
            this.parent.getComponent("GlobalVariables").oldSelectRoad = this;
            this.parent.getComponent("GlobalVariables").selectedRoad = this;
            this.getChildByName("sprite").getComponent(cc.Sprite).enabled = true
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
