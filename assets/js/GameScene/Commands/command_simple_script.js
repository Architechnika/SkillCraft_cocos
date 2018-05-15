/*
    Скрипт для обработки простых команд передвижений
*/

cc.Class({
    extends: cc.Component,

    properties: {
        //up-вверх, down-вниз, left-влево, right-вправо
        //onleft - налево по отношению к роботу,
        //onright - направо по отношению к роботу,
        //onup - вперед по отношению к роботу,
        //ondown - назад по отношению к роботу,
        DIRECTION: "up",
        commandType: "simple",
    },

    start() {

    },
    //Возвращает точку куда нужно двигаться в зависимости от типа команды
    getCommand(playerObj) {
        switch (this.DIRECTION) {
            case "up":
                if (playerObj.lookDirection == "up" && playerObj._frontFieldElement) return this._getP(playerObj._frontFieldElement);
                else if (playerObj.lookDirection == "down" && playerObj._backFieldElement) return this._getP(playerObj._backFieldElement);
                else if (playerObj.lookDirection == "left" && playerObj._rightFieldElement) return this._getP(playerObj._rightFieldElement);
                else if (playerObj.lookDirection == "right" && playerObj._leftFieldElement) return this._getP(playerObj._leftFieldElement);
            case "down":
                if (playerObj.lookDirection == "up" && playerObj._backFieldElement) return this._getP(playerObj._backFieldElement);
                else if (playerObj.lookDirection == "down" && playerObj._frontFieldElement) return this._getP(playerObj._frontFieldElement);
                else if (playerObj.lookDirection == "left" && playerObj._rightFieldElement) return this._getP(playerObj._rightFieldElement);
                else if (playerObj.lookDirection == "right" && playerObj._leftFieldElement) return this._getP(playerObj._leftFieldElement);
            case "left":
                if (playerObj.lookDirection == "up" && playerObj._leftFieldElement) return this._getP(playerObj._frontFieldElement);
                else if (playerObj.lookDirection == "down" && playerObj._rightFieldElement) return this._getP(playerObj._rightFieldElement);
                else if (playerObj.lookDirection == "left" && playerObj._frontFieldElement) return this._getP(playerObj._frontFieldElement);
                else if (playerObj.lookDirection == "right" && playerObj._backFieldElement) return this._getP(playerObj._backFieldElement);
            case "right":
                if (playerObj.lookDirection == "up" && playerObj._leftFieldElement) return this._getP(playerObj._leftFieldElement);
                else if (playerObj.lookDirection == "down" && playerObj._rightFieldElement) return this._getP(playerObj._rightFieldElement);
                else if (playerObj.lookDirection == "left" && playerObj._backFieldElement) return this._getP(playerObj._backFieldElement);
                else if (playerObj.lookDirection == "right" && playerObj._frontFieldElement) return this._getP(playerObj._frontFieldElement);
            case "onleft":
                return cc.p(playerObj._leftFieldElement.x, playerObj._leftFieldElement.y);
            case "onright":
                return cc.p(playerObj._rightFieldElement.x, playerObj._rightFieldElement.y);
            case "onup":
                return cc.p(playerObj._frontFieldElement.x, playerObj._frontFieldElement.y);
            case "ondown":
                return cc.p(playerObj._backFieldElement.x, playerObj._backFieldElement.y);
        }
    },
    
    _getP(el){
        return cc.p(el.x + (el.width / 2), el.y + (el.height / 2));
    }
});
