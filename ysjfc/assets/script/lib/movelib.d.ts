declare module ML {
    class LineSegment {
        type: number;
        lineList: Array<string>;
        _duration: number;
        _childindex: number;
        _child: null;
        _xoffset: number;
        _yoffset: number;
        _hasparent: boolean;
        _round: number;
        _dir: number;
        _length: number;
        constructor();
        /**解析内部数据结构 */
        parseData(): void;
        preprocess(): void;
        getPosInternal(t: number, x: number, y: number): any;
        GetPos(t: number, x: number, y: number): any;
    }
    class TLineSegmentPoint {
        speed: number;
        x: number;
        y: number;
        t: number;
    }
}
declare module ML {
    /**贝塞尔曲线 */
    class UniformBezier {
        constructor();
        /**bezier 线长度 */
        uniformBezier_Length(ctx: TUniformBezierCtx, t: number): number;
        uniformBezier_InitCtx(ctx: TUniformBezierCtx, x0: number, y0: number, x1: number, y1: number, x2: number, y2: number): void;
        private uniformBezier_Speed(ctx, t);
        private uniformBezier_InvertLength(ctx, t, l);
        uniformBezier_GetPos(ctx: TUniformBezierCtx, u: number, ox: number, oy: number): egret.Point;
    }
    class TUniformBezierCtx {
        x0: number;
        y0: number;
        x1: number;
        y1: number;
        x2: number;
        y2: number;
        ax: number;
        ay: number;
        bx: number;
        by: number;
        A: number;
        B: number;
        C: number;
        len: number;
    }
}
declare module ML {
    class LineCircleVo extends LineSegment {
        private _points;
        constructor();
        parseData(): void;
        preprocess(): void;
        getPosInternal(t: number, x: number, y: number): any;
    }
}
declare module ML {
    class LineCurveVo extends LineSegment {
        private _points;
        private _subCtx;
        private distances;
        constructor();
        parseData(): void;
        preprocess(): void;
        getPosInternal(t: number, x: number, y: number): any;
    }
}
declare module ML {
    class FishLineVo {
        version: number;
        dict: any;
        constructor();
        /**获取line列表 */
        getLine(id: number): Array<LineSegment>;
        getPosAndDir(id: number, t: number): TPosAndDirVo;
        private getPos(t, x, y, id);
        /**转换下坐标 */
        private py_BuildValue(params);
        /**获取鱼游动最大时间 */
        getFishLineTime(line_id: number): number;
    }
    class TPosAndDirVo {
        isBol: boolean;
        posX: number;
        posY: number;
        dirX: number;
        dirY: number;
        length: number;
        constructor(vo: any);
    }
}
declare module ML {
    function getfishline(resName: string): ML.FishLineVo;
    function getfishlinetxt(txt: string): ML.FishLineVo;
    class prafil {
        /**路线数据解析 */
        private fishMoveListData(txt);
        /**存储鱼线路的列表 */
        _lineDictionary: any;
        getFishLine(resName: string): ML.FishLineVo;
    }
}
