/**
 * @File   : index.tsx
 * @Author : {{AUTHOR.NAME}} ({{AUTHOR.EMAIL}})
 * @Date   : {{DATE}}
 * @Description: Component.
 */
import * as React from 'react';
import * as ReactDom from 'react-dom';
import * as Sein from 'seinjs';

if (!window['Sein']) {
  window['Sein'] = Sein;
}

import {main} from './game';
import './base.scss';

class Game extends React.PureComponent {
  private canvas: React.RefObject<HTMLCanvasElement> = React.createRef();
  private game: Sein.Game;

  public async componentDidMount() {
    this.game = await main(this.canvas.current);
  }

  public componentWillUnmount() {
    this.game.destroy();
  }

  public render() {
    return (
      <canvas
        className={'game'}
        ref={this.canvas}
      />
    );
  }
}

ReactDom.render(<Game />, document.getElementById('container'));
