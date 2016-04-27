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
        scoresound:{
            default: null,
            url: cc.AudioClip,
        },
        bgmsound:{
            default: null,
            url: cc.AudioClip, 
        },
        timelabel:{
            default: null,
            type: cc.Label,
        },
        scorelabel:{
            default: null,
            type: cc.Label,
        },
    },

    // use this for initialization
    onLoad: function () {
        this.time = 0;
        this.generateStar();
        
        this.callback = function() {
            // 这里的 this 指向 component
            this.countTime();
        };
        this.schedule(this.callback, 1);
        cc.audioEngine.playMusic(this.bgmsound, true);
    },
    
    /**
     * 计时
     */
    countTime: function(){
        this.time += 1;
        this.timelabel.string = 'time:'+this.time;
    },
    
    /**
     * 展示分数
     */
    showScore: function(){
        this.scorelabel.string = 'score:'+this.time;
        cc.audioEngine.stopMusic(true);
    },
    
    stopCountTime: function(){
        this.unschedule(this.callback);
    },

    // 生成星星
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
