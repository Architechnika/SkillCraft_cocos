cc.Class({
    extends: cc.Component,

    properties: {
<<<<<<< HEAD
        _targetNode: cc.Node,//Элемент на котором висит меню
        isMove: false,//Флаг который отображает режим перемещения команд в кодмапе
=======
        _targetNode: cc.Node, //Элемент на котором висит меню
>>>>>>> 1b91807d249f1d3aeedcd26b3c9c6a042302c5aa
    },

    start() {

    },
<<<<<<< HEAD
    
    onMoveClick(event){
        console.log(event.target.name + " on " + this.node._targetNode.name);
        this.node._targetNode.active = false;//Отображаем режим перемещения команд
        this.node.isMove = true;
=======

    onMoveClick(event) {
        console.log(event.target.name);
>>>>>>> 1b91807d249f1d3aeedcd26b3c9c6a042302c5aa
    },

    onReplaceClick(event) {
        console.log(event.target.name);
    },

    onAddClick(event) {
        console.log(event.target.name);
    },

    onDeleteClick(event) {
        var par = this.node._targetNode; // элемент над которым кликнули удалить
        if (par.parent && par.parent.name == "CodeMapNode") {
            var roadCommands = cc.director._globalVariables.selectedRoad.getComponent("RoadScript").roadCommands;
            this._deleteFromRoadCommands(roadCommands, par)
            par.parent.removeChild(par)
        } else {
            if (par.parent.name == "commands" || par.parent.name == "elseCommands") {
                var obj = par.parent.parent;
                if(par.parent.name == "elseCommands")
                    obj = par.parent.parent.parent;
                var objScr = obj.getComponent("command_if_script") ? obj.getComponent("command_if_script") : undefined;
                objScr = obj.getComponent("command_repeatif_script") ? obj.getComponent("command_repeatif_script") : objScr;
                objScr = obj.getComponent("command_counter_script") ? obj.getComponent("command_counter_script") : objScr;
                if (objScr) {
                    objScr.deleteCommand(par);
                }
            }
        }
        cc.director._globalVariables.codeMapNode.getComponent("GenCodeMap").generation();
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
