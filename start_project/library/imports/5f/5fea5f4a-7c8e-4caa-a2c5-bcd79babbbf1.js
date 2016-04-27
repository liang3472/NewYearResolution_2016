/**
 * 用到的物理公式
 * V(速度) ＝ v0(当前速度) ＋ a(加速度)＊t(时间)
 * S(位移) ＝ v(速度)＊t(时间)
 */
cc.Class({
    'extends': cc.Component,

    properties: {
        maxHeight: 0,
        speed: 0,
        accle: 0,
        jumpsound: {
            'default': null,
            url: cc.AudioClip
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.accLeft = false;
        this.accRight = false;

        this.initAnim();
        this.setListener();
    },

    /**
     * 初始化动画
     */
    initAnim: function initAnim() {
        var jumpUp = cc.moveBy(0.6, cc.p(this.node.x, this.maxHeight)).easing(cc.easeCubicActionOut());
        var jumpDown = cc.moveBy(0.6, cc.p(this.node.x, -this.maxHeight)).easing(cc.easeCubicActionIn());

        var short = cc.scaleTo(0.1, 1, 0.6);
        var long = cc.scaleTo(0.1, 1, 1.2);
        var back = cc.scaleTo(0.1, 1, 1);

        var callback = cc.callFunc(this.playJumpSound, this);

        var anim = cc.sequence(callback, short, long, jumpUp, back, jumpDown);
        this.node.runAction(cc.repeatForever(anim));
    },

    /**
     * 播放跳跃音效
     */
    playJumpSound: function playJumpSound() {
        cc.audioEngine.playEffect(this.jumpsound, false);
    },

    /**
     * 设置按钮监听事件
     * 主要监听左右按键事件
     */
    setListener: function setListener() {
        var self = this;
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function onKeyPressed(keyCode, event) {
                switch (keyCode) {
                    case cc.KEY.left:
                        self.accLeft = true;
                        self.accRight = false;
                        break;
                    case cc.KEY.right:
                        self.accLeft = false;
                        self.accRight = true;
                        break;
                    default:
                        break;
                }
            },
            onKeyReleased: function onKeyReleased(keyCode, event) {
                switch (keyCode) {
                    case cc.KEY.left:
                        self.accLeft = false;
                        self.accRight = false;
                        break;
                    case cc.KEY.right:
                        self.accLeft = false;
                        self.accRight = false;
                        break;
                    default:
                        break;
                }
            }
        }, this.node);

        // 设置触摸事件
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function onTouchBegan(event) {
                var xLine = self.node.getNodeToWorldTransform().tx;
                cc.log('play x = ' + xLine);
                var eventX = event.getLocation().x;
                cc.log('eventX x = ' + eventX);
                if (eventX > xLine) {
                    cc.log('to right');
                    self.accLeft = false;
                    self.accRight = true;
                } else if (eventX < xLine) {
                    cc.log('to left');
                    self.accLeft = true;
                    self.accRight = false;
                }
            },
            onTouchEnded: function onTouchEnded(event) {
                self.accLeft = false;
                self.accRight = false;
            }
        }, this.node);
    },

    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {
        // 获取屏幕宽度
        var width = cc.director.getWinSize().width;

        // 计算位移
        var newX = this.node.x + this.getSpeed(dt) * dt;

        // 避免超出屏幕
        if (!(newX > width / 2) && !(newX < -width / 2)) {
            this.node.x = newX;
        } else {
            this.speed = 0;
        }
    },

    // 获取速度
    getSpeed: function getSpeed(dt) {
        if (this.accLeft) {
            //计算向左速度
            this.speed -= this.accle * dt;
        } else if (this.accRight) {
            //计算向右速度
            this.speed += this.accle * dt;
        }
        return this.speed;
    },

    // 停止移动
    stopMove: function stopMove() {
        this.node.stopAllActions();
    }
});