/*
  Скрипт содержащий массив команд для клетки поля  
*/
// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        
    },


    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // var tmpName = this.name;
        this.node.on('mouseup', function (event) {
            var tmp = this.parent.getComponent("GlobalVariables").oldSelectRoad;
            if (tmp != undefined && tmp != this)
                tmp.getChildByName("sprite").getComponent(cc.Sprite).enabled = false;
            this.parent.getComponent("GlobalVariables").oldSelectRoad = this;
            this.getChildByName("sprite").getComponent(cc.Sprite).enabled = true
        });
    },

    start() {

    },

//    update(dt) {
//
//    },
});
