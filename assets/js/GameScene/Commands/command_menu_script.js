cc.Class({
    extends: cc.Component,

    properties: {
        _targetNode: cc.Node, //Элемент на котором висит меню
        isMove: false, //Флаг который отображает режим перемещения команд в кодмапе
    },

    start() {

    },
    onMoveClick(event) {
        /*console.log(event.target.name + " on " + this.node._targetNode.name);
        this.node._targetNode.active = false;//Отображаем режим перемещения команд
        this.node.isMove = true;*/
    },
    onLoad() {
        this.node.getScriptComplexCommand = this.getScriptComplexCommand;
        this.node.on('mousedown', function (event) {
            cc.director._globalVariables.eventDownedOn = this.name;
        });
    },
    onReplaceClick(event) {
        console.log(event.target.name);
    },

    onAddClick(event) {
        //console.log(event.target.name);
        cc.director._globalVariables.addCommandMode = true;
        cc.director._setScrollVisible(true, false);
        cc.director._globalVariables.codeMapMenu.active = false;
    },

    onDeleteClick(event) {
        var complComm = this.getScriptComplexCommand();
        if (!complComm.isComplex) {
            var roadCommands = cc.director._globalVariables.selectedRoad.getComponent("RoadScript").roadCommands;
            this._deleteFromRoadCommands(roadCommands, complComm.obj)
            complComm.obj.parent.removeChild(complComm.obj);
        } else {
            complComm.obj.deleteCommand(par);
        }
        cc.director._globalVariables.codeMapNode.getComponent("GenCodeMap").generation();
        cc.director._globalVariables.codeMapMenu.active = false;
    },
    //Возвращает обьект скрипта и флаг внутри сложной команды содержится обьект или в основной ветке
    getScriptComplexCommand() {
        var isC = false;
        var currObj = undefined;

        var par = cc.director._globalVariables.codeMapMenu._targetNode; // элемент над которым кликнули удалить
        if (par.parent && par.parent.name == "CodeMapNode") {
            currObj = par;
        } else {
            if (par.parent.name == "commands" || par.parent.name == "elseCommands") {
                var obj = par.parent.parent;
                if (par.parent.name == "elseCommands")
                    obj = par.parent.parent.parent;
                var objScr = obj.getComponent("command_if_script") ? obj.getComponent("command_if_script") : undefined;
                objScr = obj.getComponent("command_repeatif_script") ? obj.getComponent("command_repeatif_script") : objScr;
                objScr = obj.getComponent("command_counter_script") ? obj.getComponent("command_counter_script") : objScr;
                if (objScr) {
                    currObj = objScr;
                    isC = true;
                }
            }
        }
        return {
            obj: currObj,
            isComplex: isC,
        }
    },
    //обходим основной массив команд на дороге и ищем элемент для удаления
    _deleteFromRoadCommands(commandsArr, element) {
        if (commandsArr && element) {
            for (var i = 0; i < commandsArr.length; i++) {
                var el = commandsArr[i];
                if (el == element) {
                    commandsArr.splice(i, 1);
                    break;
                }
            }
        }
    }
});
