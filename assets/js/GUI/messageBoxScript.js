//Скрипт содержащий методы для работы с messageBox-ом

cc.Class({
    extends: cc.Component,

    properties: {
        textLabel: cc.Label,
        okButton: cc.Node,
        cancelButton: cc.Node,
    },

    start() {
        //Добавляем обработчики событий мыши
        this.node.on(cc.Node.EventType.MOUSE_UP, this._onMouseUpEvent);
        //Пробрасываем на ноду методы и данные, чтобы их можно было получить извне
        this.node.textLabel = this.textLabel;
        this.node.okButton = this.okButton;
        this.node.cancelButton = this.cancelButton;
        //Инитим метов отрисовки текста чтобы вызывать его извне
        this.node.showText = this.showText;
        this.node.buttonOkStartXPoint = this.okButton.x;//Запоминаем стартовое расположение кнопки ОК(потому что мы ее можем двигать по окну)
    },

    //Выводит текст в messageBoxLabelText
    //mode = 1 - показать сообщение с двуми кнопками ОК и ОТМЕНА
    showText(text, mode) {
        if (this.textLabel) {
            if (this.textLabel.string) {
                this.textLabel.string = text;
            }
        }
        if (!this.node.active)
            this.node.active = true;
        //Если меняем режим отображения кнопок
        if (mode !== undefined) {
            if (mode == 0) {//mode = 0 - показать сообщение с одной кнопкой ОК
                this.okButton.x = 0;
                this.cancelButton.active = false;
            } else if(mode == 1){
                this.okButton.x = this.buttonOkStartXPoint;
                this.cancelButton.active = true;
            }
        }
    },
    //Обработчик клика мышкой
    _onMouseUpEvent(event) {
        if (event.target == this.okButton) { //Нажатие на кнопку ОК
            this.active = false;
        } else if (event.target == this.cancelButton) { //Нажатие на кнопку отменить
            this.active = false;
        } else { //Иначе просто отменяем событие клика
            event.stopPropagation();
        }
    }

});
