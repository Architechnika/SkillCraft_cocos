/*
    Скрипт отвечающий за контроль изменений экрана(ресайз канваса)
*/

cc.Class({
    extends: cc.Component,

    properties: {
        _wSbuff: cc.p(0, 0),
        gameNode: cc.Node,
        scrollNode: cc.Node,
        codeMapNode: cc.Node,
        guiNode: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        this._setWH(cc.winSize);
        this._calcScreen(this._wSbuff);
        var gSc = cc.director._globalVariables.gameNode;
        if (!gSc) return;
        //Отпускание мышки
        this.node.on('mouseup', this._mLeave);
        this.node.on('mouseleave', this._mLeave);
    },

    update(dt) {
        if (cc.winSize.width !== this._wSbuff.width || cc.winSize.height !== this._wSbuff.height) {
            console.log("Screen changed: " + cc.winSize.width + " " + cc.winSize.height);
            console.log(this.node)
            this._calcScreen(cc.winSize);
        }
    },

    _mLeave(event) {
        var scr = cc.director._globalVariables.gameNode.getComponent("ResizeScript");
        if (scr.node.isDowned)
            scr.node.isDowned = false;
        scr = cc.director._globalVariables.codeMapNode.getComponent("ResizeScript");
        if (scr.node.isDowned)
            scr.node.isDowned = false;
    },

    //Производит перерасчет якорей всех нодов на поле под заданное разрешение
    _calcScreen(wh) {
        if (wh.width > wh.height) { //Если ширина больше высоты

        } else { //Если высота больше ширины
            //Определяем сколько процентов - ширина лабиринта от ширины экрана
            cc.director._setScrollVisible(false);
            //this.node.rotation = 90;
        }
        this._setWH(wh);
    },

    //Запоминает текущий размер окна
    _setWH(WH) {
        this._wSbuff = {
            width: WH.width,
            height: WH.height,
        };
    }
});
