class OkeyDeck {
    transform;
    _deck;

    _isReadyToTake = false;
    _pieces = [];
    _pieceTransform;

    constructor(game, x, y) {
        this.transform = new Transform(x, y, OkeyDiscardArea.Len, OkeyDiscardArea.Len);
        this._pieceTransform = new Transform(x, y, OkeyPiece.Width, OkeyPiece.Height);
        this._createDeck(game);
    }

    _createDeck(game) {
        this._deck = [];

        for (let c = 0; c < COLORS.length; c++) {
            for (let i = 0; i < 13; i++) {
                const color = COLORS[c];
                const rank = i + 1;
                this._deck.push(new OkeyPiece(game, color, rank));
                this._deck.push(new OkeyPiece(game, color, rank));
            }
        }

        this._deck.push(new OkeyPiece(game, COLOR_NONE, 0));
        this._deck.push(new OkeyPiece(game, COLOR_NONE, 0));

        shuffle(this._deck);
    }

    onMouseMove(game, xPx, yPx, isDragging) {
        // this._isReadyToTake = false;
        // if (isDragging && game.hand) {
        //     const containsMouse = this.transform.containsPx(game, xPx, yPx);
        //     if (containsMouse) {
        //         this._isReadyToTake = true;
        //     }
        // }
    }

    onMouseDown(game, xPx, yPx) {}

    onMouseUp(game, xPx, yPx) {
        if (game.hand) {
            return false;
        }

        const containsMouse = this.transform.containsPx(game, xPx, yPx);
        if (containsMouse) {
            console.log(this._deck[0]);
        }

        return true;
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

        OkeyPiece.RenderHidden(game, dt, this._pieceTransform);
    }
}

OkeyDeck.Len = OkeyBoard.Height;
