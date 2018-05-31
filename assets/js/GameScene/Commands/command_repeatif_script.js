

cc.Class({
    extends: cc.Component,

    properties: {
        commandType: "repeatif",
    },
    _H: 200,
    _W: 300,
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this._H = 200;
        this._W = 300;
        this._maxW = 400;
    },
    addLine() {
        var element = cc.instantiate(this.node.getChildByName("command_line"));
        if (element != null) {
            var itemWH = element.width;
            element.anchorX = 0;
            element.anchorY = 1;
            var bott = this.node.getChildByName("nodeCommandPos")
            element.x = bott.x;
            element.y = bott.y - itemWH;
            bott.y -= itemWH;
            this.node.addChild(element);
        }
    },
    addCommand(comm) {
        if (comm != null) {
            var commands = this.node.getChildByName("commands");
            if (commands != null) {
                comm.anchorX = 0;
                comm.anchorY = 1;
                var itemWH = comm.height;
                var h = 100;
                var w = 0;
                if (comm.name == "command_if" || comm.name == "command_repeat" || comm.name == "command_repeatif") {
                    h = comm.children[0].height;
                    //Если добавляем команду с шириной выходящей за ширину родителя, то инициализируем дискрет ширины
                    if (comm.name == "command_if" || comm.name == "command_repeatif")
                        w = this.node.parent.width >=this._maxW ? 0 : 100;
                }
                var codeMapPlus = cc.director._globalVariables.codeMapNode.getChildByName("command_plusCM");
                codeMapPlus.y -= itemWH

                commands.height += itemWH;
                this.node.parent.height += itemWH;
                this.node.parent.width += w;
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
    start() {

    },

    update(dt) {
        if (this.node.parent.name != "content" && (this.node.parent.parent.name == "commands" || this.node.parent.parent.name == "elseCommands") && this._H != this.node.parent.height) {
            var itemWH = this.node.height;
            if (this._H)
                var d = this.node.parent.height - this._H

            var lineCount = cc.director._globalVariables.lastAddCommandH / 100; //количество линий которые нужно добавить родителю данного элемента в зависимости от того кого мы добавили ему в дочерние"его размеров"
            //  console.log(cc.director._gobalVariables.lastAddCommandH)
            this.node.parent.parent.height += this.H
            if (this.node.parent.parent.name == "commands") {
                for (var i = 0; i < lineCount; i++) {
                    if (this.node.parent.parent.parent.getComponent("command_if_script"))
                        this.node.parent.parent.parent.getComponent("command_if_script").addLine();
                    else if (this.node.parent.parent.parent.getComponent("command_repeatif_script"))
                        this.node.parent.parent.parent.getComponent("command_repeatif_script").addLine();
                    else if (this.node.parent.parent.parent.getComponent("command_counter_script"))
                        this.node.parent.parent.parent.getComponent("command_counter_script").addLine();
                    this.node.parent.parent.parent.parent.height += itemWH
                }
            } else if (this.node.parent.parent.name == "elseCommands") {
                for (var i = 0; i < lineCount; i++) {
                    this.node.parent.parent.parent.parent.getComponent("command_if_script").addElseLine();
                    this.node.parent.parent.parent.parent.parent.height += itemWH
                }
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
        if (this.node.parent.name != "content" && (this.node.parent.parent.name == "commands" || this.node.parent.parent.name == "elseCommands") && this._W != this.node.parent.width) {
            var d = this.node.parent.width - this._W;
            this._W += d;
            this.node.parent.parent.parent.parent.width += d;
            cc.director._globalVariables.codeMapNode.getComponent("GenCodeMap").generation();
        }
    },
    
    //Обработчик событий клика по кнопкам внутри команды if
    onCommandElementClick(event){
        var script = cc.director._globalVariables.scrollNode.getComponent("ScrollScript");
        //Инитим скролл нужными значениями
        if(event.target.name == "command_block_a"){
            script.addToRightScroll(script.blockACommands);
        }
        else if (event.target.name == "command_block_b"){
            script.addToRightScroll(script.blockBCommands);
        }
        //Запоминаем эту ноду для инициализации
        cc.director._globalVariables.nodeCommandToInit = event.target;
        cc.director._setScrollVisible(true);  
    },
});
