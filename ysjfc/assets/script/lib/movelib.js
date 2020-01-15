var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
window.ML={};
(function (ML) {
    var LineSegment = (function () {
        function LineSegment() {
            this._childindex = -1;
            this._child = null;
            this._xoffset = 0;
            this._yoffset = 0;
            this._hasparent = false;
            this._round = 0;
            this._dir = 1;
            this._length = 0;
        }
        /**解析内部数据结构 */
        LineSegment.prototype.parseData = function () {
        };
        LineSegment.prototype.preprocess = function () {
        };
        LineSegment.prototype.getPosInternal = function (t, x, y) {
            var tempAny;
            return tempAny;
        };
        LineSegment.prototype.GetPos = function (t, x, y) {
            var ret = this.getPosInternal(t, x, y);
            if (!ret.bol) {
                return { bol: false, x: ret.x, y: ret.y, d: ret.d };
            }
            x = ret.x;
            y = ret.y;
            if (this._child == null) {
                if (x) {
                    x -= this._xoffset;
                }
                if (y) {
                    y -= this._yoffset;
                }
                return { bol: true, x: x, y: y, d: ret.d };
            }
        };
        return LineSegment;
    }());
    ML.LineSegment = LineSegment;
    __reflect(LineSegment.prototype, "ML.LineSegment");
    var TLineSegmentPoint = (function () {
        function TLineSegmentPoint() {
        }
        return TLineSegmentPoint;
    }());
    ML.TLineSegmentPoint = TLineSegmentPoint;
    __reflect(TLineSegmentPoint.prototype, "ML.TLineSegmentPoint");
})(ML || (ML = {}));
(function (ML) {
    /**贝塞尔曲线 */
    var UniformBezier = (function () {
        function UniformBezier() {
        }
        /**bezier 线长度 */
        UniformBezier.prototype.uniformBezier_Length = function (ctx, t) {
            var temp1 = Math.sqrt(ctx.C + t * (ctx.B + ctx.A * t));
            var temp2 = (2 * ctx.A * t * temp1 + ctx.B * (temp1 - Math.sqrt(ctx.C)));
            var temp3 = Math.log(ctx.B + 2 * Math.sqrt(ctx.A) * Math.sqrt(ctx.C));
            var temp4 = Math.log(ctx.B + 2 * ctx.A * t + 2 * Math.sqrt(ctx.A) * temp1);
            var temp5 = 2 * Math.sqrt(ctx.A) * temp2;
            var temp6 = (ctx.B * ctx.B - 4 * ctx.A * ctx.C) * (temp3 - temp4);
            return (temp5 + temp6) / (8 * Math.pow(ctx.A, 1.5));
        };
        UniformBezier.prototype.uniformBezier_InitCtx = function (ctx, x0, y0, x1, y1, x2, y2) {
            ctx.x0 = x0;
            ctx.y0 = y0;
            ctx.x1 = x1;
            ctx.y1 = y1;
            ctx.x2 = x2;
            ctx.y2 = y2;
            ctx.ax = x0 - 2 * x1 + x2;
            ctx.ay = y0 - 2 * y1 + y2;
            ctx.bx = 2 * x1 - 2 * x0;
            ctx.by = 2 * y1 - 2 * y0;
            ctx.A = 4 * (ctx.ax * ctx.ax + ctx.ay * ctx.ay);
            ctx.B = 4 * (ctx.ax * ctx.bx + ctx.ay * ctx.by);
            ctx.C = ctx.bx * ctx.bx + ctx.by * ctx.by;
            ctx.len = this.uniformBezier_Length(ctx, 1);
        };
        UniformBezier.prototype.uniformBezier_Speed = function (ctx, t) {
            return Math.sqrt(ctx.A * t * t + ctx.B * t + ctx.C);
        };
        UniformBezier.prototype.uniformBezier_InvertLength = function (ctx, t, l) {
            var self = this;
            var t1 = t, t2, s;
            do {
                s = self.uniformBezier_Speed(ctx, t1);
                if (s != s) {
                    t2 = t1;
                    break;
                }
                t2 = t1 - (self.uniformBezier_Length(ctx, t1) - l) / s;
                if (t2 != t2 || t2 < 0) {
                    t2 = t1;
                    break;
                }
                if (Math.abs(t1 - t2) < 0.01)
                    break;
                t1 = t2;
            } while (true);
            return t2;
        };
        UniformBezier.prototype.uniformBezier_GetPos = function (ctx, u, ox, oy) {
            var l = u * ctx.len;
            var point = new cc.Vec2();
            u = this.uniformBezier_InvertLength(ctx, u, l);
            ox = (1 - u) * (1 - u) * ctx.x0 + 2 * (1 - u) * u * ctx.x1 + u * u * ctx.x2;
            oy = (1 - u) * (1 - u) * ctx.y0 + 2 * (1 - u) * u * ctx.y1 + u * u * ctx.y2;
            point.x = ox;
            point.y = oy;
            return point;
        };
        return UniformBezier;
    }());
    ML.UniformBezier = UniformBezier;
    __reflect(UniformBezier.prototype, "ML.UniformBezier");
    var TUniformBezierCtx = (function () {
        function TUniformBezierCtx() {
        }
        return TUniformBezierCtx;
    }());
    ML.TUniformBezierCtx = TUniformBezierCtx;
    __reflect(TUniformBezierCtx.prototype, "ML.TUniformBezierCtx");
})(ML || (ML = {}));
(function (ML) {
    var LineCircleVo = (function (_super) {
        __extends(LineCircleVo, _super);
        function LineCircleVo() {
            var _this = _super.call(this) || this;
            _this.lineList = [];
            return _this;
        }
        LineCircleVo.prototype.parseData = function () {
            this._points = [];
            var index = 0;
            var count = this.lineList.length;
            var tempStr = this.lineList[0];
            var tempArr = tempStr.split(",");
            this._duration = parseFloat(tempArr[0]);
            var pcount = parseFloat(tempArr[1]);
            this._round = parseFloat(tempArr[2]);
            this._dir = parseFloat(tempArr[3]);
            if (tempArr.length >= 7) {
                this._childindex = parseFloat(tempArr[4]);
                this._xoffset = parseFloat(tempArr[5]);
                this._yoffset = parseFloat(tempArr[6]);
            }
            //得到的点
            for (index = 1; index < count; index++) {
                var p = new ML.TLineSegmentPoint();
                var pStr = this.lineList[index];
                var tempP = pStr.split(",");
                p.x = parseFloat(tempP[0]);
                p.y = parseFloat(tempP[1]);
                this._points.push(p);
            }
        };
        LineCircleVo.prototype.preprocess = function () {
            var x1 = this._points[1].x - this._points[0].x;
            var y1 = -(this._points[1].y - this._points[0].y);
            var x2 = this._points[2].x - this._points[0].x;
            var y2 = -(this._points[2].y - this._points[0].y);
            var r1 = Math.atan2(y1, x1);
            if (r1 < 0)
                r1 += 2.0 * Math.PI;
            var r2 = Math.atan2(y2, x2);
            if (r2 < 0)
                r2 += 2.0 * Math.PI;
            var rr = 0.0;
            if (r2 > r1) {
                rr = r2 - r1;
                if (this._dir == 1) {
                    rr = 2 * Math.PI - rr;
                }
            }
            else {
                rr = r1 - r2;
                if (this._dir == 0) {
                    rr = 2 * Math.PI - rr;
                }
            }
            var dr = (this._dir == 1 ? -1.0 : 1.0);
            var tr = this._round * 2 * Math.PI + rr;
            var R1 = Math.sqrt(x1 * x1 + y1 * y1);
            var R2 = Math.sqrt(x2 * x2 + y2 * y2);
            var D = 2.0 / (1.0 / R1 + 1.0 / R2);
            this._length = D * tr / 2.0; //客户端没有啥意义
        };
        LineCircleVo.prototype.getPosInternal = function (t, x, y) {
            if (this._points.length < 3)
                return { bol: false, x: x, y: y, d: 0 };
            if (t >= this._duration) {
                return { bol: false, x: x, y: y, d: 0 };
            }
            var x1 = this._points[1].x - this._points[0].x;
            var y1 = -(this._points[1].y - this._points[0].y);
            var x2 = this._points[2].x - this._points[0].x;
            var y2 = -(this._points[2].y - this._points[0].y);
            var r1 = Math.atan2(y1, x1);
            if (r1 < 0)
                r1 += 2.0 * Math.PI;
            var r2 = Math.atan2(y2, x2);
            if (r2 < 0)
                r2 += 2.0 * Math.PI;
            var rr = 0.0;
            if (r2 > r1) {
                rr = r2 - r1;
                if (this._dir == 1) {
                    rr = 2 * Math.PI - rr;
                }
            }
            else {
                rr = r1 - r2;
                if (this._dir == 0) {
                    rr = 2 * Math.PI - rr;
                }
            }
            var dr = (this._dir == 1 ? -1.0 : 1.0);
            var tr = this._round * 2 * Math.PI + rr;
            var r = dr * tr * t / this._duration + r1;
            var R1 = Math.sqrt(x1 * x1 + y1 * y1);
            var R2 = Math.sqrt(x2 * x2 + y2 * y2);
            var R = R1 + (R2 - R1) * t / this._duration;
            var d;
            var D = 2.0 / (1.0 / R1 + 1.0 / R);
            d = D * tr * t / (2.0 * this._duration);
            x = this._points[0].x + R * Math.cos(r);
            y = this._points[0].y - R * Math.sin(r);
            return { bol: true, x: x, y: y, d: d };
        };
        return LineCircleVo;
    }(ML.LineSegment));
    ML.LineCircleVo = LineCircleVo;
    __reflect(LineCircleVo.prototype, "ML.LineCircleVo");
})(ML || (ML = {}));
(function (ML) {
    var LineCurveVo = (function (_super) {
        __extends(LineCurveVo, _super);
        function LineCurveVo() {
            var _this = _super.call(this) || this;
            _this.lineList = [];
            _this._subCtx = [];
            _this.distances = [];
            return _this;
        }
        LineCurveVo.prototype.parseData = function () {
            this._points = [];
            var index = 0;
            var count = this.lineList.length;
            var tempStr = this.lineList[0];
            var tempArr = tempStr.split(",");
            this._duration = parseFloat(tempArr[0]);
            var pcount = parseFloat(tempArr[1]);
            if (tempArr.length >= 5) {
                this._childindex = parseFloat(tempArr[2]);
                this._xoffset = parseFloat(tempArr[3]);
                this._yoffset = parseFloat(tempArr[4]);
            }
            //得到的点
            for (index = 1; index < count; index++) {
                var p = new ML.TLineSegmentPoint();
                var pStr = this.lineList[index];
                var tempP = pStr.split(",");
                p.x = parseFloat(tempP[0]);
                p.y = parseFloat(tempP[1]);
                p.speed = parseFloat(tempP[2]);
                p.t = parseFloat(tempP[3]);
                this._points.push(p);
            }
        };
        LineCurveVo.prototype.preprocess = function () {
            if (this._points.length == 0)
                return;
            var grain = 10;
            var dsum = 0.0;
            // std::vector<float> distances;
            this._length = 0.0;
            if (this._points.length == 2) {
                this._points[0].t = 0.0;
                this._points[1].t = this._duration;
                this._length = Math.sqrt((this._points[1].x - this._points[0].x) * (this._points[1].x - this._points[0].x) +
                    (this._points[1].y - this._points[0].y) * (this._points[1].y - this._points[0].y));
                return;
            }
            var index = 0;
            while (index + 2 < this._points.length) {
                var ctx = new ML.TUniformBezierCtx();
                var uBezier = new ML.UniformBezier();
                uBezier.uniformBezier_InitCtx(ctx, this._points[index].x, this._points[index].y, this._points[index + 1].x, this._points[index + 1].y, this._points[index + 2].x, this._points[index + 2].y);
                var speed = this._points[index].speed;
                dsum += ctx.len / speed;
                this.distances.push(ctx.len / speed);
                this._subCtx.push(ctx);
                this._length += ctx.len;
                index += 2;
            }
            this._points[0].t = 0.0;
            index = 0;
            var i = 0;
            while (index + 2 < this._points.length) {
                var dt = this._duration * this.distances[i] / (dsum);
                this._points[index + 2].t = this._points[index].t + dt;
                this._points[index + 1].t = 0.0;
                index += 2;
                i++;
            }
        };
        LineCurveVo.prototype.getPosInternal = function (t, x, y) {
            if (this._points.length == 0)
                return { bol: false, x: x, y: y };
            var d = 0;
            var lastpt = this._points[this._points.length - 1];
            if (t > lastpt.t) {
                return { bol: false, x: x, y: y, d: d };
            }
            if (this._points.length == 2) {
                var p = t / (this._points[1].t - this._points[0].t);
                x = this._points[0].x + (this._points[1].x - this._points[0].x) * p;
                y = this._points[0].y + (this._points[1].y - this._points[0].y) * p;
                d = p * this._length;
                return { bol: true, x: x, y: y, d: d };
            }
            var i = 0;
            var index = 0;
            var uBezier = new ML.UniformBezier();
            while (index + 2 < this._points.length) {
                if (t >= this._points[index].t && t < this._points[index + 2].t) {
                    var tp0 = this._points[index];
                    var tp1 = this._points[index + 1];
                    var tp2 = this._points[index + 2];
                    var u = (t - tp0.t) / (tp2.t - tp0.t);
                    var ctx = this._subCtx[i];
                    // uBezier.uniformBezier_InitCtx(ctx, tp0.x, tp0.y, tp1.x, tp1.y, tp2.x, tp2.y);
                    var point = uBezier.uniformBezier_GetPos(ctx, u, x, y);
                    d += u * ctx.len;
                    return { bol: true, x: point.x, y: point.y, d: d };
                }
                else {
                    d += this._subCtx[i].len;
                }
                index += 2;
                i++;
            }
            return { bol: false, x: x, y: y, d: d };
        };
        return LineCurveVo;
    }(ML.LineSegment));
    ML.LineCurveVo = LineCurveVo;
    __reflect(LineCurveVo.prototype, "ML.LineCurveVo");
})(ML || (ML = {}));
(function (ML) {
    var FishLineVo = (function () {
        function FishLineVo() {
            this.dict = {};
        }
        /**获取line列表 */
        FishLineVo.prototype.getLine = function (id) {
            //if (this.dict[id]) {
            return this.dict[id];
            //} else {
            //return null;
            //}
        };
        FishLineVo.prototype.getPosAndDir = function (id, t) {
            var x0 = 0, y0 = 0, x1 = 0, y1 = 0;
            var x = 0, y = 0, dirx = 0, diry = 0;
            var tPosAndDirVo;
            var ret0 = this.getPos(t, x0, y0, id);
            tPosAndDirVo = new TPosAndDirVo(ret0);
            if (!ret0.bol) {
                return this.py_BuildValue(tPosAndDirVo);
                ;
            }
            var ret1 = this.getPos(t + 1 / 60.0, x1, y1, id);
            if (!ret1.bol) {
                tPosAndDirVo.isBol = ret1.bol;
                return this.py_BuildValue(tPosAndDirVo);
                ;
            }
            x0 = tPosAndDirVo.posX;
            y0 = tPosAndDirVo.posY;
            x1 = ret1.x;
            y1 = ret1.y;
            var d = Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0));
            if (d > 0.0) {
                dirx = (x1 - x0) / d;
                diry = (y1 - y0) / d;
            }
            else {
                dirx = 1.0;
                diry = 0.0;
            }
            tPosAndDirVo.isBol = true;
            tPosAndDirVo.dirX = dirx;
            tPosAndDirVo.dirY = diry;
            return this.py_BuildValue(tPosAndDirVo);
        };
        FishLineVo.prototype.getPos = function (t, x, y, id) {
            var length = 0;
            var tempList = this.getLine(id);
            if(!tempList)
                return false
            for (var i = 0; i < tempList.length; ++i) {
                var ls = tempList[i];
                if (ls._hasparent) {
                    continue;
                }
                var len = 0.0;
                var ret = ls.GetPos(t, x, y);
                if (ret.bol) {
                    length += ret.d;
                    ret.d = length;
                    return ret;
                }
                length += ls._length;
                t -= ls._duration;
            }
            return false;
        };
        /**转换下坐标 */
        FishLineVo.prototype.py_BuildValue = function (params) {
            // params.posY = 640-params.posY;  //(640 服务器屏幕高度)
            // params.dirY *= -1;
            return params;
        };
        /**获取鱼游动最大时间 */
        FishLineVo.prototype.getFishLineTime = function (line_id) {
            var time = 0;
            var tempList = this.getLine(line_id);
            var length = 0;
            for (var i = 0; i < tempList.length; ++i) {
                var ls = tempList[i];
                time += ls._duration;
            }
            return time;
        };
        return FishLineVo;
    }());
    ML.FishLineVo = FishLineVo;
    __reflect(FishLineVo.prototype, "ML.FishLineVo");
    var TPosAndDirVo = (function () {
        function TPosAndDirVo(vo) {
            this.isBol = vo.bol;
            this.posX = vo.x;
            this.posY = vo.y;
            this.dirX = vo.dirx;
            this.dirY = vo.diry;
            this.length = vo.d;
        }
        return TPosAndDirVo;
    }());
    ML.TPosAndDirVo = TPosAndDirVo;
    __reflect(TPosAndDirVo.prototype, "ML.TPosAndDirVo");
})(ML || (ML = {}));
(function (ML) {
    function getfishline(resName) {
        if (!instance)
            instance = new prafil();
        return instance.getFishLine(RES.getRes(resName));
    }
    ML.getfishline = getfishline;
    function getfishlinetxt(txt) {
        if (!instance)
            instance = new prafil();
        return instance.getFishLine(txt);
    }
    ML.getfishlinetxt = getfishlinetxt;
    var prafil = (function () {
        function prafil() {
            /**存储鱼线路的列表 */
            this._lineDictionary = {};
        }
        /**路线数据解析 */
        prafil.prototype.fishMoveListData = function (txt) {
            var txtList; //字符串列表
            txtList = txt.split(new RegExp('\\r\\n|\\r|\\n')); // 字符串变成列表
            var lno = 0;
            var version = parseInt(txtList[lno]); //version
            var fishLineVo = new ML.FishLineVo();
            fishLineVo.version = version;
            var count = txtList.length - 1;
            while (lno < count) {
                lno++; //1.LINE_BEGIN
                var temp_Arr = txtList[++lno].split(",");
                var id = parseInt(temp_Arr[0]);
                var segcount = parseInt(temp_Arr[1]);
                var tempList = [];
                for (var index = 0; index < segcount; ++index) {
                    lno++; //1.SEG_BEGIN
                    var type = parseInt(txtList[lno].split(".")[0]);
                    var lineTypeVo = void 0;
                    if (type == 1)
                        lineTypeVo = new ML.LineCurveVo();
                    else
                        lineTypeVo = new ML.LineCircleVo();
                    lineTypeVo.type = type;
                    while (txtList[lno] != "SEG_END") {
                        lno++;
                        if ("SEG_END" != txtList[lno]) {
                            lineTypeVo.lineList.push(txtList[lno]);
                        }
                    }
                    lineTypeVo.parseData();
                    lineTypeVo.preprocess();
                    tempList.push(lineTypeVo);
                }
                lno++; //1.LINE_END
                fishLineVo.dict[id] = tempList;
            }
            return fishLineVo;
        };
        prafil.prototype.getFishLine = function (resName) {
            var tmp;
            if (this._lineDictionary[resName]) {
                tmp = this._lineDictionary[resName];
            }
            else {
                //初始化
                tmp = this.fishMoveListData(resName);
                this._lineDictionary[resName] = tmp;
            }
            return tmp;
        };
        return prafil;
    }());
    ML.prafil = prafil;
    __reflect(prafil.prototype, "ML.prafil");
    var instance;
})(ML || (ML = {}));
