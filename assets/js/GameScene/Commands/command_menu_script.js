

cc.Class({
    extends: cc.Component,

    properties: {
        _targetNode: cc.Node,//Элемент на котором висит меню
        isMove: false,//Флаг который отображает режим перемещения команд в кодмапе
    },

    start () {

    },
    
    onMoveClick(event){
        console.log(event.target.name + " on " + this.node._targetNode.name);
        this.node._targetNode.active = false;//Отображаем режим перемещения команд
        this.node.isMove = true;
    },
    
    onReplaceClick(event){
        console.log(event.target.name);
    },
    
    onAddClick(event){
        console.log(event.target.name);
    },
    
    onDeleteClick(event){
        /*var spl = event.target.name.split("_")[1];
        if (spl && spl == "block") {//Если это блок со сложной командой то меню надо располагать не в центре а в левом верхнем элементе*/
        var par = this.node._targetNode.parent;
        if(par.name == "CodeMapNode"){
            //this.node._targetNode.destroy();
            par.removeChild(this.node._targetNode);
        }
        else{
            if(par.name == "commands"){
                var obj = par.parent;
                var objScr = obj.getComponent("command_if_script") ? obj.getComponent("command_if_script") : undefined;
                objScr = obj.getComponent("command_repeatif_script") ? obj.getComponent("command_repeatif_script") : objScr;
                objScr = obj.getComponent("command_counter_script") ? obj.getComponent("command_counter_script") : objScr;
                if(objScr){
                    objScr.deleteCommand(obj.parent);
                }
            }
        }
        this._deleteFromRoadCommands(cc.director._globalVariables.selectedRoad.getComponent("RoadScript").roadCommands, this.node._targetNode);
        cc.director._globalVariables.codeMapNode.getComponent("GenCodeMap").generation();
        //console.log(event.target.name + " on " + this.node._targetNode.name);
    },
    //Рекурсивный поиск элементов в массиве всех команд массиве и удаление ее
    _deleteFromRoadCommands(commandsArr, element){
        for(var i = 0 ; i < commandsArr.length; i++){
            if(commandsArr[i] == element){
                //Удаление
                console.log("УДЛЯЮ НАХОЙ");
                var obj = commandsArr.splice(i,1);
                obj[0].active = false;//-------------------------------------------------------------------------------------------------*-ТУТ ВОЗМОЖНА УТЕЧКА КОДА*------------------------------------
                return true;
            }
            else if(commandsArr[i]._children.length > 0){
                if(this._deleteFromRoadCommands(commandsArr[i]._children, element))
                    return true;
            }
        }
        return false;
    }
});
