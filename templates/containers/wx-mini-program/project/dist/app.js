/**
 * @File   : app.js
 * @Author : {{AUTHOR.NAME}} ({{AUTHOR.EMAIL}})
 * @Date   : {{DATE}}
 * @Description:
 */
import './sein-game/seinjs';
import './sein-game/common';

App({
  onLaunch(options) {
    console.log('App Launch', options);
  },
  onShow() {
    console.log('App Show');
  },
  onHide() {
    console.log('App Hide');
  }
});
