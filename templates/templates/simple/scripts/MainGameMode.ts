/**
 * @File   : MainGameMode.tsx
 * @Author : {{AUTHOR.NAME}} ({{AUTHOR.EMAIL}})
 * @Date   : {{DATE}}
 * @Description: MainGameMode.
 */
import * as Sein from 'seinjs';

import GameState from '../states/GameState';

export default class MainGameMode extends Sein.GameModeActor {
  private delta: number;

  public onError(error: Error) {
    console.log(error);

    return true;
  }

  public onAdd() {
    this.delta = 0;
  }

  public onUpdate(delta: number) {
    this.delta += delta;

    if (this.delta > 2000) {
      this.getGame<GameState>().state.changeFloatingSpeed();
      this.delta = 0;
    }
  }
}
