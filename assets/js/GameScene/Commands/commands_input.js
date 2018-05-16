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

    onLoad() {

        this.node.ifBlock = this.ifBlock;
        this.node.repeatIfBlock = this.repeatIfBlock;
        this.node.counterBlock = this.counterBlock;
        this.node.on('mousedown', function (event) {
            var road = this.parent.parent.parent.parent.parent.getChildByName("GameNode").getComponent("GlobalVariables").selectedRoad
            if (road != undefined) {
                var roadComm = road.getComponent("RoadScript").roadCommands;
                if (roadComm != null) {
                    var element = cc.instantiate(this);
                    if (element.name == "command_block_if")
                        element = cc.instantiate(this.ifBlock);
                    else if (element.name == "command_block_repeatif")
                        element = cc.instantiate(this.repeatIfBlock);
                    else if (element.name == "command_block_repeat")
                        element = cc.instantiate(this.counterBlock);
                    
                        roadComm.push(element);
                }


            }
        });
    },

    start() {

    },

    // update (dt) {},
});
