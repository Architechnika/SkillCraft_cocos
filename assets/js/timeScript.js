
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
        this._totalSeconds += dt;
        cc.director._globalVariables.localStorageScript.time = this._totalSeconds;
        var sec = Math.floor(this._totalSeconds % 60);
        var min = Math.floor(this._totalSeconds / 60);
        var text = (min < 10 ? "0" + min : min) + ":" + (sec < 10 ? "0" + sec : sec);
        this.node._components[0].string = text;
    },
});
