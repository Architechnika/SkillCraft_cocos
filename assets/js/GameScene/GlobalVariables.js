/*Скрипт содержащий в себе глобальные переменные игры*/

cc.Class({
    extends: cc.Component,

    properties: {
        oldSelectRoad: undefined,//Переменная для хранения ссылки на последнюю кликнутую дорогу на поле
        currentLabSize: 51,//Текущий размер лабиринта
        collisionManager:null,
    },

    start () {
        this.collisionManager = cc.director.getCollisionManager();
        this.collisionManager.enabled = true;
        this.collisionManager.enabledDebugDraw = true;
        this.collisionManager.enabledDrawBoundingBox = true;
    },
});
