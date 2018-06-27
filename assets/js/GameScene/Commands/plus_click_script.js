cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.GameNode = this.GameNode;
        this.node.getPlusParentScript = this.getPlusParentScript;
        this.node.on('mouseup', function (event) {
            if (cc.director._globalVariables.codeMapMenu.isMove) {
                var script = this.getPlusParentScript(event.target)
                this.objScr = cc.director._globalVariables.codeMapMenu.getScriptComplexCommand();
                this.objScr.obj.deleteCommand(cc.director._globalVariables.codeMapMenu._targetNode);
                if (event.target.parent.name == "elseCommands")
                    script.addElseCommand(cc.director._globalVariables.codeMapMenu._targetNode);
                else if(event.target.parent.name == "commands")
                    script.addCommand(cc.director._globalVariables.codeMapMenu._targetNode)
                else
                    {
                        var road = cc.director._globalVariables.selectedRoad;
                        var roadCommands = road.getComponent("RoadScript").roadCommands;
                        roadCommands.push(cc.director._globalVariables.codeMapMenu._targetNode)
                    }
                cc.director._globalVariables.codeMapMenu._targetNode.active = true;
                cc.director._globalVariables.codeMapNode.getComponent("GenCodeMap").generation();
                cc.director._globalVariables.codeMapMenu.isMove = false;
                return;
            }
            var GN = null;
            if (this.parent.parent.getComponent("command_if_script") || this.parent.parent.name == "command_block_repeatif" || this.parent.parent.name == "command_block_repeat") {
                //  GN = this.parent.parent.getComponent("command_if_script").gameNode;
                cc.director._globalVariables.commandAddState = "commands"
            }
            if (this.parent.parent.parent.getComponent("command_if_script")) {
                // GN = this.parent.parent.parent.getComponent("command_if_script").gameNode;
                cc.director._globalVariables.commandAddState = "elseCommands"
            }
            if (this.parent.name == "CodeMapNode") {
                cc.director._globalVariables.commandAddState = "road"
            }
            cc.director._globalVariables.parentAdd = this.parent;
            //Инитим правый скролл
            var scrollScript = cc.director._globalVariables.scrollNode.getComponent("ScrollScript");
            scrollScript.setCommandsState();
            //Инитим левый скролл
            var elems = [];
            for (var i = 0; i < this.parent._children.length; i++) {
                if (this.parent._children[i] !== this)
                    elems.push(this.parent._children[i]);
            }
            scrollScript.addToLeftScroll(elems, true);
            cc.director._globalVariables.guiNode.getChildByName("buttons").getChildByName("okButton").active = true; //Отображаем кнопку ОК
            cc.director._setScrollVisible(true, true);
        });
    },

    getPlusParentScript(plus) {
        var scr = null;
        if (plus.parent.name == "CodeMapNode") {
            return scr = plus.parent.getComponent("GenCodeMap");
        }
        if (plus.parent.name == "commands") {
            var obj = plus.parent.parent;
        }
        if (plus.parent.name == "elseCommands") {
            var obj = plus.parent.parent.parent;
        }
        scr = obj.getComponent("command_if_script") ? obj.getComponent("command_if_script") : undefined;
        scr = obj.getComponent("command_repeatif_script") ? obj.getComponent("command_repeatif_script") : scr;
        scr = obj.getComponent("command_counter_script") ? obj.getComponent("command_counter_script") : scr;
        return scr;
    },

    start() {},

    //     update (dt) { 
    //
    //     },
});
