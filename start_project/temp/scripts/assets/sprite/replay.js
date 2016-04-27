"use strict";
cc._RFpush(module, '27f24b/tN9AF7FWevPA8SFl', 'replay');
// sprite/replay.js

cc.Class({
    "extends": cc.Component,

    properties: {
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...

        bgmsound: {
            "default": null,
            url: cc.AudioClip
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        cc.audioEngine.playEffect(this.bgmsound, false);
    },

    /**
     * 触发replay动作
     */
    replay: function replay() {
        cc.log("action to replay");
        cc.audioEngine.stopAllEffects();
        cc.director.loadScene('game');
    }

});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();