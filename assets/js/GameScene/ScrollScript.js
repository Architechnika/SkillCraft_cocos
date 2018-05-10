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
    //
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.itemsSort(this.LegendCommands, "rightScroll");
    },

    itemsSort(arr, scrollName) {
        //сортировка элементов в скроле
        var columnCount = 2; //количество столбцов в скроле
        var cont = this.node.getChildByName(scrollName).getChildByName("view").getChildByName("content")
        if (scrollName == "leftScroll")
            columnCount = 1;
        for (var i = 0; i < arr.length; i++)
            cont.addChild(arr[i].data)

        cont.anchorX = 1;
        cont.anchorY = 1;
        var itemWH = cont.getContentSize().width / columnCount;
        cont.setContentSize(cont.getContentSize().width, itemWH * arr.length / columnCount)
        var x = cont.getPosition().x;
        var y = 0;
        for (var i = 0; i < cont.children.length; i++) {
            var child = cont.children[i];
            child.anchorX = columnCount/2; //расчитываем якорь по X для элемента так, чтобы универсально было для левого и правого скрола, потому что с левым скролом какие то траблы когда якорь = 1 по X
            child.anchorY = 1;
            //  child.setContentSize(itemWH,itemWH);
            if (i != 0 && i % columnCount == 0) {
                x = cont.getPosition().x;
                y -= itemWH;
            } else if (i != 0 && i % columnCount != 0) {
                x += itemWH;
            }
            child.setPosition(x, y)
        }
    },

    // update (dt) {},
});
