/*
    Скрипт описывающий обработчики для всех элементов на экране главного меню
*/

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    onmenuButtonClick(button) {
        if (button.currentTarget._name == "newGameButton") {
            cc.sys.localStorage.setItem("isNewGame",true)
            cc.director.loadScene("GameScene");
        }
    },

    start() {

    },

});
