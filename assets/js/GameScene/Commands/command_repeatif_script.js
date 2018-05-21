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
        commandType: "repeatif",
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
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
    start () {

    },

    // update (dt) {},
});
