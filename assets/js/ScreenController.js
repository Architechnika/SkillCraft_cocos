/*
    Скрипт отвечающий за контроль изменений экрана(ресайз канваса)
*/

cc.Class({
    extends: cc.Component,

    properties: {
        _wSbuff: cc.p(0, 0),
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
        this._setWH(cc.winSize);
    },

    update(dt) {
        if (cc.winSize.width !== this._wSbuff.w || cc.winSize.height !== this._wSbuff.h) {
            this._calcScreen(cc.winSize);
        }
    },

    //Производит перерасчет якорей всех нодов на поле под заданное разрешение
    _calcScreen(wh){
        this._setWH(wh);
    },
    
    //Запоминает текущий размер окна
    _setWH(WH) {
        this._wSbuff = {
            w: WH.width,
            h: WH.height,
        };
    }
});
