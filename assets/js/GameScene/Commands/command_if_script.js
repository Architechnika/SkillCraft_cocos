/*
    Скрипт для отработки команды IF
*/
cc.Class({
    extends: cc.Component,

    properties: {
        NAME: "default",
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
       // var element = cc.instantiate(this.node.getChildByName("command_left"));
     //   var element1 = cc.instantiate(this.node.getChildByName("command_if"));
      //  var element2 = cc.instantiate(this.node.getChildByName("command_if"));
      //  this.addCommand(element)
       // this.addCommand(element2)
//       this.addCommand(element1)
//        this.addLine();
//        this.addLine();
//        this.addLine();
//        this.addLine();
//        this.addLine();
//        this.addLine();
//        this.addLine();
//        this.addLine();
//        this.addLine();
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
            this.node.parent.height +=itemWH;
        }

    },
    addCommand(comm) {
        if (comm != null) {
            var commands = this.node.getChildByName("commands");
            if (commands != null) {
                comm.anchorX = 0;
                comm.anchorY = 1;
                var itemWH = comm.height;
                commands.height += itemWH
                var x = 0;
                var y = 0;
                for (var i = 0; i < commands.children.length; i++) {
                    var el = commands.children[i];
                    el.y -= itemWH;
                    x = commands.children[commands.children.length - 1].x
                    y = commands.children[commands.children.length - 1].y
                }
                commands.anchorX = 0;
                commands.anchorY = 1;
                comm.x = x;
                comm.y = y + itemWH;
                commands.addChild(comm);
            }
        }
    },
    // update (dt) {},
});
