

cc.Class({
    extends: cc.Component,

    properties: {
        messageLabel: cc.Label,
        videoPlayer: cc.VideoPlayer,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        //this.videoPlayer.play();
        this.node.on('mouseup', this._onMouseClickEvent);
    },
    //Обработчик клмков мыши. Он пустой для того чтобы прервать ивент клика на форму(и не отработать клик по полю)
    onMouseClickEvent(event){
        
    },
    
    //Обработчик клика по КРЕСТИКУ(закрыть окно)
    onCloseButtonClick(event){
        this.node.active = false;
    },
    //Обработчик клика по кнопке показать следующую подсказку
    onNextButtonClick(event){
        
    },
    //Обработчик клика по кнопке показать предыдущую подсказку
    onPrevButtonClick(event){
        
    },
    // update (dt) {},
});
