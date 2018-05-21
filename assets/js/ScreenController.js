/*
    Скрипт отвечающий за контроль изменений экрана(ресайз канваса)
*/

cc.Class({
    extends: cc.Component,

    properties: {
        _WinSize : 0,
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
