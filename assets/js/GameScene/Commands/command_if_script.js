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
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this._H = 400;
    },

    start() {

        //  var element = cc.instantiate(this.node.parent);
        //           var element1 = cc.instantiate(this.node.getChildByName("command_if"));
        //        //  var element2 = cc.instantiate(this.node.getChildByName("command_if"));
        //  this.addCommand(element)
        //        /// this.addCommand(element2)
        //               this.addCommand(element1)
        //        console.log(this.name)
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
                commands.height += itemWH;
                this.node.parent.height += itemWH;
                var x = 0;
                var y = 0;
                var plus = commands.children[0];
                x = plus.x
                y = plus.y
                plus.y -= itemWH;
//                var lineCount = itemWH / h;
//                for (var i = 0; i < lineCount; i++) 
//                {
//                    this.addLine();
//                }
                commands.anchorX = 0;
                commands.anchorY = 1;
                comm.x = x;
                comm.y = y;
                commands.addChild(comm);
            }
        }
    },
    update(dt) {
        // console.log(this.node.parent.parent.name)
                if (this.node.parent.name != "content" && this.node.parent.parent.name == "commands" && this._H != this.node.parent.height) {
        
                    //if(this.node.parent.parent && this.node.parent.parent.name == "commands" || this.node.parent.parent.name == "elseCommands")
                    //   {
                    console.log("Dd")
                    var itemWH = this.node.width;
                    if (this._H)
                        var d = this.node.parent.height - this._H
        
                    var lineCount = 100 / itemWH;
                    this.node.parent.parent.height += this.H
                    for (var i = 0; i < lineCount; i++) {
                        this.node.parent.parent.parent.getComponent("command_if_script").addLine();
                        for(var j =1;j<this.node.parent.parent.children.length;j++)
                            {
                                var el = this.node.parent.parent.children[i]
                                el.y-=el.height;
                            }
                    }
                    //this.addLine();
                    this._H = this.node.parent.height;
                    //  }
                }


        //        if (this._H != this.node.parent.height) {
        //            this._H = this.node.parent.height;
        //            var parent = this.node.parent.parent;
        //            if (parent.getChildByName("commands")) {
        //                parent.getChildByName("commands").height += this._H
        //               // parent.parent.height += this._H
        //                var itemWH = parent.width;
        //                var lineCount = this._H / itemWH;
        //                for (var i = 0; i < lineCount; i++)
        //                    this.addLine();
        //            }
        //        }
    },
});
