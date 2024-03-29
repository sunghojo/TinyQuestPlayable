import { _decorator, Component, EventTouch, Node, Sprite, SpriteFrame, Vec3, Label, PhysicsSystem2D, Vec2, randomRangeInt, tween } from 'cc';
import { MergeManager } from './MergeManager';
import { GameManager } from './GameManager';
import { AttackArea } from './AttackArea';
const { ccclass, property } = _decorator;

@ccclass('MergeCell')
export class MergeCell extends Component {
    @property(Sprite) background: Sprite;
    @property(Sprite) icon: Sprite;
    @property(Label) label: Label;

    @property level: number = 0;
    @property type: number = 0;

    tempPosVec2: Vec2 = new Vec2();
    tempPosVec3: Vec3 = new Vec3();

    start() {
        this.show();
    }

    onLoad() {
        this.background.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.background.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.background.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.background.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    onTouchStart(event: EventTouch) {
        this.icon.node.active = false;
        MergeManager.instance.ActiveSelectIcon(this.node.getWorldPosition(), this.icon.spriteFrame);
    }

    onTouchMove(event: EventTouch) {
        this.tempPosVec3.set(event.getUILocation().x - 250, event.getUILocation().y);
        MergeManager.instance.MoveSelectIcon(this.tempPosVec3)
    }

    onTouchEnd(event: EventTouch) {
        let closetCell: MergeCell;
        let attackArea: AttackArea;

        this.tempPosVec2.set(event.getUILocation().x, event.getUILocation().y);
        const colliders = PhysicsSystem2D.instance.testPoint(this.tempPosVec2);
        colliders.forEach(collider => {
            closetCell = collider.getComponent(MergeCell)

            if (closetCell == null) {
                attackArea = collider.getComponent(AttackArea);
            }
        });

        if (closetCell != null && closetCell != this) {
            if (closetCell.merge(this) == false) {
                closetCell.change(this);
            }

            GameManager.instance.onPlay();
        }
        else if (attackArea != null) {
            GameManager.instance.attack(this.getDamage());
            this.reset();
        }

        this.icon.node.active = true;
        MergeManager.instance.DeactiveSelectIcon();
    }

    public init(level: number, type: number) {
        this.level = level;
        this.type = type;

        this.show();
    }

    public create() {
        this.type = randomRangeInt(1, 3);
        this.level = 0;

        this.show();

        GameManager.instance.onPlay();
    }

    public reset() {
        this.level = 0;
        this.type = 0;

        this.show();
    }

    // 다른 셀과 합치기
    merge(otherCell: MergeCell): boolean {
        if (this.isMergeAble(otherCell)) {
            this.level++;
            this.show();

            otherCell.reset();
            return true;
        }

        return false;
    }

    change(otherCell: MergeCell) {
        const type = this.type;
        const level = this.level;

        this.type = otherCell.type;
        this.level = otherCell.level;

        otherCell.type = type;
        otherCell.level = level;

        this.show();
        otherCell.show();
    }

    public show() {
        this.icon.node.active = true;

        switch (this.type) {
            case 1:
                this.setSprite(MergeManager.instance.redSpriteFrames[this.level]);
                break;
            case 2:
                this.setSprite(MergeManager.instance.blueSpriteFrames[this.level]);
                break;
            default:
                this.label.node.active = false;
                this.setSprite(null);
                return;
        }

        this.label.node.active = true;
        this.label.string = `${this.getDamage()}`;

        this.animation();
    }

    getDamage(): number {
        return Math.pow(2, this.level * 2);
    }

    public setSprite(spriteFrame: SpriteFrame) {
        this.icon.spriteFrame = spriteFrame;
    }

    public isMergeAble(otherCell: MergeCell): boolean {
        return this.type == otherCell.type &&
            this.level == otherCell.level &&
            this.level < 7;
    }

    public isEmpty(): boolean {
        return this.type == 0;
    }

    animation() {
        this.node.scale = new Vec3(1, 1, 1);

        tween(this.node.scale)
            .to(0.1, new Vec3(1.3, 1.3, 1.3), {
                onUpdate: (target: Vec3, ratio: number) => {
                    this.node.scale = target;
                }
            })
            .to(0.1, new Vec3(1, 1, 1), {
                onUpdate: (target: Vec3, ratio: number) => {
                    this.node.scale = target;
                }
            })
            .start();
    }
}