class OkeyBoard {
    slots;
    transform;
    highlightTransform;

    constructor(game, x, y) {
        this.transform = new Transform(x, y, OkeyBoard.Width, OkeyBoard.Height);

        this.slots = [];
        for (let y = 0; y < OkeyBoard.Rows; y++) {
            for (let x = 0; x < OkeyBoard.Cols; x++) {
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

        // DEBUG
        // this._fillSlots(game);
    }

    _fillSlots(game) {
        this.slots[0][0].piece = new OkeyPiece(game, COLOR_RED, 13);
        this.slots[0][1].piece = new OkeyPiece(game, COLOR_RED, 12);
        this.slots[0][2].piece = new OkeyPiece(game, COLOR_RED, 11);
        this.slots[0][3].piece = new OkeyPiece(game, COLOR_RED, 10);
        this.slots[0][4].piece = new OkeyPiece(game, COLOR_RED, 9);
        this.slots[0][5].piece = new OkeyPiece(game, COLOR_RED, 8);
        this.slots[0][6].piece = new OkeyPiece(game, COLOR_RED, 7);
        this.slots[0][7].piece = new OkeyPiece(game, COLOR_RED, 6);
        this.slots[0][8].piece = new OkeyPiece(game, COLOR_RED, 5);
        this.slots[0][9].piece = new OkeyPiece(game, COLOR_RED, 4);
        this.slots[0][10].piece = new OkeyPiece(game, COLOR_RED, 3);
        this.slots[0][11].piece = new OkeyPiece(game, COLOR_RED, 2);
        this.slots[0][12].piece = new OkeyPiece(game, COLOR_RED, 1);

        this.slots[0][14].piece = new OkeyPiece(game, COLOR_YELLOW, 2);
        this.slots[0][15].piece = new OkeyPiece(game, COLOR_NONE, 0);

        this.slots[1][1].piece = new OkeyPiece(game, COLOR_BLUE, 7);
        this.slots[1][4].piece = new OkeyPiece(game, COLOR_GREEN, 4);
    }

    _getSlotTransform(slotIndexX, slotIndexY) {
        const { x, y } = this.transform.getPos();
        const { w, h } = this.transform.getSize();
        const slotX = slotIndexX * OkeyPiece.Width + OkeyPiece.Width / 2 - w / 2 + x;
        const slotY = (OkeyBoard.Rows - slotIndexY) * OkeyPiece.Height - OkeyPiece.Height / 2 - h / 2 + y;
        return new Transform(slotX, slotY, OkeyPiece.Width, OkeyPiece.Height);
    }

    _getSlot(game, xPx, yPx) {
        const containsMouse = this.transform.containsPx(game, xPx, yPx);
        if (!containsMouse) return null;

        const { x, y } = game.getUnits(xPx, yPx);
        const { x: slotIndexX, y: slotIndexY } = this.transform.getSlot(
            x,
            y,
            OkeyBoard.Rows,
            OkeyBoard.Cols,
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

        c.fillStyle = 'BurlyWood';
        c.fillRect(-w / 2, -h / 2, w, h);
        // https://pinetools.com/darken-color
        // darken BurlyWood by 16% --> #d19d5a
        c.fillStyle = '#d19d5a';
        c.fillRect(-w / 2, 0, w, h / 2);

        c.strokeStyle = 'WhiteSmoke';
        c.lineWidth = 4;
        c.lineJoin = 'round';
        c.strokeRect(-w / 2, -h / 2, w, h);
        c.beginPath();
        c.moveTo(-w / 2, 0);
        c.lineTo(w / 2, 0);
        c.stroke();

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

OkeyBoard.Cols = 16;
OkeyBoard.Rows = 2;
OkeyBoard.Width = OkeyPiece.Width * OkeyBoard.Cols;
OkeyBoard.Height = OkeyPiece.Height * OkeyBoard.Rows;
