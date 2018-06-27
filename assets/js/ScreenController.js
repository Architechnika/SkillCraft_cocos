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
       // this._setWH(cc.winSize);
        //this._calcScreen(this._wSbuff);

        var size = cc.view.getFrameSize();
       // cc.view.(size);
        console.log(size)
        console.log(cc.view.getVisibleSize())
        cc.view.setDesignResolutionSize(size)
;//        this.node.on('mouseup', function (event) {
//            //Отключает отбражение меню на кодмапе если оно активно
//            if (cc.director._globalVariables && cc.director._globalVariables.codeMapMenu && cc.director._globalVariables.codeMapMenu.active){
//                //Если это блок команд то на него это правило не распространяется
//                var spl = event.target.name.split("_")[1];
//                if(spl && spl == "block");
//                else cc.director._globalVariables.codeMapMenu.active = false;
//            }
//        });
    },

    update(dt) {
        //if (cc.winSize.width !== this._wSbuff.width || cc.winSize.height !== this._wSbuff.height) {
        /*console.log("Screen changed: " + cc.winSize.width + " " + cc.winSize.height);
        console.log(this.node)*/
        // this._calcScreen(cc.winSize);
        //}
    },

    //Производит перерасчет якорей всех нодов на поле под заданное разрешение
    _calcScreen(wh) {
        /*if (wh.width > wh.height) { //Если ширина больше высоты

        } else { //Если высота больше ширины
            //Определяем сколько процентов - ширина лабиринта от ширины экрана
            cc.director._setScrollVisible(false);
            //this.node.rotation = 90;
        }
        this._setWH(wh);*/
    },

    //Запоминает текущий размер окна
    _setWH(WH) {
        /*this._wSbuff = {
            width: WH.width,
            height: WH.height,
        };*/
    }
});
