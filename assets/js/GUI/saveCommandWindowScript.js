

cc.Class({
    extends: cc.Component,

    properties: {
        editBox: cc.EditBox,
    },

    start () {
        //Добавляем обработчики событий мыши
        this.node.on(cc.Node.EventType.MOUSE_UP, this._onMouseUpEvent);
        this.node.on(cc.Node.EventType.MOUSE_DOWN, this._onMouseDownEvent);
    },

    _onMouseDownEvent(event) {
        event.stopPropagation();
    },
    //Обработчик клика мышкой
    _onMouseUpEvent(event) {
        event.stopPropagation();
    },
    
    onOkButtonClick(event){
        /*if(!this.editBox || !this.editBox.placeholder || this.editBox.string === "")
            cc.director._globalVariables.showMessageBox("Ошибка с вводом названия команд");*/
        //Если строка пустая заменяем её на дефолтную
        if(this.editBox.string == "") this.editBox.string = this.editBox.placeholder;
        //Сохраням текущий блок команд в локалсторейдж
        cc.director._globalVariables.localStorageScript.saveCommandBlock(this.editBox.string);
        this.node.active = false;
    },
    
    onCancelButtonClick(event){
        this.node.active = false;
    },
});
