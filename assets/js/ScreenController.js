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

        if (cc.director._scene.name == "GameScene") {
            this.node.genMapNode = this.node.getChildByName("GameNode");
            //Отпускание мышки
            this.node.on('mouseup', function (event) {
                var scr = this.genMapNode.getComponent("ResizeScript");
                scr.node.isDowned = false;
                var scr = cc.director._globalVariables.codeMapNode.getComponent("ResizeScript");
                if(scr) scr.node.isDowned = false;
            });
        }
        this._setWH(cc.winSize);
        this._calcScreen(this._wSbuff);
    },

    update(dt) {
        if (cc.winSize.width !== this._wSbuff.width || cc.winSize.height !== this._wSbuff.height) {
            console.log("Screen changed: " + cc.winSize.width + " " + cc.winSize.height);
            console.log(this.node)
            this._calcScreen(cc.winSize);
        }
    },

    //Производит перерасчет якорей всех нодов на поле под заданное разрешение
    _calcScreen(wh){
        if(wh.width > wh.height){//Если ширина больше высоты
            
        }
        else{//Если высота больше ширины
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
