import { _decorator, Component, Label, Sprite, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Actor')
export class Actor extends Component {
    @property(Sprite)
    sprite: Sprite;

    @property(Label)
    hpText: Label;

    @property
    hp: number = 10;

    @property
    isFear: boolean = false;

    start() {
        this.show();

        if (this.isFear) this.fear();
    }

    show() {
        this.hpText.string = `${this.hp}`;

        if (this.hp <= 0){
            this.node.active = false;
        }
    }

    move() {
        let distance = 20;
        let targetPos = new Vec3(this.node.position.x - distance, this.node.position.y);

        tween(this.node.position)
            .to(0.3, targetPos, {
                onUpdate: (target: Vec3, ratio: number) => {
                    this.node.position = target;
                }
            })
            .start();
    }

    fear() {
        let origin = new Vec3(this.node.position.x, this.node.position.y);

        let right = new Vec3(5, 0);
        console.log(right.x);

        tween(this.node.position)
            .by(0.2, right, {
                onUpdate: (target: Vec3, ratio: number) => {
                    this.node.position = target;
                },
                onComplete: () => {
                    this.node.position = origin;
                }
            })
            .repeatForever()
            .start();
    }

    attack(other: Actor) {
        other.hp -= this.hp;

        other.show();
    }

    hit(damage: number) {
        this.hp -= damage;
        this.show();
    }

    addHp(value: number) {
        this.hp += value;
    }
}


