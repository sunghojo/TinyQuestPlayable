import { _decorator, Camera, Component, PhysicsSystem2D, Sprite, SpriteFrame, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MergeManager')
export class MergeManager extends Component {
    @property([SpriteFrame])
    redSpriteFrames: SpriteFrame[] = [];
    @property([SpriteFrame])
    blueSpriteFrames: SpriteFrame[] = [];

    @property(Camera)
    camera: Camera;

    @property(Sprite)
    selectIcon: Sprite;

    public static instance;

    onLoad() {
        MergeManager.instance = this;

        PhysicsSystem2D.instance.enable = true;
    }

    public ActiveSelectIcon(worldPos: Vec3, spriteFrame: SpriteFrame) {
        this.selectIcon.node.active = true;
        this.selectIcon.node.setWorldPosition(worldPos);

        this.selectIcon.spriteFrame = spriteFrame;
    }

    public DeactiveSelectIcon() {
        this.selectIcon.node.active = false;
    }

    public MoveSelectIcon(pos: Vec3) {
        this.selectIcon.node.position = pos;
    }
}


