/*
  Обработчики кликов и событий связанных с перемещением удалением и тд элементов из кодмапа.  
*/

cc.Class({
    extends: cc.Component,

    properties: {
    },


    start () {

    },
    
    onCollisionExit: function (other, self) {
        console.log(other.node.convertToWorldSpace(cc.p(other.node.x, other.node.y)));
    },
});
