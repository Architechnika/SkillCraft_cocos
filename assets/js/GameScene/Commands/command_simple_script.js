/*
    Скрипт для обработки простых команд передвижений
*/

cc.Class({
    extends: cc.Component,

    properties: {
        //up-вверх, down-вниз, left-влево, right-вправо
        //onleft - налево по отношению к роботу,
        //onright - направо по отношению к роботу,
        //onup - вперед по отношению к роботу,
        //ondown - назад по отношению к роботу,
        DIRECTION: "up",
        commandType: "simple",
    },

    start () {

    },
});
