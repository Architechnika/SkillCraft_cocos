/*Скрипт содержащий в себе глобальные переменные игры*/

cc.Class({
    extends: cc.Component,

    properties: {
        currentLabSize: 11, //Текущий размер лабиринта
        isDebug: false, //Дебаг режим для всей игры
        playerSpeed: 0.7,
        _oldSelectRoad: undefined, //Переменная для хранения ссылки на последнюю кликнутую дорогу на поле
        _collisionManager: null,
        oldSelectRoad: undefined, //Переменная для хранения ссылки на последнюю кликнутую дорогу на поле
        selectedRoad: undefined,
        collisionManager: null,
        commandAddState: "road", //флаг обозначающий куда мы добавляем команды из скрола
        parentAdd: null, // родительский элемент куда нужно добовлять команды из скрола
        lastAddCommandH: 0, //высота последней добавленной команды в кодмап
        labelBoxes: cc.Label,
    },

    start() {
        //Инициализируем глобальные переменные игры в класс ДИРЕКТОРА
        if (!cc.director._globalVariables)
            cc.director._globalVariables = this;
        cc.director._globalVariables.commandAddState = this.commandAddState;
        cc.director._globalVariables.oldSelectRoad = undefined;
        cc.director._globalVariables.selectedRoad = undefined;
        cc.director._globalVariables.scrollNode = this.node.getChildByName("ScrollsNode");
        cc.director._globalVariables.labelBoxes = this.labelBoxes;

        this.collisionManager = cc.director.getCollisionManager();
        this.collisionManager.enabled = true;
        if (this.isDebug) {
            this.collisionManager.enabledDebugDraw = true;
            this.collisionManager.enabledDrawBoundingBox = true;
        }
    },
});
