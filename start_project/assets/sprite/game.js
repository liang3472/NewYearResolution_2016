cc.Class({
    extends: cc.Component,

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
        player:{
            default: null,
            type: cc.Sprite,
        },
        starPrefab:{
            default: null,
            type: cc.Prefab,
        },
        ground:{
            default: null,
            type: cc.Node,
        },
        gameover:{
            default: null,
            type: cc.Layout,
        },
    },

    // use this for initialization
    onLoad: function () {
        this.generateStar();
    },

    generateStar: function(){
        this.star = cc.instantiate(this.starPrefab);
        this.node.addChild(this.star);
        
        var width = cc.director.getWinSize().width;
        var newX = cc.randomMinus1To1()*width/2;
        
        var maxHeight = this.player.getComponent('player').maxHeight;
        var groundY = this.ground.getPositionY();
        var newY = cc.random0To1()*maxHeight+groundY+50;
        
        this.star.getComponent('star').init(this);
        this.star.setPosition(cc.p(newX, newY));
    },
    
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {
        
    // },
});
