cc.Class({
    extends: cc.Component,

    properties: {
        _targetNode: cc.Node, //Элемент на котором висит меню
    },

    start() {

    },

    onMoveClick(event) {
        console.log(event.target.name);
    },

    onReplaceClick(event) {
        console.log(event.target.name);
    },

    onAddClick(event) {
        console.log(event.target.name);
    },

    onDeleteClick(event) {
        /*var spl = event.target.name.split("_")[1];
        if (spl && spl == "block") {//Если это блок со сложной командой то меню надо располагать не в центре а в левом верхнем элементе*/
        var par = this.node._targetNode; // элемент над которым кликнули удалить
        if (par.parent && par.parent.name == "CodeMapNode") {
            //this.node._targetNode.destroy();
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
        //        this._deleteFromRoadCommands(cc.director._globalVariables.selectedRoad.getComponent("RoadScript").roadCommands, this.node._targetNode);
        //        cc.director._globalVariables.codeMapNode.getComponent("GenCodeMap").generation();
        //console.log(event.target.name + " on " + this.node._targetNode.name);
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
