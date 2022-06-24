class Okey101Game extends Game {
    _board;
    _leftDiscard;
    _rightDiscard;
    _ground;
    _deck;

    _boardOffset = 2;
    _discardOffset = 1;
    _groundOffset = 1.5;
    _deckOffset = 1;

    hand;
    targetSlot;

    constructor(canvas) {
        super(canvas, OkeyBoard.Width * 2.5);

        // document.fonts.add(
        //     new FontFace(
        //         'Orbitron',
        //         'url(https://fonts.gstatic.com/s/orbitron/v24/yMJMMIlzdpvBhQQL_SC3X9yhF25-T1nysimBoWgz.woff2)'
        //     )
        // );

        const boardY = -this.height / 2 + OkeyBoard.Height / 2 + this._boardOffset;
        this._board = new OkeyBoard(this, 0, boardY);

        let leftDiscardX = -OkeyBoard.Width / 2 - OkeyDiscardArea.Len / 2 - this._discardOffset;
        this._leftDiscard = new OkeyDiscardArea(this, leftDiscardX, boardY);
        this._rightDiscard = new OkeyDiscardArea(
            this,
            OkeyBoard.Width / 2 + OkeyDiscardArea.Len / 2 + this._discardOffset,
            boardY
        );
        this._ground = new OkeyGround(
            this,
            0,
            boardY + OkeyBoard.Height / 2 + OkeyGround.Height / 2 + this._groundOffset
        );
        this._deck = new OkeyDeck(
            this,
            leftDiscardX - OkeyDiscardArea.Len / 2 - OkeyDeck.Len / 2 - this._deckOffset,
            boardY
        );

        // DEBUG
        for (let i = 0; i < 11; i++) {
            const piece = this._deck._deck.pop();
            this._board.slots[0][i].piece = piece;
        }
        for (let i = 0; i < 10; i++) {
            const piece = this._deck._deck.pop();
            this._board.slots[1][i].piece = piece;
        }
    }

    _resize() {
        super._resize();

        const boardY = -this.height / 2 + OkeyBoard.Height / 2 + this._boardOffset;
        if (this._board) {
            this._board.transform = new Transform(0, boardY, OkeyBoard.Width, OkeyBoard.Height);
        }

        if (this._leftDiscard) {
            const x = -OkeyBoard.Width / 2 - OkeyDiscardArea.Len / 2 - this._discardOffset;
            this._leftDiscard.transform = new Transform(x, boardY, OkeyDiscardArea.Len, OkeyDiscardArea.Len);
            this._leftDiscard._pieceTransform = new Transform(x, boardY, OkeyPiece.Width, OkeyPiece.Height);
        }

        if (this._rightDiscard) {
            const x = OkeyBoard.Width / 2 + OkeyDiscardArea.Len / 2 + this._discardOffset;
            this._rightDiscard.transform = new Transform(x, boardY, OkeyDiscardArea.Len, OkeyDiscardArea.Len);
            this._rightDiscard._pieceTransform = new Transform(x, boardY, OkeyPiece.Width, OkeyPiece.Height);
        }

        if (this._ground) {
            this._ground.transform = new Transform(
                0,
                boardY + OkeyBoard.Height / 2 + OkeyGround.Height / 2 + this._groundOffset,
                OkeyGround.Width,
                OkeyGround.Height
            );
        }

        if (this._deck) {
            const x =
                this._leftDiscard.transform.getPos().x - OkeyDiscardArea.Len / 2 - OkeyDeck.Len / 2 - this._deckOffset;
            this._deck.transform = new Transform(x, boardY, OkeyDeck.Len, OkeyDeck.Len);
            this._deck._pieceTransform = new Transform(x, boardY, OkeyPiece.Width, OkeyPiece.Height);
        }
    }

    _onMouseMove(xPx, yPx, isDragging) {
        super._onMouseMove(xPx, yPx, isDragging);

        let eHandled = false;
        eHandled = eHandled || this._board.onMouseMove(this, xPx, yPx, isDragging);
        eHandled = eHandled || this._leftDiscard.onMouseMove(this, xPx, yPx, isDragging);
        eHandled = eHandled || this._rightDiscard.onMouseMove(this, xPx, yPx, isDragging);
        eHandled = eHandled || this._ground.onMouseMove(this, xPx, yPx, isDragging);
        eHandled = eHandled || this._deck.onMouseMove(this, xPx, yPx, isDragging);

        if (!eHandled) {
            this.targetSlot = null;
        }

        if (isDragging && this.hand) {
            const { x, y } = this.getUnits(xPx, yPx);
            this.hand.pieceTransform = new Transform(x, y, OkeyPiece.Width, OkeyPiece.Height);
            this.hand.slot.isMoving = true;
        }
    }

    _onMouseDown(xPx, yPx) {
        super._onMouseDown(xPx, yPx);
        this._board.onMouseDown(this, xPx, yPx);
        this._leftDiscard.onMouseDown(this, xPx, yPx);
        this._rightDiscard.onMouseDown(this, xPx, yPx);
        this._ground.onMouseDown(this, xPx, yPx);
        this._deck.onMouseDown(this, xPx, yPx);
    }

    _onMouseUp(xPx, yPx) {
        super._onMouseUp(xPx, yPx);

        let eHandled = false;
        eHandled = eHandled || this._board.onMouseUp(this, xPx, yPx);
        eHandled = eHandled || this._leftDiscard.onMouseUp(this, xPx, yPx);
        eHandled = eHandled || this._rightDiscard.onMouseUp(this, xPx, yPx);
        eHandled = eHandled || this._ground.onMouseUp(this, xPx, yPx);
        eHandled = eHandled || this._deck.onMouseUp(this, xPx, yPx);

        if (!eHandled) {
            if (this.hand) this.hand.slot.isMoving = false;
            this.hand = null;
        }
    }

    _render(dt) {
        super._render(dt);
        this._board.render(this, dt);
        this._leftDiscard.render(this, dt);
        this._rightDiscard.render(this, dt);
        this._ground.render(this, dt);
        this._deck.render(this, dt);

        super.context.fillStyle = 'White';
        super.context.font = `20px monospace`;
        let text = 'Target :';
        if (this.targetSlot) {
            text += ` ${String(this.targetSlot.x + 1).padStart(2, '_')} ${String(this.targetSlot.y + 1).padStart(
                2,
                '_'
            )}`;
            if (this.targetSlot.piece) {
                if (this.targetSlot.piece.isJoker) text += ' ( JJ )';
                else text += ` (${this.targetSlot.piece.color} ${String(this.targetSlot.piece.rank).padStart(2, ' ')})`;
            }
        } else {
            text += ' None';
        }
        super.context.fillText(text, 16, 90);

        if (this.hand) {
            this.hand.slot?.piece?.render(this, dt, this.hand.pieceTransform);
        }
    }
}
