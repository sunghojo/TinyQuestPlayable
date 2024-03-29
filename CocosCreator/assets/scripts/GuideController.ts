import { _decorator, Component, EventTouch, Node, Sprite, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GuideController')
export class GuideController extends Component {
    @property(Sprite)
    background: Sprite;

    @property(Node)
    finger: Node;

    start() {
        let startPos = new Vec3(-100, 40);
        let middlePos = new Vec3(120, 40);
        let endPos = new Vec3(200, 300);

        let tweenMove = tween(this.finger)
            .to(1, {position: middlePos}, {easing: 'quartOut'})
            .to(1, {position: endPos}, {easing: 'quartOut', onComplete: () => { this.finger.position = startPos}});

        tween(this.finger)
            .repeatForever(tweenMove)
            .start();

        this.background.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
    }

    onTouchStart(event: EventTouch) {
        this.node.active = false;
    }
}


