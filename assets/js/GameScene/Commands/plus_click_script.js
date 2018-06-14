
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.GameNode = this.GameNode;
        this.node.on('mouseup', function (event) {
            if(cc.director._globalVariables.codeMapNode.isMoved)
                return;
            var GN = null;
            if (this.parent.parent.getComponent("command_if_script") || this.parent.parent.name == "command_block_repeatif" || this.parent.parent.name == "command_block_repeat") {
              //  GN = this.parent.parent.getComponent("command_if_script").gameNode;
                cc.director._globalVariables.commandAddState = "commands"
            }
            if (this.parent.parent.parent.getComponent("command_if_script")) {
               // GN = this.parent.parent.parent.getComponent("command_if_script").gameNode;
                cc.director._globalVariables.commandAddState = "elseCommands"
            }
            if(this.parent.name =="CodeMapNode")
                {
                     cc.director._globalVariables.commandAddState = "road"
                }
            cc.director._globalVariables.parentAdd = this.parent;
            //Инитим правый скролл
            var scrollScript = cc.director._globalVariables.scrollNode.getComponent("ScrollScript");
            scrollScript.setCommandsState();
            //Инитим левый скролл
            var elems = [];
            for(var i = 0 ; i < this.parent._children.length; i++){
                if(this.parent._children[i] !== this)
                    elems.push(this.parent._children[i]);
            }
            scrollScript.addToLeftScroll(elems, true);
            cc.director._globalVariables.guiNode.getChildByName("buttons").getChildByName("okButton").active = true;//Отображаем кнопку ОК
            cc.director._setScrollVisible(true);
        });
    },
    
    start() {
    },

//     update (dt) { 
//
//     },
});
