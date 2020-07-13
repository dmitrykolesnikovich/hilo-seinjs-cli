/**
 * @File   : index.js
 * @Author : {{AUTHOR.NAME}} ({{AUTHOR.EMAIL}})
 * @Date   : {{DATE}}
 * @Description:
 */
import {main} from '../sein-game/index';

Page({
  data: {
    canvasHeight: 0,
  },
  canvas: null,
  game: null,
  onLoad() {
    console.log('load');
    this.setData({
      canvasHeight: wx.window.innerHeight / 2
    });
  },
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
  async onSeinCanvasCreated({detail: canvas}) {
    this.canvas = canvas;
    this.game = await main(this.canvas);
    console.log('onSeinCanvasCreated', canvas, this.game);
  }
});
