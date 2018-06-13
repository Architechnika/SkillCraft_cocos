
cc.Class({
    extends: cc.Component,

    properties: {
        _totalSeconds : 0,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    update (dt) 
    {
        cc.director._globalVariables.player_totalSeconds += dt;
        var secS = cc.director._globalVariables.player_totalSeconds;
        cc.director._globalVariables.localStorageScript.time = sec;
        var sec = Math.floor(secS % 60);
        var min = Math.floor(secS / 60);
        var text = (min < 10 ? "0" + min : min) + ":" + (sec < 10 ? "0" + sec : sec);
        this.node._components[0].string = text;
    },
});
