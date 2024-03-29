import { _decorator, Button, Component, Tween, tween, Vec3 } from 'cc';
import { MergeCell } from './MergeCell';
const { ccclass, property } = _decorator;

@ccclass('CreateButton')
export class CreateButton extends Component {
    @property(Button)
    button: Button;

    @property([MergeCell])
    cells: MergeCell[] = [];

    start() {
        let tweenScale = tween(this.node)
            .to(1, { scale: new Vec3(1.1, 1.1, 1.1)})
            .to(1, { scale: new Vec3(1, 1, 1)});

        tween(this.node)
            .repeatForever(tweenScale)
            .start();
    }

    public onClick() {
        Tween.stopAllByTarget(this.node);

        for (let i = 0; i < this.cells.length; i++) {
            const cell = this.cells[i];
            if (cell.isEmpty()) {
                cell.create();
                break;
            }
        }
    }
}


