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
        ifBlock: {
            default: null,
            type: cc.Prefab
        },
        repeatIfBlock: {
            default: null,
            type: cc.Prefab
        },
        counterBlock: {
            default: null,
            type: cc.Prefab
        },
    },

    // LIFE-CYCLE CALLBACKS:

    _onRightScrollClick(event) {
        var road = this.globalVar.selectedRoad;
        var commandAddState = this.globalVar.commandAddState;
        var parentAdd = this.globalVar.parentAdd;
        if (commandAddState == "road") {
            if (road != undefined) {
                var roadComm = road.getComponent("RoadScript").roadCommands;
                if (roadComm != null) {
                    var element = cc.instantiate(this);
                    var elementCopy = element;
                    if (element.name == "command_block_if") {
                        elementCopy = cc.instantiate(this.ifBlock);
                        var ifScript = elementCopy.getChildByName("command_block_if").getComponent("command_if_script")
                        ifScript.gameNode = this.parent.parent.parent.parent.parent.getChildByName("GameNode");

                    } else if (element.name == "command_block_repeatif") {
                        elementCopy = cc.instantiate(this.repeatIfBlock);
                        var repeatifScript = elementCopy.getChildByName("command_block_repeatif").getComponent("command_repeatif_script")
                        repeatifScript.gameNode = this.parent.parent.parent.parent.parent.getChildByName("GameNode");
                    } else if (element.name == "command_block_repeat") {
                        elementCopy = cc.instantiate(this.counterBlock);
                        var repeatifScript = elementCopy.getChildByName("command_block_repeat").getComponent("command_counter_script")
                        repeatifScript.gameNode = this.parent.parent.parent.parent.parent.getChildByName("GameNode");
                    }
                    roadComm.push(elementCopy);
                    if (cc.director._globalVariables.scrollNode) {
                        var scr = cc.director._globalVariables.scrollNode.getComponent("ScrollScript");
                        if (scr.addToLeftScroll)
                            scr.addToLeftScroll(element);
                    }
                }


            }
        } else if (commandAddState == "commands") {
            if (parentAdd) {
                var element = cc.instantiate(this);
                var par = null;
                if (parentAdd.parent.getComponent("command_if_script")) {
                    par = parentAdd.parent.getComponent("command_if_script")
                }
                if (parentAdd.parent.parent.getComponent("command_if_script")) {
                    par = parentAdd.parent.parent.getComponent("command_if_script")
                }
                if (parentAdd.parent.getComponent("command_repeatif_script")) {
                    par = parentAdd.parent.getComponent("command_repeatif_script")
                }
                if (parentAdd.parent.getComponent("command_counter_script")) {
                    par = parentAdd.parent.getComponent("command_counter_script")
                }
                if (element.name == "command_block_if") {
                    element = cc.instantiate(this.ifBlock);
                    var ifScript = element.getChildByName("command_block_if").getComponent("command_if_script")
                    ifScript.gameNode = this.parent.parent.parent.parent.parent.getChildByName("GameNode");

                } else if (element.name == "command_block_repeatif") {
                    element = cc.instantiate(this.repeatIfBlock);
                    var repeatifScript = element.getChildByName("command_block_repeatif").getComponent("command_repeatif_script")
                    repeatifScript.gameNode = this.parent.parent.parent.parent.parent.getChildByName("GameNode");
                }
                if (element.name == "command_block_repeat") {
                    element = cc.instantiate(this.counterBlock);
                    var repeatifScript = element.getChildByName("command_block_repeat").getComponent("command_counter_script")
                    repeatifScript.gameNode = this.parent.parent.parent.parent.parent.getChildByName("GameNode");
                }
                //roadComm.push(element);
                par.addCommand(element)
            }
        } else if (commandAddState == "elseCommands") {
            if (parentAdd) {
                var element = cc.instantiate(this);
                var par = null;
                if (parentAdd.parent.getComponent("command_if_script")) {
                    par = parentAdd.parent.getComponent("command_if_script")
                }
                if (parentAdd.parent.parent.getComponent("command_if_script")) {
                    par = parentAdd.parent.parent.getComponent("command_if_script")
                }
                if (element.name == "command_block_if") {
                    element = cc.instantiate(this.ifBlock);
                    var ifScript = element.getChildByName("command_block_if").getComponent("command_if_script")
                    ifScript.gameNode = this.parent.parent.parent.parent.parent.getChildByName("GameNode");

                } else if (element.name == "command_block_repeatif")
                    element = cc.instantiate(this.repeatIfBlock);
                else if (element.name == "command_block_repeat")
                    element = cc.instantiate(this.counterBlock);
                //roadComm.push(element);
                par.addElseCommand(element)
            }
        }
    },

    _onLeftScrollClick(event) {
        //Клик правой кнопкой мышки
        if (event._button && event._button == 2) {
            //Удаление элемента
            this.globalVar.scrollNode.getComponent("ScrollScript").removeFromLeftScroll(this);
        }
    },
    onLoad() {

        this.node.ifBlock = this.ifBlock;
        this.node.repeatIfBlock = this.repeatIfBlock;
        this.node.counterBlock = this.counterBlock;
        this.node._commandAddState = this._commandAddState;
        this.node.globalVar = cc.director._globalVariables;
        this.node._onLeftScrollClick = this._onLeftScrollClick;
        this.node._onRightScrollClick = this._onRightScrollClick;

        this.node.on('mouseup', function (event) {
            if (this.parent.parent.parent.name == "leftScroll") { //Обработчик клика по команде на левом скроле
                this._onLeftScrollClick(event);
            } else if (this.parent.parent.parent.name == "rightScroll") {
                this._onRightScrollClick(event);
            }
        });
    },

    setParentAddItem(par) {
        //this._parentAdd = par;
        // this._commandAddState = "commands";
    },

    start() {

    },
    // update (dt) {},
});
