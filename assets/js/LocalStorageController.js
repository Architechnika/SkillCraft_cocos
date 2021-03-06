/*
    Скрипт отвечающий за работу с файловой системой. Загрузка и сохранение пользовательских данных
*/

cc.Class({
    extends: cc.Component,

    properties: {
        arrayRoadCommandsNames: [], //массив где храниться имена команд для загрузки
        arrayBinRoad: [], // массив для харнения лабиринта в бинарном видке
        arrayRoadGameObjectsNames: [], //массив с именами игровый объектов
        time: 0, //игровое время
        coinCount: 0, // количество собранных очков
        _timeCounter: 0,
        allcommands: {
            default: [],
            type: cc.Prefab
        },
    },
    roadElemsArr: null, //массив с элементами дороги, для обхода  и храенинеи команды если они есть
    saveData: null,
    key: "save",
    arrayRoadCommands: null,
    isFieldDataLoaded: false,
    isFristSave: null,
    arrayLoadCommandBlocks: null, // массив для хранения сохраненных скриптов
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.key = "save";
        this.arrayLoadCommandBlocks = [];
        this.isFristSave = true;
        this.saveData = {
            arrayRoadCommandsNames: [],
            arrayBinRoad: [],
            arrayRoadGameObjectsNames: [],
            reLoadGameObjectsNames: [],
            // arraySaveCommands: [],
            reLoadCoinCount: 0,
            reLoadGExp: 0,
            reLoadPLvlExp: 0,
            reLoadNLvlExp: 100,
            reLoadLvl: 1,
            reLoadTotalLabs: 0,
            reLoadTotalBoxes: 0,
            time: 0,
            coinCount: 0,
            isSaved: false,
            rouColCount: 0,
            cellCounter: 0,
            gExp: 0,
            pLvlExp: 0,
            nLvlExp: 100,
            lvl: 1,
            totalBoxes: 0,
            totalErrors: 0,
            totalLabs: 0,

        }
        if (cc.sys.localStorage.getItem(this.key)) {
            this.saveData = JSON.parse(cc.sys.localStorage.getItem(this.key));
            if (this.saveData.arraySaveCommands && this.saveData.arraySaveCommands.length > 0) {
                this.commandBlocksParser(this.saveData.arraySaveCommands, this.arrayLoadCommandBlocks);
            }
        }
        if (cc.sys.localStorage.getItem(this.key) && cc.sys.localStorage.getItem("isNewGame") && cc.sys.localStorage.getItem("isNewGame") == "false") {
            //            this.saveData = JSON.parse(cc.sys.localStorage.getItem(this.key));
            this.arrayRoadCommands = this.arrayCopy(this.saveData.arrayRoadCommandsNames);
            this.arrayRoadCommands = this.parseRoadsCommands(this.saveData.arrayRoadCommandsNames);
            this.isFieldDataLoaded = false;
            cc.director._globalVariables.currentLabSize = this.saveData.rouColCount;
            cc.director._globalVariables.player_cellCounter = this.saveData.cellCounter;
            cc.director._globalVariables.player_gExp = this.saveData.gExp;
            cc.director._globalVariables.player_pLvlExp = this.saveData.pLvlExp;
            cc.director._globalVariables.player_nLvlExp = this.saveData.nLvlExp;
            cc.director._globalVariables.player_lvl = this.saveData.lvl;
            cc.director._globalVariables.player_totalBoxes = this.saveData.totalBoxes;
            cc.director._globalVariables.player_totalErrors = this.saveData.totalErrors;
            cc.director._globalVariables.player_totalLabs = this.saveData.totalLabs;
            cc.director._globalVariables.player_totalSeconds = this.saveData.time;
        }
    },

    start() {},

    generationArrayRoadCommands(arr, nameArr) {
        // метод рукурсивно создает древовидный массив имен кодмапа для хранения
        if (arr) {
            for (var i = 0; i < arr.length; i++) {
                var el = arr[i];
                if (el.name == "command_if") {
                    var commandsArr = [] //массив для команд у if
                    var elseCommandsArr = [] //массив для else команд у if
                    var interactArr = [];
                    var ifCommands = el.getChildByName("command_block_if").getChildByName("commands").children;
                    var elseCommands = el.getChildByName("command_block_if").getChildByName("bottom").getChildByName("elseCommands").children;
                    if (ifCommands.length > 1) {
                        this.generationArrayRoadCommands(ifCommands, commandsArr)
                    }
                    if (elseCommands.length > 1) {
                        this.generationArrayRoadCommands(elseCommands, elseCommandsArr)
                    }
                    nameArr.push(el.name)
                    var lookName = "null"
                    for (var k = 0; k < el.getChildByName("command_block_if").children.length; k++) {
                        //добавляем проверку того куда смотрит робот
                        var ch = el.getChildByName("command_block_if").children[k]
                        if (ch.name.indexOf("command_look") >= 0) {
                            if (ch.active == true) {
                                lookName = ch.name
                            }
                        }
                        if (ch.name.indexOf("command_interact") >= 0) {
                            if (ch.active == true) {
                                interactArr.push(ch.name)
                            }
                        }
                    }
                    nameArr.push(lookName)
                    nameArr.push(interactArr)
                    nameArr.push(commandsArr)
                    nameArr.push(elseCommandsArr)
                } else if (el.name == "command_repeatif") {
                    var commandsArr = [];
                    var interactArr = [];
                    var repeatifCommands = el.getChildByName("command_block_repeatif").getChildByName("commands").children;
                    if (repeatifCommands.length > 1) {
                        this.generationArrayRoadCommands(repeatifCommands, commandsArr)
                    }
                    //
                    var lookName = "null"
                    for (var k = 0; k < el.getChildByName("command_block_repeatif").children.length; k++) {
                        //добавляем проверку того куда смотрит робот
                        var ch = el.getChildByName("command_block_repeatif").children[k]
                        if (ch.name.indexOf("command_look") >= 0) {
                            if (ch.active == true) {
                                lookName = ch.name
                            }
                        }
                        if (ch.name.indexOf("command_interact") >= 0) {
                            if (ch.active == true) {
                                interactArr.push(ch.name)
                            }
                        }
                    }
                    //
                    nameArr.push(el.name)
                    nameArr.push(lookName)
                    nameArr.push(interactArr)
                    nameArr.push(commandsArr)
                } else if (el.name == "command_repeat") {
                    var commandsArr = []
                    var repeatCommands = el.getChildByName("command_block_repeat").getChildByName("commands").children;
                    var counter = el.getChildByName("command_block_repeat").getComponent("command_counter_script")._counter;
                    if (repeatCommands.length > 1) {
                        this.generationArrayRoadCommands(repeatCommands, commandsArr)
                    }
                    nameArr.push(el.name)
                    nameArr.push(counter)
                    nameArr.push(commandsArr)
                } else {
                    if (el.name != "command_plus")
                        nameArr.push(el.name)
                }

            }
        }
        return nameArr;
    },
    save() {
        if (this.roadElemsArr && this.roadElemsArr.length > 0) {
            this.arrayRoadCommandsNames.length = 0;
            this.arrayRoadGameObjectsNames.length = 0;
            if (this.arrayBinRoad && this.arrayBinRoad.length == 0) {
                this.arrayBinRoad = this.arrayCopy(this.saveData.arrayBinRoad)
                this.arrayRoadCommandsNames = this.arrayCopy(this.saveData.arrayRoadCommandsNames)
                this.arrayRoadGameObjectsNames = this.arrayCopy(this.saveData.arrayRoadGameObjectsNames)
            } else {
                this.arrayRoadCommandsNames = this.arrayCopy(this.arrayBinRoad)
                this.arrayRoadGameObjectsNames = this.arrayCopy(this.arrayBinRoad)
                this.saveData.arrayBinRoad = this.arrayCopy(this.arrayBinRoad); //кидаем в объект saveData бинарный массив для генерации поля
            }
            for (var i = 0; i < this.roadElemsArr.length; i++) {
                var road = this.roadElemsArr[i];
                if (road.name.indexOf("filed_start") >= 0) //таким образом мы не сохраняем первую команду под роботом, чтобы не загрузить его каждый раз, он всегда создаеться и вовремя ново игры и при загрузке
                    continue;
                var i_r = road.getComponent("RoadScript").getI();
                var j_r = road.getComponent("RoadScript").getJ();
                if (road.roadCommands && road.roadCommands.length > 0) { // если дорога имеет команды, то храним их в соответствующем массиве
                    var arr = [];
                    var nameArr = this.generationArrayRoadCommands(road.roadCommands, arr);
                    if (i_r != null && j_r != null)
                        this.arrayRoadCommandsNames[i_r][j_r] = this.arrayCopy(nameArr);
                    nameArr.length = 0;
                    arr.length = 0;
                }
                if (road.getComponent("RoadScript").isGameObjectName != null) { //если дорога имеет игровой объект, то храним его в соответствующем месте
                    if (i_r != null && j_r != null)
                        this.arrayRoadGameObjectsNames[i_r][j_r] = road.getComponent("RoadScript").isGameObjectName
                }
            }
            if (this.isFristSave) {
                this.saveData.reLoadGameObjectsNames = this.arrayCopy(this.arrayRoadGameObjectsNames);
                this.saveData.reLoadGExp = cc.director._globalVariables.player_gExp;
                this.saveData.reLoadPLvlExp = cc.director._globalVariables.player_pLvlExp;
                this.saveData.reLoadNLvlExp = cc.director._globalVariables.player_nLvlExp;
                this.saveData.reLoadLvl = cc.director._globalVariables.player_lvl;
                this.saveData.reLoadTotalLabs = cc.director._globalVariables.player_totalLabs;
                this.saveData.reLoadTotalBoxes = cc.director._globalVariables.player_totalBoxes;
                this.isFristSave = false;
            }
            //
            this.saveData.rouColCount = cc.director._globalVariables.currentLabSize;
            this.saveData.cellCounter = cc.director._globalVariables.player_cellCounter;
            this.saveData.gExp = cc.director._globalVariables.player_gExp;
            this.saveData.pLvlExp = cc.director._globalVariables.player_pLvlExp;
            this.saveData.nLvlExp = cc.director._globalVariables.player_nLvlExp;
            this.saveData.lvl = cc.director._globalVariables.player_lvl;
            this.saveData.totalBoxes = cc.director._globalVariables.player_totalBoxes;
            this.saveData.totalErrors = cc.director._globalVariables.player_totalErrors;
            this.saveData.totalLabs = cc.director._globalVariables.player_totalLabs;
            //
            this.saveData.arrayRoadCommandsNames = this.arrayCopy(this.arrayRoadCommandsNames); // кидаем в объект saveData бинарный массив для хранения имел команд кодмапа для каждой дороги
            this.saveData.arrayRoadGameObjectsNames = this.arrayCopy(this.arrayRoadGameObjectsNames); //массив игровый объектов на дороге
            this.saveData.time = cc.director._globalVariables.player_totalSeconds
            this.saveData.isSaved = true;
            if (cc.director._globalVariables)
                this.saveData.rouColCount = cc.director._globalVariables.currentLabSize;
            cc.sys.localStorage.setItem(this.key, JSON.stringify(this.saveData))
        }
    },
    //Cохраняет команду в локал сторейдж
    saveCommandBlock(name) {
        cc.director._globalVariables.localStorageScript.save();
        if (!cc.director._globalVariables.selectedRoad)
            return;
        var selRoadSrc = cc.director._globalVariables.selectedRoad.getComponent("RoadScript");
        var saveData = cc.director._globalVariables.localStorageScript.saveData;
        if (selRoadSrc && selRoadSrc !== undefined) {
            if (saveData.arraySaveCommands) {} else {
                saveData.arraySaveCommands = [];

            }
            saveData.arraySaveCommands.push(name);
            saveData.arraySaveCommands.push(saveData.arrayRoadCommandsNames[selRoadSrc.getI()][selRoadSrc.getJ()])
            cc.sys.localStorage.setItem(cc.director._globalVariables.localStorageScript.key, JSON.stringify(saveData))
            if (this.saveData.arraySaveCommands && this.saveData.arraySaveCommands.length > 0) {
                this.arrayLoadCommandBlocks = [];
                this.commandBlocksParser(this.saveData.arraySaveCommands, this.arrayLoadCommandBlocks);
            }
        }
    },

    parseRoadsCommands(arr) {
        var arrPref = this.arrayCopy(arr);
        for (var i = 0; i < arr.length - 1; i++) {
            for (var j = 0; j < arr.length - 1; j++) {
                var commands = arr[i][j];
                if (Array.isArray(commands)) {
                    var par = cc.instantiate(this.allcommands[31]);
                    if (par && par != null) {
                        this.complexCommandParse(commands, par, null)
                        arrPref[i][j] = par
                    }
                }
            }
        }
        return arrPref;
    },
    complexCommandParse(arr, par, complexPref) {
        if (arr && arr.length > 0 && this.allcommands.length > 0) {
            //Получаем скрипт в котором функция для инициализации сложных комамнд
            var complexCommandScript = cc.director._scene.name == "GameScene" ? this.node.getChildByName("staticObj").getComponent("commands_input") : undefined;
            if (complexCommandScript === undefined)
                return;
            var method = complexCommandScript.codeViewCommandClickHandler;
            for (var el = 0; el < arr.length; el++) {
                var comm = arr[el];
                if (comm == "command_if") {
                    var ifPrefab = cc.instantiate(this.allcommands[0])
                    var ifComm = ifPrefab.getChildByName("command_block_if").getChildByName("commands");
                    var ifCommElse = ifPrefab.getChildByName("command_block_if").getChildByName("bottom").getChildByName("elseCommands");
                    method(arr[el + 1], ifPrefab.getChildByName("command_block_if").getChildByName("command_block_a"));
                    var interactArr = arr[el + 2];
                    for (var u = 0; u < interactArr.length; u++) {
                        var interName = interactArr[u];
                        method(interName, ifPrefab.getChildByName("command_block_if").getChildByName("command_ifandor_add"));
                    }
                    this.complexCommandParse(arr[el + 3], ifComm, ifPrefab.getChildByName("command_block_if").getComponent("command_if_script"));
                    this.complexCommandParse(arr[el + 4], ifCommElse, ifPrefab.getChildByName("command_block_if").getComponent("command_if_script"));
                    if (par.name == "command_none")
                        par.addChild(ifPrefab)
                    else if (par.name == "commands") {
                        complexPref.addCommand(ifPrefab)
                    } else if (par.name == "elseCommands")
                        complexPref.addElseCommand(ifPrefab)
                    el += 4;
                } else if (comm == "command_repeatif") {
                    var repeatifPrefab = cc.instantiate(this.allcommands[1])
                    var repeatifComm = repeatifPrefab.getChildByName("command_block_repeatif").getChildByName("commands");
                    method(arr[el + 1], repeatifPrefab.getChildByName("command_block_repeatif").getChildByName("command_block_a"));
                    var interactArr = arr[el + 2];
                    for (var u = 0; u < interactArr.length; u++) {
                        var interName = interactArr[u];
                        method(interName, repeatifPrefab.getChildByName("command_block_repeatif").getChildByName("command_ifandor_add"));
                    }
                    this.complexCommandParse(arr[el + 3], repeatifComm, repeatifPrefab.getChildByName("command_block_repeatif").getComponent("command_repeatif_script"));
                    if (par.name == "command_none")
                        par.addChild(repeatifPrefab)
                    else if (par.name == "commands")
                        complexPref.addCommand(repeatifPrefab);
                    el += 3;
                } else if (comm == "command_repeat") {
                    var repeatPrefab = cc.instantiate(this.allcommands[2])
                    var repeatComm = repeatPrefab.getChildByName("command_block_repeat").getChildByName("commands");
                    repeatPrefab.getChildByName("command_block_repeat").getComponent("command_counter_script")._counter = arr[el + 1]
                    this.complexCommandParse(arr[el + 2], repeatComm, repeatPrefab.getChildByName("command_block_repeat").getComponent("command_counter_script"));
                    if (par.name == "command_none")
                        par.addChild(repeatPrefab)
                    else if (par.name == "commands")
                        complexPref.addCommand(repeatPrefab);
                    el += 2;
                } else {
                    for (var pNames = 0; pNames < this.allcommands.length; pNames++) {
                        var pf = this.allcommands[pNames]
                        if (pf.data.name == comm) {
                            var child = cc.instantiate(pf);
                            if (complexPref != null) {
                                if (par.name == "commands") {
                                    complexPref.addCommand(child);
                                } else if (par.name == "elseCommands") {
                                    complexPref.addElseCommand(child)
                                }
                            } else
                                par.addChild(child);
                            break;
                        }
                    }
                }
            }
        }
    },

    arrayCopy(arr) {
        var newArray = JSON.parse(JSON.stringify(arr))
        return newArray;
    },

    commandBlocksParser(arrBlocksNames, arrBlock) {
        for (var i = 0; i < arrBlocksNames.length; i += 2) {
            var par = cc.instantiate(this.allcommands[31]);
            arrBlock.push(arrBlocksNames[i]);
            this.complexCommandParse(arrBlocksNames[i + 1], par, null)
            arrBlock.push(par);
        }
    },

    update(dt) {
        this._timeCounter += dt;
        if (this._timeCounter > 5) {
            this.save();
            this._timeCounter = 0;
        }
        if (this.isFristSave) {
            this.save();
        }
        //console.log(this.saveData.arrayRoadCommandsNames)
        // console.log(this.arrayRoadCommandsNames)
    },
});
