import { _decorator, Component, EventTouch, Node, Sprite, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ResultManger')
export class ResultManger extends Component {
    @property(Sprite)
    background: Sprite;

    @property(Sprite)
    success: Sprite;

    @property(Sprite)
    fail: Sprite;

    @property(Node)
    retry: Node;

    start() {
        this.success.node.active = false;
        this.fail.node.active = false;

        this.background.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
    }

    showSuccess() {
        this.scheduleOnce(() => {
            this.success.node.active = true;
            this.success.node.scale = new Vec3(3, 3, 3)
            tween(this.success.node.scale)
                .delay(0.5)
                .to(0.7, new Vec3(1, 1, 1), {
                    easing: 'quartIn',
                    onUpdate: (target: Vec3, ratio: number) => {
                        this.success.node.scale = target;
                    }
                })
                .start();

            this.showRetry();
        }, 0.5);
    }

    showFail() {
        this.scheduleOnce(() => {
            this.fail.node.active = true;
            this.fail.node.scale = new Vec3(3, 3, 3)
            tween(this.fail.node.scale)
                .to(0.7, new Vec3(1, 1, 1), {
                    easing: 'quartIn',
                    onUpdate: (target: Vec3, ratio: number) => {
                        this.fail.node.scale = target;
                    }
                })
                .start();

            this.showRetry();
        }, 0.5);
    }

    showRetry() {
        tween(this.retry)
         .delay(1.5)
         .call(() => {
            this.success.node.active = false;
            this.fail.node.active = false;
    
            this.retry.active = true;
         })
         .start();
    }

    onTouchStart(event: EventTouch) {
        open("https://tinyquest.onelink.me/lHqn/TQ");
    }
}


