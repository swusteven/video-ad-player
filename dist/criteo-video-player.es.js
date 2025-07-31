var Ze = Object.defineProperty;
var Je = (t, e, n) => e in t ? Ze(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var $ = (t, e, n) => Je(t, typeof e != "symbol" ? e + "" : e, n);
function Ke(t) {
  if (t === void 0)
    return;
  const e = t.slice(0, 5);
  return e != "https" && e.slice(0, 4) === "http" ? t.replace("http", "https") : t;
}
class Ve {
  async getFromUrl(e) {
    const r = await (await fetch(e)).text();
    return this.getInformation(r);
  }
  getFromContent(e) {
    return this.getInformation(e);
  }
  getInformation(e) {
    try {
      const n = new window.DOMParser().parseFromString(e, "text/xml");
      return this.parseFile(n);
    } catch (n) {
      throw console.error("Could not fetch vast file", n), n;
    }
  }
  parseFile(e) {
    return {
      mediaUrl: Ke(this.queryXMLFile(e, "MediaFile")),
      clickThroughUrl: this.queryXMLFile(e, "ClickThrough"),
      beacons: {
        adFirstQuartile: this.queryXMLFile(
          e,
          "Tracking[event='firstQuartile']"
        ),
        adMidpoint: this.queryXMLFile(e, "Tracking[event='midpoint']"),
        adThirdQuartile: this.queryXMLFile(
          e,
          "Tracking[event='thirdQuartile']"
        ),
        adCompleted: this.queryXMLFile(e, "Tracking[event='complete']"),
        mute: this.queryXMLFile(e, "Tracking[event='mute']"),
        unmute: this.queryXMLFile(e, "Tracking[event='unmute']"),
        pause: this.queryXMLFile(e, "Tracking[event='pause']"),
        resume: this.queryXMLFile(e, "Tracking[event='resume']"),
        impression: this.queryXMLFile(e, "Impression"),
        adStarted: this.queryXMLFile(e, "Tracking[event='start']"),
        clickThrough: this.queryXMLFile(e, "ClickTracking"),
        verificationNotExecuted: this.queryXMLFile(
          e,
          'TrackingEvents Tracking[event="verificationNotExecuted"]'
        )
      },
      adVerifications: this.loadAdVerifications(e)
    };
  }
  loadAdVerifications(e) {
    let n = e.querySelectorAll("AdVerifications Verification");
    return n.length ? Array.from(n).map((r) => ({
      javascriptResource: this.queryXMLFile(
        r,
        "JavaScriptResource"
      ),
      apiFramework: this.queryXMLAttribute(
        r.querySelector("JavaScriptResource"),
        "apiFramework"
      ),
      vendor: this.queryXMLAttribute(r, "vendor"),
      verificationParameters: this.queryXMLFile(
        r,
        "VerificationParameters"
      )
    })) : [];
  }
  queryXMLFile(e, n) {
    var r;
    return (r = e.querySelector(n)) == null ? void 0 : r.firstChild.wholeText.trim();
  }
  queryXMLAttribute(e, n) {
    return (e == null ? void 0 : e.getAttribute(n)) ?? void 0;
  }
}
var z, f, $e, A, ae, Ae, G, oe, ee, te, R = {}, Ne = [], Ye = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i, Z = Array.isArray;
function V(t, e) {
  for (var n in e) t[n] = e[n];
  return t;
}
function He(t) {
  t && t.parentNode && t.parentNode.removeChild(t);
}
function ne(t, e, n) {
  var r, o, i, s = {};
  for (i in e) i == "key" ? r = e[i] : i == "ref" ? o = e[i] : s[i] = e[i];
  if (arguments.length > 2 && (s.children = arguments.length > 3 ? z.call(arguments, 2) : n), typeof t == "function" && t.defaultProps != null) for (i in t.defaultProps) s[i] === void 0 && (s[i] = t.defaultProps[i]);
  return X(t, s, r, o, null);
}
function X(t, e, n, r, o) {
  var i = { type: t, props: e, key: n, ref: r, __k: null, __: null, __b: 0, __e: null, __d: void 0, __c: null, constructor: void 0, __v: o ?? ++$e, __i: -1, __u: 0 };
  return o == null && f.vnode != null && f.vnode(i), i;
}
function H(t) {
  return t.children;
}
function F(t, e) {
  this.props = t, this.context = e;
}
function U(t, e) {
  if (e == null) return t.__ ? U(t.__, t.__i + 1) : null;
  for (var n; e < t.__k.length; e++) if ((n = t.__k[e]) != null && n.__e != null) return n.__e;
  return typeof t.type == "function" ? U(t) : null;
}
function Ue(t) {
  var e, n;
  if ((t = t.__) != null && t.__c != null) {
    for (t.__e = t.__c.base = null, e = 0; e < t.__k.length; e++) if ((n = t.__k[e]) != null && n.__e != null) {
      t.__e = t.__c.base = n.__e;
      break;
    }
    return Ue(t);
  }
}
function ce(t) {
  (!t.__d && (t.__d = !0) && A.push(t) && !Q.__r++ || ae !== f.debounceRendering) && ((ae = f.debounceRendering) || Ae)(Q);
}
function Q() {
  var t, e, n, r, o, i, s, c;
  for (A.sort(G); t = A.shift(); ) t.__d && (e = A.length, r = void 0, i = (o = (n = t).__v).__e, s = [], c = [], n.__P && ((r = V({}, o)).__v = o.__v + 1, f.vnode && f.vnode(r), ie(n.__P, r, o, n.__n, n.__P.namespaceURI, 32 & o.__u ? [i] : null, s, i ?? U(o), !!(32 & o.__u), c), r.__v = o.__v, r.__.__k[r.__i] = r, Ie(s, r, c), r.__e != i && Ue(r)), A.length > e && A.sort(G));
  Q.__r = 0;
}
function Re(t, e, n, r, o, i, s, c, a, l, p) {
  var _, d, u, g, k, b = r && r.__k || Ne, v = e.length;
  for (n.__d = a, Ge(n, e, b), a = n.__d, _ = 0; _ < v; _++) (u = n.__k[_]) != null && (d = u.__i === -1 ? R : b[u.__i] || R, u.__i = _, ie(t, u, d, o, i, s, c, a, l, p), g = u.__e, u.ref && d.ref != u.ref && (d.ref && _e(d.ref, null, u), p.push(u.ref, u.__c || g, u)), k == null && g != null && (k = g), 65536 & u.__u || d.__k === u.__k ? a = Oe(u, a, t) : typeof u.type == "function" && u.__d !== void 0 ? a = u.__d : g && (a = g.nextSibling), u.__d = void 0, u.__u &= -196609);
  n.__d = a, n.__e = k;
}
function Ge(t, e, n) {
  var r, o, i, s, c, a = e.length, l = n.length, p = l, _ = 0;
  for (t.__k = [], r = 0; r < a; r++) (o = e[r]) != null && typeof o != "boolean" && typeof o != "function" ? (s = r + _, (o = t.__k[r] = typeof o == "string" || typeof o == "number" || typeof o == "bigint" || o.constructor == String ? X(null, o, null, null, null) : Z(o) ? X(H, { children: o }, null, null, null) : o.constructor === void 0 && o.__b > 0 ? X(o.type, o.props, o.key, o.ref ? o.ref : null, o.__v) : o).__ = t, o.__b = t.__b + 1, i = null, (c = o.__i = et(o, n, s, p)) !== -1 && (p--, (i = n[c]) && (i.__u |= 131072)), i == null || i.__v === null ? (c == -1 && _--, typeof o.type != "function" && (o.__u |= 65536)) : c !== s && (c == s - 1 ? _-- : c == s + 1 ? _++ : (c > s ? _-- : _++, o.__u |= 65536))) : o = t.__k[r] = null;
  if (p) for (r = 0; r < l; r++) (i = n[r]) != null && !(131072 & i.__u) && (i.__e == t.__d && (t.__d = U(i)), qe(i, i));
}
function Oe(t, e, n) {
  var r, o;
  if (typeof t.type == "function") {
    for (r = t.__k, o = 0; r && o < r.length; o++) r[o] && (r[o].__ = t, e = Oe(r[o], e, n));
    return e;
  }
  t.__e != e && (e && t.type && !n.contains(e) && (e = U(t)), n.insertBefore(t.__e, e || null), e = t.__e);
  do
    e = e && e.nextSibling;
  while (e != null && e.nodeType === 8);
  return e;
}
function B(t, e) {
  return e = e || [], t == null || typeof t == "boolean" || (Z(t) ? t.some(function(n) {
    B(n, e);
  }) : e.push(t)), e;
}
function et(t, e, n, r) {
  var o = t.key, i = t.type, s = n - 1, c = n + 1, a = e[n];
  if (a === null || a && o == a.key && i === a.type && !(131072 & a.__u)) return n;
  if (r > (a != null && !(131072 & a.__u) ? 1 : 0)) for (; s >= 0 || c < e.length; ) {
    if (s >= 0) {
      if ((a = e[s]) && !(131072 & a.__u) && o == a.key && i === a.type) return s;
      s--;
    }
    if (c < e.length) {
      if ((a = e[c]) && !(131072 & a.__u) && o == a.key && i === a.type) return c;
      c++;
    }
  }
  return -1;
}
function le(t, e, n) {
  e[0] === "-" ? t.setProperty(e, n ?? "") : t[e] = n == null ? "" : typeof n != "number" || Ye.test(e) ? n : n + "px";
}
function q(t, e, n, r, o) {
  var i;
  e: if (e === "style") if (typeof n == "string") t.style.cssText = n;
  else {
    if (typeof r == "string" && (t.style.cssText = r = ""), r) for (e in r) n && e in n || le(t.style, e, "");
    if (n) for (e in n) r && n[e] === r[e] || le(t.style, e, n[e]);
  }
  else if (e[0] === "o" && e[1] === "n") i = e !== (e = e.replace(/(PointerCapture)$|Capture$/i, "$1")), e = e.toLowerCase() in t || e === "onFocusOut" || e === "onFocusIn" ? e.toLowerCase().slice(2) : e.slice(2), t.l || (t.l = {}), t.l[e + i] = n, n ? r ? n.u = r.u : (n.u = oe, t.addEventListener(e, i ? te : ee, i)) : t.removeEventListener(e, i ? te : ee, i);
  else {
    if (o == "http://www.w3.org/2000/svg") e = e.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
    else if (e != "width" && e != "height" && e != "href" && e != "list" && e != "form" && e != "tabIndex" && e != "download" && e != "rowSpan" && e != "colSpan" && e != "role" && e != "popover" && e in t) try {
      t[e] = n ?? "";
      break e;
    } catch {
    }
    typeof n == "function" || (n == null || n === !1 && e[4] !== "-" ? t.removeAttribute(e) : t.setAttribute(e, e == "popover" && n == 1 ? "" : n));
  }
}
function ue(t) {
  return function(e) {
    if (this.l) {
      var n = this.l[e.type + t];
      if (e.t == null) e.t = oe++;
      else if (e.t < n.u) return;
      return n(f.event ? f.event(e) : e);
    }
  };
}
function ie(t, e, n, r, o, i, s, c, a, l) {
  var p, _, d, u, g, k, b, v, m, x, S, h, w, M, T, N, L = e.type;
  if (e.constructor !== void 0) return null;
  128 & n.__u && (a = !!(32 & n.__u), i = [c = e.__e = n.__e]), (p = f.__b) && p(e);
  e: if (typeof L == "function") try {
    if (v = e.props, m = "prototype" in L && L.prototype.render, x = (p = L.contextType) && r[p.__c], S = p ? x ? x.props.value : p.__ : r, n.__c ? b = (_ = e.__c = n.__c).__ = _.__E : (m ? e.__c = _ = new L(v, S) : (e.__c = _ = new F(v, S), _.constructor = L, _.render = nt), x && x.sub(_), _.props = v, _.state || (_.state = {}), _.context = S, _.__n = r, d = _.__d = !0, _.__h = [], _._sb = []), m && _.__s == null && (_.__s = _.state), m && L.getDerivedStateFromProps != null && (_.__s == _.state && (_.__s = V({}, _.__s)), V(_.__s, L.getDerivedStateFromProps(v, _.__s))), u = _.props, g = _.state, _.__v = e, d) m && L.getDerivedStateFromProps == null && _.componentWillMount != null && _.componentWillMount(), m && _.componentDidMount != null && _.__h.push(_.componentDidMount);
    else {
      if (m && L.getDerivedStateFromProps == null && v !== u && _.componentWillReceiveProps != null && _.componentWillReceiveProps(v, S), !_.__e && (_.shouldComponentUpdate != null && _.shouldComponentUpdate(v, _.__s, S) === !1 || e.__v === n.__v)) {
        for (e.__v !== n.__v && (_.props = v, _.state = _.__s, _.__d = !1), e.__e = n.__e, e.__k = n.__k, e.__k.some(function(I) {
          I && (I.__ = e);
        }), h = 0; h < _._sb.length; h++) _.__h.push(_._sb[h]);
        _._sb = [], _.__h.length && s.push(_);
        break e;
      }
      _.componentWillUpdate != null && _.componentWillUpdate(v, _.__s, S), m && _.componentDidUpdate != null && _.__h.push(function() {
        _.componentDidUpdate(u, g, k);
      });
    }
    if (_.context = S, _.props = v, _.__P = t, _.__e = !1, w = f.__r, M = 0, m) {
      for (_.state = _.__s, _.__d = !1, w && w(e), p = _.render(_.props, _.state, _.context), T = 0; T < _._sb.length; T++) _.__h.push(_._sb[T]);
      _._sb = [];
    } else do
      _.__d = !1, w && w(e), p = _.render(_.props, _.state, _.context), _.state = _.__s;
    while (_.__d && ++M < 25);
    _.state = _.__s, _.getChildContext != null && (r = V(V({}, r), _.getChildContext())), m && !d && _.getSnapshotBeforeUpdate != null && (k = _.getSnapshotBeforeUpdate(u, g)), Re(t, Z(N = p != null && p.type === H && p.key == null ? p.props.children : p) ? N : [N], e, n, r, o, i, s, c, a, l), _.base = e.__e, e.__u &= -161, _.__h.length && s.push(_), b && (_.__E = _.__ = null);
  } catch (I) {
    if (e.__v = null, a || i != null) {
      for (e.__u |= a ? 160 : 32; c && c.nodeType === 8 && c.nextSibling; ) c = c.nextSibling;
      i[i.indexOf(c)] = null, e.__e = c;
    } else e.__e = n.__e, e.__k = n.__k;
    f.__e(I, e, n);
  }
  else i == null && e.__v === n.__v ? (e.__k = n.__k, e.__e = n.__e) : e.__e = tt(n.__e, e, n, r, o, i, s, a, l);
  (p = f.diffed) && p(e);
}
function Ie(t, e, n) {
  e.__d = void 0;
  for (var r = 0; r < n.length; r++) _e(n[r], n[++r], n[++r]);
  f.__c && f.__c(e, t), t.some(function(o) {
    try {
      t = o.__h, o.__h = [], t.some(function(i) {
        i.call(o);
      });
    } catch (i) {
      f.__e(i, o.__v);
    }
  });
}
function tt(t, e, n, r, o, i, s, c, a) {
  var l, p, _, d, u, g, k, b = n.props, v = e.props, m = e.type;
  if (m === "svg" ? o = "http://www.w3.org/2000/svg" : m === "math" ? o = "http://www.w3.org/1998/Math/MathML" : o || (o = "http://www.w3.org/1999/xhtml"), i != null) {
    for (l = 0; l < i.length; l++) if ((u = i[l]) && "setAttribute" in u == !!m && (m ? u.localName === m : u.nodeType === 3)) {
      t = u, i[l] = null;
      break;
    }
  }
  if (t == null) {
    if (m === null) return document.createTextNode(v);
    t = document.createElementNS(o, m, v.is && v), c && (f.__m && f.__m(e, i), c = !1), i = null;
  }
  if (m === null) b === v || c && t.data === v || (t.data = v);
  else {
    if (i = i && z.call(t.childNodes), b = n.props || R, !c && i != null) for (b = {}, l = 0; l < t.attributes.length; l++) b[(u = t.attributes[l]).name] = u.value;
    for (l in b) if (u = b[l], l != "children") {
      if (l == "dangerouslySetInnerHTML") _ = u;
      else if (!(l in v)) {
        if (l == "value" && "defaultValue" in v || l == "checked" && "defaultChecked" in v) continue;
        q(t, l, null, u, o);
      }
    }
    for (l in v) u = v[l], l == "children" ? d = u : l == "dangerouslySetInnerHTML" ? p = u : l == "value" ? g = u : l == "checked" ? k = u : c && typeof u != "function" || b[l] === u || q(t, l, u, b[l], o);
    if (p) c || _ && (p.__html === _.__html || p.__html === t.innerHTML) || (t.innerHTML = p.__html), e.__k = [];
    else if (_ && (t.innerHTML = ""), Re(t, Z(d) ? d : [d], e, n, r, m === "foreignObject" ? "http://www.w3.org/1999/xhtml" : o, i, s, i ? i[0] : n.__k && U(n, 0), c, a), i != null) for (l = i.length; l--; ) He(i[l]);
    c || (l = "value", m === "progress" && g == null ? t.removeAttribute("value") : g !== void 0 && (g !== t[l] || m === "progress" && !g || m === "option" && g !== b[l]) && q(t, l, g, b[l], o), l = "checked", k !== void 0 && k !== t[l] && q(t, l, k, b[l], o));
  }
  return t;
}
function _e(t, e, n) {
  try {
    if (typeof t == "function") {
      var r = typeof t.__u == "function";
      r && t.__u(), r && e == null || (t.__u = t(e));
    } else t.current = e;
  } catch (o) {
    f.__e(o, n);
  }
}
function qe(t, e, n) {
  var r, o;
  if (f.unmount && f.unmount(t), (r = t.ref) && (r.current && r.current !== t.__e || _e(r, null, e)), (r = t.__c) != null) {
    if (r.componentWillUnmount) try {
      r.componentWillUnmount();
    } catch (i) {
      f.__e(i, e);
    }
    r.base = r.__P = null;
  }
  if (r = t.__k) for (o = 0; o < r.length; o++) r[o] && qe(r[o], e, n || typeof t.type != "function");
  n || He(t.__e), t.__c = t.__ = t.__e = t.__d = void 0;
}
function nt(t, e, n) {
  return this.constructor(t, n);
}
function rt(t, e, n) {
  var r, o, i, s;
  f.__ && f.__(t, e), o = (r = typeof n == "function") ? null : e.__k, i = [], s = [], ie(e, t = (!r && n || e).__k = ne(H, null, [t]), o || R, R, e.namespaceURI, !r && n ? [n] : o ? null : e.firstChild ? z.call(e.childNodes) : null, i, !r && n ? n : o ? o.__e : e.firstChild, r, s), Ie(i, t, s);
}
z = Ne.slice, f = { __e: function(t, e, n, r) {
  for (var o, i, s; e = e.__; ) if ((o = e.__c) && !o.__) try {
    if ((i = o.constructor) && i.getDerivedStateFromError != null && (o.setState(i.getDerivedStateFromError(t)), s = o.__d), o.componentDidCatch != null && (o.componentDidCatch(t, r || {}), s = o.__d), s) return o.__E = o;
  } catch (c) {
    t = c;
  }
  throw t;
} }, $e = 0, F.prototype.setState = function(t, e) {
  var n;
  n = this.__s != null && this.__s !== this.state ? this.__s : this.__s = V({}, this.state), typeof t == "function" && (t = t(V({}, n), this.props)), t && V(n, t), t != null && this.__v && (e && this._sb.push(e), ce(this));
}, F.prototype.forceUpdate = function(t) {
  this.__v && (this.__e = !0, t && this.__h.push(t), ce(this));
}, F.prototype.render = H, A = [], Ae = typeof Promise == "function" ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, G = function(t, e) {
  return t.__v.__b - e.__v.__b;
}, Q.__r = 0, oe = 0, ee = ue(!1), te = ue(!0);
var ot = 0;
function y(t, e, n, r, o, i) {
  e || (e = {});
  var s, c, a = e;
  if ("ref" in a) for (c in a = {}, e) c == "ref" ? s = e[c] : a[c] = e[c];
  var l = { type: t, props: a, key: n, ref: s, __k: null, __: null, __b: 0, __e: null, __d: void 0, __c: null, constructor: void 0, __v: --ot, __i: -1, __u: 0, __source: o, __self: i };
  if (typeof t == "function" && (s = t.defaultProps)) for (c in s) a[c] === void 0 && (a[c] = s[c]);
  return f.vnode && f.vnode(l), l;
}
var O, C, J, fe, j = 0, De = [], E = f, de = E.__b, pe = E.__r, he = E.diffed, ve = E.__c, me = E.unmount, ye = E.__;
function se(t, e) {
  E.__h && E.__h(C, t, j || e), j = 0;
  var n = C.__H || (C.__H = { __: [], __h: [] });
  return t >= n.__.length && n.__.push({}), n.__[t];
}
function K(t) {
  return j = 1, it(We, t);
}
function it(t, e, n) {
  var r = se(O++, 2);
  if (r.t = t, !r.__c && (r.__ = [n ? n(e) : We(void 0, e), function(c) {
    var a = r.__N ? r.__N[0] : r.__[0], l = r.t(a, c);
    a !== l && (r.__N = [l, r.__[1]], r.__c.setState({}));
  }], r.__c = C, !C.u)) {
    var o = function(c, a, l) {
      if (!r.__c.__H) return !0;
      var p = r.__c.__H.__.filter(function(d) {
        return !!d.__c;
      });
      if (p.every(function(d) {
        return !d.__N;
      })) return !i || i.call(this, c, a, l);
      var _ = !1;
      return p.forEach(function(d) {
        if (d.__N) {
          var u = d.__[0];
          d.__ = d.__N, d.__N = void 0, u !== d.__[0] && (_ = !0);
        }
      }), !(!_ && r.__c.props === c) && (!i || i.call(this, c, a, l));
    };
    C.u = !0;
    var i = C.shouldComponentUpdate, s = C.componentWillUpdate;
    C.componentWillUpdate = function(c, a, l) {
      if (this.__e) {
        var p = i;
        i = void 0, o(c, a, l), i = p;
      }
      s && s.call(this, c, a, l);
    }, C.shouldComponentUpdate = o;
  }
  return r.__N || r.__;
}
function _t(t, e) {
  var n = se(O++, 3);
  !E.__s && Xe(n.__H, e) && (n.__ = t, n.i = e, C.__H.__h.push(n));
}
function ge(t) {
  return j = 5, st(function() {
    return { current: t };
  }, []);
}
function st(t, e) {
  var n = se(O++, 7);
  return Xe(n.__H, e) && (n.__ = t(), n.__H = e, n.__h = t), n.__;
}
function at() {
  for (var t; t = De.shift(); ) if (t.__P && t.__H) try {
    t.__H.__h.forEach(W), t.__H.__h.forEach(re), t.__H.__h = [];
  } catch (e) {
    t.__H.__h = [], E.__e(e, t.__v);
  }
}
E.__b = function(t) {
  C = null, de && de(t);
}, E.__ = function(t, e) {
  t && e.__k && e.__k.__m && (t.__m = e.__k.__m), ye && ye(t, e);
}, E.__r = function(t) {
  pe && pe(t), O = 0;
  var e = (C = t.__c).__H;
  e && (J === C ? (e.__h = [], C.__h = [], e.__.forEach(function(n) {
    n.__N && (n.__ = n.__N), n.i = n.__N = void 0;
  })) : (e.__h.forEach(W), e.__h.forEach(re), e.__h = [], O = 0)), J = C;
}, E.diffed = function(t) {
  he && he(t);
  var e = t.__c;
  e && e.__H && (e.__H.__h.length && (De.push(e) !== 1 && fe === E.requestAnimationFrame || ((fe = E.requestAnimationFrame) || ct)(at)), e.__H.__.forEach(function(n) {
    n.i && (n.__H = n.i), n.i = void 0;
  })), J = C = null;
}, E.__c = function(t, e) {
  e.some(function(n) {
    try {
      n.__h.forEach(W), n.__h = n.__h.filter(function(r) {
        return !r.__ || re(r);
      });
    } catch (r) {
      e.some(function(o) {
        o.__h && (o.__h = []);
      }), e = [], E.__e(r, n.__v);
    }
  }), ve && ve(t, e);
}, E.unmount = function(t) {
  me && me(t);
  var e, n = t.__c;
  n && n.__H && (n.__H.__.forEach(function(r) {
    try {
      W(r);
    } catch (o) {
      e = o;
    }
  }), n.__H = void 0, e && E.__e(e, n.__v));
};
var be = typeof requestAnimationFrame == "function";
function ct(t) {
  var e, n = function() {
    clearTimeout(r), be && cancelAnimationFrame(e), setTimeout(t);
  }, r = setTimeout(n, 100);
  be && (e = requestAnimationFrame(n));
}
function W(t) {
  var e = C, n = t.__c;
  typeof n == "function" && (t.__c = void 0, n()), C = e;
}
function re(t) {
  var e = C;
  t.__c = t.__(), C = e;
}
function Xe(t, e) {
  return !t || t.length !== e.length || e.some(function(n, r) {
    return n !== t[r];
  });
}
function We(t, e) {
  return typeof e == "function" ? e(t) : e;
}
function lt(t, e) {
  for (var n in e) t[n] = e[n];
  return t;
}
function we(t, e) {
  for (var n in t) if (n !== "__source" && !(n in e)) return !0;
  for (var r in e) if (r !== "__source" && t[r] !== e[r]) return !0;
  return !1;
}
function ke(t, e) {
  this.props = t, this.context = e;
}
(ke.prototype = new F()).isPureReactComponent = !0, ke.prototype.shouldComponentUpdate = function(t, e) {
  return we(this.props, t) || we(this.state, e);
};
var Ce = f.__b;
f.__b = function(t) {
  t.type && t.type.__f && t.ref && (t.props.ref = t.ref, t.ref = null), Ce && Ce(t);
};
var ut = f.__e;
f.__e = function(t, e, n, r) {
  if (t.then) {
    for (var o, i = e; i = i.__; ) if ((o = i.__c) && o.__c) return e.__e == null && (e.__e = n.__e, e.__k = n.__k), o.__c(t, e);
  }
  ut(t, e, n, r);
};
var Ee = f.unmount;
function Qe(t, e, n) {
  return t && (t.__c && t.__c.__H && (t.__c.__H.__.forEach(function(r) {
    typeof r.__c == "function" && r.__c();
  }), t.__c.__H = null), (t = lt({}, t)).__c != null && (t.__c.__P === n && (t.__c.__P = e), t.__c = null), t.__k = t.__k && t.__k.map(function(r) {
    return Qe(r, e, n);
  })), t;
}
function Be(t, e, n) {
  return t && n && (t.__v = null, t.__k = t.__k && t.__k.map(function(r) {
    return Be(r, e, n);
  }), t.__c && t.__c.__P === e && (t.__e && n.appendChild(t.__e), t.__c.__e = !0, t.__c.__P = n)), t;
}
function Y() {
  this.__u = 0, this.t = null, this.__b = null;
}
function je(t) {
  var e = t.__.__c;
  return e && e.__a && e.__a(t);
}
function D() {
  this.u = null, this.o = null;
}
f.unmount = function(t) {
  var e = t.__c;
  e && e.__R && e.__R(), e && 32 & t.__u && (t.type = null), Ee && Ee(t);
}, (Y.prototype = new F()).__c = function(t, e) {
  var n = e.__c, r = this;
  r.t == null && (r.t = []), r.t.push(n);
  var o = je(r.__v), i = !1, s = function() {
    i || (i = !0, n.__R = null, o ? o(c) : c());
  };
  n.__R = s;
  var c = function() {
    if (!--r.__u) {
      if (r.state.__a) {
        var a = r.state.__a;
        r.__v.__k[0] = Be(a, a.__c.__P, a.__c.__O);
      }
      var l;
      for (r.setState({ __a: r.__b = null }); l = r.t.pop(); ) l.forceUpdate();
    }
  };
  r.__u++ || 32 & e.__u || r.setState({ __a: r.__b = r.__v.__k[0] }), t.then(s, s);
}, Y.prototype.componentWillUnmount = function() {
  this.t = [];
}, Y.prototype.render = function(t, e) {
  if (this.__b) {
    if (this.__v.__k) {
      var n = document.createElement("div"), r = this.__v.__k[0].__c;
      this.__v.__k[0] = Qe(this.__b, n, r.__O = r.__P);
    }
    this.__b = null;
  }
  var o = e.__a && ne(H, null, t.fallback);
  return o && (o.__u &= -33), [ne(H, null, e.__a ? null : t.children), o];
};
var Se = function(t, e, n) {
  if (++n[1] === n[0] && t.o.delete(e), t.props.revealOrder && (t.props.revealOrder[0] !== "t" || !t.o.size)) for (n = t.u; n; ) {
    for (; n.length > 3; ) n.pop()();
    if (n[1] < n[0]) break;
    t.u = n = n[2];
  }
};
(D.prototype = new F()).__a = function(t) {
  var e = this, n = je(e.__v), r = e.o.get(t);
  return r[0]++, function(o) {
    var i = function() {
      e.props.revealOrder ? (r.push(o), Se(e, t, r)) : o();
    };
    n ? n(i) : i();
  };
}, D.prototype.render = function(t) {
  this.u = null, this.o = /* @__PURE__ */ new Map();
  var e = B(t.children);
  t.revealOrder && t.revealOrder[0] === "b" && e.reverse();
  for (var n = e.length; n--; ) this.o.set(e[n], this.u = [1, 0, this.u]);
  return t.children;
}, D.prototype.componentDidUpdate = D.prototype.componentDidMount = function() {
  var t = this;
  this.o.forEach(function(e, n) {
    Se(t, n, e);
  });
};
var ft = typeof Symbol < "u" && Symbol.for && Symbol.for("react.element") || 60103, dt = /^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|dominant|fill|flood|font|glyph(?!R)|horiz|image(!S)|letter|lighting|marker(?!H|W|U)|overline|paint|pointer|shape|stop|strikethrough|stroke|text(?!L)|transform|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/, pt = /^on(Ani|Tra|Tou|BeforeInp|Compo)/, ht = /[A-Z0-9]/g, vt = typeof document < "u", mt = function(t) {
  return (typeof Symbol < "u" && typeof Symbol() == "symbol" ? /fil|che|rad/ : /fil|che|ra/).test(t);
};
F.prototype.isReactComponent = {}, ["componentWillMount", "componentWillReceiveProps", "componentWillUpdate"].forEach(function(t) {
  Object.defineProperty(F.prototype, t, { configurable: !0, get: function() {
    return this["UNSAFE_" + t];
  }, set: function(e) {
    Object.defineProperty(this, t, { configurable: !0, writable: !0, value: e });
  } });
});
var Me = f.event;
function yt() {
}
function gt() {
  return this.cancelBubble;
}
function bt() {
  return this.defaultPrevented;
}
f.event = function(t) {
  return Me && (t = Me(t)), t.persist = yt, t.isPropagationStopped = gt, t.isDefaultPrevented = bt, t.nativeEvent = t;
};
var wt = { enumerable: !1, configurable: !0, get: function() {
  return this.class;
} }, Pe = f.vnode;
f.vnode = function(t) {
  typeof t.type == "string" && function(e) {
    var n = e.props, r = e.type, o = {}, i = r.indexOf("-") === -1;
    for (var s in n) {
      var c = n[s];
      if (!(s === "value" && "defaultValue" in n && c == null || vt && s === "children" && r === "noscript" || s === "class" || s === "className")) {
        var a = s.toLowerCase();
        s === "defaultValue" && "value" in n && n.value == null ? s = "value" : s === "download" && c === !0 ? c = "" : a === "translate" && c === "no" ? c = !1 : a[0] === "o" && a[1] === "n" ? a === "ondoubleclick" ? s = "ondblclick" : a !== "onchange" || r !== "input" && r !== "textarea" || mt(n.type) ? a === "onfocus" ? s = "onfocusin" : a === "onblur" ? s = "onfocusout" : pt.test(s) && (s = a) : a = s = "oninput" : i && dt.test(s) ? s = s.replace(ht, "-$&").toLowerCase() : c === null && (c = void 0), a === "oninput" && o[s = a] && (s = "oninputCapture"), o[s] = c;
      }
    }
    r == "select" && o.multiple && Array.isArray(o.value) && (o.value = B(n.children).forEach(function(l) {
      l.props.selected = o.value.indexOf(l.props.value) != -1;
    })), r == "select" && o.defaultValue != null && (o.value = B(n.children).forEach(function(l) {
      l.props.selected = o.multiple ? o.defaultValue.indexOf(l.props.value) != -1 : o.defaultValue == l.props.value;
    })), n.class && !n.className ? (o.class = n.class, Object.defineProperty(o, "className", wt)) : (n.className && !n.class || n.class && n.className) && (o.class = o.className = n.className), e.props = o;
  }(t), t.$$typeof = ft, Pe && Pe(t);
};
var Te = f.__r;
f.__r = function(t) {
  Te && Te(t), t.__c;
};
var Le = f.diffed;
f.diffed = function(t) {
  Le && Le(t);
  var e = t.props, n = t.__e;
  n != null && t.type === "textarea" && "value" in e && e.value !== n.value && (n.value = e.value == null ? "" : e.value);
};
function kt() {
  return /* @__PURE__ */ y("svg", { viewBox: "0 0 24 24", children: /* @__PURE__ */ y(
    "path",
    {
      fill: "currentColor",
      d: "M5,9V15H9L14,20V4L9,9M18.5,12C18.5,10.23 17.5,8.71 16,7.97V16C17.5,15.29 18.5,13.76 18.5,12Z"
    }
  ) });
}
function Ct() {
  return /* @__PURE__ */ y("svg", { viewBox: "0 0 24 24", children: /* @__PURE__ */ y(
    "path",
    {
      fill: "currentColor",
      d: "M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z"
    }
  ) });
}
function Et() {
  return /* @__PURE__ */ y("svg", { viewBox: "0 0 24 24", children: /* @__PURE__ */ y("path", { fill: "currentColor", d: "M14,19H18V5H14M6,19H10V5H6V19Z" }) });
}
function St() {
  return /* @__PURE__ */ y("svg", { viewBox: "0 0 24 24", children: /* @__PURE__ */ y("path", { fill: "currentColor", d: "M8,5.14V19.14L19,12.14L8,5.14Z" }) });
}
function Mt({
  onClickMute: t,
  onClickPlayPause: e,
  isMuted: n,
  isPlaying: r
}) {
  return /* @__PURE__ */ y("div", { class: "rm-video-controls-container", children: /* @__PURE__ */ y("div", { class: "controls", children: [
    /* @__PURE__ */ y("div", { class: "play-pause-container", children: /* @__PURE__ */ y(
      "button",
      {
        class: "play-pause-btn",
        onClick: e,
        "data-testid": "play-button",
        "aria-label": r ? "Pause" : "Play",
        children: r ? /* @__PURE__ */ y(Et, {}) : /* @__PURE__ */ y(St, {})
      }
    ) }),
    /* @__PURE__ */ y("div", { class: "volume-container", children: /* @__PURE__ */ y(
      "button",
      {
        class: "mute-btn",
        onClick: t,
        "data-testid": "mute-button",
        "aria-label": n ? "Unmute" : "Mute",
        children: n ? /* @__PURE__ */ y(kt, {}) : /* @__PURE__ */ y(Ct, {})
      }
    ) })
  ] }) });
}
function Pt({
  fallbackImage: t,
  optionalVideoRedirectUrl: e,
  optionalRedirectTarget: n
}) {
  return /* @__PURE__ */ y("a", { href: e, target: n, children: /* @__PURE__ */ y("img", { class: "rm-video-fallback-image", src: t }) });
}
class Fe {
  constructor(e, n) {
    $(this, "currentLoop", 1);
    $(this, "adStartedSent", !1);
    $(this, "adFirstQuartileSent", !1);
    $(this, "adMidpointSent", !1);
    $(this, "adThirdQuartileSent", !1);
    $(this, "adCompletedSent", !1);
    this.vastInformation = e, this.mediaEvents = n;
  }
  setTime(e, n, r) {
    const o = e / n * 100;
    this.currentLoop == 1 && (o > 0.01 && !this.adStartedSent && this.sendAdStarted(n, r), o > 25 && !this.adFirstQuartileSent && this.sendFirstQuartile(), o > 50 && !this.adMidpointSent && this.sendMidpoint(), o > 75 && !this.adThirdQuartileSent && this.sendThirdQuartile());
  }
  loop() {
    this.currentLoop === 1 && (P(this.vastInformation.beacons.adCompleted), this.mediaEvents && this.mediaEvents.complete(), this.adCompletedSent = !0), this.currentLoop++;
  }
  pause() {
    P(this.vastInformation.beacons.pause), this.mediaEvents && this.mediaEvents.pause();
  }
  play() {
    P(this.vastInformation.beacons.resume), this.mediaEvents && this.mediaEvents.resume();
  }
  mute() {
    P(this.vastInformation.beacons.mute), this.mediaEvents && this.mediaEvents.volumeChange(0);
  }
  unmute(e) {
    P(this.vastInformation.beacons.unmute), this.mediaEvents && this.mediaEvents.volumeChange(e);
  }
  bufferStart() {
    this.mediaEvents && this.mediaEvents.bufferStart();
  }
  bufferFinish() {
    this.mediaEvents && this.mediaEvents.bufferFinish();
  }
  sendAdStarted(e, n) {
    P(this.vastInformation.beacons.adStarted), this.mediaEvents && this.mediaEvents.start(e, n), this.adStartedSent = !0;
  }
  sendFirstQuartile() {
    P(this.vastInformation.beacons.adFirstQuartile), this.mediaEvents && this.mediaEvents.firstQuartile(), this.adFirstQuartileSent = !0;
  }
  sendMidpoint() {
    P(this.vastInformation.beacons.adMidpoint), this.mediaEvents && this.mediaEvents.midpoint(), this.adMidpointSent = !0;
  }
  sendThirdQuartile() {
    P(this.vastInformation.beacons.adThirdQuartile), this.mediaEvents && this.mediaEvents.thirdQuartile(), this.adThirdQuartileSent = !0;
  }
}
const P = (t) => {
  if (t !== void 0)
    try {
      const e = new URL(t);
      navigator.sendBeacon(e);
    } catch (e) {
      console.error("Could not send beacon", e);
    }
};
async function Tt(t) {
  if (t.adVerifications.length < 1)
    return console.log("No ad verifications found"), null;
  window.OmidSessionClient.default && await Lt();
  const e = window.OmidSessionClient.default, n = e.AdSession, r = e.Partner, o = e.Context, i = e.VerificationScriptResource, s = e.MediaEvents, c = e.AdEvents, a = window.location.href, l = "criteo", p = Object.keys(window.OmidSessionClient)[0], _ = new r(l, p), d = window.top, u = [];
  for (const h of t.adVerifications) {
    if (h.apiFramework != "omid") {
      if (console.log(
        "detected non-omid compatible script, skipping load, attempting to fire verificationNotExecuted"
      ), !t.beacons.verificationNotExecuted) {
        console.log("Failed to load verificationNotExecuted beacon");
        continue;
      }
      P(t.beacons.verificationNotExecuted), console.log(
        t.beacons.verificationNotExecuted,
        "verificationNotExecuted beacon dropped"
      );
      continue;
    }
    u.push(
      new i(
        h.javascriptResource,
        h.vendor,
        h.verificationParameters,
        "full"
      )
    );
  }
  if (u.length < 1)
    return console.log("no valid verification tags detected"), null;
  const g = new o(_, u, a);
  g.setServiceWindow(d);
  const k = new n(g);
  if (k.setCreativeType("video"), k.setImpressionType("beginToRender"), !k.isSupported())
    return console.log("This AdSession is not supported"), null;
  const b = new c(k), v = e.VastProperties, m = new s(k);
  return k.start(), { onAdLoaded: () => {
    k.registerSessionObserver((h) => {
      if (h.type === "sessionStart") {
        const w = new v(!1, 0, !0, "standalone");
        b.loaded(w), b.impressionOccurred(), console.log("OMID AdEvent loaded and impression occurred");
      }
    });
  }, mediaEvents: m, setVideoContext: (h) => {
    g.setVideoElement(h);
  } };
}
async function Lt() {
  try {
    await xe(
      "https://static.criteo.net/banners/js/omidjs/stable/omid-session-client-v1.js"
    ), await xe(
      "https://static.criteo.net/banners/js/omidjs/stable/omweb-v1.js"
    );
  } catch (t) {
    console.error(t);
  }
}
function xe(t) {
  return new Promise((e, n) => {
    const r = document.createElement("script");
    r.src = t, r.onload = () => e(), r.onerror = () => n(new Error(`Failed to load script ${t}`)), document.head.appendChild(r);
  });
}
function Ft(t) {
  const { fallbackImage: e, altText: n, vastInformation: r, maxVolume: o } = t, i = ge(null), [s, c] = K(!0), [a, l] = K(!1), [p, _] = K(!1), d = ge(null), u = () => {
    var h, w;
    s ? (h = d.current) == null || h.mute() : (w = d.current) == null || w.unmute(o || 1), c(!s);
  }, g = (h) => {
    var M, T;
    p && (_(!1), (M = d.current) == null || M.bufferFinish());
    const w = h.target;
    (T = d.current) == null || T.setTime(
      w.currentTime,
      w.duration,
      w.volume
    );
  }, k = () => {
    var h;
    (h = d.current) == null || h.loop();
  }, b = () => {
    r.clickThroughUrl ? (P(r.beacons.clickThrough), window.open(r.clickThroughUrl, "_self")) : (a ? i.current.pause() : i.current.play(), l(!a));
  }, v = () => {
    new IntersectionObserver(
      (w) => {
        for (let M = 0; M < w.length; M++) {
          let N = w[M].isIntersecting;
          N && !a ? (i.current.play(), l(!0)) : !N && a && (i.current.pause(), l(!1));
        }
      },
      { threshold: 0.5 }
    ).observe(i.current);
  }, m = async () => {
    const h = await Tt(r);
    if (h === null) {
      d.current = new Fe(r, null);
      return;
    }
    const { onAdLoaded: w, setVideoContext: M, mediaEvents: T } = h;
    d.current = new Fe(r, T), M(i.current), i.current.addEventListener("canplay", w, { once: !0 });
  };
  _t(() => {
    async function h() {
      await m(), v();
    }
    h();
  }, []);
  const x = () => {
    var h, w;
    a ? (i.current.pause(), (h = d.current) == null || h.pause()) : (i.current.play(), (w = d.current) == null || w.play()), l(!a);
  }, S = () => {
    var h;
    _(!0), (h = d.current) == null || h.bufferStart();
  };
  return /* @__PURE__ */ y("div", { class: "rm-video-player-container", children: [
    /* @__PURE__ */ y(
      "video",
      {
        ref: i,
        class: "rm-ad-player",
        loop: !0,
        muted: s,
        playsInline: !0,
        "webkit-playsInline": !0,
        disablePictureInPicture: !0,
        alt: n,
        src: r.mediaUrl,
        onTimeUpdate: g,
        onEnded: k,
        onClick: b,
        onWaiting: S,
        "data-testid": "video",
        volume: o,
        children: (e == null ? void 0 : e.src) && (e == null ? void 0 : e.optionalVideoRedirectUrl) && (e == null ? void 0 : e.optionalRedirectTarget) && /* @__PURE__ */ y(
          Pt,
          {
            fallbackImage: e == null ? void 0 : e.src,
            optionalVideoRedirectUrl: e == null ? void 0 : e.optionalVideoRedirectUrl,
            optionalRedirectTarget: e == null ? void 0 : e.optionalRedirectTarget
          }
        )
      }
    ),
    /* @__PURE__ */ y(
      Mt,
      {
        onClickPlayPause: x,
        onClickMute: u,
        isMuted: s,
        isPlaying: a
      }
    )
  ] });
}
const ze = async (t, e, n, r) => {
  rt(
    /* @__PURE__ */ y(
      Ft,
      {
        altText: n,
        vastInformation: t,
        fallbackImage: r
      }
    ),
    document.getElementById(e)
  );
}, Vt = async (t, e, n, r) => {
  const i = await new Ve().getFromUrl(t);
  return ze(i, e, n, r);
}, $t = async (t, e, n, r) => {
  const i = await new Ve().getFromContent(t);
  return ze(i, e, n, r);
};
export {
  $t as criteoVideoPlayerFromContent,
  Vt as criteoVideoPlayerFromUrl
};
