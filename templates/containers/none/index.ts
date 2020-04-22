/**
 * @File   : index.tsx
 * @Author : {{AUTHOR.NAME}} ({{AUTHOR.EMAIL}})
 * @Date   : {{DATE}}
 * @Description: Component.
 */
import * as Sein from 'seinjs';

if (!window['Sein']) {
  window['Sein'] = Sein;
}

import {main} from './game';
import './base.scss';

const canvas = document.createElement('canvas');
canvas.className = 'game';
document.getElementById('container').appendChild(canvas);

main(canvas);
