const COLOR_NONE = 'X';
const COLOR_RED = 'R';
const COLOR_GREEN = 'G';
const COLOR_BLUE = 'B';
const COLOR_YELLOW = 'Y';
const COLORS = [COLOR_RED, COLOR_GREEN, COLOR_BLUE, COLOR_YELLOW];

class OkeyPiece {
    color;
    cssColor;
    rank;
    text;
    isJoker;

    constructor(game, color, rank) {
        this.color = color;
        this.rank = Math.round(Math.abs(rank));
        if (this.rank < 0) this.rank = 0;
        else if (this.rank > 13) this.rank = 13;

        if (this.rank === 0) {
            this.text = '🔷';
            this.isJoker = true;
        } else if (this.rank === 10) this.text = 'X';
        else if (this.rank === 11) this.text = 'J';
        else if (this.rank === 12) this.text = 'Q';
        else if (this.rank === 13) this.text = 'K';
        else this.text = this.rank + '';

        switch (color) {
            case COLOR_RED:
                this.cssColor = 'FireBrick';
                break;
            case COLOR_GREEN:
                this.cssColor = 'SeaGreen';
                break;
            case COLOR_BLUE:
                this.cssColor = 'RoyalBlue';
                break;
            case COLOR_YELLOW:
                this.cssColor = 'GoldenRod';
                break;
            default:
                this.cssColor = 'black';
        }
    }

    render(game, dt, transform) {
        const c = game.context;
        const { w, h } = transform.getSizePx(game);
        const { left, right, top, bottom } = transform.getBoxPx(game);

        c.fillStyle = 'Ivory';
        c.strokeStyle = 'Wheat';
        c.lineWidth = 4;
        c.lineJoin = 'round';
        roundRect(c, left, top, w, h, 5, true, true);

        let fontSize = 16;
        let marginLeft = 0;
        let marginTop = 0;
        if (this.isJoker) {
            fontSize = Math.round(w * 0.5);
            marginLeft = w * 0.15;
            marginTop = h * 0.125;
        } else {
            // fontSize = Math.round(w * 0.6);
            // marginLeft = w * 0.15;
            // marginTop = h * 0.15;

            fontSize = Math.round(w * 0.9);
            marginLeft = w * 0.25;
            marginTop = -h * 0.05;
        }

        c.fillStyle = this.cssColor;
        c.font = `bold ${fontSize}px monospace`;
        c.fillText(this.text, left + marginLeft, top + fontSize + marginTop);

        if (!this.isJoker) {
            // const lineMarginX = w * 0.16;
            // const lineMarginY = h * 0.25;
            // const lineHeight = h * 0.085;
            // const lineRadius = w * 0.075;
            // roundRect(
            //     c,
            //     left + lineMarginX,
            //     bottom - lineMarginY,
            //     w - lineMarginX * 2,
            //     lineHeight,
            //     lineRadius,
            //     true,
            //     false
            // );

            const dotRadius = w * 0.111;
            const dotMarginX = (w - dotRadius * 2) / 2 + dotRadius;
            const dotMarginY = h * 0.222;

            c.fillStyle = 'Wheat';
            c.beginPath();
            c.arc(left + dotMarginX, bottom - dotMarginY, dotRadius * 1.8, 0, Math.PI * 2);
            c.fill();

            c.fillStyle = this.cssColor;
            c.beginPath();
            c.arc(left + dotMarginX, bottom - dotMarginY, dotRadius, 0, Math.PI * 2);
            c.fill();
        }
    }
}

OkeyPiece.Width = 1;
OkeyPiece.Height = 1.6;

OkeyPiece.RenderHidden = function (game, dt, transform) {
    const c = game.context;
    const { w, h } = transform.getSizePx(game);
    const { left, right, top, bottom } = transform.getBoxPx(game);

    c.fillStyle = 'Ivory';
    c.strokeStyle = 'Wheat';
    c.lineWidth = 4;
    c.lineJoin = 'round';
    roundRect(c, left, top, w, h, 5, true, true);

    const fontSize = Math.round(w * 0.9);
    const marginLeft = w * 0.25;
    const marginTop = h * 0.1;

    c.fillStyle = 'Black';
    c.font = `bold ${fontSize}px monospace`;
    c.fillText('?', left + marginLeft, top + fontSize + marginTop);
};
