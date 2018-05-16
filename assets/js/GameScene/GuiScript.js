/*
  Скрипт для вывода на экран данных об игре(Время, собранные ящики и тд).  
*/

cc.Class({
    extends: cc.Component,

    properties: {
        startButton: cc.Node,
        prevStepButton: cc.Node,
        nextStepButton: cc.Node,
        reloadButton: cc.Node,
        menuButton: cc.Node,
        _playerObj: null,//Указатель на робота(на скрипт робота)
    },

    onButtonClicked(event) {
        switch (event.target) {
            case this.startButton:
                {
                    this._playerObj.play();
                }
                break;
            case this.prevStepButton:
                {
                    console.log("prev");
                }
                break;
            case this.nextStepButton:
                {
                    console.log("next");
                }
                break;
            case this.reloadButton:
                {
                    console.log("reload");
                }
                break;
            case this.menuButton:
                {
                    console.log("menu");
                }
                break;
        }
    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        //Инициализируем указатель но обьект игрока
        this._playerObj = this.node.parent.getChildByName("GameNode").getChildByName("Player").getComponent("PlayerScript");
    },

});
