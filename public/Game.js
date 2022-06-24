class Game {
    _canvas;
    _context;
    _isStarted = false;

    _pxToUnits;
    _unitsToPx;
    _width;
    _widthPx;
    _height;
    _heightPx;

    _prevTs = 0;
    _fps = 0;
    _fpsCache = 0;
    _updateFps = false;

    _mouseDown = false;
    _mousePos = { x: 0, y: 0 };

    get canvas() {
        return this._canvas;
    }

    get context() {
        return this._context;
    }

    get isStarted() {
        return this._isStarted;
    }

    get pxToUnits() {
        return this._pxToUnits;
    }

    get unitsToPx() {
        return this._unitsToPx;
    }

    get width() {
        return this._width;
    }

    get widthPx() {
        return this._widthPx;
    }

    get height() {
        return this._height;
    }

    get heightPx() {
        return this._heightPx;
    }

    get fps() {
        return this._fps;
    }

    constructor(canvas, width = 10) {
        this._canvas = canvas;
        this._context = canvas.getContext('2d');
        this._width = width;
        window.addEventListener('resize', this._resize.bind(this));
        this._resize();

        setInterval(() => {
            this._updateFps = true;
        }, 250);

        document.addEventListener('mousemove', (e) => {
            this._mousePos = { x: e.clientX, y: e.clientY };
            this._onMouseMove(this._mousePos.x, this._mousePos.y, this._mouseDown);
        });

        document.addEventListener('mousedown', (e) => {
            this._mouseDown = true;
            this._onMouseDown(this._mousePos.x, this._mousePos.y);
        });
        document.addEventListener('mouseup', (e) => {
            this._mouseDown = false;
            this._onMouseUp(this._mousePos.x, this._mousePos.y);
        });
    }

    start() {
        if (this.isStarted) return;
        window.requestAnimationFrame(this._tick.bind(this));
        this._isStarted = true;
        console.log('Game started');
    }

    stop() {
        if (!this.isStarted) return;
        this._isStarted = false;
        console.log('Game stopped');
    }

    /**
     * Coordinate Systems
     *
     * "px" origin is top left.
     * x+ is right.
     * y+ is down.
     *
     * "units" origin is at the center.
     * x+ is right.
     * y+ is up.
     *
     * @param {number} x X Position in "units"
     * @param {number} y Y Position in "units"
     * @returns {object} Position in "px" {x, y}
     */
    getPx(x, y) {
        const xPx = x * this._unitsToPx + this._widthPx / 2;
        const yPx = this._heightPx - (y * this._unitsToPx + this._heightPx / 2);
        return { x: xPx, y: yPx };
    }

    /**
     * Coordinate Systems
     *
     * "px" origin is top left.
     * x+ is right.
     * y+ is down.
     *
     * "units" origin is at the center.
     * x+ is right.
     * y+ is up.
     *
     * @param {number} x X Position in "px"
     * @param {number} y Y Position in "px"
     * @returns {object} Position in "units" {x, y}
     */
    getUnits(x, y) {
        const xUnits = (x - this._widthPx / 2) * this._pxToUnits;
        const yUnits = (this._heightPx - y - this._heightPx / 2) * this._pxToUnits;
        return { x: xUnits, y: yUnits };
    }

    _resize() {
        this._widthPx = this._canvas.width = document.body.clientWidth;
        this._heightPx = this._canvas.height = document.body.clientHeight;

        this._pxToUnits = this._width / this._widthPx;
        this._unitsToPx = 1 / this._pxToUnits;
        this._height = this._heightPx * this._pxToUnits;

        // console.log(
        //     `Resize: ${this._widthPx}px X ${this._heightPx}px (${this._width.toFixed(2)} X ${this._height.toFixed(2)})`
        // );
    }

    _tick(ts) {
        const dt = (ts - this._prevTs) / 1000;
        this._prevTs = ts;
        this._fps = Math.round(1 / dt);
        this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this._context.save();
        this._render(dt);
        this._context.restore();

        if (this.isStarted) {
            window.requestAnimationFrame(this._tick.bind(this));
        }
    }

    _render(dt) {
        if (this._updateFps) {
            this._fpsCache = this.fps;
            this._updateFps = false;
        }

        this._context.fillStyle = 'White';
        this._context.font = `20px monospace`;
        this._context.fillText(`FPS    : ${this._fpsCache}`, 16, 30);

        const pos = this.getUnits(this._mousePos.x, this._mousePos.y);
        this._context.fillText(
            `Pointer: ${String(this._mousePos.x).padStart(4, '_')} ${String(this._mousePos.y).padStart(
                4,
                '_'
            )}  (${String(pos.x.toFixed(1)).padStart(5, ' ')} ${String(pos.y.toFixed(1)).padStart(5, ' ')}) ${
                this._mouseDown ? 'DOWN' : 'UP'
            }`,
            16,
            60
        );
    }

    _onMouseMove(xPx, yPx, isDragging) {
        // console.log(`Mouse Move: ${x} ${y} (Dragging: ${isDragging})`);
    }

    _onMouseDown(xPx, yPx) {
        // console.log(`Mouse Down: ${x} ${y}`);
    }

    _onMouseUp(xPx, yPx) {
        // console.log(`Mouse Up: ${x} ${y}`);
    }
}
