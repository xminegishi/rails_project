
(function (Raphael) {
    Raphael.colorwheel = function(x, y, size, initcolor, element) {
      return new Colorwheel(x, y, size, initcolor, element);
    };
    var pi = Math.PI;
    var doc = document;
    var win = window;
    var Colorwheel = function (x, y, size, initcolor, element) {
            size = size || 200;
            var w3 = 3 * size / 200;
            var w1 = size / 200;
            var fi = 1.6180339887;
            var segments = pi * size / 5;
            var size20 = size / 13;
            var size2 = size / 2;
            var padding = 2 * size / 200;
            var t = this;

            var H = 1, S = 1, B = 1, s = size - (size20 * 4);
            var r = element ? Raphael(element, size, size) : Raphael(x, y, size, size);
            var xy = s / 6 + size20 * 2 + padding;
            var wh = s * 2 / 3 - padding * 2;
            if(w1 < 1)
                w1 = 1;
            if(w3 < 1)
                w3 = 1;

            // ring drawing
            var a = pi / 2 - pi * 2 / segments * 1.3;
                //outer radius
            var R = size2 - padding;
                //inner radius
            var R2 = R - size20 * 2;
            var path = ["M", size2, padding, "A", R, R, 0, 0, 1, R * Math.cos(a) + R + padding, R - R * Math.sin(a) + padding, "L", R2 * Math.cos(a) + R + padding, R - R2 * Math.sin(a) + padding, "A", R2, R2, 0, 0, 0, size2, padding + size20 * 2, "z"].join();
            var startH = initcolor;
            var hue = startH;
            for (var i = 0; i < segments; i++) {
                hue = startH - (i / segments);
                if (hue < 0)
                    hue += 1;

                r.path(path).attr({
                    stroke: "none",
                    fill: "hsb(" + hue + ", 1, 1)",
                    transform: "r" + [(360 / segments) * i, size2, size2]
                });
            }
            // ring outline drawing
            r.path(["M", size2, padding, "A", R, R, 0, 1, 1, size2 - 1, padding, "l1,0", "M", size2, padding + size20 * 2, "A", R2, R2, 0, 1, 1, size2 - 1, padding + size20 * 2, "l1,0"]).attr({
                "stroke-width": w3,
                stroke: "#fff"
            });
            t.cursorhsb = r.set();
            var h = size20 * 2 + 2;
            t.cursorhsb.push(r.rect(size2 - h / fi / 2, padding - 1, h / fi, h, 3 * size / 200).attr({
                stroke: "#000",
                opacity: .7,
                "stroke-width": w3
            }));
            t.cursorhsb.push(r.rect(size2 - h / fi / 2, padding - 1, h / fi, h, 3 * size / 200).attr({
                stroke: "#fff",
                opacity: 1,
                "stroke-width": w1
            }));
            t.ring = r.path(["M", size2, padding, "A", R, R, 0, 1, 1, size2 - 1, padding, "l1,0M", size2, padding + size20 * 2, "A", R2, R2, 0, 1, 1, size2 - 1, padding + size20 * 2, "l1,0"]).attr({
                fill: "#000",
                opacity: 0,
                stroke: "none"
            });

            t.H = t.S = t.B = 1;
            t.raphael = r;
            t.size2 = size2;
            t.wh = wh;
            t.x = x;
            t.xy = xy;
            t.y = y;
            t.startH = startH;

            // events
            t.ring.drag(function (dx, dy, x, y) {
                t.docOnMove(dx, dy, x, y);
            }, function (x, y) {
                t.hsbOnTheMove = true;
                t.setHfromCoord(x - t.x - t.size2, y - t.y - t.size2);
            }, function () {
                t.hsbOnTheMove = false;
            });

            //t.color(initcolor || "#f00");
            t.setHfromCoord(0, padding - size2);
        }

    Colorwheel.prototype.setHfromCoord = function (x, y) {
        var d = Raphael.angle(x, y, 0, 0);
        var rd = Raphael.rad(d);
        this.cursorhsb.attr({transform: "r" + [d + 90, this.size2, this.size2]});
        this.H = (d + 90) / 360;
        if(this.onchange)
            this.onchange(this.color());
    };
    Colorwheel.prototype.docOnMove = function (dx, dy, x, y) {
        if (this.hsbOnTheMove) {
            this.setHfromCoord(x - this.x - this.size2, y - this.y - this.size2);
        }
    };
    Colorwheel.prototype.remove = function () {
        this.raphael.remove();
        this.color = function () {
            return false;
        };
    };
    Colorwheel.prototype.color = function (color) {
        if (color) {
            color = Raphael.color(color);
            var d = color.h * 360;
            //this.H = color.h;
            this.H = this.startH;
            this.cursorhsb.attr({transform: "r" + [d, this.size2, this.size2]});
            return this;
        } else {
            return this.H * 20;
        }
    };
    Colorwheel.prototype.temperature = function (hue) {
        
    };
    Colorwheel.prototype.setTemp = function (temp) {

    };
    Colorwheel.prototype.setTempMin = function (tempMin) {

    };
    Colorwheel.prototype.setTempMax = function (tempMax) {

    };
})(window.Raphael);
