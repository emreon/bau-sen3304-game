class OkeyDiscardArea {
    transform;

    _isReadyToDrop = false;
    _pieces = [];
    _pieceTransform;

    constructor(game, x, y) {
        this.transform = new Transform(x, y, OkeyDiscardArea.Len, OkeyDiscardArea.Len);
        this._pieceTransform = new Transform(x, y, OkeyPiece.Width, OkeyPiece.Height);
    }

    onMouseMove(game, xPx, yPx, isDragging) {
        this._isReadyToDrop = false;

        if (isDragging && game.hand) {
            const containsMouse = this.transform.containsPx(game, xPx, yPx);
            if (containsMouse) {
                this._isReadyToDrop = true;
            }
        }
    }

    onMouseDown(game, xPx, yPx) {}

    onMouseUp(game, xPx, yPx) {
        const containsMouse = this.transform.containsPx(game, xPx, yPx);

        if (containsMouse) {
            if (game.hand) {
                this._pieces.push(game.hand.slot.piece);
                game.hand.slot.piece = null;
                game.hand.slot.isMoving = false;

                console.log(this._pieces);
            }
            game.hand = null;

            return true;
        }
    }

    render(game, dt) {
        const c = game.context;
        const { x, y } = this.transform.getPosPx(game);
        const { w, h } = this.transform.getSizePx(game);

        c.save();
        c.translate(x, y); // origin --> center of the object
        // c.rotate(Math.PI);

        if (this._isReadyToDrop) {
            c.scale(1.125, 1.125);
        }

        c.strokeStyle = this._isReadyToDrop ? 'Gold' : 'WhiteSmoke';
        c.lineWidth = this._isReadyToDrop ? 6 : 4;
        c.lineJoin = 'round';
        c.setLineDash([10, 15]);
        c.strokeRect(-w / 2, -h / 2, w, h);

        c.restore(); // origin --> top left of the screen

        if (this._pieces.length > 0) {
            this._pieces.at(-1).render(game, dt, this._pieceTransform);
        }
    }
}

OkeyDiscardArea.Len = OkeyBoard.Height;
