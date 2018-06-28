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
        console.log("Тут сохранять скрипт")
        cc.director._globalVariables.localStorageScript.save();
        if(!cc.director._globalVariables.selectedRoad)
            return;
        var selRoadSrc = cc.director._globalVariables.selectedRoad.getComponent("RoadScript");
        var saveData = cc.director._globalVariables.localStorageScript.saveData;
        if (selRoadSrc && selRoadSrc !== undefined) {
            if (saveData.arraySaveCommands) {} else {
                saveData.arraySaveCommands = [];

            }
            saveData.arraySaveCommands.push("name")
            saveData.arraySaveCommands.push(saveData.arrayRoadCommandsNames[selRoadSrc.getI()][selRoadSrc.getJ()])
            cc.sys.localStorage.setItem(cc.director._globalVariables.localStorageScript.key, JSON.stringify(saveData))
        }
    },

    //Обработчик кнопки очистить кодмап
    onButtonClearClick(event) {
        console.log("Тут очищать кодмап");
    },
});
