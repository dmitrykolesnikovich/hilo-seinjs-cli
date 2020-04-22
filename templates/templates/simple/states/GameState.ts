/**
 * @File   : GameState.tsx
 * @Author : {{AUTHOR.NAME}} ({{AUTHOR.EMAIL}})
 * @Date   : {{DATE}}
 * @Description: GameState.
 */
import * as Sein from 'seinjs';

export default class GameState extends Sein.StateActor {
  public floatingSpeedFactor: number = 0;

  public changeFloatingSpeed() {
    this.floatingSpeedFactor = Math.random();
  }
}
