/*
    Скрипт отвечающий за контроль изменений экрана(ресайз канваса)
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
        if (cc.director._scene.name == "GameScene") {
            this.node.genMapNode = this.node.getChildByName("GameNode");
            //Отпускание мышки
            this.node.on('mouseup', function (event) {
                var scr = this.genMapNode.getComponent("GenMap");
                scr.node.isDowned = false;
            });
        }
    },

    start() {

    },

    // update (dt) {},
});
