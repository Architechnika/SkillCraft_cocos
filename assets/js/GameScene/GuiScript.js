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
        exp_progressBar: cc.Node,
        _playerObj: null, //Указатель на робота(на скрипт робота)
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
                     this._playerObj.prevStep();
                }
                break;
            case this.nextStepButton:
                {
                    this._playerObj.makeStep();
                }
                break;
            case this.reloadButton:
                {
                    this._playerObj.stop();
                    this._playerObj.setToStart();
                }
                break;
            case this.menuButton:
                {
                    cc.director.loadScene("MainMenuScene");
                }
                break;
        }
        //Скрываем скролы выбора и показа команд
        cc.director._setScrollVisible(false, false);
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var onePerc = (cc.director._globalVariables.player_nLvlExp - cc.director._globalVariables.player_pLvlExp) / 100;
        var gExp_perc = (cc.director._globalVariables.player_gExp - cc.director._globalVariables.player_pLvlExp) / onePerc;
        this.exp_progressBar._components[1].progress = gExp_perc / 100;
        this.exp_progressBar.getChildByName("lvl_label")._components[0].string = cc.director._globalVariables.player_lvl.toString();
    },

    start() {
        //Инициализируем указатель но обьект игрока
        this._playerObj = cc.director._globalVariables.gameNode.getChildByName("Player").getComponent("PlayerScript");
    },

});
