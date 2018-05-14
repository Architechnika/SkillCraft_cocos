/*
  Скрипт содержащий массив команд для клетки поля  
*/

cc.Class({
    extends: cc.Component,

    properties: {
        commandsArray:[],
    },


    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // var tmpName = this.name;
        this.node.on('mouseup', function (event) {
            var t = this.parent.getComponent("GenMap");
            if(t.node.isMoved) return;
            var tmp = this.parent.getComponent("GlobalVariables").oldSelectRoad;
            if (tmp != undefined && tmp != this)
                tmp.getChildByName("sprite").getComponent(cc.Sprite).enabled = false;
            this.parent.getComponent("GlobalVariables").oldSelectRoad = this;
            this.getChildByName("sprite").getComponent(cc.Sprite).enabled = true
            //event.stopPropagation();
        });
        /*this.node.on('mousedown', function (event) {
            event.stopPropagation();
        });*/
    },

    start() {

    },

//    update(dt) {
//
//    },
});
