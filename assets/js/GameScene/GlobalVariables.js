/*Скрипт содержащий в себе глобальные переменные игры*/

cc.Class({
    extends: cc.Component,

    properties: {
        currentLabSize: 11, //Текущий размер лабиринта
        isDebug: false, //Дебаг режим для всей игры
        playerSpeed: 0.7,
        _oldSelectRoad: undefined, //Переменная для хранения ссылки на последнюю кликнутую дорогу на поле
        _collisionManager: null,
        oldSelectRoad: undefined,//Переменная для хранения ссылки на последнюю кликнутую дорогу на поле
        selectedRoad: undefined,
        collisionManager:null,
        commandAddState: "road", //флаг обозначающий куда мы добавляем команды из скрола
        parentAdd: null, // родительский элемент куда нужно добовлять команды из скрола
    },

    start() {
        //Инициализируем глобальные переменные игры в класс ДИРЕКТОРА
        if(!cc.director._labSize)
            cc.director._labSize = this.currentLabSize;
        
        this.collisionManager = cc.director.getCollisionManager();
        this.collisionManager.enabled = true;
        if (this.isDebug) {
            this.collisionManager.enabledDebugDraw = true;
            this.collisionManager.enabledDrawBoundingBox = true;
        }
    },
});