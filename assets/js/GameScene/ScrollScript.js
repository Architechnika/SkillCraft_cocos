/*
  Скрипт для инициализации скрола командами(при выборе команд на клетку). А так-же обработчик кликов по элементам скрола  
*/
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
        //массив самый легких копанд, первые 4 команды
        veryLightCommands: {
            default: [],
            type: cc.Prefab
        },
        //массив из 5 команд
        LightCommands: {
            default: [],
            type: cc.Prefab
        },
        // массив из 6 команд
        MediumCommands: {
            default: [],
            type: cc.Prefab
        },
        //массив из 10 команд
        aboveAverageCommands: {
            default: [],
            type: cc.Prefab
        },
        // массив из 8 команд, циклы условия
        ComplexCommands: {
            default: [],
            type: cc.Prefab
        }, 
        // массив из 12 команд, циклы, условия
        LegendCommands: {
            default: [],
            type: cc.Prefab
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
//        this.test();
//        var cont = this.node.getChildByName("rightScroll").getChildByName("view").getChildByName("content")
//        cont.addChild(this.commands[0].data)
//        cont.addChild(this.commands[1].data)
//        cont.addChild(this.commands[2].data)
//        cont.anchorX = 1;
//        cont.anchorY = 0;
//        var itemWH = cont.getContentSize().width / 2;
//        for (var i = 0; i < cont.children.length; i++) {
//            var child = cont.children[i];
//            child.anchorX = 1;
//            child.anchorY = 0;
//            //  child.setContentSize(itemWH,itemWH);
//            child.setPosition(cont.getPosition().x, 0)
//        }
//        console.log(cont.getContentSize() + " " + this.commands[0].data.getPosition() + " ")
    },

    test() {
        //console.log(this.commands)
    },

    // update (dt) {},
});
