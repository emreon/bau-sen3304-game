class OkeyGround {
    slots;
    transform;
    highlightTransform;

    constructor(game, x, y) {
        this.transform = new Transform(x, y, OkeyGround.Width, OkeyGround.Height);

        this.slots = [];
        for (let y = 0; y < OkeyGround.Rows; y++) {
            for (let x = 0; x < OkeyGround.Cols; x++) {
                if (!this.slots[y]) this.slots[y] = [];
                this.slots[y][x] = new OkeySlot(x, y);
            }
        }

        for (let y = 0; y < this.slots.length; y++) {
            const col = this.slots[y];
            for (let x = 0; x < col.length; x++) {
                const slot = col[x];

                if (x > 0) slot.leftSlot = this.slots[y][x - 1];
                if (x < col.length - 1) slot.rightSlot = this.slots[y][x + 1];
                if (y > 0) slot.upSlot = this.slots[y - 1][x];
                if (y < this.slots.length - 1) slot.downSlot = this.slots[y + 1][x];
            }
        }
    }

    _getSlotTransform(slotIndexX, slotIndexY) {
        const { x, y } = this.transform.getPos();
        const { w, h } = this.transform.getSize();
        const slotX = slotIndexX * OkeyPiece.Width + OkeyPiece.Width / 2 - w / 2 + x;
        const slotY = (OkeyGround.Rows - slotIndexY) * OkeyPiece.Height - OkeyPiece.Height / 2 - h / 2 + y;
        return new Transform(slotX, slotY, OkeyPiece.Width, OkeyPiece.Height);
    }

    _getSlot(game, xPx, yPx) {
        const containsMouse = this.transform.containsPx(game, xPx, yPx);
        if (!containsMouse) return null;

        const { x, y } = game.getUnits(xPx, yPx);
        const { x: slotIndexX, y: slotIndexY } = this.transform.getSlot(
            x,
            y,
            OkeyGround.Rows,
            OkeyGround.Cols,
            OkeyPiece.Width,
            OkeyPiece.Height
        );
        const slot = this.slots[slotIndexY][slotIndexX];
        const slotTransform = this._getSlotTransform(slotIndexX, slotIndexY);

        return {
            slotIndexX,
            slotIndexY,
            slot,
            slotTransform,
        };
    }

    onMouseMove(game, xPx, yPx, isDragging) {
        const slotData = this._getSlot(game, xPx, yPx);
        if (!slotData) {
            this.highlightTransform = null;
            return false;
        }

        this.highlightTransform = slotData.slotTransform;
        game.targetSlot = slotData.slot;
        return true;
    }

    onMouseDown(game, xPx, yPx) {
        const slotData = this._getSlot(game, xPx, yPx);
        if (!slotData) {
            return false;
        }
        if (!slotData.slot.piece) {
            return false;
        }

        const { x, y } = game.getUnits(xPx, yPx);

        game.hand = {};
        game.hand.slot = slotData.slot;
        game.hand.slot.isMoving = true;
        game.hand.pieceTransform = new Transform(x, y, OkeyPiece.Width, OkeyPiece.Height);
        return true;
    }

    onMouseUp(game, xPx, yPx) {
        const slotData = this._getSlot(game, xPx, yPx);
        if (!slotData) {
            return false;
        }

        if (game.hand) {
            const currentPiece = game.hand.slot.piece;
            const targetPiece = slotData.slot.piece;
            slotData.slot.piece = currentPiece;
            game.hand.slot.piece = targetPiece;

            game.hand.slot.isMoving = false;
            game.hand = null;
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

        c.strokeStyle = 'WhiteSmoke';
        c.lineWidth = 2;
        c.lineJoin = 'round';
        c.setLineDash([20, 15]);
        c.strokeRect(-w / 2, -h / 2, w, h);
        c.setLineDash([]);

        c.save();
        c.translate(-x, -y); // origin --> top left of the screen

        for (let y = 0; y < this.slots.length; y++) {
            const col = this.slots[y];
            for (let x = 0; x < col.length; x++) {
                const slot = col[x];
                if (!slot.piece) continue;
                if (slot.isMoving) continue;

                const slotTransform = this._getSlotTransform(x, y);
                slot.piece.render(game, dt, slotTransform);
            }
        }

        if (this.highlightTransform) {
            const { w: _w, h: _h } = this.highlightTransform.getSizePx(game);
            const { left, top } = this.highlightTransform.getBoxPx(game);

            c.strokeStyle = 'Gold';
            c.lineWidth = 6;
            c.lineJoin = 'round';
            c.strokeRect(left, top, _w, _h);
            c.restore();
        }

        c.restore(); // origin --> center of the object
        c.restore(); // origin --> top left of the screen
    }
}

OkeyGround.Cols = OkeyBoard.Cols + 8;
OkeyGround.Rows = 6;
OkeyGround.Width = OkeyPiece.Width * OkeyGround.Cols;
OkeyGround.Height = OkeyPiece.Height * OkeyGround.Rows;
