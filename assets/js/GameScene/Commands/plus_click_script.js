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
        GameNode: { 
            default: null,
            type: cc.Prefab
        },

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.GameNode = this.GameNode;
        this.node.on('mousedown', function (event) {
            var GN = this.GameNode.data;
            GN.getComponent("GlobalVariables").commandAddState = "commands"
            GN.getComponent("GlobalVariables").parentAdd = this.parent;
        });
    },

    start() {

    },

    // update (dt) {},
});
