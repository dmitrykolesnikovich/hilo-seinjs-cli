/**
 * @File   : main.tsx
 * @Author : {{AUTHOR.NAME}} ({{AUTHOR.EMAIL}})
 * @Date   : {{DATE}}
 * @Description: Component.
 */
import * as Sein from 'seinjs';

import GameState from './states/GameState';
import MainGameMode from './scripts/MainGameMode';
import MainLevelScript from './scripts/MainLevelScript';

export async function main(canvas: HTMLCanvasElement): Promise<Sein.Game> {
  const engine = new Sein.Engine();

  const game = new Sein.Game(
    'intro-game',
    {
      canvas,
      clearColor: new Sein.Color(0, .6, .9, 1),
      width: canvas.offsetWidth,
      height: canvas.offsetHeight,
      pixelRatio: window.devicePixelRatio
    },
    GameState
  );

  engine.addGame(game);

  game.addWorld('main', MainGameMode, MainLevelScript);

  await game.start();

  return game;
}
