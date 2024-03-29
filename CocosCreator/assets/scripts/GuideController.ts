import { _decorator, Component, EventTouch, Node, Sprite, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GuideController')
export class GuideController extends Component {
    @property(Sprite)
    background: Sprite;

    @property(Node)
    finger: Node;

    start() {
        tween(this.finger.position)
            .by(1, new Vec3(100, 300), {
                easing: 'quartOut',
                onUpdate: (target: Vec3, ratio: number) => {
                    this.finger.position = target;
                },
                onComplete: () => {
                    this.finger.position = new Vec3(120, 40);
                }
            })
            .repeatForever()
            .start();

        this.background.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
    }

    onTouchStart(event: EventTouch) {
        this.node.active = false;
    }
}


