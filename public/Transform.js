class Transform {
    _pos;
    _size;
    _box;

    constructor(x, y, w = 0, h = 0) {
        this._pos = { x, y };
        this._size = { w, h };
        this._box = { left: x - w / 2, right: x + w / 2, top: y + h / 2, bottom: y - h / 2 };
    }

    containsPx(game, x, y) {
        const { left, right, top, bottom } = this.getBoxPx(game);
        return x > left && x < right && y > top && y < bottom;
    }

    /**
     * top left slot is 0,0.
     * bottom right slot is row, col.
     *
     * @param {number} x - X Position in "units"
     * @param {number} y - Y Position in "units"
     * @param {number} rows
     * @param {number} cols
     * @param {number} slotWidth - Slot Width in "units"
     * @param {number} slotHeight - Slot Height in "units"
     */
    getSlot(x, y, rows, cols, slotWidth, slotHeight) {
        const { w, h } = this._size;
        const { left, right, top, bottom } = this._box;

        const xNormalized = (x - slotWidth / 2 - left) / w;
        const slotWidthNormalized = slotWidth / w;
        let slotXIdx = Math.round(xNormalized / slotWidthNormalized);
        slotXIdx = Math.max(Math.min(slotXIdx, cols), 0);

        const yNormalized = (y - slotHeight / 2 - bottom) / h;
        const slotHeightNormalized = slotHeight / h;
        let slotYIdx = rows - 1 - Math.round(yNormalized / slotHeightNormalized);
        slotYIdx = Math.max(Math.min(slotYIdx, rows), 0);

        return { x: slotXIdx, y: slotYIdx };
    }

    getPos() {
        return this._pos;
    }

    getPosPx(game) {
        const { x, y } = this._pos;
        return game.getPx(x, y);
    }

    getSize() {
        return this._size;
    }

    getSizePx(game) {
        const { w, h } = this._size;
        const { unitsToPx: s } = game;
        return { w: w * s, h: h * s };
    }

    getBox() {
        return this._box;
    }

    getBoxPx(game) {
        const { x, y } = this.getPosPx(game);
        const { w, h } = this.getSizePx(game);

        return {
            left: x - w / 2,
            right: x + w / 2,
            top: y - h / 2,
            bottom: y + h / 2,
        };
    }
}
