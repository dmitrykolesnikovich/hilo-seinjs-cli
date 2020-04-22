/**
 * @File   : game.js
 * @Author : {{AUTHOR.NAME}} ({{AUTHOR.EMAIL}})
 * @Date   : {{DATE}}
 * @Description:
 */
import './sein-game/seinjs-adapter.js';
import './sein-game/seinjs';
import './sein-game/common';
import {main} from './sein-game'

const canvas = window.initCanvas(window);

main(canvas);
