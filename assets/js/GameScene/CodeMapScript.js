/*
  Обработчики кликов и событий связанных с перемещением удалением и тд элементов из кодмапа.  
*/

cc.Class({
    extends: cc.Component,

    properties: {
    },
    
    start () {

    },
    
    //Обработчик кнопки сохранить скрипт
    onButtonSaveClick(event){
        console.log("Тут сохранять скрипт")
    },
    
    //Обработчик кнопки очистить кодмап
    onButtonClearClick(event){
        console.log("Тут очищать кодмап");
    },
});
