/*
    Скрипт для отработки команды IF
*/
cc.Class({
    extends: cc.Component,

    properties: {
        NAME: "default",
        gameNode: null,
    },
    _H: 400,
    _lastAddCommandH: 0,
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this._H = 400;
    },

    start() {
    },
    addLine() {
        var element = cc.instantiate(this.node.getChildByName("command_line"));
        if (element != null) {
            var itemWH = element.width;
            element.anchorX = 0;
            element.anchorY = 1;
            var bott = this.node.getChildByName("bottom")
            element.x = bott.x;
            element.y = bott.y - itemWH;
            bott.y -= itemWH;
            this.node.addChild(element);
            //  this.node.parent.height += itemWH;
        }

    },
    addCommand(comm) {
        if (comm != null) {
            var commands = this.node.getChildByName("commands");
            if (commands != null) {
                comm.anchorX = 0;
                comm.anchorY = 1;
                var itemWH = comm.height;
                var h = itemWH;
                if (comm.name == "command_if") {
                    itemWH = comm.height;
                    h = comm.getChildByName("command_block_if").height;
                }
                var codeMapPlus = cc.director._globalVariables.scrollNode.parent.getChildByName("CodeMapNode").getChildByName("command_plusCM");
                codeMapPlus.y -= itemWH

                commands.height += itemWH;
                this.node.parent.height += itemWH;
                var x = 0;
                var y = 0;
                var plus = commands.children[0];
                x = plus.x
                y = plus.y
                plus.y -= itemWH;
                var lineCount = itemWH / h;
                for (var i = 0; i < lineCount; i++) {
                    this.addLine();
                }
                commands.anchorX = 0;
                commands.anchorY = 1;
                comm.x = x;
                comm.y = y;
                commands.addChild(comm);
                cc.director._globalVariables.lastAddCommandH = comm.height
            }
        }
    },
    update(dt) {
        if (this.node.parent.name != "content" && this.node.parent.parent.name == "commands" && this._H != this.node.parent.height) {
            var itemWH = this.node.height;
            if (this._H)
                var d = this.node.parent.height - this._H

            var lineCount = cc.director._globalVariables.lastAddCommandH / 100;
            console.log(cc.director._globalVariables.lastAddCommandH)
            this.node.parent.parent.height += this.H
            for (var i = 0; i < lineCount; i++) {
                this.node.parent.parent.parent.getComponent("command_if_script").addLine();
                this.node.parent.parent.parent.parent.height += itemWH
            }
            var isGo = false;
            for (var j = 0; j < this.node.parent.parent.children.length; j++) {
                var el = this.node.parent.parent.children[j]
                if (el == this.node.parent) {
                    isGo = true
                    continue;
                }
                if (isGo || el.name == "command_plus")
                    el.y -= cc.director._globalVariables.lastAddCommandH;
            }
            this._H = this.node.parent.height;
        }
    },
});
