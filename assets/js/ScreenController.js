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
        var deviseSize = cc.view.getFrameSize(); //размер экрана устройства
        cc.view.setDesignResolutionSize(deviseSize.width, deviseSize.height, cc.ResolutionPolicy.SHOW_ALL);
        
        var _x = 0 - this.node.width / 2;
        var _y = 0 + this.node.height / 2;
        
        var gameNode = this.node.getChildByName("GameNode");
        var BG = this.node.getChildByName("BackGround");
        var codeMapMask = this.node.getChildByName("CodeMapMask");
        var scrolls = this.node.getChildByName("ScrollsNode");
        var GUINode = this.node.getChildByName("GUINode");

        if (cc.director._scene._name == "GameScene") {


            //настройки левого скролла 
            scrolls.getChildByName("leftScroll").height = deviseSize.height
            this.setPosition(scrolls.getChildByName("leftScroll"),0,scrolls.getChildByName("leftScroll").y)
            scrolls.getChildByName("leftScroll").getChildByName("view").height =  deviseSize.height
            
            //настройка правого скролла
            scrolls.getChildByName("rightScroll").height = deviseSize.height
            this.setPosition(scrolls.getChildByName("rightScroll"),this.node.width-scrolls.getChildByName("rightScroll").width,scrolls.getChildByName("rightScroll").y)
            scrolls.getChildByName("rightScroll").getChildByName("view").height =  deviseSize.height
            
            //настройка заднего фона
            BG.height = deviseSize.height
            BG.width = deviseSize.width
            
            //настройка кодмапа
            codeMapMask.x = 0;
            codeMapMask.x = this.node.width/2 - codeMapMask.width
            codeMapMask.y = 0;
            codeMapMask.y =  this.node.height/2
            codeMapMask.height = deviseSize.height;
            
            //настройка GUI элементов
            GUINode.height = deviseSize.height;
            GUINode.width = deviseSize.width;
            var timer = GUINode.getChildByName("time_label");
            var box = GUINode.getChildByName("sprite");
            var exp = GUINode.getChildByName("exp_progressBar");
            var butts = GUINode.getChildByName("buttons");
            timer.y =0;
            timer.y = _y - timer.height/2
            
            box.y =0;
            box.y = _y - box.height/2
            
            exp.y =0;
            exp.y = box.y
            
            butts.y = 0;
            butts.y = (0- this.node.height / 2) + butts.height/2
            //
            
            //настройка лабиринта
            var mapH = this.node.height - box.height - butts.height
            gameNode.width = gameNode.height = mapH
            gameNode.x = 0;
            gameNode.y = 0;
            gameNode.x -= gameNode.width/2;
            gameNode.y += gameNode.height/2;
            //


        }
    },
setPosition(obj, x, y) {
        var _x = x - this.node.width / 2;
        var _y = y - this.node.height / 2;

    obj.x = _x + (obj.width / 2);
    obj.y = _y + (obj.height / 2);
},

    //    update(dt) {
    //    },
});
