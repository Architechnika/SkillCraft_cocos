/*
    Скрипт отвечающий за работу с файловой системой. Загрузка и сохранение пользовательских данных
*/
// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        arrayRoadCommandsNames: [], //массив где храниться имена команд для загрузки
        arrayBinRoad: [], // массив для харнения лабиринта в бинарном видке
        arrayRoadGameObjectsNames: [], //массив с именами игровый объектов
        time: 0, //игровое время
        coinCount: 0, // количество собранных очков
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
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.key = "save";
        this.saveData = {
            arrayRoadCommandsNames: [],
            arrayBinRoad: [],
            arrayRoadGameObjectsNames: [],
            time: 0,
            coinCount: 0,
            isSaved: false,
            rouColCount: 0,

        }
        if (cc.sys.localStorage.getItem(this.key)) {
            this.saveData = JSON.parse(cc.sys.localStorage.getItem(this.key));
            this.arrayRoadCommands = this.arrayCopy(this.saveData.arrayRoadCommandsNames);
            this.arrayRoadCommands = this.parseRoadsCommands(this.saveData.arrayRoadCommandsNames);
            this.isFieldDataLoaded = false;
        }
    },

    start() {

    },

    generationArrayRoadCommands(arr, nameArr) {
        // метод рукурсивно создает древовидный массив имен кодмапа для хранения
        if (arr) {
            for (var i = 0; i < arr.length; i++) {
                var el = arr[i];
                if (el.name == "command_if") {
                    var commandsArr = [] //массив для команд у if
                    var elseCommandsArr = [] //массив для else команд у if
                    var ifCommands = el.getChildByName("command_block_if").getChildByName("commands").children;
                    var elseCommands = el.getChildByName("command_block_if").getChildByName("bottom").getChildByName("elseCommands").children;
                    if (ifCommands.length > 1) {
                        this.generationArrayRoadCommands(ifCommands, commandsArr)
                    }
                    if (elseCommands.length > 1) {
                        this.generationArrayRoadCommands(elseCommands, elseCommandsArr)
                    }
                    nameArr.push(el.name)
                    nameArr.push(commandsArr)
                    nameArr.push(elseCommandsArr)
                } else if (el.name == "command_repeatif") {
                    var commandsArr = []
                    var repeatifCommands = el.getChildByName("command_block_repeatif").getChildByName("commands").children;
                    if (repeatifCommands.length > 1) {
                        this.generationArrayRoadCommands(repeatifCommands, commandsArr)
                    }
                    nameArr.push(el.name)
                    nameArr.push(commandsArr)
                } else if (el.name == "command_repeat") {
                    var commandsArr = []
                    var repeatCommands = el.getChildByName("command_block_repeat").getChildByName("commands").children;
                    if (repeatCommands.length > 1) {
                        this.generationArrayRoadCommands(repeatCommands, commandsArr)
                    }
                    nameArr.push(el.name)
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
            this.saveData.arrayRoadCommandsNames = this.arrayCopy(this.arrayRoadCommandsNames); // кидаем в объект saveData бинарный массив для хранения имел команд кодмапа для каждой дороги
            this.saveData.arrayRoadGameObjectsNames = this.arrayCopy(this.arrayRoadGameObjectsNames); //массив игровый объектов на дороге
            this.saveData.time = this.time;
            this.saveData.isSaved = true;
            if (cc.director._globalVariables)
                this.saveData.rouColCount = cc.director._globalVariables.currentLabSize;
            cc.sys.localStorage.setItem(this.key, JSON.stringify(this.saveData))
        }
    },

    parseRoadsCommands(arr) {
        var arrPref = this.arrayCopy(arr);
        for (var i = 0; i < arr.length - 1; i++) {
            for (var j = 0; j < arr.length - 1; j++) {
                var commands = arr[i][j];
                if (Array.isArray(commands)) {
                    var par = cc.instantiate(this.allcommands[31]);
                    this.complexCommandParse(commands, par, null)
                    arrPref[i][j] = par
                }
            }
        }
        return arrPref;
    },
    complexCommandParse(arr, par, complexPref) {
        if (arr && arr.length > 0 && this.allcommands.length > 0) {
            for (var el = 0; el < arr.length; el++) {
                var comm = arr[el];
                if (comm == "command_if") {
                    var ifPrefab = cc.instantiate(this.allcommands[0])
                    var ifComm = ifPrefab.getChildByName("command_block_if").getChildByName("commands");
                    var ifCommElse = ifPrefab.getChildByName("command_block_if").getChildByName("bottom").getChildByName("elseCommands");
                    if (par.name == "command_none")
                        par.addChild(ifPrefab)
                    else if (par.name == "commands")
                        complexPref.getChildByName("command_block_if").getComponent("command_if_script").addCommand(ifPrefab);
                    else if (par.name == "elseCommands")
                        complexPref.getChildByName("command_block_if").getComponent("command_if_script").addElseCommand(ifPrefab)
                    this.complexCommandParse(arr[el + 1], ifComm, ifPrefab);
                    this.complexCommandParse(arr[el + 2], ifCommElse, ifPrefab);
                    el += 2;
                } else if (comm == "command_repeatif") {
                    var repeatifPrefab = cc.instantiate(this.allcommands[1])
                    var repeatifComm = repeatifPrefab.getChildByName("command_block_repeatif").getChildByName("commands");
                    if (par.name == "command_none")
                        par.addChild(repeatifPrefab)
                    else if (par.name == "commands")
                        complexPref.getChildByName("command_block_repeatif").getComponent("command_repeatif_script").addCommand(repeatifPrefab);
                    this.complexCommandParse(arr[el + 1], repeatifComm, repeatifPrefab);
                    el += 1;
                } else if (comm == "command_repeat") {
                    var repeatPrefab = cc.instantiate(this.allcommands[2])
                    var repeatComm = repeatPrefab.getChildByName("command_block_repeat").getChildByName("commands");
                    if (par.name == "command_none")
                        par.addChild(repeatPrefab)
                    else if (par.name == "commands")
                        complexPref.getChildByName("command_block_repeat").getComponent("command_counter_script").addCommand(repeatPrefab);
                    this.complexCommandParse(arr[el + 1], repeatComm, repeatPrefab);
                    el += 1;
                } else {
                    for (var pNames = 0; pNames < this.allcommands.length; pNames++) {
                        var pf = this.allcommands[pNames]
                        if (pf.data.name == comm) {
                            var child = cc.instantiate(pf);
                            if (complexPref != null) {
                                if (par.name == "commands") {
                                    if (complexPref.name == "command_if") {
                                        complexPref.getChildByName("command_block_if").getComponent("command_if_script").addCommand(child);
                                    }
                                    if (complexPref.name == "command_repeatif") {
                                        complexPref.getChildByName("command_block_repeatif").getComponent("command_repeatif_script").addCommand(child);
                                    }
                                    if (complexPref.name == "command_repeat") {
                                        complexPref.getChildByName("command_block_repeat").getComponent("command_counter_script").addCommand(child);
                                    }
                                } else if (par.name == "elseCommands") {
                                    complexPref.getChildByName("command_block_if").getComponent("command_if_script").addElseCommand(child)
                                }
                            } else
                                par.addChild(child);
                            continue;
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

    update(dt) {
        this.save()
        //console.log(this.saveData.arrayRoadCommandsNames)
        // console.log(this.arrayRoadCommandsNames)
    },
});
