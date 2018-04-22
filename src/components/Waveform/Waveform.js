import { Component } from 'preact';
import { css } from 'emotion';

const waveform = css`
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    width: inherit;
    height: inherit;
    overflow: hidden;
    pointer-events: none;

    canvas {
        width: inherit;
        height: inherit;
        image-rendering: pixelated;
        image-rendering: optimizeSpeed;
        pointer-events: none;
    }
`;

export class Waveform extends Component {

    /**
     * Render the waveform into a canvas
     */
    renderCanvas () {
        const { data } = this.props;
        const samples = data.samples;
        const l = samples.length;
        let canvas = document.createElement('canvas');
        let context = canvas.getContext('2d');
        let i = 0;
        let x = 0;
        let v;

        canvas.height = data.height / 2;
        canvas.width = data.width / 2;
    
        context.fillStyle = '#1d1e1f';
    
    
        for (; i < l; i += 2, x++) {
          v = samples[i] / 4;
          context.fillRect(x, 0, 1, 35 - v);
          context.fillRect(x, 35 + v, 1, 70);
        }

        this.containerEl.appendChild(canvas);
    }

    render () {
        return (
            <div className="waveform" ref={e => this.containerEl = e}>
                {this.renderCanvas.bind(this)()}
            </div>
        )
    }
}
