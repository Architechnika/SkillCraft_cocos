/*
  Скрипт для инициализации скрола командами(при выборе команд на клетку). А так-же обработчик кликов по элементам скрола  
*/

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
        //Массив из набора команд для блока А команд условий
        blockACommands: {
            default: [],
            type: cc.Prefab
        },
        //Массив из набора команд для блока B команд условий
        blockBCommands: {
            default: [],
            type: cc.Prefab
        },
        //Цыфры для блока итераций
        blockCountCommands:{
            default: [],
            type: cc.Prefab
        },
        blockIF: {
            default: null,
            type: cc.Prefab
        },
        blockRepeatIF: {
            default: null,
            type: cc.Prefab
        },
        blockCount: {
            default: null,
            type: cc.Prefab
        },
        _commandsMode: "",
    },
    //
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.setCommandsState();
        cc.director._setScrollVisible(false, false);
    },

    addToLeftScroll(elements, isClear) {
        if (isClear) this.clearLeftScroll();
        this.itemsSort(elements, "leftScroll");
    },
    //Установка команд в скролл в зависимости от выбранного состояния
    setCommandsState() {
        this.addToRightScroll(this.LegendCommands);
    },
    //При удалении из левого скрола, команда должна удалится отовсюду
    removeFromLeftScroll(element) {
        var cont = this.node.getChildByName("leftScroll").getChildByName("view").getChildByName("content");
        cont.removeChild(element);
        var commArr = cc.director._globalVariables.oldSelectRoad.getComponent("RoadScript").roadCommands;
        commArr.splice(commArr.indexOf(element), 1);
        this.clearLeftScroll();
        this.addToLeftScroll(commArr);
    },

    addToRightScroll(elements) {
        if (elements == this.blockACommands)
            this._commandsMode = "blocka";
        if (elements == this.blockACommands)
            this._commandsMode = "blockb";
        else this._commandsMode = "";

        this.clearRightScroll();
        this.itemsSort(elements, "rightScroll");
    },

    clearRightScroll() {
        var cont = this.node.getChildByName("rightScroll").getChildByName("view").getChildByName("content");
        if (cont) cont.removeAllChildren();
    },
    clearLeftScroll() {
        var cont = this.node.getChildByName("leftScroll").getChildByName("view").getChildByName("content");
        if (cont) cont.removeAllChildren();
    },

    itemsSort(arr, scrollName) {
        //сортировка элементов в скроле
        var columnCount = 2; //количество столбцов в скроле
        var cont = this.node.getChildByName(scrollName).getChildByName("view").getChildByName("content");

        if (scrollName == "leftScroll")
            columnCount = 1;
        if (arr && !Array.isArray(arr)) {
            if (!arr.active)
                arr.active = true;
            if (arr.name == "command_if")
                arr = cc.instantiate(this.blockIF);
            else if (arr.name == "command_repeatif")
                arr = cc.instantiate(this.blockRepeatIF);
            else if (arr.name == "command_repeat")
                arr = cc.instantiate(this.blockCount);//--------------ОТМЕНА ДОБАВЛЕНИЯ БЛОКА СЧЕТЧИКА
            cont.addChild(cc.instantiate(arr));
        } else {
            for (var i = 0; i < arr.length; i++) {
                //if(arr[i].name == "command_block_repeat") continue;//--------------ОТМЕНА ДОБАВЛЕНИЯ БЛОКА СЧЕТЧИКА
                if (!arr[i].active)
                    arr[i].active = true;
                if (arr[i].name == "command_if")
                    cont.addChild(cc.instantiate(this.blockIF));
                else if (arr[i].name == "command_repeatif")
                    cont.addChild(cc.instantiate(this.blockRepeatIF));
                else if (arr[i].name == "command_repeat")
                    cont.addChild(cc.instantiate(this.blockCount));
                else cont.addChild(cc.instantiate(arr[i]));
            }
        }
        cont.anchorX = 1;
        cont.anchorY = 1;
        var itemWH = cont.getContentSize().width / columnCount;
        cont.setContentSize(cont.getContentSize().width, itemWH * cont.children.length / columnCount)
        var x = cont.getPosition().x;
        var y = 0;
        for (var i = 0; i < cont.children.length; i++) {
            var child = cont.children[i];
            child.anchorX = columnCount / 2; //расчитываем якорь по X для элемента так, чтобы универсально было для левого и правого скрола, потому что с левым скролом какие то траблы когда якорь = 1 по X
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

    getFieldAreaRect() {
        var rightScroll = this.node.getChildByName("rightScroll").getChildByName("view").getChildByName("content");
        var leftScroll = this.node.getChildByName("leftScroll").getChildByName("view").getChildByName("content");
    },

    // update (dt) {},
});
