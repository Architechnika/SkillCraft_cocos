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
        GameNode: {
            default: null,
            type: cc.Prefab
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        this.node.ifBlock = this.ifBlock;
        this.node.repeatIfBlock = this.repeatIfBlock;
        this.node.counterBlock = this.counterBlock;
        this.node._commandAddState = this._commandAddState;
        this.node.GameNode = this.GameNode;
        this.node.on('mousedown', function (event) {
            var road = undefined;
            var commandAddState = "road";
            var parentAdd = null;
            if (this.parent)
                if (this.parent.parent)
                    if (this.parent.parent.parent)
                        if (this.parent.parent.parent.parent)
                            if (this.parent.parent.parent.parent.parent) {
                                road = this.parent.parent.parent.parent.parent.getChildByName("GameNode").getComponent("GlobalVariables").selectedRoad
                                commandAddState = this.parent.parent.parent.parent.parent.getChildByName("GameNode").getComponent("GlobalVariables").commandAddState
                                parentAdd = this.parent.parent.parent.parent.parent.getChildByName("GameNode").getComponent("GlobalVariables").parentAdd
                            }
            if (commandAddState == "road") {
                if (road != undefined) {
                    var roadComm = road.getComponent("RoadScript").roadCommands;
                    if (roadComm != null) {
                        var element = cc.instantiate(this);
                        if (element.name == "command_block_if") {
                            element = cc.instantiate(this.ifBlock);
                            var ifScript = element.getChildByName("command_block_if").getComponent("command_if_script")
                            ifScript.gameNode = this.parent.parent.parent.parent.parent.getChildByName("GameNode");

                        } else if (element.name == "command_block_repeatif")
                            element = cc.instantiate(this.repeatIfBlock);
                        else if (element.name == "command_block_repeat")
                            element = cc.instantiate(this.counterBlock);
                        roadComm.push(element);
                    }


                }
            } else if (commandAddState == "commands") {
                if (parentAdd) {
                    var element = cc.instantiate(this);
                    var par = null;
                    if (parentAdd.parent.getComponent("command_if_script")) {
                        par= parentAdd.parent.getComponent("command_if_script")
                    }
                    if (parentAdd.parent.parent.getComponent("command_if_script")) {
                        par= parentAdd.parent.parent.getComponent("command_if_script")
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
                    par.addCommand(element)
                }
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
