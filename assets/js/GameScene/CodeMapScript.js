/*
  Обработчики кликов и событий связанных с перемещением удалением и тд элементов из кодмапа.  
*/

cc.Class({
    extends: cc.Component,

    properties: {},

    start() {

    },

    //Обработчик кнопки сохранить скрипт
    onButtonSaveClick(event) {
        cc.director._globalVariables.saveCommandWindow.active = true;
    },

    //Обработчик кнопки очистить кодмап
    onButtonClearClick(event) {
        //Сема, сделаешь обработчик очистки кодмапа сегодня?(крестик рядом с сохранением)
    },
});
