/**
 * @File   : index.js
 * @Author : {{AUTHOR.NAME}} ({{AUTHOR.EMAIL}})
 * @Date   : {{DATE}}
 * @Description:
 */
import {main} from '../sein-game';

Page({
  data: {},
  canvas: null,
  game: null,
  onHide() {
    console.log('hide');
    if (this.game) {
      this.game.pause();
    }
  },
  onShow() {
    console.log('show');
    if (this.game) {
      this.game.resume();
    }
  },
  onUnload() {
    console.log('unload');
    if (this.game) {
      this.game.destroy();
    }
  },
  async onSeinCanvasCreated(canvas) {
    this.canvas = canvas;
    this.game = await main(this.canvas);
    console.log('onSeinCanvasCreated', canvas, this.game);
  }
});
