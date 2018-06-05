

cc.Class({
    extends: cc.Component,

    properties: {
        _targetNode: cc.Node,
    },

    start () {

    },
    
    onMoveClick(event){
        console.log(event.target.name);
    },
    
    onReplaceClick(event){
        console.log(event.target.name);
    },
    
    onAddClick(event){
        console.log(event.target.name);
    },
    
    onDeleteClick(event){
        console.log(event.target.name);
    },
});
