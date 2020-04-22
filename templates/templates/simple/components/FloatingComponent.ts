/**
 * @File   : FloatingComponent.tsx
 * @Author : {{AUTHOR.NAME}} ({{AUTHOR.EMAIL}})
 * @Date   : {{DATE}}
 * @Description: FloatingComponent.
 */
import * as Sein from 'seinjs';

import GameState from '../states/GameState';

export interface IFloatingComponentState {
  componentName?: string;
  position?: Sein.Vector3;
  omega?: number;
  phase?: number;
  amp?: number;
}

export default class FloatingComponent extends Sein.Component<IFloatingComponentState> {
  public initPosition: Sein.Vector3 = new Sein.Vector3();
  public omega: number;
  public phase: number;
  public amp: number;
  
  private component: Sein.SceneComponent;
  private time: number = 0;

  public onAdd(initState: IFloatingComponentState) {
    this.component = this.getOwner().findComponentByName(initState.componentName || 'root');

    if (initState.position) {
      this.initPosition.copy(initState.position);
    } else {
      this.initPosition.copy(this.component.position);
    }
    this.amp = initState.amp || .5;
    this.omega = initState.omega || 1;
    this.phase = initState.phase || 0;
  }

  public onUpdate(delta: number) {
    const transform = this.component;
    this.time += delta / 1000;
    const omega = this.omega * this.getGame<GameState>().state.floatingSpeedFactor;

    transform.position.y = this.initPosition.y + Math.sin(this.time * omega + this.phase) * this.amp;
  }
}
