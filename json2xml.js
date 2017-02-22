function json2xml(json) {
    var a = JSON.parse(json)
    var c = document.createElement("root");
    var t = function (v) {
        return {}.toString.call(v).split(' ')[1].slice(0, -1).toLowerCase();
    };
    var f = function (f, c, a, s) {
        c.setAttribute("type", t(a));
        if (t(a) != "array" && t(a) != "object") {
            if (t(a) != "null") {
                c.appendChild(document.createTextNode(a));
            }
        } else {
            for (var k in a) {
                var v = a[k];
                if (k == "__type" && t(a) == "object") {
                    c.setAttribute("__type", v);
                } else {
                    if (t(v) == "object") {
                        var ch = c.appendChild(document.createElementNS(null, s ? "item" : k));
                        f(f, ch, v);
                    } else if (t(v) == "array") {
                        var ch = c.appendChild(document.createElementNS(null, s ? "item" : k));
                        f(f, ch, v, true);
                    } else {
                        var va = document.createElementNS(null, s ? "item" : k);
                        if (t(v) != "null") {
                            va.appendChild(document.createTextNode(v));
                        }
                        var ch = c.appendChild(va);
                        ch.setAttribute("type", t(v));
                    }
                }
            }
        }
    };
    f(f, c, a, t(a) == "array");
    return c.outerHTML;
}

function xml2json(xml) {
    var dom = window.ActiveXObject ? (new ActiveXObject("Microsoft.XMLDOM")) : null;
    dom = dom ? dom : document.implementation.createDocument(null, "body");
    dom.firstChild.innerHTML = xml;
    a = dom.firstChild.firstChild;
    var t = function (v) {
        return v.getAttribute ? v.getAttribute("type") : "null";
    };
    var f = function (f, a) {
        var c = undefined;
        if (t(a) == "null") {
            c = null;
        } else if (t(a) == "boolean") {
            var b = a.textContent.toLowerCase().substr(0, 1);
            c = ['1', 't'].indexOf(b) != -1;
        } else if (t(a) == "number") {
            c = Number(a.textContent);
        } else if (t(a) == "string") {
            c = a.textContent;
        } else if (t(a) == "object") {
            c = {};
            if (a.getAttribute("__type")) {
                c["__type"] = a.getAttribute("__type");
            }
            for (var i = 0; i < a.childNodes.length; i++) {
                var v = a.childNodes[i];
                c[v.nodeName] = f(f, v);
            }
        } else if (t(a) == "array") {
            c = [];
            for (var i = 0; i < a.childNodes.length; i++) {
                var v = a.childNodes[i];
                c[i] = f(f, v);
            }
        }
        return c;
    };
    var c = f(f, a);
    return JSON.stringify(c);
}