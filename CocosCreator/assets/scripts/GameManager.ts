import { _decorator, Color, Component, Label, screen, Sprite, tween, UIOpacity, Vec3, view, View } from 'cc';
import { Actor } from './Actor';
import { ResultManger } from './ResultManger';
import { GuideController } from './GuideController';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    public static instance: GameManager;

    @property(Sprite) background: Sprite;

    @property(Sprite) hit: Sprite;
    @property(Label) hitLabel: Label;

    @property(UIOpacity) warning: UIOpacity;

    @property([Actor]) players: Actor[] = [];
    @property([Actor]) enemies: Actor[] = [];

    @property(GuideController) guide: GuideController;
    @property(ResultManger) result: ResultManger;

    onLoad() {
        GameManager.instance = this;

        View.instance.on('canvas-resize', this.onResized, this);
    }

    start() {
        this.guide.node.active = true;
        this.onResized();
    }

    onResized() {
        const standardRadio = 1.5; // standard aspect ratio, the aspect ratio is almost iPhone6 (landscape), generally as a standard design draft
        const currentRadio = screen.windowSize.height / screen.windowSize.width; // aspect ratio   

        if (currentRadio <= standardRadio) { 
            var value = standardRadio / currentRadio;
            this.background.node.scale = new Vec3(value, value, value);
        }
        else {
            var value = currentRadio / standardRadio;
            this.background.node.scale = new Vec3(value, value, value);
        }
    }

    public onPlay() {
        // 1. 적 리스트에서 살아있는 맨앞 actor를 선택
        // 2. 적 actor의 위치가 0이라면 공격 / 아니라면 전체 50씩 움직임
        let enemy: Actor = this.getFirstActor(this.enemies);
        if (enemy != null){
            if (enemy.node.position.x > -50){
                this.enemies.forEach(item => {
                    if (item.hp > 0){
                        item.move();
                    }
                });
            }
            else {
                let player: Actor = this.getFirstActor(this.players);
                if (player != null) {
                    player.hit(enemy.hp);

                    // 게임 패배
                    if (player.hp <= 0) {
                        this.result.showFail();
                    }
                    
                    this.showHit(enemy.hp, player.node.worldPosition);
                    this.showWarning();
                }
            }
        }
    }

    public attack(damage: number) {
        let enemy: Actor = this.getFirstActor(this.enemies);
        if (enemy != null){
            enemy.hit(damage);

            this.showHit(damage, enemy.node.worldPosition);
        }

        let count = 0;
        for (let i = 0; i < this.enemies.length; i++) {
            if (this.enemies[i].hp > 0){
                count++;
            }
        }

        // 게임 승리
        if (count <= 0){
            this.result.showSuccess();
        }
        else {
            this.onPlay();
        }
    }

    getFirstActor(actors: Actor[]): Actor {
        for (let i = 0; i < actors.length; i++) {
            const actor = actors[i];
            if (actor.hp > 0){
                return actor;
            }
        }
    }

    showHit(damage: number, worldPosition: Vec3) {
        this.hitLabel.string = `-${damage}`;
            this.hit.node.worldPosition = worldPosition;
            this.hit.color = new Color(255, 255, 255, 255);
            tween(this.hit)
                .to(0.2, { color: Color.WHITE })
                .to(0.2, { color: new Color(255, 255, 255, 0)})
                .start();
    }

    isWarning: boolean;
    showWarning() {
        if (this.isWarning)
            return;

        let tweenOpacity = tween(this.warning)
                            .to(1, { opacity: 50 })
                            .to(1, { opacity: 0 });
        
        tween(this.warning)
            .repeatForever(tweenOpacity)
            .start();
    }
}


