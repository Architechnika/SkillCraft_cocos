/*Скрипт содержащий в себе глобальные переменные игры*/

cc.Class({
    extends: cc.Component,

    properties: {
        currentLabSize: 3, //Текущий размер лабиринта
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
        lastDeleteCommandH: 0,
        labelBoxes: cc.Label,
        localStorageScript: null,
    },

    onLoad() {
        //Инициализируем глобальные переменные игры в класс ДИРЕКТОРА
        if (!cc.director._globalVariables) {//Выполняется когда игра только запустилась
            cc.director._globalVariables = this;
            cc.director._globalVariables.player_cellCounter = 0;
            //Переменные связанные с уровнем робота-----------------------------------------------------
            cc.director._globalVariables.player_gExp = 0; //Этот параметр будет загружен из сохранения              !---------SAVE
            cc.director._globalVariables.player_pLvlExp = 0;//Количество опыта для предыдущего уровня               !---------SAVE
            cc.director._globalVariables.player_nLvlExp = 100;//Количество опыта для следующего уровня              !---------SAVE
            cc.director._globalVariables.player_lvl = 1;
            //------------------------------------------------------------------------------------------
            cc.director._globalVariables.player_totalSeconds = 0; //Время которое потребовалось роботу для прохождения лабиринта
            cc.director._globalVariables.player_totalBoxes = 0;
            cc.director._globalVariables.player_totalErrors = 0;                                                    //!---------SAVE
        }
        cc.director._globalVariables.commandAddState = this.commandAddState;
        cc.director._globalVariables.oldSelectRoad = undefined;
        cc.director._globalVariables.selectedRoad = undefined;
        cc.director._globalVariables.gameNode = this.node.getChildByName("GameNode");
        cc.director._globalVariables.scrollNode = this.node.getChildByName("ScrollsNode");
        cc.director._globalVariables.codeMapNode = this.node.getChildByName("CodeMapMask").getChildByName("CodeMapNode");
        cc.director._globalVariables.codeMapMenu = this.node.parent.getChildByName("command_menu");
        cc.director._globalVariables.labelBoxes = this.labelBoxes;
        cc.director._globalVariables.localStorageScript = this.node.getComponent("LocalStorageController")
        cc.director._globalVariables.expBar = this.node.getChildByName("GUINode").getChildByName("exp_progressBar"); //Прогресс бар для опыта
        cc.director._globalVariables.nodeCommandToInit = undefined; //ССылка но обьект в который мы добавляем значение(blockA blockB или countBlock в кодмапе)
        cc.director._globalVariables.addCommandMode = false; //Флаг для включения режима добавления команды к команде
        cc.director._globalVariables.eventDownedOn = undefined;

        //Функция скрывающая скролы
        cc.director._setScrollVisible = function (visibleRight, visibleLeft) {
            if (this._globalVariables.scrollNode) {
                if (visibleRight !== undefined) {
                    var right = this._globalVariables.scrollNode.getChildByName("rightScroll")
                    if (right)
                        right.active = visibleRight;
                }
                if (visibleLeft !== undefined) {
                    var left = this._globalVariables.scrollNode.getChildByName("leftScroll");
                    if (left)
                        left.active = visibleLeft;
                }
            }
        }

        this.collisionManager = cc.director.getCollisionManager();
        this.collisionManager.enabled = true;
        if (this.isDebug) {
            this.collisionManager.enabledDebugDraw = true;
            this.collisionManager.enabledDrawBoundingBox = true;
        }
    },
});
