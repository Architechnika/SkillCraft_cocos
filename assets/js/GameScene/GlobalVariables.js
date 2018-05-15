/*Скрипт содержащий в себе глобальные переменные игры*/

cc.Class({
    extends: cc.Component,

    properties: {
<<<<<<< HEAD
        currentLabSize: 3, //Текущий размер лабиринта
        isDebug: false, //Дебаг режим для всей игры
        _oldSelectRoad: undefined, //Переменная для хранения ссылки на последнюю кликнутую дорогу на поле
        _collisionManager: null,
=======
        oldSelectRoad: undefined,//Переменная для хранения ссылки на последнюю кликнутую дорогу на поле
        selectedRoad: undefined,
        currentLabSize: 51,//Текущий размер лабиринта
        collisionManager:null,
>>>>>>> bf72e2b8b0f7f1e20f9f0b11e9fef0aa5a608f8f
    },

    start() {
        this.collisionManager = cc.director.getCollisionManager();
        if (this.isDebug) {
            this.collisionManager.enabled = true;
            this.collisionManager.enabledDebugDraw = true;
            this.collisionManager.enabledDrawBoundingBox = true;
        }
    },
});
