/* QANATCHI ArvanCloud Edge API Bundle (API v1) - Pure Web Fetch Standard */
(() => {
  function le(n) {
    let i = 2166136261;
    for (let l = 0; l < n.length; l++) i ^= n.charCodeAt(l), i = Math.imul(i, 16777619);
    return i >>> 0;
  }
  function Se(n) {
    let i = n >>> 0;
    return () => {
      i = i + 1831565813 >>> 0;
      let l = Math.imul(i ^ i >>> 15, 1 | i);
      return l = l + Math.imul(l ^ l >>> 7, 61 | l) ^ l, ((l ^ l >>> 14) >>> 0) / 4294967296;
    };
  }
  function Te(n, i, l) {
    return l <= i ? i : i + Math.floor(n() * (l - i));
  }
  var r = () => ({ type: "empty", initialRotation: 0, solutionRotation: 0, locked: true }), t = () => ({ type: "blocked", initialRotation: 0, solutionRotation: 0, locked: true }), h = (n) => ({ type: "source", initialRotation: n, solutionRotation: n, locked: true }), c = (n) => ({ type: "destination", initialRotation: n, solutionRotation: n, locked: true }), o = (n, i) => ({ type: "straight", initialRotation: n, solutionRotation: i, locked: false }), e = (n, i) => ({ type: "corner", initialRotation: n, solutionRotation: i, locked: false }), a = (n, i) => ({ type: "tee", initialRotation: n, solutionRotation: i, locked: false }), u = (n = 0) => ({ type: "cross", initialRotation: n, solutionRotation: 0, locked: false });
  var H = [{ id: "tpl_01", numericIndex: 1, titleFa: "\u0642\u0646\u0627\u062A \u0633\u062D\u0631\u06AF\u0627\u0647", introFa: "\u062C\u0631\u06CC\u0627\u0646 \u0622\u0628 \u0635\u0628\u062D\u06AF\u0627\u0647\u06CC \u0631\u0627 \u0627\u0632 \u06A9\u0646\u0627\u0631 \u062F\u06CC\u0648\u0627\u0631\u0647\u0627\u06CC \u062E\u0634\u062A\u06CC \u0628\u0647 \u062D\u0648\u0636\u0686\u0647 \u0628\u0631\u0633\u0627\u0646\u06CC\u062F.", difficulty: "normal", rows: 5, cols: 5, source: { row: 0, col: 0 }, destination: { row: 4, col: 4 }, destinations: [{ row: 4, col: 4 }], parTimeSec: 55, grid: [[h(0), o(0, 90), e(0, 180), r(), r()], [r(), t(), o(90, 0), r(), r()], [r(), e(180, 90), e(90, 270), r(), r()], [r(), o(90, 0), t(), r(), r()], [r(), e(270, 0), o(0, 90), o(0, 90), c(0)]] }, { id: "tpl_02", numericIndex: 2, titleFa: "\u0627\u0646\u0634\u0639\u0627\u0628 \u0646\u062E\u0644\u0633\u062A\u0627\u0646", introFa: "\u0622\u0628 \u0633\u0631\u0686\u0634\u0645\u0647 \u0631\u0627 \u0628\u0627 \u06CC\u06A9 \u0633\u0647\u200C\u0631\u0627\u0647\u06CC \u0645\u06CC\u0627\u0646 \u062F\u0648 \u0646\u062E\u0644\u0633\u062A\u0627\u0646 \u06A9\u0648\u06CC\u0631\u06CC \u062A\u0642\u0633\u06CC\u0645 \u06A9\u0646\u06CC\u062F.", difficulty: "normal", rows: 5, cols: 5, source: { row: 2, col: 0 }, destination: { row: 0, col: 4 }, destinations: [{ row: 0, col: 4 }, { row: 4, col: 4 }], parTimeSec: 60, grid: [[r(), r(), e(0, 90), o(0, 90), c(0)], [r(), t(), o(90, 0), t(), r()], [h(0), o(0, 90), a(0, 270), r(), r()], [r(), t(), o(90, 0), t(), r()], [r(), r(), e(90, 0), o(0, 90), c(0)]] }, { id: "tpl_03", numericIndex: 3, titleFa: "\u0686\u0634\u0645\u0647 \u062E\u0648\u0631\u0634\u06CC\u062F", introFa: "\u0645\u0633\u06CC\u0631 \u067E\u0631\u067E\u06CC\u0686\u200C\u0648\u062E\u0645 \u0622\u0628 \u0631\u0627 \u0627\u0632 \u0645\u06CC\u0627\u0646 \u0628\u0642\u0627\u06CC\u0627\u06CC \u0622\u0628\u200C\u0627\u0646\u0628\u0627\u0631 \u0642\u062F\u06CC\u0645\u06CC \u0628\u0627\u0632\u0633\u0627\u0632\u06CC \u06A9\u0646\u06CC\u062F.", difficulty: "medium", rows: 5, cols: 5, source: { row: 0, col: 2 }, destination: { row: 4, col: 2 }, destinations: [{ row: 4, col: 2 }], parTimeSec: 65, grid: [[e(0, 90), o(0, 90), h(180), r(), r()], [o(90, 0), t(), r(), r(), r()], [e(90, 0), o(0, 90), o(0, 90), o(0, 90), e(0, 180)], [r(), r(), t(), r(), o(90, 0)], [r(), r(), c(180), o(0, 90), e(90, 270)]] }, { id: "tpl_04", numericIndex: 4, titleFa: "\u0686\u0647\u0627\u0631\u0631\u0627\u0647 \u0641\u06CC\u0631\u0648\u0632\u0647", introFa: "\u0627\u0632 \u062A\u0642\u0627\u0637\u0639 \u0645\u0631\u06A9\u0632\u06CC \u0642\u0646\u0627\u062A \u0628\u0631\u0627\u06CC \u0622\u0628\u0631\u0633\u0627\u0646\u06CC \u0647\u0645\u200C\u0632\u0645\u0627\u0646 \u0628\u0647 \u0633\u0647 \u062D\u0648\u0636\u0686\u0647 \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u06A9\u0646\u06CC\u062F.", difficulty: "medium", rows: 5, cols: 5, source: { row: 2, col: 0 }, destination: { row: 0, col: 2 }, destinations: [{ row: 0, col: 2 }, { row: 2, col: 4 }, { row: 4, col: 2 }], parTimeSec: 65, grid: [[r(), t(), c(270), t(), r()], [r(), r(), o(90, 0), r(), r()], [h(0), o(0, 90), u(0), o(0, 90), c(0)], [r(), r(), o(90, 0), r(), r()], [r(), t(), c(90), t(), r()]] }, { id: "tpl_05", numericIndex: 5, titleFa: "\u062C\u0648\u06CC\u0628\u0627\u0631 \u0645\u0627\u0647\u062A\u0627\u0628", introFa: "\u0634\u0627\u062E\u0647\u200C\u0647\u0627\u06CC \u067E\u0644\u06A9\u0627\u0646\u06CC \u0642\u0646\u0627\u062A \u0631\u0627 \u0628\u062F\u0648\u0646 \u0646\u0634\u062A \u0628\u0647 \u062F\u0648 \u0628\u0627\u063A \u067E\u0627\u06CC\u06CC\u0646\u06CC \u0647\u062F\u0627\u06CC\u062A \u06A9\u0646\u06CC\u062F.", difficulty: "medium", rows: 5, cols: 5, source: { row: 0, col: 0 }, destination: { row: 2, col: 4 }, destinations: [{ row: 2, col: 4 }, { row: 4, col: 2 }], parTimeSec: 70, grid: [[h(0), o(0, 90), e(0, 180), r(), r()], [t(), r(), o(90, 0), t(), r()], [r(), r(), a(0, 90), o(0, 90), c(0)], [r(), t(), o(90, 0), r(), r()], [r(), r(), c(90), r(), r()]] }, { id: "tpl_06", numericIndex: 6, titleFa: "\u0634\u0628\u06A9\u0647 \u06A9\u0647\u0646", introFa: "\u062F\u0648 \u0633\u0647\u200C\u0631\u0627\u0647\u06CC \u0627\u0635\u0644\u06CC \u0631\u0627 \u0637\u0648\u0631\u06CC \u062A\u0646\u0638\u06CC\u0645 \u06A9\u0646\u06CC\u062F \u06A9\u0647 \u0647\u06CC\u0686 \u062F\u0647\u0627\u0646\u0647\u200C\u0627\u06CC \u0628\u0627\u0632 \u0646\u0645\u0627\u0646\u062F.", difficulty: "challenging", rows: 5, cols: 5, source: { row: 2, col: 0 }, destination: { row: 0, col: 3 }, destinations: [{ row: 0, col: 3 }, { row: 2, col: 4 }, { row: 4, col: 3 }], parTimeSec: 75, grid: [[r(), e(0, 90), o(0, 90), c(0), r()], [r(), o(90, 0), t(), r(), r()], [h(0), a(180, 0), a(90, 180), o(0, 90), c(0)], [r(), t(), o(90, 0), t(), r()], [r(), r(), e(90, 0), c(0), r()]] }, { id: "tpl_07", numericIndex: 7, titleFa: "\u062D\u0635\u0627\u0631 \u06A9\u0627\u0631\u0648\u0627\u0646\u0633\u0631\u0627", introFa: "\u0622\u0628 \u0631\u0627 \u067E\u06CC\u0631\u0627\u0645\u0648\u0646 \u062F\u06CC\u0648\u0627\u0631\u0647\u0627\u06CC \u06A9\u0627\u0631\u0648\u0627\u0646\u0633\u0631\u0627 \u0628\u0686\u0631\u062E\u0627\u0646\u06CC\u062F \u0648 \u0628\u0647 \u062D\u0648\u0636\u062E\u0627\u0646\u0647 \u0645\u0631\u06A9\u0632\u06CC \u0628\u0631\u0633\u0627\u0646\u06CC\u062F.", difficulty: "challenging", rows: 6, cols: 6, source: { row: 0, col: 0 }, destination: { row: 5, col: 5 }, destinations: [{ row: 5, col: 5 }], parTimeSec: 85, grid: [[h(0), o(0, 90), o(0, 90), o(0, 90), e(0, 180), r()], [t(), r(), t(), r(), o(90, 0), r()], [e(0, 90), o(0, 90), o(0, 90), o(0, 90), e(90, 270), r()], [o(90, 0), t(), r(), t(), r(), r()], [e(90, 0), o(0, 90), e(0, 180), r(), r(), r()], [r(), r(), e(90, 0), o(0, 90), o(0, 90), c(0)]] }, { id: "tpl_08", numericIndex: 8, titleFa: "\u06A9\u0627\u0631\u0648\u0627\u0646 \u0622\u0628", introFa: "\u0627\u0632 \u0622\u0628\u0631\u0627\u0647 \u06A9\u0648\u0647\u0633\u062A\u0627\u0646\u06CC \u0633\u0647 \u0622\u0628\u0627\u062F\u06CC \u067E\u06CC\u0631\u0627\u0645\u0648\u0646 \u06A9\u0648\u06CC\u0631 \u0631\u0627 \u0647\u0645\u200C\u0632\u0645\u0627\u0646 \u0633\u06CC\u0631\u0627\u0628 \u06A9\u0646\u06CC\u062F.", difficulty: "challenging", rows: 6, cols: 6, source: { row: 0, col: 2 }, destination: { row: 2, col: 0 }, destinations: [{ row: 2, col: 0 }, { row: 2, col: 5 }, { row: 5, col: 2 }], parTimeSec: 90, grid: [[r(), t(), h(90), t(), r(), r()], [r(), r(), o(90, 0), r(), r(), r()], [c(180), o(0, 90), u(0), o(0, 90), o(0, 90), c(0)], [r(), t(), o(90, 0), t(), r(), r()], [r(), r(), o(90, 0), r(), r(), r()], [r(), r(), c(90), r(), r(), r()]] }, { id: "tpl_09", numericIndex: 9, titleFa: "\u0628\u0627\u063A \u0633\u062A\u0627\u0631\u06AF\u0627\u0646", introFa: "\u0634\u0628\u06A9\u0647 \u0645\u062A\u0642\u0627\u0631\u0646 \u0628\u0627\u063A \u0627\u06CC\u0631\u0627\u0646\u06CC \u0631\u0627 \u0628\u0631\u0627\u06CC \u0631\u0648\u0634\u0646 \u06A9\u0631\u062F\u0646 \u0647\u0631 \u0633\u0647 \u0641\u0648\u0627\u0631\u0647 \u06A9\u0627\u0645\u0644 \u06A9\u0646\u06CC\u062F.", difficulty: "hard", rows: 6, cols: 6, source: { row: 3, col: 0 }, destination: { row: 0, col: 5 }, destinations: [{ row: 0, col: 5 }, { row: 3, col: 5 }, { row: 5, col: 5 }], parTimeSec: 95, grid: [[r(), r(), e(0, 90), o(0, 90), o(0, 90), c(0)], [r(), t(), o(90, 0), t(), r(), r()], [r(), r(), o(90, 0), r(), r(), r()], [h(0), o(0, 90), u(0), o(0, 90), o(0, 90), c(0)], [r(), t(), o(90, 0), t(), r(), r()], [r(), r(), e(90, 0), o(0, 90), o(0, 90), c(0)]] }, { id: "tpl_10", numericIndex: 10, titleFa: "\u0622\u06CC\u06CC\u0646\u0647 \u0622\u0628", introFa: "\u0645\u0633\u06CC\u0631\u0647\u0627\u06CC \u067E\u06CC\u0686\u06CC\u062F\u0647 \u0639\u0645\u0627\u0631\u062A \u062A\u0627\u0631\u06CC\u062E\u06CC \u0631\u0627 \u0628\u0627 \u062F\u0642\u062A \u0628\u0647 \u062F\u0648 \u062D\u0648\u0636 \u0641\u06CC\u0631\u0648\u0632\u0647\u200C\u0627\u06CC \u0648\u0635\u0644 \u06A9\u0646\u06CC\u062F.", difficulty: "hard", rows: 6, cols: 6, source: { row: 0, col: 0 }, destination: { row: 1, col: 5 }, destinations: [{ row: 1, col: 5 }, { row: 5, col: 4 }], parTimeSec: 95, grid: [[h(0), o(0, 90), e(0, 180), r(), r(), r()], [t(), r(), a(0, 90), o(0, 90), o(0, 90), c(0)], [r(), r(), o(90, 0), t(), r(), r()], [r(), e(0, 90), e(90, 270), r(), t(), r()], [r(), o(90, 0), t(), r(), r(), r()], [r(), e(90, 0), o(0, 90), o(0, 90), c(0), r()]] }, { id: "tpl_11", numericIndex: 11, titleFa: "\u062D\u0648\u0636 \u0646\u06AF\u06CC\u0646", introFa: "\u0633\u0647\u200C\u0631\u0627\u0647\u06CC\u200C\u0647\u0627\u06CC \u062A\u0648 \u062F\u0631 \u062A\u0648 \u0631\u0627 \u0647\u0645\u0627\u0647\u0646\u06AF \u06A9\u0646\u06CC\u062F \u062A\u0627 \u0622\u0628 \u0628\u062F\u0648\u0646 \u06CC\u06A9 \u0642\u0637\u0631\u0647 \u0647\u062F\u0631\u0631\u0641\u062A \u062C\u0631\u06CC\u0627\u0646 \u06CC\u0627\u0628\u062F.", difficulty: "expert", rows: 6, cols: 6, source: { row: 2, col: 0 }, destination: { row: 0, col: 4 }, destinations: [{ row: 0, col: 4 }, { row: 3, col: 1 }, { row: 3, col: 5 }], parTimeSec: 105, grid: [[r(), e(0, 90), o(0, 90), o(0, 90), c(0), r()], [r(), o(90, 0), t(), r(), t(), r()], [h(0), a(180, 0), o(0, 90), e(0, 180), r(), r()], [r(), c(270), t(), a(0, 90), o(0, 90), c(0)], [r(), o(90, 0), t(), o(90, 0), r(), r()], [r(), e(90, 0), o(0, 90), e(90, 270), r(), r()]] }, { id: "tpl_12", numericIndex: 12, titleFa: "\u062A\u067E\u0634 \u0632\u0645\u06CC\u0646", introFa: "\u0686\u0647\u0627\u0631 \u0645\u0638\u0647\u0631 \u0642\u0646\u0627\u062A \u0631\u0627 \u0627\u0632 \u06CC\u06A9 \u0633\u0631\u0686\u0634\u0645\u0647 \u0645\u0634\u062A\u0631\u06A9 \u0628\u0627 \u0646\u0647\u0627\u06CC\u062A \u062F\u0642\u062A \u0645\u0647\u0646\u062F\u0633\u06CC \u0632\u0646\u062F\u0647 \u06A9\u0646\u06CC\u062F.", difficulty: "expert", rows: 6, cols: 6, source: { row: 2, col: 0 }, destination: { row: 0, col: 2 }, destinations: [{ row: 0, col: 2 }, { row: 0, col: 5 }, { row: 5, col: 2 }, { row: 5, col: 5 }], parTimeSec: 110, grid: [[r(), r(), c(270), r(), e(0, 90), c(0)], [r(), t(), o(90, 0), t(), o(90, 0), r()], [h(0), o(0, 90), u(0), o(0, 90), a(0, 270), r()], [r(), t(), o(90, 0), t(), o(90, 0), r()], [r(), r(), o(90, 0), r(), o(90, 0), r()], [r(), r(), c(90), r(), e(90, 0), c(0)]] }];
  function Qe(n) {
    return H.find((i) => i.id === n);
  }
  function Je(n) {
    return H.find((i) => i.numericIndex === n);
  }
  var Ht = ["N", "E", "S", "W"], Bt = { N: 0, E: 1, S: 2, W: 3 }, et = { N: "S", E: "W", S: "N", W: "E" }, zt = { N: { row: -1, col: 0 }, E: { row: 0, col: 1 }, S: { row: 1, col: 0 }, W: { row: 0, col: -1 } }, Kt = { straight: ["N", "S"], corner: ["N", "E"], tee: ["N", "E", "W"], cross: ["N", "E", "S", "W"], source: ["E"], destination: ["W"], blocked: [], empty: [] };
  function ne(n, i) {
    return `${n},${i}`;
  }
  function Ce(n) {
    return n === "straight" || n === "corner" || n === "tee" || n === "cross";
  }
  function ie(n, i) {
    return i ? false : Ce(n);
  }
  function Wt(n, i) {
    let l = i / 90 % 4, s = (Bt[n] + l) % 4;
    return Ht[s];
  }
  function ce(n) {
    return (n + 90) % 360;
  }
  function Fe(n, i) {
    let l = Kt[n];
    return l.length === 0 ? [] : l.map((s) => Wt(s, i));
  }
  function qe(n, i, l) {
    return i === l || n === "cross" || n === "blocked" || n === "empty" ? true : n === "straight" ? i % 180 === l % 180 : false;
  }
  function Ie(n, i, l) {
    if (qe(n, i, l)) return 0;
    let s = i;
    for (let d = 1; d <= 3; d++) if (s = ce(s), qe(n, s, l)) return d;
    return 0;
  }
  function tt(n, i, l) {
    let s = zt[l];
    return { row: n + s.row, col: i + s.col };
  }
  function ot(n, i, l, s) {
    return n >= 0 && n < l && i >= 0 && i < s;
  }
  function Yt(n, i, l) {
    let s = [], d = /* @__PURE__ */ new Set(), p = { row: n, col: i };
    for (; p; ) {
      let f = ne(p.row, p.col);
      if (d.has(f)) break;
      d.add(f), s.push(p), p = l.get(f) ?? null;
    }
    return s.reverse();
  }
  function ae(n) {
    let i = n.length, l = i > 0 ? n[0].length : 0, s = {}, d = [], p = [], f = [], g = [], w = /* @__PURE__ */ new Map(), _ = [], m = /* @__PURE__ */ new Set();
    for (let R = 0; R < i; R++) for (let O = 0; O < l; O++) {
      let k = n[R][O];
      if (k.type === "source") {
        let L = ne(R, O);
        if (!m.has(L)) {
          m.add(L), w.set(L, null);
          let P = { row: R, col: O, step: 0, enteredFrom: null, exitsTo: [], leakDirections: [] };
          s[L] = P, d.push(P), p.push({ row: R, col: O }), _.push({ row: R, col: O, step: 0 });
        }
      } else k.type === "destination" && g.push({ row: R, col: O });
    }
    let b = 0, S = 0;
    for (; S < _.length; ) {
      let R = _[S++], O = n[R.row][R.col], k = ne(R.row, R.col), L = s[k], P = Fe(O.type, O.rotation);
      R.step > b && (b = R.step);
      for (let F of P) {
        if (L.enteredFrom === F) continue;
        let U = tt(R.row, R.col, F);
        if (!ot(U.row, U.col, i, l)) {
          L.leakDirections.push(F), f.push({ row: R.row, col: R.col, direction: F, reason: "boundary" });
          continue;
        }
        let J = n[U.row][U.col];
        if (J.type === "blocked") {
          L.leakDirections.push(F), f.push({ row: R.row, col: R.col, direction: F, reason: "blocked" });
          continue;
        }
        if (J.type === "empty") {
          L.leakDirections.push(F), f.push({ row: R.row, col: R.col, direction: F, reason: "empty" });
          continue;
        }
        let C = et[F];
        if (!Fe(J.type, J.rotation).includes(C)) {
          L.leakDirections.push(F), f.push({ row: R.row, col: R.col, direction: F, reason: "mismatch" });
          continue;
        }
        L.exitsTo.push(F);
        let q = ne(U.row, U.col);
        if (!m.has(q)) {
          m.add(q), w.set(q, { row: R.row, col: R.col });
          let re = R.step + 1;
          re > b && (b = re);
          let Ee = { row: U.row, col: U.col, step: re, enteredFrom: C, exitsTo: [], leakDirections: [] };
          s[q] = Ee, d.push(Ee), p.push({ row: U.row, col: U.col }), _.push({ row: U.row, col: U.col, step: re });
        }
      }
    }
    let E = [];
    for (let R = 0; R < i; R++) for (let O = 0; O < l; O++) {
      let k = n[R][O];
      Ce(k.type) && !m.has(ne(R, O)) && E.push({ row: R, col: O });
    }
    let I = [], y = [];
    for (let R of g) m.has(ne(R.row, R.col)) ? I.push(R) : y.push(R);
    let v = g.length > 0 && y.length === 0, A = f.map((R) => ({ tiles: Yt(R.row, R.col, w), leak: R })), N = v && f.length === 0;
    return { flowMap: s, orderedSteps: d, maxStep: b, connectedTiles: p, disconnectedPipeTiles: E, leaks: f, reachedDestinations: I, unreachedDestinations: y, allDestinationsReached: v, invalidPaths: A, isValidSolution: N };
  }
  function me(n, i) {
    return n.grid.map((l, s) => l.map((d, p) => {
      let f = i === "initial" ? d.initialRotation : d.solutionRotation, g = d.locked ?? (d.type === "source" || d.type === "destination" || d.type === "blocked" || d.type === "empty");
      return { row: s, col: p, type: d.type, rotation: f, visualRotation: f, locked: g };
    }));
  }
  function rt(n) {
    let i = [];
    n.grid.length !== n.rows && i.push(`Expected ${n.rows} rows, found ${n.grid.length}.`);
    for (let _ = 0; _ < n.grid.length; _++) n.grid[_].length !== n.cols && i.push(`Row ${_} expected ${n.cols} cols, found ${n.grid[_].length}.`);
    if (i.length > 0) return { levelId: n.id, valid: false, errors: i, computedMinMoves: 0, initialAlreadySolved: false, solutionSimulation: null };
    let l = n.grid[n.source.row]?.[n.source.col];
    (!l || l.type !== "source") && i.push(`Source mismatch at (${n.source.row}, ${n.source.col}).`), n.destinations.length === 0 && i.push("Level must define at least one destination.");
    for (let _ of n.destinations) {
      let m = n.grid[_.row]?.[_.col];
      (!m || m.type !== "destination") && i.push(`Destination mismatch at (${_.row}, ${_.col}).`);
    }
    let s = me(n, "initial"), d = me(n, "solution"), f = ae(s).isValidSolution;
    f && i.push("Initial level configuration is already solved.");
    let g = ae(d);
    g.allDestinationsReached || i.push(`Solution does not reach all destinations (unreached: ${g.unreachedDestinations.length}).`), g.leaks.length > 0 && i.push(`Solution has ${g.leaks.length} water leak(s): ${g.leaks.map((_) => `(${_.row},${_.col})->${_.direction}:${_.reason}`).join(", ")}`), g.isValidSolution || i.push("Solution simulation failed isValidSolution check.");
    let w = 0;
    for (let _ = 0; _ < n.rows; _++) for (let m = 0; m < n.cols; m++) {
      let b = n.grid[_][m], S = b.locked ?? (b.type === "source" || b.type === "destination" || b.type === "blocked" || b.type === "empty");
      ie(b.type, S) && (w += Ie(b.type, b.initialRotation, b.solutionRotation));
    }
    return w !== n.expectedMinMoves && i.push(`expectedMinMoves (${n.expectedMinMoves}) does not match computedMinMoves (${w}).`), { levelId: n.id, valid: i.length === 0, errors: i, computedMinMoves: w, initialAlreadySolved: f, solutionSimulation: g };
  }
  function ke(n, i) {
    return ((n + i * 90) % 360 + 360) % 360;
  }
  function nt(n, i) {
    switch (n) {
      case "straight":
      case "cross":
      case "blocked":
      case "empty":
        return i;
      case "corner":
        return ((270 - i) % 360 + 360) % 360;
      case "tee":
        return ((360 - i) % 360 + 360) % 360;
      case "source":
      case "destination":
        return ((180 - i) % 360 + 360) % 360;
    }
  }
  function jt(n) {
    let i = n.length, l = Array.from({ length: i }, () => new Array(i));
    for (let s = 0; s < i; s++) for (let d = 0; d < i; d++) {
      let p = n[s][d], f = d, g = i - 1 - s;
      l[f][g] = { ...p, initialRotation: ke(p.initialRotation, 1), solutionRotation: ke(p.solutionRotation, 1) };
    }
    return l;
  }
  function Xt(n) {
    let i = n.length, l = n[0].length;
    return Array.from({ length: i }, (s, d) => Array.from({ length: l }, (p, f) => {
      let g = n[d][l - 1 - f];
      return { ...g, initialRotation: nt(g.type, g.initialRotation), solutionRotation: nt(g.type, g.solutionRotation) };
    }));
  }
  function Zt(n) {
    let i = n.locked ?? (n.type === "source" || n.type === "destination" || n.type === "blocked" || n.type === "empty");
    return ie(n.type, i) ? n.type !== "cross" : false;
  }
  function it(n) {
    let i = 0;
    for (let l = 0; l < n.length; l++) for (let s = 0; s < n[l].length; s++) {
      let d = n[l][s], p = d.locked ?? (d.type === "source" || d.type === "destination" || d.type === "blocked" || d.type === "empty");
      ie(d.type, p) && (i += Ie(d.type, d.initialRotation, d.solutionRotation));
    }
    return i;
  }
  function Re(n, i, l) {
    let s = Se(i >>> 0), d = n.rows === n.cols, p = n.grid.map((E) => E.map((I) => ({ ...I })));
    if (d) {
      let E = Te(s, 0, 4);
      for (let I = 0; I < E; I++) p = jt(p);
    }
    Te(s, 0, 2) === 1 && (p = Xt(p));
    let g = [];
    for (let E = 0; E < p.length; E++) for (let I = 0; I < p[E].length; I++) {
      let y = p[E][I];
      if (Zt(y)) if (g.push({ row: E, col: I }), y.type === "straight") {
        let v = s() < 0.75;
        y.initialRotation = v ? ce(y.solutionRotation) : y.solutionRotation;
      } else if (s() < 0.82) {
        let v = Te(s, 1, 4);
        y.initialRotation = ke(y.solutionRotation, v);
      } else y.initialRotation = y.solutionRotation;
    }
    let w = { row: 0, col: 0 }, _ = [];
    for (let E = 0; E < p.length; E++) for (let I = 0; I < p[E].length; I++) p[E][I].type === "source" ? w = { row: E, col: I } : p[E][I].type === "destination" && _.push({ row: E, col: I });
    let m = { id: l.syntheticLevelId, regionId: "yazd", titleFa: l.titleFa ?? n.titleFa, subtitleFa: l.subtitleFa ?? n.introFa, difficulty: n.difficulty, rows: p.length, cols: p[0].length, source: w, destination: _[0] ?? { row: 0, col: 0 }, destinations: _, expectedMinMoves: it(p), parTimeSec: n.parTimeSec, grid: p };
    if (ae(me(m, "initial")).isValidSolution && g.length > 0) {
      let E = g[0], I = p[E.row][E.col];
      I.initialRotation = ce(I.solutionRotation), m.expectedMinMoves = it(p);
    }
    let S = rt(m);
    if (!S.valid) throw new Error(`Generated puzzle failed verification for template "${n.id}" (seed=${i}): ${S.errors.join("; ")}`);
    return m;
  }
  var Qt = ["\u06F0", "\u06F1", "\u06F2", "\u06F3", "\u06F4", "\u06F5", "\u06F6", "\u06F7", "\u06F8", "\u06F9"];
  function ge(n) {
    return String(n).replace(/\d/g, (i) => Qt[Number(i)]);
  }
  var at = "Asia/Tehran", Jt = /^(\d{4})-(\d{2})-(\d{2})$/;
  function qt(n = /* @__PURE__ */ new Date()) {
    let i = Number.isFinite(n.getTime()) ? n : /* @__PURE__ */ new Date(0), s = new Intl.DateTimeFormat("en-US", { timeZone: at, calendar: "gregory", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" }).formatToParts(i), d = (f) => {
      let g = s.find((w) => w.type === f)?.value ?? "0";
      return Number.parseInt(g, 10) || 0;
    }, p = d("hour");
    return { year: d("year"), month: d("month"), day: d("day"), hour: p === 24 ? 0 : p, minute: d("minute"), second: d("second") };
  }
  function j(n = /* @__PURE__ */ new Date()) {
    let i = qt(n), l = String(i.year).padStart(4, "0"), s = String(i.month).padStart(2, "0"), d = String(i.day).padStart(2, "0");
    return `${l}-${s}-${d}`;
  }
  function Y(n) {
    let i = Jt.exec(n);
    if (!i) return false;
    let l = Number.parseInt(i[1], 10), s = Number.parseInt(i[2], 10), d = Number.parseInt(i[3], 10);
    if (l < 2e3 || l > 2150 || s < 1 || s > 12 || d < 1 || d > 31) return false;
    let p = new Date(Date.UTC(l, s - 1, d));
    return p.getUTCFullYear() === l && p.getUTCMonth() === s - 1 && p.getUTCDate() === d;
  }
  function eo(n) {
    if (!Y(n)) return null;
    let [i, l, s] = n.split("-").map((d) => Number.parseInt(d, 10));
    return new Date(Date.UTC(i, l - 1, s, 8, 30, 0));
  }
  function Ae(n, i) {
    if (!Y(n) || !Y(i)) return null;
    let [l, s, d] = n.split("-").map((m) => Number.parseInt(m, 10)), [p, f, g] = i.split("-").map((m) => Number.parseInt(m, 10)), w = Date.UTC(l, s - 1, d), _ = Date.UTC(p, f - 1, g);
    return Math.round((_ - w) / 864e5);
  }
  function st(n) {
    let i = typeof n == "string" ? eo(n) : Number.isFinite(n.getTime()) ? n : null;
    if (!i) return "";
    try {
      let l = new Intl.DateTimeFormat("fa-IR", { timeZone: at, calendar: "persian", weekday: "long", day: "numeric", month: "long", year: "numeric" }), s = l.formatToParts(i), d = s.find((w) => w.type === "weekday")?.value ?? "", p = s.find((w) => w.type === "day")?.value ?? "", f = s.find((w) => w.type === "month")?.value ?? "", g = s.find((w) => w.type === "year")?.value ?? "";
      return d && p && f && g ? ge(`${d}\u060C ${p} ${f} ${g}`) : ge(l.format(i));
    } catch {
      return typeof n == "string" ? ge(n) : ge(j(i));
    }
  }
  var ee = 1, te = [1], to = "2025-01-01";
  function Pe(n, i) {
    let l = H.length, s = Array.from({ length: l }, (f, g) => g), d = le(`qanatchi:daily-cycle:v${i}:${n}`), p = Se(d);
    for (let f = l - 1; f > 0; f--) {
      let g = Math.floor(p() * (f + 1)), w = s[f];
      s[f] = s[g], s[g] = w;
    }
    return s;
  }
  function oo(n, i) {
    let l = H.length, s = Ae(to, n) ?? 0, d = Math.floor(s / l), p = (s % l + l) % l, f = Pe(d, i), g = f[p];
    if (p === 0) {
      let _ = Pe(d - 1, i)[l - 1];
      g === _ && (g = f[1 % l]);
    } else if (p === 1) {
      let _ = Pe(d - 1, i)[l - 1];
      f[0] === _ && (g = f[0]);
    }
    return g;
  }
  function ve(n = j(), i = ee) {
    if (!Y(n)) throw new Error(`Invalid Tehran dateKey for daily challenge: "${n}"`);
    if (!te.includes(i)) throw new Error(`Unsupported daily puzzle algorithm version: ${i}`);
    let l = `qanatchi:daily:v${i}:${n}`, s = le(l), d = oo(n, i), p = H[d], f = st(n), g = Re(p, s, { syntheticLevelId: 1e3 + p.numericIndex, titleFa: p.titleFa, subtitleFa: p.introFa });
    return { challengeId: `daily-v${i}-${n}`, dateKey: n, algoVersion: i, seed: s, templateId: p.id, persianDateFa: f, titleFa: p.titleFa, introFa: p.introFa, difficulty: p.difficulty, level: g };
  }
  var lt = { master: "\u0627\u0633\u062A\u0627\u062F \u0642\u0646\u0627\u062A", engineer: "\u0645\u0647\u0646\u062F\u0633 \u0622\u0628", guardian: "\u0646\u06AF\u0647\u0628\u0627\u0646 \u0686\u0634\u0645\u0647", striver: "\u062A\u0644\u0627\u0634\u06AF\u0631 \u06A9\u0648\u06CC\u0631" }, Ve = 1;
  var se = 1, Le = [1];
  var ro = /^Q(\d+)-(\d{2})-([0-9A-F]{1,8})-([0-9A-F]{2})$/i;
  function ct(n, i, l) {
    let s = `qanatchi:friend-check:v${n}:t${i}:s${l >>> 0}`;
    return (le(s) & 255).toString(16).toUpperCase().padStart(2, "0");
  }
  function no(n, i, l = se) {
    let s = String(n).padStart(2, "0"), d = i >>> 0, p = d.toString(16).toUpperCase().padStart(8, "0"), f = ct(l, n, d);
    return `Q${l}-${s}-${p}-${f}`;
  }
  function dt(n, i, l = se) {
    let s = Qe(n) ?? H[0], d = i >>> 0, p = no(s.numericIndex, d, l), f = Re(s, d, { syntheticLevelId: 2e3 + s.numericIndex, titleFa: s.titleFa, subtitleFa: s.introFa });
    return { challengeId: p, algoVersion: l, templateId: s.id, seed: d, titleFa: s.titleFa, introFa: s.introFa, difficulty: s.difficulty, level: f };
  }
  function ut(n, i) {
    let l = n === "any" ? H : H.filter((f) => f.difficulty === n), s = l.length > 0 ? l : H, d = le(`qanatchi:friend-gen:${n}:${i}`), p = s[d % s.length];
    return dt(p.id, d);
  }
  function de(n) {
    let i = n.trim().toUpperCase();
    if (!i) return { ok: false, reason: "empty", rawCode: n, messageFa: "\u06A9\u062F \u0631\u0642\u0627\u0628\u062A \u0648\u0627\u0631\u062F \u0646\u0634\u062F\u0647 \u0627\u0633\u062A." };
    let l = ro.exec(i);
    if (!l) return { ok: false, reason: "malformed", rawCode: n, messageFa: "\u0644\u06CC\u0646\u06A9 \u06CC\u0627 \u06A9\u062F \u0631\u0642\u0627\u0628\u062A \u0646\u0627\u0645\u0639\u062A\u0628\u0631 \u0627\u0633\u062A \u0648 \u0642\u0627\u0644\u0628 \u0627\u0633\u062A\u0627\u0646\u062F\u0627\u0631\u062F\u06CC \u0646\u062F\u0627\u0631\u062F." };
    let s = Number.parseInt(l[1], 10), d = Number.parseInt(l[2], 10), p = l[3], f = l[4].toUpperCase();
    if (!Le.includes(s)) return { ok: false, reason: "unsupported_version", rawCode: n, messageFa: "\u0646\u0633\u062E\u0647 \u0627\u06CC\u0646 \u0644\u06CC\u0646\u06A9 \u0631\u0642\u0627\u0628\u062A \u062F\u0631 \u0646\u0633\u062E\u0647 \u0641\u0639\u0644\u06CC \u0628\u0627\u0632\u06CC \u067E\u0634\u062A\u06CC\u0628\u0627\u0646\u06CC \u0646\u0645\u06CC\u200C\u0634\u0648\u062F." };
    let g = Je(d);
    if (!g) return { ok: false, reason: "invalid_template", rawCode: n, messageFa: "\u0627\u0644\u06AF\u0648\u06CC \u0645\u0639\u0645\u0627\u06CC \u0645\u0648\u062C\u0648\u062F \u062F\u0631 \u0644\u06CC\u0646\u06A9 \u0631\u0642\u0627\u0628\u062A \u0645\u0639\u062A\u0628\u0631 \u0646\u06CC\u0633\u062A." };
    let w = Number.parseInt(p, 16) >>> 0, _ = ct(s, d, w);
    if (f !== _) return { ok: false, reason: "invalid_checksum", rawCode: n, messageFa: "\u0644\u06CC\u0646\u06A9 \u0631\u0642\u0627\u0628\u062A \u0646\u0627\u0642\u0635 \u0627\u0633\u062A \u06CC\u0627 \u062F\u0633\u062A\u06A9\u0627\u0631\u06CC \u0634\u062F\u0647 \u0648 \u0642\u0627\u0628\u0644 \u0628\u0627\u0631\u06AF\u0630\u0627\u0631\u06CC \u0646\u06CC\u0633\u062A." };
    try {
      return { ok: true, challenge: dt(g.id, w, s) };
    } catch {
      return { ok: false, reason: "verification_failed", rawCode: n, messageFa: "\u0633\u0627\u062E\u062A \u0645\u0639\u0645\u0627\u06CC \u0627\u06CC\u0646 \u0631\u0642\u0627\u0628\u062A \u0628\u0627 \u062E\u0637\u0627 \u0645\u0648\u0627\u062C\u0647 \u0634\u062F." };
    }
  }
  var B = 2, io = { easy: 100, normal: 200, medium: 300, challenging: 400, hard: 500, expert: 650 };
  function pt(n) {
    let i = Math.max(0, Math.round(n.verifiedMoves)), l = Math.max(1, Math.round(n.trustedExpectedMinMoves)), s = Math.max(0, i - l);
    if (!n.verifiedSolved) return { scoringVersion: B, verifiedSolved: false, score: 0, stars: 0, verifiedMoves: i, trustedExpectedMinMoves: l, extraMoves: s, performanceTier: null, performanceLabelFa: "\u0646\u0627\u0645\u0639\u062A\u0628\u0631" };
    let d = l + 2, p = Math.ceil(l * 1.55) + 3, f = 1;
    i <= d ? f = 3 : i <= p && (f = 2);
    let g = 1200 + (io[n.difficulty] ?? 200), w = Math.max(0, 1e3 - s * 40), _ = f * 150, m = Math.max(300, g + w + _), b;
    return f === 3 && s === 0 ? b = "master" : f === 3 ? b = "engineer" : f === 2 ? b = "guardian" : b = "striver", { scoringVersion: B, verifiedSolved: true, score: m, stars: f, verifiedMoves: i, trustedExpectedMinMoves: l, extraMoves: s, performanceTier: b, performanceLabelFa: lt[b] };
  }
  var ft = [{ id: 49, regionId: "fars", destinationId: "shiraz", titleFa: "\u062C\u0648\u06CC\u0628\u0627\u0631 \u0628\u0627\u063A\u200C\u0647\u0627\u06CC \u0634\u06CC\u0631\u0627\u0632", subtitleFa: "\u0647\u062F\u0627\u06CC\u062A \u0622\u0628 \u0627\u0632 \u062D\u0648\u0636\u0686\u0647 \u062C\u0646\u0648\u0628\u06CC \u0628\u0647 \u0633\u0647 \u06AF\u0630\u0631\u06AF\u0627\u0647 \u0628\u0627\u063A\u200C\u0647\u0627\u06CC \u0633\u0631\u0633\u0628\u0632 \u0634\u06CC\u0631\u0627\u0632", difficulty: "challenging", rows: 5, cols: 6, source: { row: 4, col: 0 }, destination: { row: 0, col: 1 }, destinations: [{ row: 0, col: 1 }, { row: 3, col: 5 }, { row: 4, col: 3 }], expectedMinMoves: 25, parTimeSec: 150, grid: [[t(), c(270), r(), e(270, 90), o(0, 90), e(0, 180)], [e(0, 90), u(0), o(0, 90), a(90, 270), t(), o(90, 0)], [o(90, 0), a(270, 90), o(0, 90), u(0), a(0, 180), e(90, 270)], [a(270, 90), e(90, 270), t(), a(0, 90), a(180, 0), c(0)], [h(270), t(), r(), c(90), t(), r()]] }, { id: 50, regionId: "fars", destinationId: "shiraz", titleFa: "\u062D\u0648\u0636\u200C\u0647\u0627\u06CC \u067E\u0644\u06A9\u0627\u0646\u06CC \u0634\u06CC\u0631\u0627\u0632", subtitleFa: "\u062A\u0646\u0638\u06CC\u0645 \u062F\u0648 \u062A\u0642\u0627\u0637\u0639 \u06A9\u0644\u06CC\u062F\u06CC \u0628\u0631\u0627\u06CC \u062A\u0642\u0633\u06CC\u0645 \u0645\u062A\u0639\u0627\u062F\u0644 \u062C\u0631\u06CC\u0627\u0646 \u0645\u06CC\u0627\u0646 \u0633\u0647 \u0628\u0627\u063A\u0686\u0647", difficulty: "hard", rows: 6, cols: 6, source: { row: 0, col: 2 }, destination: { row: 0, col: 0 }, destinations: [{ row: 0, col: 0 }, { row: 0, col: 4 }, { row: 5, col: 5 }], expectedMinMoves: 31, parTimeSec: 170, grid: [[c(180), e(0, 180), h(90), t(), c(270), r()], [t(), a(270, 90), u(0), o(0, 90), a(90, 270), t()], [e(270, 90), a(90, 270), o(90, 0), t(), a(0, 90), e(0, 180)], [o(90, 0), e(180, 0), u(0), o(0, 90), e(90, 270), o(90, 0)], [e(180, 0), o(0, 90), a(180, 0), o(0, 90), o(0, 90), a(90, 270)], [t(), r(), t(), r(), t(), c(90)]] }, { id: 51, regionId: "fars", destinationId: "neyriz", titleFa: "\u0627\u0646\u0627\u0631\u0633\u062A\u0627\u0646 \u062F\u0631\u0647 \u0646\u06CC\u200C\u0631\u06CC\u0632", subtitleFa: "\u0634\u0628\u06A9\u0647 \u0633\u062A\u0648\u0646\u06CC \u0641\u0634\u0631\u062F\u0647 \u0628\u0627 \u0633\u0647 \u0686\u0647\u0627\u0631\u0631\u0627\u0647 \u062F\u0631 \u0645\u0633\u06CC\u0631 \u062F\u0631\u0647\u200C\u0647\u0627\u06CC \u067E\u06CC\u0631\u0627\u0645\u0648\u0646 \u0646\u06CC\u200C\u0631\u06CC\u0632", difficulty: "hard", rows: 6, cols: 5, source: { row: 5, col: 0 }, destination: { row: 0, col: 2 }, destinations: [{ row: 0, col: 2 }, { row: 2, col: 4 }, { row: 5, col: 2 }], expectedMinMoves: 21, parTimeSec: 155, grid: [[t(), r(), c(270), t(), r()], [e(270, 90), o(0, 90), u(0), e(0, 180), t()], [o(90, 0), t(), a(270, 90), a(180, 0), c(0)], [a(0, 90), o(0, 90), u(0), o(0, 90), e(0, 180)], [a(270, 90), o(0, 90), u(0), o(0, 90), e(90, 270)], [h(270), t(), c(90), t(), r()]] }, { id: 52, regionId: "fars", destinationId: "neyriz", titleFa: "\u0645\u0642\u0633\u0645 \u0622\u0628 \u062D\u0627\u0634\u06CC\u0647 \u0646\u06CC\u200C\u0631\u06CC\u0632", subtitleFa: "\u0648\u0631\u0648\u062F \u062C\u0631\u06CC\u0627\u0646 \u0627\u0632 \u0634\u0631\u0642 \u0648 \u067E\u062E\u0634 \u0647\u0645\u200C\u0632\u0645\u0627\u0646 \u0628\u0647 \u0686\u0647\u0627\u0631 \u0628\u0627\u063A \u0628\u062F\u0648\u0646 \u0646\u0634\u062A", difficulty: "hard", rows: 6, cols: 6, source: { row: 2, col: 5 }, destination: { row: 0, col: 1 }, destinations: [{ row: 0, col: 1 }, { row: 0, col: 5 }, { row: 5, col: 1 }, { row: 5, col: 4 }], expectedMinMoves: 25, parTimeSec: 170, grid: [[t(), c(270), t(), e(270, 90), o(0, 90), c(0)], [e(270, 90), u(0), o(0, 90), a(90, 270), t(), r()], [o(90, 0), o(90, 0), t(), a(270, 90), o(0, 90), h(180)], [e(180, 0), u(0), o(0, 90), u(0), e(0, 180), t()], [t(), a(270, 90), o(0, 90), a(180, 0), a(90, 270), r()], [r(), c(90), t(), r(), c(90), t()]] }, { id: 53, regionId: "fars", destinationId: "estahban", titleFa: "\u062F\u0627\u0645\u0646\u0647 \u06A9\u0648\u0647\u0633\u062A\u0627\u0646 \u0627\u0633\u062A\u0647\u0628\u0627\u0646", subtitleFa: "\u0639\u0628\u0648\u0631 \u0627\u0632 \u062F\u06CC\u0648\u0627\u0631\u0647 \u0635\u062E\u0631\u0647\u200C\u0627\u06CC \u0645\u0631\u06A9\u0632 \u0648 \u0631\u0633\u0627\u0646\u062F\u0646 \u0622\u0628 \u0628\u0647 \u0633\u0647 \u0622\u0628\u200C\u06AF\u06CC\u0631 \u06A9\u0648\u0647\u0633\u062A\u0627\u0646\u06CC", difficulty: "hard", rows: 6, cols: 6, source: { row: 0, col: 0 }, destination: { row: 0, col: 5 }, destinations: [{ row: 0, col: 5 }, { row: 3, col: 0 }, { row: 5, col: 5 }], expectedMinMoves: 29, parTimeSec: 175, grid: [[h(90), t(), e(270, 90), o(0, 90), o(0, 90), c(0)], [e(180, 0), o(0, 90), u(0), e(0, 180), t(), r()], [t(), e(270, 90), e(90, 270), a(0, 90), o(0, 90), e(0, 180)], [c(180), a(90, 270), t(), o(90, 0), t(), o(90, 0)], [r(), e(180, 0), o(0, 90), a(180, 0), o(0, 90), a(90, 270)], [t(), r(), t(), r(), t(), c(90)]] }, { id: 54, regionId: "fars", destinationId: "estahban", titleFa: "\u0627\u0646\u062C\u06CC\u0631\u0633\u062A\u0627\u0646\u200C\u0647\u0627\u06CC \u0627\u0633\u062A\u0647\u0628\u0627\u0646", subtitleFa: "\u0627\u0646\u0634\u0639\u0627\u0628\u200C\u0647\u0627\u06CC \u067E\u06CC\u200C\u062F\u0631\u067E\u06CC \u0628\u0631\u0627\u06CC \u0622\u0628\u06CC\u0627\u0631\u06CC \u0686\u0647\u0627\u0631 \u0628\u062E\u0634 \u0628\u0627\u063A\u200C\u0647\u0627\u06CC \u062F\u0627\u0645\u0646\u0647\u200C\u0627\u06CC", difficulty: "hard", rows: 6, cols: 6, source: { row: 3, col: 0 }, destination: { row: 0, col: 0 }, destinations: [{ row: 0, col: 0 }, { row: 0, col: 4 }, { row: 5, col: 2 }, { row: 5, col: 5 }], expectedMinMoves: 29, parTimeSec: 180, grid: [[c(270), t(), r(), t(), c(270), r()], [e(180, 0), o(0, 90), a(0, 180), a(90, 180), a(90, 270), t()], [t(), e(270, 90), e(90, 270), o(90, 0), e(180, 0), e(0, 180)], [h(0), u(0), o(0, 90), e(90, 270), t(), o(90, 0)], [r(), e(180, 0), a(0, 180), o(0, 90), o(0, 90), a(90, 270)], [t(), r(), c(90), t(), r(), c(90)]] }, { id: 55, regionId: "fars", destinationId: "abadeh", titleFa: "\u0641\u0644\u0627\u062A \u0634\u0645\u0627\u0644\u06CC \u0622\u0628\u0627\u062F\u0647", subtitleFa: "\u0647\u062F\u0627\u06CC\u062A \u0622\u0628 \u0627\u0632 \u062C\u0646\u0648\u0628 \u0645\u0631\u06A9\u0632\u06CC \u0628\u0647 \u0686\u0647\u0627\u0631 \u0646\u0642\u0637\u0647 \u062F\u0634\u062A \u0645\u0631\u062A\u0641\u0639 \u0622\u0628\u0627\u062F\u0647", difficulty: "hard", rows: 6, cols: 6, source: { row: 5, col: 2 }, destination: { row: 0, col: 2 }, destinations: [{ row: 0, col: 2 }, { row: 1, col: 5 }, { row: 5, col: 0 }, { row: 5, col: 4 }], expectedMinMoves: 28, parTimeSec: 180, grid: [[t(), r(), c(270), t(), r(), t()], [e(270, 90), o(0, 90), u(0), o(0, 90), a(0, 180), c(0)], [o(90, 0), t(), e(180, 0), e(0, 180), o(90, 0), t()], [a(270, 90), o(0, 90), e(0, 180), a(270, 90), e(90, 270), r()], [o(90, 0), t(), a(270, 90), a(180, 0), e(0, 180), t()], [c(90), r(), h(270), t(), c(90), r()]] }, { id: 56, regionId: "fars", destinationId: "abadeh", titleFa: "\u0686\u0647\u0627\u0631\u062F\u0631\u0648\u0627\u0632\u0647 \u06A9\u0627\u0631\u0648\u0627\u0646\u200C\u0633\u0631\u0627\u06CC \u0622\u0628\u0627\u062F\u0647", subtitleFa: "\u0622\u0632\u0645\u0648\u0646 \u067E\u0627\u06CC\u0627\u0646\u06CC \u0645\u0633\u06CC\u0631 \u0641\u0627\u0631\u0633\u061B \u0631\u0633\u0627\u0646\u062F\u0646 \u0622\u0628 \u0627\u0632 \u0645\u0631\u06A9\u0632 \u0628\u0647 \u0686\u0647\u0627\u0631\u06AF\u0648\u0634\u0647 \u0634\u0647\u0631", difficulty: "expert", rows: 6, cols: 6, source: { row: 2, col: 3 }, destination: { row: 0, col: 0 }, destinations: [{ row: 0, col: 0 }, { row: 0, col: 5 }, { row: 5, col: 0 }, { row: 5, col: 5 }], expectedMinMoves: 33, parTimeSec: 190, grid: [[c(270), t(), e(270, 90), o(0, 90), e(0, 180), c(270)], [e(180, 0), o(0, 90), a(90, 270), t(), a(270, 90), e(90, 270)], [t(), e(270, 90), a(180, 0), h(180), o(90, 0), t()], [e(270, 90), u(0), o(0, 90), o(0, 90), u(0), e(0, 180)], [a(270, 90), e(90, 270), t(), t(), e(180, 0), a(90, 270)], [c(90), r(), t(), r(), t(), c(90)]] }];
  var mt = [{ id: 41, regionId: "isfahan", destinationId: "isfahan", titleFa: "\u0645\u0627\u062F\u06CC\u200C\u0647\u0627\u06CC \u0632\u0627\u06CC\u0646\u062F\u0647\u200C\u0631\u0648\u062F", subtitleFa: "\u0627\u0646\u0634\u0639\u0627\u0628 \u0646\u062E\u0633\u062A \u0622\u0628 \u062F\u0631 \u0641\u0644\u0627\u062A \u0627\u0635\u0641\u0647\u0627\u0646 \u0648 \u0647\u062F\u0627\u06CC\u062A \u0622\u0631\u0627\u0645 \u0622\u0646 \u0628\u0647 \u062F\u0648 \u0628\u0627\u063A", difficulty: "medium", rows: 5, cols: 5, source: { row: 2, col: 0 }, destination: { row: 0, col: 4 }, destinations: [{ row: 0, col: 4 }, { row: 4, col: 4 }], expectedMinMoves: 17, parTimeSec: 110, grid: [[t(), e(0, 90), o(0, 90), o(0, 90), c(0)], [r(), a(270, 90), o(0, 90), e(90, 180), t()], [h(0), a(90, 270), t(), a(0, 90), e(0, 180)], [r(), e(180, 0), o(0, 90), e(180, 270), o(90, 0)], [t(), r(), r(), t(), c(90)]] }, { id: 42, regionId: "isfahan", destinationId: "isfahan", titleFa: "\u06AF\u0630\u0631\u06AF\u0627\u0647 \u0622\u0628 \u0686\u0647\u0627\u0631\u0628\u0627\u063A", subtitleFa: "\u062A\u0646\u0638\u06CC\u0645 \u0634\u0628\u06A9\u0647 \u0645\u0633\u062A\u0637\u06CC\u0644\u06CC \u062C\u0648\u06CC\u0628\u0627\u0631\u0647\u0627 \u0628\u0631\u0627\u06CC \u0633\u06CC\u0631\u0627\u0628\u200C\u0633\u0627\u0632\u06CC \u0633\u0647 \u0628\u062E\u0634 \u0628\u0627\u063A", difficulty: "challenging", rows: 5, cols: 6, source: { row: 0, col: 0 }, destination: { row: 0, col: 5 }, destinations: [{ row: 0, col: 5 }, { row: 2, col: 5 }, { row: 4, col: 0 }], expectedMinMoves: 22, parTimeSec: 135, grid: [[h(0), o(0, 90), a(0, 180), o(0, 90), o(0, 90), c(0)], [t(), e(270, 90), a(180, 270), t(), e(0, 90), e(0, 180)], [e(270, 90), a(270, 0), u(0), a(0, 180), e(90, 270), c(90)], [o(90, 0), t(), e(270, 0), e(90, 270), t(), r()], [c(90), r(), t(), r(), t(), r()]] }, { id: 43, regionId: "isfahan", destinationId: "ardestan", titleFa: "\u062F\u0627\u0644\u0627\u0646 \u062F\u0627\u0645\u0646\u0647 \u0627\u0631\u062F\u0633\u062A\u0627\u0646", subtitleFa: "\u0628\u0647\u0631\u0647\u200C\u06AF\u06CC\u0631\u06CC \u0627\u0632 \u062F\u0648 \u062D\u0644\u0642\u0647 \u0647\u0645\u200C\u062A\u0631\u0627\u0632 \u062F\u0631 \u06AF\u0630\u0631\u06AF\u0627\u0647 \u06A9\u0648\u0647\u067E\u0627\u06CC\u0647\u200C\u0627\u06CC \u0627\u0631\u062F\u0633\u062A\u0627\u0646", difficulty: "challenging", rows: 5, cols: 6, source: { row: 2, col: 0 }, destination: { row: 0, col: 2 }, destinations: [{ row: 0, col: 2 }, { row: 4, col: 1 }, { row: 4, col: 5 }], expectedMinMoves: 23, parTimeSec: 140, grid: [[t(), r(), c(270), t(), e(270, 90), e(90, 180)], [r(), e(0, 90), u(0), o(0, 90), e(90, 270), o(90, 0)], [h(0), a(90, 270), e(180, 0), o(0, 90), e(0, 180), o(90, 0)], [t(), a(0, 90), o(0, 90), o(0, 90), a(180, 0), a(90, 270)], [r(), c(90), t(), r(), t(), c(90)]] }, { id: 44, regionId: "isfahan", destinationId: "ardestan", titleFa: "\u0622\u0628\u0631\u0627\u0647\u0647 \u067E\u0644\u06A9\u0627\u0646\u06CC \u0627\u0631\u062F\u0633\u062A\u0627\u0646", subtitleFa: "\u062A\u0648\u0632\u06CC\u0639 \u0639\u0645\u0648\u062F\u06CC \u062C\u0631\u06CC\u0627\u0646 \u062F\u0631 \u0634\u06CC\u0628 \u0645\u0644\u0627\u06CC\u0645 \u0641\u0644\u0627\u062A \u0645\u0631\u06A9\u0632\u06CC \u0628\u0647 \u0633\u0647 \u0622\u0628\u200C\u0627\u0646\u0628\u0627\u0631", difficulty: "challenging", rows: 6, cols: 5, source: { row: 0, col: 0 }, destination: { row: 0, col: 4 }, destinations: [{ row: 0, col: 4 }, { row: 5, col: 0 }, { row: 5, col: 4 }], expectedMinMoves: 25, parTimeSec: 145, grid: [[h(90), t(), e(270, 90), o(0, 90), c(0)], [e(180, 0), o(0, 90), a(90, 270), t(), r()], [t(), e(0, 90), u(0), o(0, 90), e(0, 180)], [e(270, 90), a(90, 270), o(90, 0), t(), o(90, 0)], [o(90, 0), e(180, 0), a(180, 0), o(0, 90), a(180, 270)], [c(90), t(), r(), t(), c(90)]] }, { id: 45, regionId: "isfahan", destinationId: "nain", titleFa: "\u0622\u0628\u200C\u0627\u0646\u0628\u0627\u0631 \u06A9\u0648\u06CC\u0631\u06CC \u0646\u0627\u0626\u06CC\u0646", subtitleFa: "\u0628\u0627\u0644\u0627 \u0622\u0648\u0631\u062F\u0646 \u062C\u0631\u06CC\u0627\u0646 \u0627\u0632 \u062C\u0646\u0648\u0628 \u0648 \u067E\u062E\u0634 \u062F\u0642\u06CC\u0642 \u0622\u0646 \u062F\u0631 \u062D\u0627\u0634\u06CC\u0647 \u06A9\u0648\u06CC\u0631 \u0646\u0627\u0626\u06CC\u0646", difficulty: "challenging", rows: 6, cols: 6, source: { row: 5, col: 0 }, destination: { row: 0, col: 0 }, destinations: [{ row: 0, col: 0 }, { row: 0, col: 5 }, { row: 5, col: 3 }], expectedMinMoves: 32, parTimeSec: 165, grid: [[c(180), o(0, 90), e(0, 180), t(), r(), c(270)], [t(), e(270, 90), a(90, 270), t(), e(0, 90), a(90, 270)], [e(0, 90), u(0), a(180, 0), o(0, 90), e(90, 270), o(90, 0)], [o(90, 0), a(270, 90), o(0, 90), e(0, 180), t(), o(90, 0)], [a(270, 90), e(180, 270), t(), a(270, 90), o(0, 90), e(90, 270)], [h(270), t(), r(), c(90), r(), t()]] }, { id: 46, regionId: "isfahan", destinationId: "nain", titleFa: "\u062F\u0627\u0644\u0627\u0646\u200C\u0647\u0627\u06CC \u062E\u0646\u06A9 \u0646\u0627\u0626\u06CC\u0646", subtitleFa: "\u0639\u0628\u0648\u0631 \u0627\u0632 \u0633\u0646\u06AF\u0644\u0627\u062E \u0645\u0631\u06A9\u0632\u06CC \u0628\u0627 \u06CC\u06A9 \u0686\u0647\u0627\u0631\u0631\u0627\u0647 \u06A9\u0644\u06CC\u062F\u06CC \u0648 \u0633\u0647 \u062E\u0631\u0648\u062C\u06CC \u0647\u0645\u200C\u0632\u0645\u0627\u0646", difficulty: "hard", rows: 6, cols: 6, source: { row: 2, col: 0 }, destination: { row: 0, col: 5 }, destinations: [{ row: 0, col: 5 }, { row: 3, col: 5 }, { row: 5, col: 1 }], expectedMinMoves: 28, parTimeSec: 170, grid: [[t(), e(270, 90), o(0, 90), a(0, 180), o(0, 90), c(0)], [r(), o(90, 0), t(), a(270, 90), e(0, 180), t()], [h(0), u(0), o(0, 90), a(180, 270), o(90, 0), r()], [t(), o(90, 0), e(270, 90), e(90, 270), a(270, 90), c(0)], [r(), a(270, 90), a(180, 0), o(0, 90), e(90, 270), t()], [t(), c(90), t(), r(), r(), r()]] }, { id: 47, regionId: "isfahan", destinationId: "natanz", titleFa: "\u0628\u0627\u063A\u0633\u062A\u0627\u0646\u200C\u0647\u0627\u06CC \u062F\u0627\u0645\u0646\u0647 \u0646\u0637\u0646\u0632", subtitleFa: "\u0622\u0628\u0631\u0633\u0627\u0646\u06CC \u0627\u0632 \u0686\u0634\u0645\u0647 \u0645\u0631\u06A9\u0632\u06CC \u0628\u0647 \u0686\u0647\u0627\u0631\u06AF\u0648\u0634\u0647 \u0628\u0627\u063A\u200C\u0647\u0627\u06CC \u06A9\u0648\u0647\u067E\u0627\u06CC\u0647 \u06A9\u0631\u06A9\u0633", difficulty: "hard", rows: 6, cols: 6, source: { row: 3, col: 2 }, destination: { row: 0, col: 0 }, destinations: [{ row: 0, col: 0 }, { row: 0, col: 5 }, { row: 5, col: 0 }, { row: 5, col: 5 }], expectedMinMoves: 32, parTimeSec: 175, grid: [[c(180), o(0, 90), e(0, 180), t(), r(), c(270)], [e(270, 90), o(0, 90), u(0), o(0, 90), o(0, 90), a(90, 270)], [o(90, 0), t(), a(270, 90), o(0, 90), e(0, 180), o(90, 0)], [a(270, 90), e(0, 180), h(270), t(), o(90, 0), o(90, 0)], [o(90, 0), e(180, 0), o(0, 90), o(0, 90), a(180, 0), a(90, 270)], [c(90), t(), r(), t(), r(), c(90)]] }, { id: 48, regionId: "isfahan", destinationId: "natanz", titleFa: "\u0686\u0647\u0627\u0631\u0631\u0627\u0647 \u0622\u0628\u200C\u0631\u0633\u0627\u0646\u06CC \u0646\u0637\u0646\u0632", subtitleFa: "\u0622\u0632\u0645\u0648\u0646 \u067E\u0627\u06CC\u0627\u0646\u06CC \u0641\u0644\u0627\u062A \u0627\u0635\u0641\u0647\u0627\u0646 \u0628\u0627 \u0686\u0647\u0627\u0631 \u062A\u0642\u0627\u0637\u0639 \u0647\u0645\u200C\u067E\u0648\u0634\u0627\u0646 \u0648 \u0686\u0647\u0627\u0631 \u0645\u0642\u0635\u062F", difficulty: "hard", rows: 6, cols: 6, source: { row: 0, col: 5 }, destination: { row: 0, col: 2 }, destinations: [{ row: 0, col: 2 }, { row: 2, col: 5 }, { row: 4, col: 0 }, { row: 5, col: 2 }], expectedMinMoves: 22, parTimeSec: 170, grid: [[t(), r(), c(270), t(), r(), h(90)], [e(270, 90), o(0, 90), u(0), o(0, 90), a(0, 180), e(90, 270)], [o(90, 0), t(), o(90, 0), e(270, 90), u(0), c(0)], [e(180, 0), o(0, 90), u(0), e(90, 270), o(90, 0), t()], [c(180), o(0, 90), u(0), o(0, 90), e(90, 270), r()], [t(), r(), c(90), t(), r(), t()]] }];
  var gt = [{ id: 17, regionId: "kashan", destinationId: "kashan", titleFa: "\u062D\u0648\u0636 \u0641\u06CC\u0631\u0648\u0632\u0647", subtitleFa: "\u062F\u0648 \u0622\u0628\u0634\u0627\u0631 \u0645\u0648\u0627\u0632\u06CC \u0628\u0627 \u06AF\u0630\u0631\u06AF\u0627\u0647 \u0645\u06CC\u0627\u0646\u06CC \u062F\u0631 \u0635\u062D\u0646 \u0639\u0645\u0627\u0631\u062A", difficulty: "hard", rows: 6, cols: 6, source: { row: 0, col: 2 }, destination: { row: 5, col: 1 }, destinations: [{ row: 5, col: 1 }, { row: 5, col: 4 }], expectedMinMoves: 25, parTimeSec: 145, grid: [[t(), r(), h(90), r(), r(), t()], [r(), e(270, 90), a(180, 0), o(0, 90), e(90, 180), r()], [t(), a(270, 90), e(0, 180), e(0, 90), a(90, 270), t()], [r(), o(90, 0), e(180, 0), e(90, 270), o(90, 0), r()], [r(), a(270, 90), o(0, 90), o(0, 90), a(90, 270), r()], [t(), c(90), r(), r(), c(90), t()]] }, { id: 18, regionId: "kashan", destinationId: "kashan", titleFa: "\u0633\u0631\u0627\u06CC \u0639\u0627\u0645\u0631\u06CC", subtitleFa: "\u062F\u0648 \u062D\u06CC\u0627\u0637 \u062A\u0627\u0631\u06CC\u062E\u06CC \u0645\u062A\u0635\u0644 \u0628\u0627 \u062F\u0648 \u062A\u0642\u0627\u0637\u0639 \u0686\u0647\u0627\u0631\u0631\u0627\u0647\u06CC", difficulty: "hard", rows: 6, cols: 6, source: { row: 5, col: 0 }, destination: { row: 0, col: 5 }, destinations: [{ row: 0, col: 5 }, { row: 3, col: 5 }], expectedMinMoves: 19, parTimeSec: 135, grid: [[t(), t(), r(), r(), e(270, 90), c(0)], [t(), r(), e(270, 90), o(0, 90), a(90, 270), r()], [r(), r(), o(90, 0), t(), o(90, 0), r()], [e(270, 90), o(0, 90), u(0), o(0, 90), u(0), c(0)], [o(90, 0), r(), e(180, 0), o(0, 90), e(90, 270), r()], [h(270), r(), r(), t(), r(), t()]] }, { id: 19, regionId: "kashan", destinationId: "abuzeydabad", titleFa: "\u0641\u0648\u0627\u0631\u0647 \u0633\u0644\u06CC\u0645\u0627\u0646\u06CC\u0647", subtitleFa: "\u0622\u0628\u0631\u0633\u0627\u0646\u06CC \u0686\u0647\u0627\u0631\u0641\u0635\u0644\u06CC \u0628\u0647 \u0633\u0647 \u0641\u0648\u0627\u0631\u0647 \u062F\u0631 \u0686\u0647\u0627\u0631\u06AF\u0648\u0634\u0647 \u0628\u0627\u063A", difficulty: "hard", rows: 6, cols: 6, source: { row: 0, col: 0 }, destination: { row: 0, col: 5 }, destinations: [{ row: 0, col: 5 }, { row: 5, col: 0 }, { row: 5, col: 5 }], expectedMinMoves: 27, parTimeSec: 155, grid: [[h(90), r(), t(), r(), r(), c(270)], [e(180, 0), o(0, 90), a(0, 180), o(0, 90), a(0, 180), e(90, 270)], [t(), r(), o(90, 0), t(), o(90, 0), r()], [t(), r(), a(270, 90), o(0, 90), a(90, 270), t()], [r(), e(270, 90), e(90, 270), r(), e(180, 0), e(0, 180)], [c(180), e(90, 270), r(), t(), r(), c(90)]] }, { id: 20, regionId: "kashan", destinationId: "abuzeydabad", titleFa: "\u0686\u0647\u0627\u0631\u0628\u0627\u063A \u0641\u06CC\u0646", subtitleFa: "\u0647\u0646\u062F\u0633\u0647 \u0627\u0635\u06CC\u0644 \u0686\u0647\u0627\u0631\u0628\u0627\u063A \u0627\u06CC\u0631\u0627\u0646\u06CC \u0628\u0627 \u062F\u0648 \u0645\u062D\u0648\u0631 \u0645\u062A\u0642\u0627\u0637\u0639", difficulty: "hard", rows: 6, cols: 6, source: { row: 2, col: 0 }, destination: { row: 0, col: 3 }, destinations: [{ row: 0, col: 3 }, { row: 5, col: 3 }], expectedMinMoves: 19, parTimeSec: 140, grid: [[t(), r(), r(), c(270), r(), t()], [r(), e(270, 90), o(0, 90), u(0), e(0, 180), r()], [h(0), a(90, 270), t(), o(90, 0), o(90, 0), t()], [r(), o(90, 0), e(270, 90), u(0), e(90, 270), r()], [r(), e(180, 0), e(90, 270), o(90, 0), r(), r()], [t(), r(), r(), c(90), r(), t()]] }, { id: 21, regionId: "kashan", destinationId: "niasar", titleFa: "\u062A\u0627\u0644\u0627\u0631 \u0622\u06CC\u0646\u0647", subtitleFa: "\u062A\u0642\u0627\u0631\u0646 \u0622\u06CC\u0646\u0647\u200C\u0627\u06CC \u0622\u0628\u0631\u0627\u0647\u200C\u0647\u0627 \u0628\u0627 \u0633\u0647 \u0645\u0638\u0647\u0631 \u0648 \u062F\u0648 \u0686\u0647\u0627\u0631\u0631\u0627\u0647\u06CC", difficulty: "expert", rows: 6, cols: 6, source: { row: 0, col: 3 }, destination: { row: 2, col: 0 }, destinations: [{ row: 2, col: 0 }, { row: 2, col: 5 }, { row: 5, col: 3 }], expectedMinMoves: 23, parTimeSec: 155, grid: [[t(), r(), r(), h(90), r(), t()], [t(), r(), e(270, 90), a(180, 0), e(0, 180), r()], [c(180), o(0, 90), a(180, 0), a(0, 180), a(180, 0), c(0)], [t(), e(270, 90), o(0, 90), u(0), e(0, 180), t()], [r(), e(180, 0), o(0, 90), u(0), e(90, 270), r()], [t(), r(), r(), c(90), r(), t()]] }, { id: 22, regionId: "kashan", destinationId: "niasar", titleFa: "\u0634\u062A\u0631\u06AF\u0644\u0648", subtitleFa: "\u0645\u0647\u0646\u062F\u0633\u06CC \u0635\u0639\u0648\u062F \u0641\u0634\u0627\u0631 \u0622\u0628 \u062F\u0631 \u06AF\u0630\u0631\u06AF\u0627\u0647\u200C\u0647\u0627\u06CC \u062A\u0648\u062F\u0631\u062A\u0648", difficulty: "expert", rows: 6, cols: 6, source: { row: 5, col: 0 }, destination: { row: 0, col: 0 }, destinations: [{ row: 0, col: 0 }, { row: 0, col: 5 }], expectedMinMoves: 27, parTimeSec: 165, grid: [[c(180), o(0, 90), e(0, 180), r(), t(), c(270)], [r(), e(270, 90), a(90, 270), r(), t(), o(90, 0)], [t(), o(90, 0), o(90, 0), r(), e(270, 90), e(90, 270)], [r(), e(180, 0), u(0), o(0, 90), a(90, 270), r()], [t(), r(), a(270, 90), o(0, 90), e(90, 270), r()], [h(0), o(0, 90), e(90, 270), r(), t(), t()]] }, { id: 23, regionId: "kashan", destinationId: "qamsar", titleFa: "\u062E\u0627\u0646\u0647 \u0637\u0628\u0627\u0637\u0628\u0627\u06CC\u06CC", subtitleFa: "\u0634\u0628\u06A9\u0647 \u067E\u06CC\u0686\u06CC\u062F\u0647 \u062D\u0648\u0636\u062E\u0627\u0646\u0647\u200C\u0647\u0627 \u0648 \u0627\u0646\u0634\u0639\u0627\u0628\u200C\u0647\u0627\u06CC \u0686\u0646\u062F\u06AF\u0627\u0646\u0647", difficulty: "expert", rows: 6, cols: 6, source: { row: 0, col: 0 }, destination: { row: 0, col: 5 }, destinations: [{ row: 0, col: 5 }, { row: 5, col: 0 }, { row: 5, col: 5 }], expectedMinMoves: 28, parTimeSec: 170, grid: [[h(0), e(0, 180), r(), t(), e(270, 90), c(0)], [r(), a(270, 90), o(0, 90), a(0, 180), e(90, 270), r()], [t(), o(90, 0), t(), o(90, 0), r(), t()], [e(270, 90), u(0), o(0, 90), u(0), e(0, 180), r()], [o(90, 0), e(180, 0), o(0, 90), a(180, 0), a(90, 270), r()], [c(90), r(), t(), r(), e(180, 0), c(0)]] }, { id: 24, regionId: "kashan", destinationId: "qamsar", titleFa: "\u0628\u0627\u063A \u0641\u06CC\u0646 \u06A9\u0627\u0634\u0627\u0646", subtitleFa: "\u0634\u0627\u0647\u06A9\u0627\u0631 \u067E\u0627\u06CC\u0627\u0646\u06CC\u061B \u0627\u062D\u06CC\u0627\u06CC \u0634\u0628\u06A9\u0647 \u06A9\u0627\u0645\u0644 \u0641\u0648\u0627\u0631\u0647\u200C\u0647\u0627\u06CC \u0628\u0627\u063A \u0627\u06CC\u0631\u0627\u0646\u06CC", difficulty: "expert", rows: 6, cols: 6, source: { row: 0, col: 2 }, destination: { row: 0, col: 0 }, destinations: [{ row: 0, col: 0 }, { row: 0, col: 5 }, { row: 5, col: 3 }], expectedMinMoves: 23, parTimeSec: 180, grid: [[c(180), e(0, 180), h(90), t(), t(), c(270)], [r(), a(270, 90), u(0), o(0, 90), a(0, 180), e(90, 270)], [t(), o(90, 0), a(270, 90), e(0, 180), o(90, 0), r()], [r(), e(180, 0), u(0), u(0), a(90, 270), t()], [t(), r(), e(180, 0), u(0), e(90, 270), r()], [t(), r(), r(), c(90), r(), t()]] }];
  var yt = [{ id: 9, regionId: "kerman", destinationId: "kerman", titleFa: "\u0686\u0634\u0645\u0647 \u06A9\u0648\u0647\u0633\u062A\u0627\u0646", subtitleFa: "\u062A\u0642\u0633\u06CC\u0645 \u0622\u0628 \u06A9\u0648\u0647\u0633\u0627\u0631 \u062F\u0631 \u062F\u0648 \u062C\u0648\u06CC\u0628\u0627\u0631 \u067E\u0644\u06A9\u0627\u0646\u06CC", difficulty: "medium", rows: 5, cols: 5, source: { row: 0, col: 2 }, destination: { row: 4, col: 0 }, destinations: [{ row: 4, col: 0 }, { row: 4, col: 4 }], expectedMinMoves: 19, parTimeSec: 100, grid: [[t(), r(), h(90), r(), t()], [e(270, 90), o(0, 90), a(180, 0), e(0, 180), r()], [e(180, 0), e(90, 180), t(), e(270, 0), e(90, 180)], [t(), o(90, 0), t(), e(0, 90), e(180, 270)], [c(180), e(90, 270), r(), e(180, 0), c(0)]] }, { id: 10, regionId: "kerman", destinationId: "kerman", titleFa: "\u0646\u062E\u0644\u0633\u062A\u0627\u0646 \u0628\u0645", subtitleFa: "\u0622\u0628\u06CC\u0627\u0631\u06CC \u0647\u0645\u200C\u0632\u0645\u0627\u0646 \u0633\u0647 \u0646\u062E\u0644\u0633\u062A\u0627\u0646 \u0627\u0632 \u062A\u0642\u0627\u0637\u0639 \u0645\u0631\u06A9\u0632\u06CC", difficulty: "medium", rows: 5, cols: 5, source: { row: 2, col: 0 }, destination: { row: 0, col: 2 }, destinations: [{ row: 0, col: 2 }, { row: 2, col: 4 }, { row: 4, col: 2 }], expectedMinMoves: 15, parTimeSec: 95, grid: [[t(), e(270, 90), c(0), t(), r()], [r(), e(180, 0), e(0, 180), e(0, 90), e(90, 180)], [h(0), o(0, 90), u(0), e(90, 270), c(90)], [r(), t(), e(180, 0), e(90, 180), r()], [t(), r(), c(180), e(180, 270), t()]] }, { id: 11, regionId: "kerman", destinationId: "mahan", titleFa: "\u0628\u0627\u063A \u0634\u0627\u0647\u0632\u0627\u062F\u0647", subtitleFa: "\u0686\u0631\u062E\u0634 \u0622\u0628 \u067E\u06CC\u0631\u0627\u0645\u0648\u0646 \u062D\u0648\u0636\u0686\u0647 \u0645\u0631\u06A9\u0632\u06CC \u0628\u0627\u063A \u0645\u0627\u0647\u0627\u0646", difficulty: "medium", rows: 5, cols: 5, source: { row: 0, col: 0 }, destination: { row: 2, col: 4 }, destinations: [{ row: 2, col: 4 }, { row: 4, col: 0 }], expectedMinMoves: 18, parTimeSec: 105, grid: [[h(0), o(0, 90), e(90, 180), r(), t()], [t(), e(270, 90), a(180, 0), e(0, 180), r()], [r(), o(90, 0), t(), a(270, 90), c(0)], [r(), a(270, 90), o(0, 90), e(90, 270), r()], [c(180), e(90, 270), r(), t(), t()]] }, { id: 12, regionId: "kerman", destinationId: "mahan", titleFa: "\u062C\u0648\u06CC\u0628\u0627\u0631 \u0645\u0627\u0647\u0627\u0646", subtitleFa: "\u062F\u0648 \u062D\u0644\u0642\u0647 \u0645\u062A\u0642\u0627\u0631\u0646 \u062F\u0631 \u06A9\u0646\u0627\u0631 \u062A\u0642\u0627\u0637\u0639 \u0645\u0631\u06A9\u0632\u06CC", difficulty: "medium", rows: 5, cols: 5, source: { row: 4, col: 2 }, destination: { row: 0, col: 0 }, destinations: [{ row: 0, col: 0 }, { row: 0, col: 4 }], expectedMinMoves: 14, parTimeSec: 95, grid: [[c(180), e(90, 180), t(), e(270, 90), c(0)], [r(), a(270, 90), a(0, 180), a(90, 270), r()], [r(), e(180, 0), u(0), e(90, 270), r()], [t(), r(), o(90, 0), r(), t()], [t(), r(), h(270), r(), t()]] }, { id: 13, regionId: "kerman", destinationId: "bam", titleFa: "\u0642\u0646\u0627\u062A \u062C\u0648\u067E\u0627\u0631", subtitleFa: "\u0622\u0628\u0631\u0633\u0627\u0646\u06CC \u0628\u0647 \u0633\u0647 \u062F\u0647\u0633\u062A\u0627\u0646 \u0628\u0627 \u06CC\u06A9 \u062D\u0644\u0642\u0647 \u0641\u0634\u0627\u0631 \u0648 \u0633\u0647 \u0645\u0638\u0647\u0631", difficulty: "challenging", rows: 5, cols: 5, source: { row: 0, col: 4 }, destination: { row: 0, col: 0 }, destinations: [{ row: 0, col: 0 }, { row: 4, col: 0 }, { row: 4, col: 4 }], expectedMinMoves: 21, parTimeSec: 120, grid: [[c(180), o(0, 90), a(0, 180), o(0, 90), h(180)], [t(), r(), o(90, 0), r(), t()], [e(270, 90), o(0, 90), u(0), o(0, 90), e(0, 180)], [a(270, 90), e(0, 180), o(90, 0), t(), o(90, 0)], [c(90), e(180, 0), e(90, 270), t(), c(90)]] }, { id: 14, regionId: "kerman", destinationId: "bam", titleFa: "\u0642\u0644\u0639\u0647 \u0631\u0627\u06CC\u0646", subtitleFa: "\u062E\u0646\u062F\u0642 \u062F\u0648\u0642\u0644\u0648\u06CC \u0622\u0628\u200C\u0631\u0633\u0627\u0646\u06CC \u0627\u0632 \u0633\u0631\u0686\u0634\u0645\u0647 \u0645\u06CC\u0627\u0646\u06CC \u0627\u0631\u06AF", difficulty: "challenging", rows: 5, cols: 5, source: { row: 2, col: 2 }, destination: { row: 0, col: 0 }, destinations: [{ row: 0, col: 0 }, { row: 4, col: 4 }], expectedMinMoves: 19, parTimeSec: 115, grid: [[c(180), e(90, 180), r(), t(), t()], [r(), a(270, 90), o(0, 90), e(0, 180), r()], [t(), o(90, 0), h(0), a(90, 270), t()], [r(), a(270, 90), o(0, 90), u(0), e(0, 180)], [t(), e(180, 0), o(0, 90), e(90, 270), c(90)]] }, { id: 15, regionId: "kerman", destinationId: "rayen", titleFa: "\u0628\u0627\u063A\u200C\u0647\u0627\u06CC \u0633\u06CC\u0631\u062C\u0627\u0646", subtitleFa: "\u0646\u062E\u0633\u062A\u06CC\u0646 \u0634\u0628\u06A9\u0647 \u06AF\u0633\u062A\u0631\u062F\u0647 \u06F6\xD7\u06F6 \u0628\u0627 \u062D\u0644\u0642\u0647 \u0622\u0628\u200C\u0627\u0646\u0628\u0627\u0631 \u063A\u0631\u0628\u06CC", difficulty: "challenging", rows: 6, cols: 6, source: { row: 0, col: 0 }, destination: { row: 2, col: 5 }, destinations: [{ row: 2, col: 5 }, { row: 5, col: 5 }], expectedMinMoves: 23, parTimeSec: 130, grid: [[h(0), o(0, 90), e(90, 180), r(), t(), r()], [t(), r(), a(270, 90), o(0, 90), e(0, 180), r()], [t(), r(), o(90, 0), t(), a(270, 90), c(0)], [r(), e(270, 90), u(0), o(0, 90), a(90, 270), r()], [r(), e(180, 0), e(90, 270), r(), e(180, 0), e(0, 180)], [t(), r(), r(), t(), r(), c(90)]] }, { id: 16, regionId: "kerman", destinationId: "rayen", titleFa: "\u06A9\u0627\u0631\u0648\u0627\u0646 \u0622\u0628 \u06A9\u0631\u0645\u0627\u0646", subtitleFa: "\u0622\u0632\u0645\u0648\u0646 \u067E\u0627\u06CC\u0627\u0646\u06CC \u06A9\u0631\u0645\u0627\u0646 \u0628\u0631\u0627\u06CC \u06AF\u0634\u0648\u062F\u0646 \u062F\u0631\u0648\u0627\u0632\u0647 \u06A9\u0627\u0634\u0627\u0646", difficulty: "challenging", rows: 6, cols: 6, source: { row: 2, col: 0 }, destination: { row: 0, col: 5 }, destinations: [{ row: 0, col: 5 }, { row: 5, col: 2 }, { row: 5, col: 5 }], expectedMinMoves: 23, parTimeSec: 140, grid: [[t(), r(), t(), r(), e(270, 90), c(0)], [r(), e(270, 90), o(0, 90), a(0, 180), e(90, 270), r()], [h(0), a(90, 270), t(), o(90, 0), r(), t()], [r(), e(180, 0), o(0, 90), u(0), e(0, 180), r()], [t(), r(), e(0, 90), e(90, 270), o(90, 0), t()], [t(), r(), c(90), r(), e(180, 0), c(0)]] }];
  var ht = [{ id: 33, regionId: "khorasan", destinationId: "gonabad", titleFa: "\u0686\u0627\u0647\u200C\u0645\u06CC\u0644\u0647 \u06AF\u0646\u0627\u0628\u0627\u062F", subtitleFa: "\u0647\u062F\u0627\u06CC\u062A \u0622\u0628 \u0627\u0632 \u0645\u0627\u062F\u0631\u0686\u0627\u0647 \u0645\u0631\u06A9\u0632\u06CC \u0628\u0647 \u0633\u0647 \u062F\u0627\u0644\u0627\u0646 \u0632\u06CC\u0631\u0632\u0645\u06CC\u0646\u06CC", difficulty: "expert", rows: 6, cols: 6, source: { row: 0, col: 2 }, destination: { row: 3, col: 0 }, destinations: [{ row: 3, col: 0 }, { row: 3, col: 5 }, { row: 5, col: 3 }], expectedMinMoves: 23, parTimeSec: 165, grid: [[t(), r(), h(90), r(), t(), r()], [r(), e(270, 90), u(0), o(0, 90), e(0, 180), t()], [e(270, 90), a(90, 270), o(90, 0), t(), a(270, 90), e(0, 180)], [c(90), e(180, 0), u(0), o(0, 90), e(90, 270), c(90)], [t(), r(), e(180, 0), e(0, 180), r(), t()], [r(), t(), r(), c(90), t(), r()]] }, { id: 34, regionId: "khorasan", destinationId: "gonabad", titleFa: "\u0642\u0646\u0627\u062A \u06A9\u0647\u0646 \u0642\u0635\u0628\u0647", subtitleFa: "\u062F\u0627\u0644\u0627\u0646\u200C\u0647\u0627\u06CC \u062A\u0648\u062F\u0631\u062A\u0648 \u0628\u0627 \u0633\u0647 \u062A\u0642\u0627\u0637\u0639 \u0686\u0647\u0627\u0631\u0631\u0627\u0647\u06CC \u0648 \u062C\u0631\u06CC\u0627\u0646 \u06AF\u0631\u0627\u0646\u0634\u06CC \u067E\u06CC\u0648\u0633\u062A\u0647", difficulty: "expert", rows: 6, cols: 6, source: { row: 0, col: 5 }, destination: { row: 0, col: 0 }, destinations: [{ row: 0, col: 0 }, { row: 5, col: 2 }, { row: 5, col: 5 }], expectedMinMoves: 31, parTimeSec: 180, grid: [[c(180), o(0, 90), e(0, 180), t(), r(), h(90)], [t(), r(), a(270, 90), o(0, 90), a(0, 180), e(90, 270)], [e(270, 90), o(0, 90), u(0), e(0, 180), o(90, 0), t()], [e(180, 0), e(0, 180), o(90, 0), e(180, 0), u(0), e(0, 180)], [t(), e(180, 0), u(0), o(0, 90), e(90, 270), o(90, 0)], [r(), t(), c(90), t(), r(), c(90)]] }, { id: 35, regionId: "khorasan", destinationId: "ferdows", titleFa: "\u0628\u0627\u063A\u0633\u062A\u0627\u0646 \u0641\u0631\u062F\u0648\u0633", subtitleFa: "\u0634\u0628\u06A9\u0647 \u0641\u0634\u0631\u062F\u0647 \u0648 \u0645\u062A\u0642\u0627\u0631\u0646 \u06F5\xD7\u06F5 \u0628\u0627 \u0633\u0631\u0686\u0634\u0645\u0647 \u0645\u0631\u06A9\u0632\u06CC \u0648 \u0633\u0647 \u0628\u0627\u063A\u0633\u062A\u0627\u0646", difficulty: "expert", rows: 5, cols: 5, source: { row: 2, col: 2 }, destination: { row: 0, col: 0 }, destinations: [{ row: 0, col: 0 }, { row: 0, col: 4 }, { row: 4, col: 2 }], expectedMinMoves: 23, parTimeSec: 150, grid: [[c(180), e(0, 180), t(), e(270, 90), c(0)], [e(270, 90), u(0), a(0, 180), u(0), e(0, 180)], [o(90, 0), o(90, 0), h(270), o(90, 0), o(90, 0)], [e(180, 0), a(180, 0), a(0, 180), a(270, 0), e(90, 270)], [t(), r(), c(90), r(), t()]] }, { id: 36, regionId: "khorasan", destinationId: "ferdows", titleFa: "\u0622\u0628\u0631\u0627\u0647\u0647 \u0628\u0644\u062F\u0647 \u0641\u0631\u062F\u0648\u0633", subtitleFa: "\u062A\u0642\u0633\u06CC\u0645 \u0647\u0645\u200C\u0632\u0645\u0627\u0646 \u062C\u0631\u06CC\u0627\u0646 \u0622\u0628 \u0628\u0647 \u0686\u0647\u0627\u0631 \u0628\u0627\u063A \u0628\u062F\u0648\u0646 \u06A9\u0648\u0686\u06A9\u200C\u062A\u0631\u06CC\u0646 \u0646\u0634\u062A", difficulty: "expert", rows: 6, cols: 6, source: { row: 2, col: 0 }, destination: { row: 0, col: 2 }, destinations: [{ row: 0, col: 2 }, { row: 0, col: 5 }, { row: 5, col: 1 }, { row: 5, col: 5 }], expectedMinMoves: 25, parTimeSec: 175, grid: [[t(), r(), c(270), t(), e(270, 90), c(0)], [r(), e(270, 90), u(0), o(0, 90), a(90, 270), t()], [h(0), u(0), a(180, 0), e(0, 180), o(90, 0), r()], [t(), o(90, 0), t(), e(180, 0), a(90, 270), r()], [r(), a(270, 90), o(0, 90), o(0, 90), a(180, 0), e(0, 180)], [t(), c(90), t(), r(), r(), c(90)]] }, { id: 37, regionId: "khorasan", destinationId: "tabas", titleFa: "\u0646\u062E\u0644\u0633\u062A\u0627\u0646 \u0637\u0628\u0633", subtitleFa: "\u062D\u0644\u0642\u0647\u200C\u0647\u0627\u06CC \u062F\u0648\u0642\u0644\u0648\u06CC \u0622\u0628\u200C\u0631\u0633\u0627\u0646\u06CC \u062F\u0631 \u062D\u0627\u0634\u06CC\u0647 \u0646\u062E\u0644\u0633\u062A\u0627\u0646\u200C\u0647\u0627\u06CC \u0648\u0627\u062D\u0647 \u0637\u0628\u0633", difficulty: "expert", rows: 6, cols: 6, source: { row: 5, col: 3 }, destination: { row: 0, col: 0 }, destinations: [{ row: 0, col: 0 }, { row: 0, col: 5 }, { row: 3, col: 0 }], expectedMinMoves: 29, parTimeSec: 175, grid: [[c(180), o(0, 90), e(0, 180), e(270, 90), o(0, 90), c(0)], [t(), e(270, 90), a(90, 270), a(270, 90), e(0, 180), t()], [e(270, 90), a(90, 270), e(180, 0), u(0), e(90, 270), r()], [c(90), o(90, 0), t(), o(90, 0), r(), t()], [t(), e(180, 0), o(0, 90), a(90, 270), r(), r()], [r(), t(), r(), h(270), t(), r()]] }, { id: 38, regionId: "khorasan", destinationId: "tabas", titleFa: "\u0628\u0627\u063A \u06AF\u0644\u0634\u0646 \u0637\u0628\u0633", subtitleFa: "\u0686\u0647\u0627\u0631 \u062C\u0648\u06CC\u0628\u0627\u0631 \u0647\u0645\u200C\u0632\u0645\u0627\u0646 \u062F\u0631 \u0628\u0627\u063A \u0648\u0627\u062D\u0647\u200C\u0627\u06CC \u0637\u0628\u0633 \u0628\u0627 \u062F\u0648 \u062A\u0642\u0627\u0637\u0639 \u0645\u0631\u06A9\u0632\u06CC", difficulty: "expert", rows: 6, cols: 6, source: { row: 0, col: 1 }, destination: { row: 0, col: 5 }, destinations: [{ row: 0, col: 5 }, { row: 2, col: 5 }, { row: 5, col: 0 }, { row: 5, col: 4 }], expectedMinMoves: 29, parTimeSec: 185, grid: [[t(), h(90), t(), e(270, 90), o(0, 90), c(0)], [e(270, 90), u(0), o(0, 90), a(90, 270), t(), r()], [o(90, 0), a(270, 90), e(0, 180), a(270, 90), o(0, 90), c(0)], [a(270, 90), e(90, 270), e(180, 0), u(0), e(0, 180), t()], [o(90, 0), t(), r(), e(180, 0), a(90, 270), r()], [c(90), r(), t(), r(), c(90), t()]] }, { id: 39, regionId: "khorasan", destinationId: "birjand", titleFa: "\u067E\u0644\u0647\u200C\u0647\u0627\u06CC \u0628\u0627\u063A \u0628\u06CC\u0631\u062C\u0646\u062F", subtitleFa: "\u0634\u0628\u06A9\u0647 \u0633\u0647 \u0686\u0647\u0627\u0631\u0631\u0627\u0647\u06CC \u0628\u0631\u0627\u06CC \u0622\u0628\u06CC\u0627\u0631\u06CC \u067E\u0644\u06A9\u0627\u0646\u06CC \u0628\u0627\u063A\u200C\u0647\u0627\u06CC \u06A9\u0648\u0647\u067E\u0627\u06CC\u0647\u200C\u0627\u06CC \u0628\u06CC\u0631\u062C\u0646\u062F", difficulty: "expert", rows: 6, cols: 6, source: { row: 5, col: 0 }, destination: { row: 0, col: 0 }, destinations: [{ row: 0, col: 0 }, { row: 0, col: 5 }, { row: 5, col: 5 }], expectedMinMoves: 32, parTimeSec: 190, grid: [[c(180), e(0, 180), t(), e(270, 90), o(0, 90), c(0)], [e(270, 90), u(0), o(0, 90), a(90, 270), t(), r()], [o(90, 0), e(180, 0), e(0, 180), a(270, 90), e(0, 180), t()], [a(270, 90), o(0, 90), u(0), u(0), e(90, 270), r()], [o(90, 0), t(), e(180, 0), a(180, 0), o(0, 90), e(0, 180)], [h(270), r(), t(), r(), t(), c(90)]] }, { id: 40, regionId: "khorasan", destinationId: "birjand", titleFa: "\u0646\u0628\u0636 \u062C\u0627\u0648\u062F\u0627\u0646 \u0622\u0628 \u0627\u06CC\u0631\u0627\u0646", subtitleFa: "\u0622\u0632\u0645\u0648\u0646 \u0646\u0647\u0627\u06CC\u06CC \u0627\u0633\u062A\u0627\u062F \u0642\u0646\u0627\u062A\u200C\u0686\u06CC\u061B \u0627\u062A\u0635\u0627\u0644 \u0633\u0631\u0686\u0634\u0645\u0647 \u0645\u0631\u06A9\u0632\u06CC \u0628\u0647 \u0686\u0647\u0627\u0631\u06AF\u0648\u0634\u0647 \u0633\u0631\u0632\u0645\u06CC\u0646", difficulty: "expert", rows: 6, cols: 6, source: { row: 2, col: 2 }, destination: { row: 0, col: 0 }, destinations: [{ row: 0, col: 0 }, { row: 0, col: 5 }, { row: 5, col: 0 }, { row: 5, col: 5 }], expectedMinMoves: 31, parTimeSec: 200, grid: [[c(180), e(0, 180), t(), e(270, 90), o(0, 90), c(0)], [e(270, 90), u(0), o(0, 90), u(0), e(0, 180), t()], [o(90, 0), o(90, 0), h(0), a(90, 270), a(270, 90), e(0, 180)], [a(270, 90), u(0), o(0, 90), u(0), e(90, 270), o(90, 0)], [o(90, 0), e(180, 0), o(0, 90), e(90, 270), t(), o(90, 0)], [c(90), t(), r(), r(), t(), c(90)]] }];
  var wt = [{ id: 65, regionId: "northwest", destinationId: "tabriz", titleFa: "\u062F\u0627\u0644\u0627\u0646\u200C\u0647\u0627\u06CC \u06A9\u0647\u0646 \u062A\u0628\u0631\u06CC\u0632", subtitleFa: "\u0647\u062F\u0627\u06CC\u062A \u062C\u0631\u06CC\u0627\u0646 \u0627\u0632 \u0634\u0645\u0627\u0644\u200C\u063A\u0631\u0628 \u062A\u0628\u0631\u06CC\u0632 \u0628\u0647 \u0633\u0647 \u0645\u062D\u0644\u0647 \u0648 \u0628\u0627\u0632\u0627\u0631\u0686\u0647 \u0632\u06CC\u0631\u0632\u0645\u06CC\u0646\u06CC", difficulty: "hard", rows: 6, cols: 6, source: { row: 0, col: 1 }, destination: { row: 0, col: 4 }, destinations: [{ row: 0, col: 4 }, { row: 3, col: 0 }, { row: 5, col: 5 }], expectedMinMoves: 31, parTimeSec: 180, grid: [[t(), h(90), t(), r(), c(270), t()], [e(270, 90), u(0), o(0, 90), e(0, 180), a(270, 90), e(0, 180)], [e(180, 0), a(180, 0), e(0, 180), a(270, 90), e(90, 270), o(90, 0)], [c(180), o(0, 90), u(0), a(90, 270), t(), o(90, 0)], [t(), r(), e(180, 0), a(180, 0), o(0, 90), a(90, 270)], [r(), t(), r(), t(), r(), c(90)]] }, { id: 66, regionId: "northwest", destinationId: "tabriz", titleFa: "\u0622\u0628\u0631\u0627\u0647\u0647 \u062F\u0627\u0645\u0646\u0647 \u0633\u0647\u0646\u062F", subtitleFa: "\u067E\u062E\u0634 \u062C\u0631\u06CC\u0627\u0646 \u06A9\u0648\u0647\u0633\u062A\u0627\u0646\u06CC \u0627\u0632 \u063A\u0631\u0628 \u0628\u0647 \u0686\u0647\u0627\u0631 \u0646\u0642\u0637\u0647 \u0634\u0647\u0631\u06CC \u0628\u0627 \u0633\u0647 \u062A\u0642\u0627\u0637\u0639 \u06A9\u0644\u06CC\u062F\u06CC", difficulty: "expert", rows: 6, cols: 6, source: { row: 2, col: 0 }, destination: { row: 0, col: 0 }, destinations: [{ row: 0, col: 0 }, { row: 0, col: 5 }, { row: 5, col: 1 }, { row: 5, col: 4 }], expectedMinMoves: 31, parTimeSec: 185, grid: [[c(180), o(0, 90), o(0, 90), e(0, 180), t(), c(270)], [t(), e(270, 90), o(0, 90), u(0), o(0, 90), a(90, 270)], [h(0), u(0), e(0, 180), o(90, 0), t(), o(90, 0)], [e(270, 90), a(90, 270), e(180, 0), u(0), o(0, 90), e(90, 270)], [e(180, 0), a(90, 270), t(), e(180, 0), e(0, 180), t()], [t(), c(90), r(), t(), c(90), r()]] }, { id: 67, regionId: "northwest", destinationId: "maragheh", titleFa: "\u0628\u0627\u063A\u200C\u0647\u0627\u06CC \u067E\u0644\u06A9\u0627\u0646\u06CC \u0645\u0631\u0627\u063A\u0647", subtitleFa: "\u0647\u062F\u0627\u06CC\u062A \u0622\u0628 \u0627\u0632 \u062C\u0646\u0648\u0628 \u0628\u0647 \u0627\u0631\u062A\u0641\u0627\u0639\u0627\u062A \u0628\u0627\u063A\u200C\u0647\u0627\u06CC \u0633\u0631\u0633\u0628\u0632 \u067E\u06CC\u0631\u0627\u0645\u0648\u0646 \u0645\u0631\u0627\u063A\u0647", difficulty: "expert", rows: 6, cols: 6, source: { row: 5, col: 3 }, destination: { row: 0, col: 2 }, destinations: [{ row: 0, col: 2 }, { row: 2, col: 5 }, { row: 5, col: 0 }], expectedMinMoves: 32, parTimeSec: 185, grid: [[t(), r(), c(270), t(), e(270, 90), e(0, 180)], [e(270, 90), o(0, 90), u(0), o(0, 90), u(0), e(90, 270)], [o(90, 0), t(), a(270, 90), e(0, 180), a(270, 90), c(0)], [a(270, 90), o(0, 90), e(90, 270), a(270, 90), e(90, 270), t()], [a(270, 90), o(0, 90), o(0, 90), a(90, 270), t(), r()], [c(90), t(), r(), h(270), r(), t()]] }, { id: 68, regionId: "northwest", destinationId: "maragheh", titleFa: "\u062F\u0648\u0686\u0647\u0627\u0631\u0631\u0627\u0647 \u062F\u0631\u0647 \u0645\u0631\u0627\u063A\u0647", subtitleFa: "\u0628\u0647\u200C\u06A9\u0627\u0631\u06AF\u06CC\u0631\u06CC \u0686\u0647\u0627\u0631 \u062A\u0642\u0627\u0637\u0639 \u0645\u062A\u0648\u0627\u0632\u0646 \u0628\u0631\u0627\u06CC \u0631\u0633\u0627\u0646\u062F\u0646 \u0622\u0628 \u0628\u0647 \u0686\u0647\u0627\u0631 \u0628\u0627\u063A\u0686\u0647", difficulty: "expert", rows: 6, cols: 6, source: { row: 3, col: 0 }, destination: { row: 0, col: 1 }, destinations: [{ row: 0, col: 1 }, { row: 0, col: 4 }, { row: 5, col: 1 }, { row: 5, col: 4 }], expectedMinMoves: 28, parTimeSec: 185, grid: [[t(), c(270), t(), r(), c(270), t()], [e(270, 90), u(0), o(0, 90), o(0, 90), u(0), e(0, 180)], [e(180, 0), a(90, 270), e(270, 90), e(0, 180), o(90, 0), o(90, 0)], [h(0), u(0), e(90, 270), e(180, 0), u(0), e(90, 270)], [t(), a(270, 90), o(0, 90), o(0, 90), a(90, 270), t()], [r(), c(90), t(), r(), c(90), r()]] }, { id: 69, regionId: "northwest", destinationId: "khoy", titleFa: "\u062F\u0634\u062A \u0645\u0631\u062A\u0641\u0639 \u062E\u0648\u06CC", subtitleFa: "\u0647\u062F\u0627\u06CC\u062A \u062C\u0631\u06CC\u0627\u0646 \u0627\u0632 \u0633\u0631\u0686\u0634\u0645\u0647 \u0634\u0645\u0627\u0644\u06CC \u0628\u0647 \u0686\u0647\u0627\u0631 \u0645\u0632\u0631\u0639\u0647 \u062F\u0631 \u062F\u0634\u062A \u062E\u0648\u06CC", difficulty: "expert", rows: 6, cols: 6, source: { row: 0, col: 2 }, destination: { row: 0, col: 0 }, destinations: [{ row: 0, col: 0 }, { row: 0, col: 5 }, { row: 5, col: 2 }, { row: 5, col: 5 }], expectedMinMoves: 34, parTimeSec: 190, grid: [[c(270), t(), h(90), e(270, 90), o(0, 90), c(0)], [e(180, 0), o(0, 90), u(0), a(90, 270), t(), r()], [t(), e(270, 90), a(90, 270), a(270, 90), o(0, 90), e(0, 180)], [e(270, 90), u(0), e(90, 270), o(90, 0), t(), o(90, 0)], [e(180, 0), a(180, 0), a(0, 180), a(180, 0), o(0, 90), a(90, 270)], [t(), r(), c(90), t(), r(), c(90)]] }, { id: 70, regionId: "northwest", destinationId: "khoy", titleFa: "\u06AF\u0630\u0631\u06AF\u0627\u0647 \u06A9\u0648\u0647\u0633\u062A\u0627\u0646\u06CC \u062E\u0648\u06CC", subtitleFa: "\u062A\u062E\u062A\u0647 \u06F7\xD7\u06F7 \u0628\u0627 \u0686\u0647\u0627\u0631 \u062C\u0647\u062A \u0627\u0635\u0644\u06CC\u061B \u0627\u062A\u0635\u0627\u0644 \u0686\u0634\u0645\u0647 \u06AF\u0648\u0634\u0647 \u0628\u0647 \u0686\u0647\u0627\u0631 \u062F\u0631\u0648\u0627\u0632\u0647 \u062F\u0634\u062A", difficulty: "expert", rows: 7, cols: 7, source: { row: 0, col: 0 }, destination: { row: 0, col: 3 }, destinations: [{ row: 0, col: 3 }, { row: 3, col: 0 }, { row: 3, col: 6 }, { row: 6, col: 3 }], expectedMinMoves: 40, parTimeSec: 225, grid: [[h(0), o(0, 90), e(0, 180), c(270), e(270, 90), o(0, 90), e(0, 180)], [t(), e(270, 90), u(0), u(0), a(90, 270), t(), o(90, 0)], [r(), o(90, 0), e(180, 0), e(90, 270), e(180, 0), a(0, 180), e(90, 270)], [c(180), a(90, 270), t(), e(270, 90), o(0, 90), u(0), c(0)], [t(), e(180, 0), o(0, 90), a(90, 270), t(), o(90, 0), t()], [r(), t(), t(), a(270, 90), o(0, 90), e(90, 270), r()], [t(), r(), t(), c(90), t(), r(), t()]] }, { id: 71, regionId: "northwest", destinationId: "urmia", titleFa: "\u062A\u0627\u06A9\u0633\u062A\u0627\u0646\u200C\u0647\u0627\u06CC \u062D\u0648\u0636\u0647 \u0627\u0631\u0648\u0645\u06CC\u0647", subtitleFa: "\u0647\u062F\u0627\u06CC\u062A \u062C\u0631\u06CC\u0627\u0646 \u0627\u0632 \u0633\u0631\u0686\u0634\u0645\u0647 \u0645\u06CC\u0627\u0646\u06CC \u0628\u0647 \u0686\u0647\u0627\u0631 \u06AF\u0648\u0634\u0647 \u062A\u0627\u06A9\u0633\u062A\u0627\u0646\u200C\u0647\u0627\u06CC \u067E\u06CC\u0631\u0627\u0645\u0648\u0646 \u0627\u0631\u0648\u0645\u06CC\u0647", difficulty: "expert", rows: 6, cols: 6, source: { row: 2, col: 2 }, destination: { row: 0, col: 0 }, destinations: [{ row: 0, col: 0 }, { row: 0, col: 5 }, { row: 5, col: 0 }, { row: 5, col: 5 }], expectedMinMoves: 43, parTimeSec: 205, grid: [[c(180), o(0, 90), e(0, 180), e(270, 90), o(0, 90), c(0)], [t(), e(270, 90), a(180, 0), u(0), e(0, 180), t()], [e(270, 90), a(90, 270), h(0), a(90, 270), a(270, 90), e(0, 180)], [o(90, 0), a(270, 90), o(0, 90), a(180, 0), a(90, 270), o(90, 0)], [e(180, 0), a(90, 270), t(), t(), a(270, 90), e(90, 270)], [c(180), e(90, 270), r(), r(), e(180, 0), c(0)]] }, { id: 72, regionId: "northwest", destinationId: "urmia", titleFa: "\u067E\u0646\u062C\u200C\u0628\u0627\u063A \u062D\u0648\u0636\u0647 \u0627\u0631\u0648\u0645\u06CC\u0647", subtitleFa: "\u0622\u0632\u0645\u0648\u0646 \u067E\u0627\u06CC\u0627\u0646\u06CC \u0634\u0645\u0627\u0644\u200C\u063A\u0631\u0628\u061B \u062A\u063A\u0630\u06CC\u0647 \u0647\u0645\u200C\u0632\u0645\u0627\u0646 \u067E\u0646\u062C \u0645\u0642\u0635\u062F \u062F\u0631 \u062A\u062E\u062A\u0647 \u0645\u062A\u0642\u0627\u0631\u0646 \u06F7\xD7\u06F7", difficulty: "expert", rows: 7, cols: 7, source: { row: 6, col: 3 }, destination: { row: 0, col: 0 }, destinations: [{ row: 0, col: 0 }, { row: 0, col: 3 }, { row: 0, col: 6 }, { row: 6, col: 1 }, { row: 6, col: 5 }], expectedMinMoves: 45, parTimeSec: 245, grid: [[c(270), t(), r(), c(270), r(), t(), c(270)], [e(180, 0), a(0, 180), o(0, 90), u(0), o(0, 90), a(0, 180), e(90, 270)], [t(), o(90, 0), e(270, 90), a(180, 0), e(0, 180), o(90, 0), t()], [e(270, 90), u(0), e(90, 270), t(), e(180, 0), u(0), e(0, 180)], [o(90, 0), o(90, 0), e(270, 90), o(0, 90), e(0, 180), o(90, 0), o(90, 0)], [e(180, 0), u(0), a(180, 0), a(0, 180), a(180, 0), u(0), e(90, 270)], [t(), c(90), r(), h(270), r(), c(90), t()]] }];
  var bt = [{ id: 73, regionId: "razavi_khorasan", destinationId: "nishapur", titleFa: "\u062F\u0627\u0645\u0646\u0647 \u0641\u06CC\u0631\u0648\u0632\u0647\u200C\u0627\u06CC \u0646\u06CC\u0634\u0627\u0628\u0648\u0631", subtitleFa: "\u0647\u062F\u0627\u06CC\u062A \u0622\u0628 \u0627\u0632 \u0634\u0645\u0627\u0644\u200C\u0634\u0631\u0642 \u062F\u0634\u062A \u0646\u06CC\u0634\u0627\u0628\u0648\u0631 \u0628\u0647 \u0686\u0647\u0627\u0631 \u0622\u0628\u200C\u0627\u0646\u0628\u0627\u0631 \u067E\u06CC\u0631\u0627\u0645\u0648\u0646\u06CC", difficulty: "expert", rows: 6, cols: 6, source: { row: 0, col: 5 }, destination: { row: 0, col: 1 }, destinations: [{ row: 0, col: 1 }, { row: 2, col: 5 }, { row: 5, col: 0 }, { row: 5, col: 4 }], expectedMinMoves: 31, parTimeSec: 195, grid: [[t(), c(270), t(), e(270, 90), e(0, 180), h(90)], [e(270, 90), u(0), o(0, 90), u(0), a(180, 0), e(90, 270)], [o(90, 0), o(90, 0), t(), a(270, 90), a(0, 180), c(0)], [a(270, 90), u(0), o(0, 90), a(180, 0), a(90, 270), t()], [o(90, 0), e(180, 0), o(0, 90), o(0, 90), a(90, 270), r()], [c(90), t(), r(), t(), c(90), t()]] }, { id: 74, regionId: "razavi_khorasan", destinationId: "nishapur", titleFa: "\u0622\u0628\u0631\u06CC\u0632 \u0628\u06CC\u0646\u0627\u0644\u0648\u062F \u0646\u06CC\u0634\u0627\u0628\u0648\u0631", subtitleFa: "\u0634\u0628\u06A9\u0647 \u06F7\xD7\u06F7 \u0628\u0627 \u067E\u0646\u062C \u0686\u0647\u0627\u0631\u0631\u0627\u0647 \u06A9\u0644\u06CC\u062F\u06CC \u062F\u0631 \u0634\u06CC\u0628 \u06A9\u0648\u0647\u067E\u0627\u06CC\u0647\u200C\u0647\u0627\u06CC \u0628\u06CC\u0646\u0627\u0644\u0648\u062F", difficulty: "expert", rows: 7, cols: 7, source: { row: 3, col: 0 }, destination: { row: 0, col: 1 }, destinations: [{ row: 0, col: 1 }, { row: 0, col: 6 }, { row: 6, col: 0 }, { row: 6, col: 5 }], expectedMinMoves: 42, parTimeSec: 235, grid: [[t(), c(270), t(), r(), t(), r(), c(270)], [e(270, 90), u(0), o(0, 90), e(0, 180), e(270, 90), o(0, 90), a(90, 270)], [e(180, 0), a(90, 270), t(), a(270, 90), u(0), e(0, 180), o(90, 0)], [h(0), u(0), o(0, 90), u(0), e(90, 270), o(90, 0), o(90, 0)], [e(270, 90), a(180, 0), e(0, 180), e(180, 0), o(0, 90), u(0), e(90, 270)], [o(90, 0), t(), e(180, 0), o(0, 90), o(0, 90), a(90, 270), t()], [c(90), r(), t(), r(), t(), c(90), r()]] }, { id: 75, regionId: "razavi_khorasan", destinationId: "sabzevar", titleFa: "\u06AF\u0630\u0631\u06AF\u0627\u0647 \u06A9\u0648\u06CC\u0631\u06CC \u0633\u0628\u0632\u0648\u0627\u0631", subtitleFa: "\u0647\u062F\u0627\u06CC\u062A \u062C\u0631\u06CC\u0627\u0646 \u0627\u0632 \u062C\u0646\u0648\u0628\u200C\u0634\u0631\u0642 \u0627\u0632 \u0645\u06CC\u0627\u0646 \u0686\u0647\u0627\u0631 \u062A\u0642\u0627\u0637\u0639 \u0645\u062A\u0648\u0627\u0644\u06CC \u062F\u0631 \u062F\u0634\u062A \u0633\u0628\u0632\u0648\u0627\u0631", difficulty: "expert", rows: 6, cols: 6, source: { row: 5, col: 5 }, destination: { row: 0, col: 0 }, destinations: [{ row: 0, col: 0 }, { row: 0, col: 3 }, { row: 3, col: 5 }, { row: 5, col: 2 }], expectedMinMoves: 27, parTimeSec: 195, grid: [[c(270), t(), r(), c(270), t(), r()], [e(180, 0), a(0, 180), o(0, 90), u(0), e(0, 180), t()], [e(270, 90), u(0), e(0, 180), e(180, 0), a(90, 270), r()], [o(90, 0), e(180, 0), u(0), o(0, 90), u(0), c(0)], [e(180, 0), o(0, 90), u(0), o(0, 90), a(180, 0), e(0, 180)], [t(), r(), c(90), t(), r(), h(270)]] }, { id: 76, regionId: "razavi_khorasan", destinationId: "sabzevar", titleFa: "\u062F\u0648\u062D\u0644\u0642\u0647 \u0632\u06CC\u0631\u0632\u0645\u06CC\u0646\u06CC \u0633\u0628\u0632\u0648\u0627\u0631", subtitleFa: "\u062A\u0646\u0638\u06CC\u0645 \u062A\u062E\u062A\u0647 \u06F7\xD7\u06F7 \u0628\u0627 \u067E\u0646\u062C \u062A\u0642\u0627\u0637\u0639 \u0628\u0631\u0627\u06CC \u062A\u0639\u0627\u062F\u0644 \u062C\u0631\u06CC\u0627\u0646 \u0645\u06CC\u0627\u0646 \u0686\u0647\u0627\u0631 \u0622\u0628\u200C\u06AF\u06CC\u0631", difficulty: "expert", rows: 7, cols: 7, source: { row: 3, col: 6 }, destination: { row: 0, col: 2 }, destinations: [{ row: 0, col: 2 }, { row: 0, col: 5 }, { row: 6, col: 1 }, { row: 6, col: 6 }], expectedMinMoves: 42, parTimeSec: 235, grid: [[t(), r(), c(270), t(), r(), c(270), t()], [e(270, 90), o(0, 90), u(0), o(0, 90), o(0, 90), u(0), e(0, 180)], [o(90, 0), t(), e(180, 0), e(0, 180), t(), a(270, 90), e(90, 270)], [a(270, 90), e(0, 180), e(270, 90), u(0), o(0, 90), u(0), h(180)], [o(90, 0), a(270, 90), e(90, 270), o(90, 0), t(), e(180, 0), e(0, 180)], [e(180, 0), u(0), o(0, 90), a(180, 0), o(0, 90), o(0, 90), a(90, 270)], [t(), c(90), r(), t(), r(), t(), c(90)]] }, { id: 77, regionId: "razavi_khorasan", destinationId: "kashmar", titleFa: "\u062A\u0627\u06A9\u0633\u062A\u0627\u0646\u200C\u0647\u0627\u06CC \u0645\u0631\u062A\u0641\u0639 \u06A9\u0627\u0634\u0645\u0631", subtitleFa: "\u0634\u0628\u06A9\u0647 \u067E\u0631\u062A\u0631\u0627\u06A9\u0645 \u06A9\u0627\u0634\u0645\u0631 \u0628\u0627 \u0633\u0647 \u0686\u0647\u0627\u0631\u0631\u0627\u0647 \u0647\u0645\u200C\u062E\u0637 \u0648 \u0686\u0647\u0627\u0631 \u0628\u0627\u063A \u0647\u062F\u0641", difficulty: "expert", rows: 6, cols: 6, source: { row: 2, col: 0 }, destination: { row: 0, col: 2 }, destinations: [{ row: 0, col: 2 }, { row: 0, col: 5 }, { row: 5, col: 0 }, { row: 5, col: 3 }], expectedMinMoves: 32, parTimeSec: 200, grid: [[t(), r(), c(270), t(), r(), c(270)], [r(), e(270, 90), u(0), e(0, 180), e(270, 90), a(90, 270)], [h(0), u(0), a(180, 0), u(0), a(180, 0), e(90, 270)], [e(270, 90), a(90, 270), t(), a(270, 90), o(0, 90), e(0, 180)], [a(270, 90), e(90, 270), t(), a(270, 90), o(0, 90), e(90, 270)], [c(90), t(), r(), c(90), t(), r()]] }, { id: 78, regionId: "razavi_khorasan", destinationId: "kashmar", titleFa: "\u067E\u0646\u062C\u200C\u062A\u0631\u0627\u0633 \u0622\u0628\u06CC\u0627\u0631\u06CC \u06A9\u0627\u0634\u0645\u0631", subtitleFa: "\u0627\u0631\u0633\u0627\u0644 \u0647\u0645\u200C\u0632\u0645\u0627\u0646 \u0622\u0628 \u0627\u0632 \u0686\u0634\u0645\u0647 \u0634\u0645\u0627\u0644\u06CC \u0628\u0647 \u067E\u0646\u062C \u0628\u0627\u063A\u0686\u0647 \u067E\u0644\u06A9\u0627\u0646\u06CC \u062F\u0631 \u062A\u062E\u062A\u0647 \u06F7\xD7\u06F7", difficulty: "expert", rows: 7, cols: 7, source: { row: 0, col: 3 }, destination: { row: 0, col: 0 }, destinations: [{ row: 0, col: 0 }, { row: 0, col: 6 }, { row: 3, col: 6 }, { row: 6, col: 0 }, { row: 6, col: 4 }], expectedMinMoves: 39, parTimeSec: 245, grid: [[c(270), t(), r(), h(90), r(), t(), c(270)], [e(180, 0), o(0, 90), a(0, 180), u(0), a(0, 180), o(0, 90), e(90, 270)], [e(270, 90), o(0, 90), e(90, 270), o(90, 0), e(180, 0), e(0, 180), t()], [o(90, 0), t(), e(270, 90), u(0), o(0, 90), u(0), c(0)], [a(270, 90), o(0, 90), a(180, 0), a(90, 270), t(), o(90, 0), t()], [o(90, 0), t(), r(), e(180, 0), a(0, 180), e(90, 270), t()], [c(90), r(), t(), r(), c(90), t(), r()]] }, { id: 79, regionId: "razavi_khorasan", destinationId: "torbat_heydarieh", titleFa: "\u0647\u0632\u0627\u0631\u062A\u0648\u06CC \u0641\u0644\u0627\u062A \u062A\u0631\u0628\u062A \u062D\u06CC\u062F\u0631\u06CC\u0647", subtitleFa: "\u0647\u0641\u062A \u062A\u0642\u0627\u0637\u0639 \u0686\u0647\u0627\u0631\u0631\u0627\u0647\u06CC \u062F\u0631 \u0634\u0628\u06A9\u0647 \u0645\u062A\u0642\u0627\u0631\u0646 \u062F\u0634\u062A \u0632\u0639\u0641\u0631\u0627\u0646 \u0628\u0627 \u067E\u0646\u062C \u0645\u0642\u0635\u062F \u0647\u0645\u200C\u0632\u0645\u0627\u0646", difficulty: "expert", rows: 7, cols: 7, source: { row: 3, col: 6 }, destination: { row: 0, col: 1 }, destinations: [{ row: 0, col: 1 }, { row: 0, col: 5 }, { row: 3, col: 0 }, { row: 6, col: 1 }, { row: 6, col: 5 }], expectedMinMoves: 44, parTimeSec: 255, grid: [[t(), c(270), t(), r(), t(), c(270), t()], [e(270, 90), u(0), o(0, 90), e(0, 180), e(270, 90), u(0), e(0, 180)], [e(180, 0), a(90, 270), t(), a(270, 90), e(90, 270), a(270, 90), e(90, 270)], [c(180), u(0), o(0, 90), u(0), o(0, 90), u(0), h(180)], [e(270, 90), a(90, 270), t(), a(270, 90), e(0, 180), a(270, 90), e(0, 180)], [e(180, 0), u(0), o(0, 90), e(90, 270), e(180, 0), u(0), e(90, 270)], [t(), c(90), t(), r(), t(), c(90), t()]] }, { id: 80, regionId: "razavi_khorasan", destinationId: "torbat_heydarieh", titleFa: "\u0642\u0644\u0628 \u0641\u06CC\u0631\u0648\u0632\u0647\u200C\u0627\u06CC \u0627\u06CC\u0631\u0627\u0646", subtitleFa: "\u0622\u0632\u0645\u0648\u0646 \u0628\u0632\u0631\u06AF \u0645\u0631\u062D\u0644\u0647 \u0647\u0634\u062A\u0627\u062F\u0645\u061B \u062A\u067E\u0634 \u0622\u0628 \u0627\u0632 \u0642\u0644\u0628 \u0634\u0628\u06A9\u0647 \u06F7\xD7\u06F7 \u0628\u0647 \u067E\u0646\u062C \u0645\u0642\u0635\u062F \u0633\u0631\u0632\u0645\u06CC\u0646", difficulty: "expert", rows: 7, cols: 7, source: { row: 3, col: 3 }, destination: { row: 0, col: 0 }, destinations: [{ row: 0, col: 0 }, { row: 0, col: 3 }, { row: 0, col: 6 }, { row: 6, col: 0 }, { row: 6, col: 6 }], expectedMinMoves: 36, parTimeSec: 260, grid: [[c(270), t(), r(), c(270), r(), t(), c(270)], [e(180, 0), o(0, 90), a(0, 180), u(0), a(0, 180), o(0, 90), e(90, 270)], [e(270, 90), o(0, 90), u(0), a(180, 0), u(0), o(0, 90), e(0, 180)], [o(90, 0), t(), o(90, 0), h(90), o(90, 0), t(), o(90, 0)], [a(270, 90), o(0, 90), u(0), u(0), u(0), o(0, 90), a(90, 270)], [o(90, 0), t(), e(180, 0), a(180, 0), e(90, 270), t(), o(90, 0)], [c(90), r(), t(), r(), t(), r(), c(90)]] }];
  var _t = [{ id: 57, regionId: "semnan", destinationId: "garmsar", titleFa: "\u0622\u0628\u06AF\u06CC\u0631 \u062F\u0634\u062A \u06AF\u0631\u0645\u0633\u0627\u0631", subtitleFa: "\u0647\u062F\u0627\u06CC\u062A \u062C\u0631\u06CC\u0627\u0646 \u0627\u0632 \u0634\u0645\u0627\u0644\u200C\u063A\u0631\u0628 \u062F\u0634\u062A \u06AF\u0631\u0645\u0633\u0627\u0631 \u0628\u0647 \u0633\u0647 \u06A9\u0627\u0646\u0627\u0644 \u062D\u0627\u0634\u06CC\u0647 \u06A9\u0648\u06CC\u0631", difficulty: "hard", rows: 5, cols: 6, source: { row: 0, col: 0 }, destination: { row: 0, col: 4 }, destinations: [{ row: 0, col: 4 }, { row: 2, col: 0 }, { row: 4, col: 5 }], expectedMinMoves: 26, parTimeSec: 165, grid: [[h(0), o(0, 90), e(0, 180), t(), c(270), r()], [t(), e(270, 90), u(0), o(0, 90), a(90, 270), t()], [c(180), a(90, 270), o(90, 0), t(), a(270, 90), e(0, 180)], [r(), e(180, 0), u(0), o(0, 90), a(90, 270), o(90, 0)], [t(), r(), e(180, 0), o(0, 90), e(90, 270), c(90)]] }, { id: 58, regionId: "semnan", destinationId: "garmsar", titleFa: "\u0627\u0646\u0634\u0639\u0627\u0628 \u062F\u0634\u062A \u06AF\u0631\u0645\u0633\u0627\u0631", subtitleFa: "\u062A\u0646\u0638\u06CC\u0645 \u062F\u0648 \u062A\u0642\u0627\u0637\u0639 \u0645\u06CC\u0627\u0646\u06CC \u0628\u0631\u0627\u06CC \u0627\u0646\u062A\u0642\u0627\u0644 \u0622\u0628 \u0627\u0632 \u0634\u0645\u0627\u0644\u200C\u0634\u0631\u0642 \u0628\u0647 \u062C\u0646\u0648\u0628 \u062F\u0634\u062A", difficulty: "hard", rows: 6, cols: 6, source: { row: 0, col: 5 }, destination: { row: 0, col: 3 }, destinations: [{ row: 0, col: 3 }, { row: 5, col: 0 }, { row: 5, col: 5 }], expectedMinMoves: 31, parTimeSec: 175, grid: [[t(), r(), t(), c(270), e(270, 90), h(180)], [e(270, 90), o(0, 90), o(0, 90), u(0), a(90, 270), t()], [o(90, 0), t(), e(270, 90), e(90, 270), a(270, 90), e(0, 180)], [a(270, 90), o(0, 90), u(0), o(0, 90), e(90, 270), o(90, 0)], [o(90, 0), t(), e(180, 0), o(0, 90), o(0, 90), a(90, 270)], [c(90), r(), t(), r(), t(), c(90)]] }, { id: 59, regionId: "semnan", destinationId: "semnan", titleFa: "\u0627\u0633\u062A\u062E\u0631\u0647\u0627\u06CC \u0622\u0628 \u0633\u0645\u0646\u0627\u0646", subtitleFa: "\u062A\u0642\u0633\u06CC\u0645 \u0647\u0645\u200C\u0632\u0645\u0627\u0646 \u0622\u0628 \u062F\u0631 \u0634\u0628\u06A9\u0647 \u0633\u062A\u0648\u0646\u06CC \u0641\u0634\u0631\u062F\u0647 \u0628\u0647 \u0686\u0647\u0627\u0631 \u06AF\u0648\u0634\u0647 \u0634\u0647\u0631", difficulty: "hard", rows: 6, cols: 5, source: { row: 2, col: 0 }, destination: { row: 0, col: 0 }, destinations: [{ row: 0, col: 0 }, { row: 0, col: 4 }, { row: 5, col: 0 }, { row: 5, col: 4 }], expectedMinMoves: 33, parTimeSec: 175, grid: [[c(270), t(), r(), t(), c(270)], [e(180, 0), o(0, 90), a(0, 180), o(0, 90), a(90, 270)], [h(0), a(0, 180), u(0), a(0, 180), e(90, 270)], [e(270, 90), a(90, 270), o(90, 0), a(270, 90), e(0, 180)], [a(270, 90), e(90, 270), e(180, 0), a(180, 0), a(90, 270)], [c(90), t(), r(), t(), c(90)]] }, { id: 60, regionId: "semnan", destinationId: "semnan", titleFa: "\u062F\u0627\u0644\u0627\u0646\u200C\u0647\u0627\u06CC \u0627\u0644\u0628\u0631\u0632 \u062C\u0646\u0648\u0628\u06CC \u0633\u0645\u0646\u0627\u0646", subtitleFa: "\u0648\u0631\u0648\u062F \u062C\u0631\u06CC\u0627\u0646 \u0627\u0632 \u0634\u0631\u0642 \u0648 \u0628\u0633\u062A\u0646 \u062F\u0648 \u062D\u0644\u0642\u0647 \u0645\u0648\u0627\u0632\u06CC \u0628\u0631\u0627\u06CC \u0686\u0647\u0627\u0631 \u0645\u0642\u0635\u062F \u067E\u06CC\u0631\u0627\u0645\u0648\u0646\u06CC", difficulty: "hard", rows: 6, cols: 6, source: { row: 3, col: 5 }, destination: { row: 0, col: 1 }, destinations: [{ row: 0, col: 1 }, { row: 0, col: 5 }, { row: 4, col: 0 }, { row: 5, col: 3 }], expectedMinMoves: 25, parTimeSec: 180, grid: [[t(), c(270), t(), r(), t(), c(270)], [e(270, 90), u(0), o(0, 90), e(0, 180), e(270, 90), e(90, 270)], [o(90, 0), o(90, 0), t(), a(270, 90), a(90, 270), t()], [e(180, 0), u(0), o(0, 90), u(0), a(180, 0), h(180)], [c(180), a(180, 0), o(0, 90), a(90, 270), t(), r()], [t(), r(), t(), c(90), r(), t()]] }, { id: 61, regionId: "semnan", destinationId: "damghan", titleFa: "\u0686\u0634\u0645\u0647\u200C\u0633\u0627\u0631 \u062F\u0627\u0645\u063A\u0627\u0646", subtitleFa: "\u0647\u062F\u0627\u06CC\u062A \u0622\u0628 \u0686\u0634\u0645\u0647\u200C\u0647\u0627\u06CC \u06A9\u0648\u0647\u067E\u0627\u06CC\u0647 \u0628\u0647 \u0628\u0627\u063A\u200C\u0647\u0627\u06CC \u067E\u0633\u062A\u0647 \u0648 \u062F\u0634\u062A \u062F\u0627\u0645\u063A\u0627\u0646", difficulty: "hard", rows: 6, cols: 6, source: { row: 0, col: 3 }, destination: { row: 0, col: 0 }, destinations: [{ row: 0, col: 0 }, { row: 2, col: 5 }, { row: 5, col: 2 }], expectedMinMoves: 28, parTimeSec: 180, grid: [[c(180), o(0, 90), e(0, 180), h(90), t(), r()], [e(270, 90), o(0, 90), u(0), a(180, 0), e(0, 180), t()], [o(90, 0), t(), o(90, 0), e(270, 90), u(0), c(0)], [e(180, 0), e(0, 180), a(270, 90), e(90, 270), o(90, 0), t()], [t(), e(180, 0), u(0), o(0, 90), e(90, 270), r()], [r(), t(), c(90), t(), r(), t()]] }, { id: 62, regionId: "semnan", destinationId: "damghan", titleFa: "\u0686\u0647\u0627\u0631\u0631\u0627\u0647 \u0622\u0628\u200C\u0627\u0646\u0628\u0627\u0631 \u062F\u0627\u0645\u063A\u0627\u0646", subtitleFa: "\u0639\u0628\u0648\u0631 \u062F\u0642\u06CC\u0642 \u0627\u0632 \u0633\u0647 \u062A\u0642\u0627\u0637\u0639 \u0647\u0645\u200C\u0632\u0645\u0627\u0646 \u062F\u0631 \u06AF\u0630\u0631\u06AF\u0627\u0647 \u062A\u0627\u0631\u06CC\u062E\u06CC \u062F\u0627\u0645\u063A\u0627\u0646", difficulty: "expert", rows: 6, cols: 6, source: { row: 3, col: 0 }, destination: { row: 0, col: 2 }, destinations: [{ row: 0, col: 2 }, { row: 1, col: 5 }, { row: 5, col: 0 }, { row: 5, col: 5 }], expectedMinMoves: 28, parTimeSec: 185, grid: [[t(), r(), c(270), t(), r(), t()], [e(270, 90), o(0, 90), u(0), o(0, 90), a(0, 180), c(0)], [e(180, 0), a(0, 180), e(90, 270), t(), a(270, 90), e(0, 180)], [h(0), u(0), o(0, 90), o(0, 90), u(0), a(90, 270)], [e(270, 90), e(90, 270), t(), t(), e(180, 0), a(90, 270)], [c(90), t(), r(), t(), r(), c(90)]] }, { id: 63, regionId: "semnan", destinationId: "shahroud", titleFa: "\u0622\u0628\u06AF\u06CC\u0631 \u06A9\u0648\u0647\u067E\u0627\u06CC\u0647 \u0634\u0627\u0647\u0631\u0648\u062F", subtitleFa: "\u0628\u0627\u0644\u0627 \u0622\u0648\u0631\u062F\u0646 \u062C\u0631\u06CC\u0627\u0646 \u0627\u0632 \u062C\u0646\u0648\u0628\u200C\u0634\u0631\u0642 \u0628\u0631\u0627\u06CC \u0633\u06CC\u0631\u0627\u0628\u200C\u0633\u0627\u0632\u06CC \u0686\u0647\u0627\u0631 \u0628\u062E\u0634 \u0634\u0627\u0647\u0631\u0648\u062F", difficulty: "expert", rows: 6, cols: 6, source: { row: 5, col: 4 }, destination: { row: 0, col: 0 }, destinations: [{ row: 0, col: 0 }, { row: 0, col: 4 }, { row: 3, col: 5 }, { row: 5, col: 1 }], expectedMinMoves: 30, parTimeSec: 190, grid: [[c(270), t(), r(), t(), c(270), r()], [e(180, 0), a(0, 180), o(0, 90), o(0, 90), a(90, 270), t()], [e(270, 90), u(0), e(0, 180), e(270, 90), a(90, 270), t()], [o(90, 0), o(90, 0), e(180, 0), e(90, 270), a(270, 90), c(0)], [e(180, 0), u(0), o(0, 90), o(0, 90), a(90, 270), t()], [t(), c(90), r(), t(), h(270), r()]] }, { id: 64, regionId: "semnan", destinationId: "shahroud", titleFa: "\u06AF\u0630\u0631\u06AF\u0627\u0647 \u0628\u0632\u0631\u06AF \u0634\u0627\u0647\u0631\u0648\u062F", subtitleFa: "\u0646\u062E\u0633\u062A\u06CC\u0646 \u062A\u062E\u062A\u0647 \u06F7\xD7\u06F7\u061B \u0631\u0633\u0627\u0646\u062F\u0646 \u0622\u0628 \u0627\u0632 \u0686\u0634\u0645\u0647 \u0645\u0631\u06A9\u0632\u06CC \u0628\u0647 \u0686\u0647\u0627\u0631\u06AF\u0648\u0634\u0647 \u062D\u0627\u0634\u06CC\u0647 \u06A9\u0648\u06CC\u0631", difficulty: "expert", rows: 7, cols: 7, source: { row: 3, col: 3 }, destination: { row: 0, col: 0 }, destinations: [{ row: 0, col: 0 }, { row: 0, col: 6 }, { row: 6, col: 0 }, { row: 6, col: 6 }], expectedMinMoves: 46, parTimeSec: 230, grid: [[c(180), o(0, 90), e(0, 180), t(), r(), t(), c(270)], [e(270, 90), o(0, 90), u(0), o(0, 90), o(0, 90), o(0, 90), a(90, 270)], [o(90, 0), t(), e(180, 0), a(0, 180), e(0, 180), t(), o(90, 0)], [a(270, 90), o(0, 90), e(0, 180), h(270), a(270, 90), o(0, 90), a(90, 270)], [o(90, 0), t(), e(180, 0), o(0, 90), a(90, 270), t(), o(90, 0)], [a(270, 90), o(0, 90), o(0, 90), o(0, 90), a(180, 0), o(0, 90), a(90, 270)], [c(90), t(), r(), t(), r(), t(), c(90)]] }];
  var Et = [{ id: 81, regionId: "shahsavan", destinationId: "parsabad", titleFa: "\u062F\u0634\u062A \u0642\u0634\u0644\u0627\u0642 \u067E\u0627\u0631\u0633\u200C\u0622\u0628\u0627\u062F", subtitleFa: "\u06AF\u0633\u062A\u0631\u0634 \u062C\u0631\u06CC\u0627\u0646 \u0622\u0628 \u062F\u0631 \u062F\u0634\u062A \u0647\u0645\u0648\u0627\u0631 \u0645\u063A\u0627\u0646 \u0645\u06CC\u0627\u0646 \u0633\u0647 \u0622\u0628\u06AF\u06CC\u0631 \u067E\u06CC\u0631\u0627\u0645\u0648\u0646\u06CC", difficulty: "challenging", rows: 5, cols: 6, source: { row: 2, col: 0 }, destination: { row: 0, col: 5 }, destinations: [{ row: 0, col: 5 }, { row: 3, col: 5 }, { row: 4, col: 4 }], expectedMinMoves: 30, parTimeSec: 155, grid: [[r(), e(270, 90), o(0, 90), e(0, 180), t(), c(270)], [t(), o(90, 0), t(), e(180, 0), o(0, 90), a(90, 270)], [h(0), u(0), o(0, 90), a(0, 180), o(0, 90), e(90, 270)], [e(270, 90), e(90, 270), t(), a(270, 90), o(0, 90), c(0)], [e(180, 0), o(0, 90), o(0, 90), a(180, 0), c(0), t()]] }, { id: 82, regionId: "shahsavan", destinationId: "parsabad", titleFa: "\u0622\u0628\u0631\u0627\u0647\u200C\u0647\u0627\u06CC \u0627\u0631\u0633 \u0648 \u0645\u063A\u0627\u0646", subtitleFa: "\u062A\u0646\u0638\u06CC\u0645 \u06AF\u0630\u0631\u06AF\u0627\u0647\u200C\u0647\u0627\u06CC \u0634\u0645\u0627\u0644\u06CC \u0628\u0647 \u062C\u0646\u0648\u0628\u06CC \u0628\u0631\u0627\u06CC \u0633\u06CC\u0631\u0627\u0628 \u06A9\u0631\u062F\u0646 \u0633\u0647 \u0628\u062E\u0634 \u062F\u0634\u062A", difficulty: "hard", rows: 6, cols: 5, source: { row: 0, col: 2 }, destination: { row: 2, col: 4 }, destinations: [{ row: 2, col: 4 }, { row: 5, col: 0 }, { row: 5, col: 1 }], expectedMinMoves: 25, parTimeSec: 165, grid: [[t(), r(), h(90), r(), t()], [e(270, 90), o(0, 90), u(0), e(0, 180), t()], [o(90, 0), t(), o(90, 0), a(270, 90), c(0)], [a(270, 90), o(0, 90), u(0), a(90, 270), t()], [o(90, 0), t(), o(90, 0), e(180, 0), e(0, 180)], [c(90), c(180), a(180, 0), o(0, 90), e(90, 270)]] }, { id: 83, regionId: "shahsavan", destinationId: "bileh_savar", titleFa: "\u06AF\u0630\u0631\u06AF\u0627\u0647 \u0686\u0645\u0646\u0632\u0627\u0631 \u0628\u06CC\u0644\u0647\u200C\u0633\u0648\u0627\u0631", subtitleFa: "\u0647\u062F\u0627\u06CC\u062A \u062C\u0631\u06CC\u0627\u0646 \u0627\u0632 \u0634\u0645\u0627\u0644\u200C\u063A\u0631\u0628 \u062F\u0634\u062A \u0645\u06CC\u0627\u0646 \u0633\u0646\u06AF\u0644\u0627\u062E\u200C\u0647\u0627 \u0628\u0647 \u0633\u0647 \u0622\u0628\u0634\u062E\u0648\u0631 \u0641\u0635\u0644\u06CC", difficulty: "hard", rows: 6, cols: 6, source: { row: 0, col: 0 }, destination: { row: 0, col: 5 }, destinations: [{ row: 0, col: 5 }, { row: 3, col: 5 }, { row: 5, col: 1 }], expectedMinMoves: 29, parTimeSec: 175, grid: [[h(0), o(0, 90), a(0, 180), o(0, 90), o(0, 90), c(0)], [t(), r(), o(90, 0), t(), e(270, 90), e(0, 180)], [e(270, 90), o(0, 90), u(0), o(0, 90), a(90, 270), o(90, 0)], [o(90, 0), t(), o(90, 0), t(), o(90, 0), c(90)], [e(180, 0), a(0, 180), a(180, 0), o(0, 90), e(90, 270), t()], [t(), c(90), r(), t(), r(), t()]] }, { id: 84, regionId: "shahsavan", destinationId: "bileh_savar", titleFa: "\u0686\u0647\u0627\u0631\u0622\u0628\u062E\u0648\u0631 \u062F\u0634\u062A \u0628\u06CC\u0644\u0647\u200C\u0633\u0648\u0627\u0631", subtitleFa: "\u062A\u0642\u0633\u06CC\u0645 \u0647\u0645\u200C\u0632\u0645\u0627\u0646 \u0622\u0628 \u0627\u0632 \u0686\u0634\u0645\u0647 \u0634\u0631\u0642\u06CC \u0645\u06CC\u0627\u0646 \u0686\u0647\u0627\u0631 \u0627\u06CC\u0633\u062A\u06AF\u0627\u0647 \u062F\u0634\u062A", difficulty: "hard", rows: 6, cols: 6, source: { row: 2, col: 5 }, destination: { row: 0, col: 1 }, destinations: [{ row: 0, col: 1 }, { row: 0, col: 4 }, { row: 5, col: 0 }, { row: 5, col: 4 }], expectedMinMoves: 25, parTimeSec: 185, grid: [[t(), c(270), r(), t(), c(270), t()], [e(270, 90), u(0), o(0, 90), o(0, 90), a(90, 270), t()], [o(90, 0), e(180, 0), e(0, 180), t(), a(270, 90), h(180)], [a(270, 90), o(0, 90), u(0), o(0, 90), a(90, 270), r()], [o(90, 0), t(), e(180, 0), o(0, 90), a(90, 270), r()], [c(90), t(), r(), t(), c(90), t()]] }, { id: 85, regionId: "shahsavan", destinationId: "germi", titleFa: "\u062F\u0631\u0647\u200C\u0647\u0627\u06CC \u06A9\u0648\u0647\u067E\u0627\u06CC\u0647 \u06AF\u0631\u0645\u06CC", subtitleFa: "\u0635\u0639\u0648\u062F \u0645\u0633\u06CC\u0631\u0647\u0627\u06CC \u0622\u0628 \u0627\u0632 \u062C\u0646\u0648\u0628 \u0628\u0647 \u0634\u0645\u0627\u0644 \u062F\u0631 \u062F\u0631\u0647\u200C\u0647\u0627\u06CC \u067E\u0644\u06A9\u0627\u0646\u06CC \u06AF\u0631\u0645\u06CC", difficulty: "hard", rows: 6, cols: 6, source: { row: 5, col: 3 }, destination: { row: 0, col: 0 }, destinations: [{ row: 0, col: 0 }, { row: 0, col: 5 }, { row: 3, col: 0 }, { row: 3, col: 5 }], expectedMinMoves: 26, parTimeSec: 185, grid: [[c(270), t(), r(), t(), r(), c(270)], [a(270, 90), o(0, 90), e(0, 180), e(270, 90), o(0, 90), a(90, 270)], [o(90, 0), t(), e(180, 0), u(0), e(0, 180), o(90, 0)], [c(90), e(270, 90), o(0, 90), u(0), a(90, 270), c(90)], [r(), e(180, 0), o(0, 90), u(0), e(90, 270), t()], [t(), r(), t(), h(270), t(), r()]] }, { id: 86, regionId: "shahsavan", destinationId: "germi", titleFa: "\u0646\u0647\u0631\u0647\u0627\u06CC \u067E\u06CC\u0686\u200C\u062F\u0631\u067E\u06CC\u0686 \u06AF\u0631\u0645\u06CC", subtitleFa: "\u062A\u062E\u062A\u0647 \u0645\u0633\u062A\u0637\u06CC\u0644\u06CC \u06F6\xD7\u06F7 \u0628\u0627 \u0627\u0646\u0634\u0639\u0627\u0628\u200C\u0647\u0627\u06CC \u0637\u0648\u0644\u0627\u0646\u06CC \u062F\u0631 \u062A\u0646\u06AF\u0647 \u06A9\u0648\u0647\u067E\u0627\u06CC\u0647\u200C\u0627\u06CC", difficulty: "hard", rows: 6, cols: 7, source: { row: 2, col: 0 }, destination: { row: 0, col: 2 }, destinations: [{ row: 0, col: 2 }, { row: 0, col: 6 }, { row: 5, col: 1 }, { row: 5, col: 5 }], expectedMinMoves: 35, parTimeSec: 205, grid: [[t(), r(), c(270), t(), r(), t(), c(270)], [r(), e(270, 90), u(0), o(0, 90), e(0, 180), e(270, 90), a(90, 270)], [h(0), a(90, 270), o(90, 0), t(), e(180, 0), u(0), e(90, 270)], [e(270, 90), u(0), a(90, 270), r(), t(), o(90, 0), t()], [e(180, 0), u(0), e(90, 270), e(270, 90), a(0, 180), a(90, 270), r()], [t(), c(90), t(), e(180, 0), e(90, 270), c(90), t()]] }, { id: 87, regionId: "shahsavan", destinationId: "meshgin_shahr", titleFa: "\u0686\u0634\u0645\u0647\u200C\u0647\u0627\u06CC \u062F\u0627\u0645\u0646\u0647 \u0645\u0634\u06AF\u06CC\u0646\u200C\u0634\u0647\u0631", subtitleFa: "\u0634\u0628\u06A9\u0647 \u067E\u0631\u062A\u0631\u0627\u06A9\u0645 \u0628\u0627 \u0646\u0642\u0634\u200C\u0645\u0627\u06CC\u0647 \u0647\u0646\u062F\u0633\u06CC \u0648\u0631\u0646\u06CC \u062F\u0631 \u062F\u0627\u0645\u0646\u0647\u200C\u0647\u0627\u06CC \u0634\u0645\u0627\u0644\u06CC \u0633\u0628\u0644\u0627\u0646", difficulty: "expert", rows: 6, cols: 6, source: { row: 1, col: 0 }, destination: { row: 0, col: 3 }, destinations: [{ row: 0, col: 3 }, { row: 2, col: 5 }, { row: 5, col: 0 }, { row: 5, col: 4 }], expectedMinMoves: 31, parTimeSec: 195, grid: [[t(), r(), t(), c(270), t(), r()], [h(0), a(0, 180), o(0, 90), u(0), e(0, 180), t()], [e(270, 90), a(90, 270), t(), o(90, 0), a(270, 90), c(0)], [o(90, 0), e(180, 0), o(0, 90), u(0), a(90, 270), t()], [a(270, 90), o(0, 90), e(0, 180), a(270, 90), a(90, 270), r()], [c(90), t(), e(180, 0), e(90, 270), c(90), t()]] }, { id: 88, regionId: "shahsavan", destinationId: "meshgin_shahr", titleFa: "\u062A\u0646\u06AF\u0647 \u0645\u0631\u062A\u0641\u0639 \u0645\u0634\u06AF\u06CC\u0646\u200C\u0634\u0647\u0631", subtitleFa: "\u06AF\u0630\u0631\u06AF\u0627\u0647 \u0639\u0645\u0648\u062F\u06CC \u06F7\xD7\u06F6 \u062F\u0631 \u0634\u06CC\u0628 \u062F\u0631\u0647\u200C\u0647\u0627\u06CC \u0645\u0631\u062A\u0641\u0639 \u0628\u0627 \u0686\u0647\u0627\u0631 \u0645\u0642\u0635\u062F \u0647\u0645\u200C\u0632\u0645\u0627\u0646", difficulty: "expert", rows: 7, cols: 6, source: { row: 0, col: 2 }, destination: { row: 2, col: 5 }, destinations: [{ row: 2, col: 5 }, { row: 4, col: 0 }, { row: 6, col: 1 }, { row: 6, col: 5 }], expectedMinMoves: 34, parTimeSec: 215, grid: [[t(), r(), h(90), r(), t(), r()], [e(270, 90), o(0, 90), u(0), o(0, 90), e(0, 180), t()], [o(90, 0), t(), o(90, 0), t(), a(270, 90), c(0)], [e(180, 0), a(0, 180), u(0), o(0, 90), u(0), e(0, 180)], [c(180), a(90, 270), o(90, 0), t(), o(90, 0), o(90, 0)], [r(), a(270, 90), e(90, 270), e(270, 90), u(0), a(90, 270)], [t(), c(90), t(), e(180, 0), e(90, 270), c(90)]] }, { id: 89, regionId: "shahsavan", destinationId: "ardabil_sabalan", titleFa: "\u06CC\u06CC\u0644\u0627\u0642 \u0622\u0644\u0627\u0686\u06CC\u0642\u200C\u0647\u0627\u06CC \u0633\u0628\u0644\u0627\u0646", subtitleFa: "\u0634\u0628\u06A9\u0647 \u06F7\xD7\u06F7 \u0627\u0644\u0647\u0627\u0645\u200C\u06AF\u0631\u0641\u062A\u0647 \u0627\u0632 \u0647\u0646\u062F\u0633\u0647 \u0648\u0631\u0646\u06CC \u0628\u0631\u0627\u06CC \u0622\u0628\u0631\u0633\u0627\u0646\u06CC \u0686\u0647\u0627\u0631 \u06CC\u06CC\u0644\u0627\u0642 \u062F\u0627\u0645\u0646\u0647 \u0633\u0628\u0644\u0627\u0646", difficulty: "expert", rows: 7, cols: 7, source: { row: 0, col: 3 }, destination: { row: 0, col: 1 }, destinations: [{ row: 0, col: 1 }, { row: 0, col: 5 }, { row: 6, col: 1 }, { row: 6, col: 5 }], expectedMinMoves: 41, parTimeSec: 235, grid: [[t(), c(270), t(), h(90), t(), c(270), t()], [e(270, 90), u(0), o(0, 90), u(0), o(0, 90), u(0), e(0, 180)], [o(90, 0), e(180, 0), e(0, 180), o(90, 0), e(270, 90), e(90, 270), o(90, 0)], [a(270, 90), o(0, 90), u(0), a(180, 0), u(0), o(0, 90), a(90, 270)], [o(90, 0), t(), o(90, 0), t(), o(90, 0), t(), o(90, 0)], [e(180, 0), a(0, 180), e(90, 270), r(), e(180, 0), a(0, 180), e(90, 270)], [t(), c(90), t(), r(), t(), c(90), t()]] }, { id: 90, regionId: "shahsavan", destinationId: "ardabil_sabalan", titleFa: "\u0634\u06A9\u0648\u0647 \u062F\u0627\u0645\u0646\u0647 \u0633\u0628\u0644\u0627\u0646", subtitleFa: "\u0622\u0632\u0645\u0648\u0646 \u067E\u0627\u06CC\u0627\u0646\u06CC \u0631\u0627\u0647 \u06A9\u0648\u0686 \u0634\u0627\u0647\u0633\u0648\u0646\u061B \u062A\u0642\u0633\u06CC\u0645 \u0622\u0628 \u06A9\u0648\u0647\u0633\u062A\u0627\u0646 \u0645\u06CC\u0627\u0646 \u067E\u0646\u062C \u06CC\u06CC\u0644\u0627\u0642 \u067E\u06CC\u0631\u0627\u0645\u0648\u0646 \u0633\u0628\u0644\u0627\u0646", difficulty: "expert", rows: 7, cols: 7, source: { row: 6, col: 3 }, destination: { row: 0, col: 0 }, destinations: [{ row: 0, col: 0 }, { row: 0, col: 3 }, { row: 0, col: 6 }, { row: 3, col: 0 }, { row: 3, col: 6 }], expectedMinMoves: 31, parTimeSec: 250, grid: [[c(270), t(), r(), c(270), r(), t(), c(270)], [a(270, 90), o(0, 90), a(0, 180), u(0), a(0, 180), o(0, 90), a(90, 270)], [o(90, 0), t(), e(180, 0), u(0), e(90, 270), t(), o(90, 0)], [c(90), e(270, 90), o(0, 90), u(0), o(0, 90), e(0, 180), c(90)], [r(), o(90, 0), t(), o(90, 0), t(), o(90, 0), r()], [t(), e(180, 0), o(0, 90), u(0), o(0, 90), e(90, 270), t()], [r(), t(), r(), h(270), r(), t(), r()]] }];
  var St = [{ id: 91, regionId: "turkmen_sahra", destinationId: "gonbad_kavus", titleFa: "\u062F\u0634\u062A \u067E\u0647\u0646\u0627\u0648\u0631 \u06AF\u0646\u0628\u062F \u06A9\u0627\u0648\u0648\u0633", subtitleFa: "\u0622\u063A\u0627\u0632 \u0631\u0627\u0647 \u062A\u0631\u06A9\u0645\u0646\u200C\u0635\u062D\u0631\u0627 \u0628\u0627 \u062A\u0642\u0627\u0631\u0646 \u0647\u0646\u062F\u0633\u06CC \u0648 \u0633\u0647 \u0645\u0642\u0635\u062F \u062F\u0631 \u067E\u0647\u0646\u0647 \u062F\u0634\u062A", difficulty: "hard", rows: 6, cols: 5, source: { row: 5, col: 2 }, destination: { row: 0, col: 0 }, destinations: [{ row: 0, col: 0 }, { row: 0, col: 4 }, { row: 3, col: 4 }], expectedMinMoves: 23, parTimeSec: 165, grid: [[c(270), t(), r(), t(), c(270)], [a(270, 90), o(0, 90), e(0, 180), e(270, 90), a(90, 270)], [o(90, 0), t(), e(180, 0), u(0), e(90, 270)], [e(180, 0), o(0, 90), a(0, 180), u(0), c(0)], [t(), r(), a(270, 90), e(90, 270), t()], [r(), t(), h(270), r(), t()]] }, { id: 92, regionId: "turkmen_sahra", destinationId: "gonbad_kavus", titleFa: "\u06AF\u0630\u0631\u06AF\u0627\u0647 \u06AF\u0631\u06AF\u0627\u0646\u200C\u0631\u0648\u062F \u062F\u0631 \u06AF\u0646\u0628\u062F", subtitleFa: "\u0627\u0646\u0634\u0639\u0627\u0628\u200C\u0647\u0627\u06CC \u0631\u0648\u062F\u062E\u0627\u0646\u0647\u200C\u0627\u06CC \u062F\u0631 \u062F\u0634\u062A \u06AF\u0646\u0628\u062F \u06A9\u0627\u0648\u0648\u0633 \u0628\u0631\u0627\u06CC \u0633\u06CC\u0631\u0627\u0628 \u06A9\u0631\u062F\u0646 \u0686\u0647\u0627\u0631 \u0627\u06CC\u0633\u062A\u06AF\u0627\u0647", difficulty: "hard", rows: 6, cols: 6, source: { row: 0, col: 4 }, destination: { row: 0, col: 0 }, destinations: [{ row: 0, col: 0 }, { row: 4, col: 5 }, { row: 5, col: 0 }, { row: 5, col: 3 }], expectedMinMoves: 31, parTimeSec: 185, grid: [[c(270), t(), r(), t(), h(90), t()], [a(270, 90), o(0, 90), e(0, 180), e(270, 90), a(180, 0), e(0, 180)], [o(90, 0), t(), o(90, 0), o(90, 0), t(), o(90, 0)], [e(180, 0), o(0, 90), u(0), a(90, 270), e(270, 90), a(90, 270)], [e(270, 90), o(0, 90), a(180, 0), u(0), e(90, 270), c(90)], [c(90), t(), r(), c(90), t(), r()]] }, { id: 93, regionId: "turkmen_sahra", destinationId: "aq_qala", titleFa: "\u067E\u0644 \u0648 \u0622\u0628\u0631\u0627\u0647\u0647 \u0622\u0642\u200C\u0642\u0644\u0627", subtitleFa: "\u0639\u0628\u0648\u0631 \u062C\u0631\u06CC\u0627\u0646 \u0627\u0635\u0644\u06CC \u0627\u0632 \u0645\u062D\u0648\u0631 \u0634\u0631\u0642\u06CC\u200C\u063A\u0631\u0628\u06CC \u0648 \u062A\u0648\u0632\u06CC\u0639 \u0622\u0628 \u0645\u06CC\u0627\u0646 \u062F\u0648 \u06A9\u0631\u0627\u0646\u0647 \u06AF\u0631\u06AF\u0627\u0646\u200C\u0631\u0648\u062F", difficulty: "hard", rows: 6, cols: 6, source: { row: 3, col: 5 }, destination: { row: 0, col: 1 }, destinations: [{ row: 0, col: 1 }, { row: 0, col: 5 }, { row: 5, col: 1 }, { row: 5, col: 5 }], expectedMinMoves: 32, parTimeSec: 190, grid: [[t(), c(270), r(), t(), r(), c(270)], [e(270, 90), u(0), o(0, 90), e(0, 180), e(270, 90), a(90, 270)], [o(90, 0), o(90, 0), t(), e(180, 0), u(0), e(90, 270)], [e(180, 0), u(0), o(0, 90), o(0, 90), u(0), h(180)], [r(), a(270, 90), e(0, 180), t(), a(270, 90), e(0, 180)], [t(), c(90), e(180, 0), o(0, 90), e(90, 270), c(90)]] }, { id: 94, regionId: "turkmen_sahra", destinationId: "aq_qala", titleFa: "\u0628\u0646\u062F\u0647\u0627\u06CC \u062F\u0634\u062A \u0622\u0642\u200C\u0642\u0644\u0627", subtitleFa: "\u062A\u062E\u062A\u0647 \u06AF\u0633\u062A\u0631\u062F\u0647 \u06F6\xD7\u06F7 \u0628\u0627 \u062F\u0648 \u062D\u0644\u0642\u0647 \u0628\u0633\u062A\u0647 \u0648 \u0686\u0647\u0627\u0631 \u0645\u0642\u0635\u062F \u062F\u0631 \u062D\u0627\u0634\u06CC\u0647 \u06AF\u0631\u06AF\u0627\u0646\u200C\u0631\u0648\u062F", difficulty: "expert", rows: 6, cols: 7, source: { row: 0, col: 3 }, destination: { row: 0, col: 0 }, destinations: [{ row: 0, col: 0 }, { row: 0, col: 6 }, { row: 5, col: 2 }, { row: 5, col: 6 }], expectedMinMoves: 29, parTimeSec: 210, grid: [[c(270), t(), r(), h(90), r(), t(), c(270)], [a(270, 90), o(0, 90), a(0, 180), u(0), a(0, 180), o(0, 90), a(90, 270)], [o(90, 0), t(), o(90, 0), o(90, 0), o(90, 0), t(), o(90, 0)], [e(180, 0), o(0, 90), u(0), a(180, 0), u(0), o(0, 90), a(90, 270)], [r(), t(), o(90, 0), t(), e(180, 0), o(0, 90), a(90, 270)], [t(), r(), c(90), t(), r(), t(), c(90)]] }, { id: 95, regionId: "turkmen_sahra", destinationId: "bandar_torkaman", titleFa: "\u06A9\u0631\u0627\u0646\u0647 \u062E\u0644\u06CC\u062C \u0628\u0646\u062F\u0631 \u062A\u0631\u06A9\u0645\u0646", subtitleFa: "\u06AF\u0633\u062A\u0631\u0634 \u0622\u0628\u0631\u0627\u0647\u0647 \u0627\u0632 \u0634\u0631\u0642 \u062F\u0634\u062A \u0628\u0647 \u0633\u0648\u06CC \u0686\u0647\u0627\u0631 \u0628\u0646\u062F\u0631\u06AF\u0627\u0647 \u0648 \u0622\u0628\u06AF\u06CC\u0631 \u0633\u0627\u062D\u0644\u06CC \u063A\u0631\u0628", difficulty: "expert", rows: 6, cols: 6, source: { row: 2, col: 5 }, destination: { row: 0, col: 0 }, destinations: [{ row: 0, col: 0 }, { row: 2, col: 0 }, { row: 5, col: 0 }, { row: 5, col: 4 }], expectedMinMoves: 27, parTimeSec: 195, grid: [[c(180), o(0, 90), a(0, 180), o(0, 90), e(0, 180), t()], [t(), r(), o(90, 0), t(), o(90, 0), r()], [c(180), o(0, 90), u(0), o(0, 90), u(0), h(180)], [t(), e(270, 90), a(90, 270), t(), o(90, 0), t()], [e(270, 90), a(180, 0), e(90, 270), e(270, 90), e(90, 270), r()], [c(90), t(), r(), e(180, 0), c(0), t()]] }, { id: 96, regionId: "turkmen_sahra", destinationId: "bandar_torkaman", titleFa: "\u067E\u0647\u0646\u0647 \u0633\u0627\u062D\u0644\u06CC \u0628\u0646\u062F\u0631 \u062A\u0631\u06A9\u0645\u0646", subtitleFa: "\u0634\u0628\u06A9\u0647 \u06F7\xD7\u06F6 \u0633\u0627\u062D\u0644\u06CC \u0628\u0627 \u0645\u0633\u06CC\u0631\u0647\u0627\u06CC \u0627\u0646\u062D\u0631\u0627\u0641\u06CC \u0648 \u0686\u0647\u0627\u0631 \u0645\u0642\u0635\u062F \u062F\u0631 \u0627\u0645\u062A\u062F\u0627\u062F \u06A9\u0631\u0627\u0646\u0647", difficulty: "expert", rows: 7, cols: 6, source: { row: 3, col: 5 }, destination: { row: 0, col: 1 }, destinations: [{ row: 0, col: 1 }, { row: 0, col: 4 }, { row: 6, col: 0 }, { row: 6, col: 4 }], expectedMinMoves: 34, parTimeSec: 220, grid: [[t(), c(270), t(), r(), c(270), t()], [e(270, 90), u(0), o(0, 90), e(0, 180), o(90, 0), t()], [o(90, 0), o(90, 0), t(), e(180, 0), e(90, 270), r()], [e(180, 0), u(0), o(0, 90), e(0, 180), t(), h(90)], [e(270, 90), a(90, 270), t(), e(180, 0), a(0, 180), e(90, 270)], [o(90, 0), e(180, 0), o(0, 90), o(0, 90), a(90, 270), t()], [c(90), t(), r(), t(), c(90), r()]] }, { id: 97, regionId: "turkmen_sahra", destinationId: "gomishan", titleFa: "\u062A\u0627\u0644\u0627\u0628 \u0648 \u062F\u0634\u062A \u06AF\u0645\u06CC\u0634\u0627\u0646", subtitleFa: "\u06AF\u0630\u0631 \u0627\u0632 \u0645\u06CC\u0627\u0646 \u062C\u0632\u06CC\u0631\u0647\u200C\u0647\u0627\u06CC \u062A\u0627\u0644\u0627\u0628\u06CC \u06F7\xD7\u06F7 \u0628\u0631\u0627\u06CC \u0627\u062A\u0635\u0627\u0644 \u0686\u0647\u0627\u0631 \u0633\u06A9\u0648\u0646\u062A\u06AF\u0627\u0647 \u067E\u06CC\u0631\u0627\u0645\u0648\u0646\u06CC", difficulty: "expert", rows: 7, cols: 7, source: { row: 3, col: 0 }, destination: { row: 0, col: 2 }, destinations: [{ row: 0, col: 2 }, { row: 0, col: 6 }, { row: 6, col: 2 }, { row: 6, col: 6 }], expectedMinMoves: 39, parTimeSec: 240, grid: [[t(), r(), c(270), t(), r(), t(), c(270)], [r(), r(), a(270, 90), o(0, 90), e(0, 180), e(270, 90), a(90, 270)], [t(), t(), o(90, 0), t(), e(180, 0), u(0), e(90, 270)], [h(0), a(0, 180), u(0), o(0, 90), o(0, 90), a(90, 270), t()], [e(270, 90), e(90, 270), o(90, 0), t(), e(270, 90), u(0), e(0, 180)], [e(180, 0), o(0, 90), u(0), o(0, 90), e(90, 270), e(180, 0), a(90, 270)], [t(), r(), c(90), t(), r(), t(), c(90)]] }, { id: 98, regionId: "turkmen_sahra", destinationId: "gomishan", titleFa: "\u0622\u0628\u0631\u0627\u0647\u200C\u0647\u0627\u06CC \u06AF\u0645\u06CC\u0634\u200C\u062A\u067E\u0647", subtitleFa: "\u0634\u0628\u06A9\u0647 \u06F7\xD7\u06F7 \u0628\u0627 \u067E\u0646\u062C \u0645\u0642\u0635\u062F \u0647\u0645\u200C\u0632\u0645\u0627\u0646 \u062F\u0631 \u062D\u0627\u0634\u06CC\u0647 \u062F\u0634\u062A \u0648 \u06A9\u0631\u0627\u0646\u0647 \u06AF\u0645\u06CC\u0634\u200C\u062A\u067E\u0647", difficulty: "expert", rows: 7, cols: 7, source: { row: 0, col: 3 }, destination: { row: 0, col: 0 }, destinations: [{ row: 0, col: 0 }, { row: 0, col: 6 }, { row: 3, col: 0 }, { row: 6, col: 1 }, { row: 6, col: 5 }], expectedMinMoves: 38, parTimeSec: 245, grid: [[c(270), t(), r(), h(90), r(), t(), c(270)], [a(270, 90), o(0, 90), a(0, 180), u(0), a(0, 180), o(0, 90), a(90, 270)], [o(90, 0), t(), o(90, 0), o(90, 0), o(90, 0), t(), o(90, 0)], [c(90), e(270, 90), a(180, 0), u(0), a(180, 0), o(0, 90), e(90, 270)], [r(), o(90, 0), t(), o(90, 0), t(), e(270, 90), e(0, 180)], [t(), a(270, 90), o(0, 90), a(180, 0), o(0, 90), u(0), e(90, 270)], [r(), c(90), t(), r(), t(), c(90), r()]] }, { id: 99, regionId: "turkmen_sahra", destinationId: "maraveh_tappeh", titleFa: "\u062A\u067E\u0647\u200C\u0645\u0627\u0647\u0648\u0631\u0647\u0627\u06CC \u0645\u0631\u0627\u0648\u0647\u200C\u062A\u067E\u0647", subtitleFa: "\u0647\u062F\u0627\u06CC\u062A \u0622\u0628 \u0627\u0632 \u062D\u0648\u0636\u0647 \u063A\u0631\u0628\u06CC \u0627\u062A\u0631\u06A9 \u062F\u0631 \u0634\u0628\u06A9\u0647 \u067E\u0631\u0634\u0627\u062E\u0647 \u06F7\xD7\u06F7 \u0628\u0647 \u067E\u0646\u062C \u0645\u0642\u0635\u062F \u06A9\u0648\u0647\u067E\u0627\u06CC\u0647\u200C\u0627\u06CC", difficulty: "expert", rows: 7, cols: 7, source: { row: 3, col: 0 }, destination: { row: 0, col: 1 }, destinations: [{ row: 0, col: 1 }, { row: 0, col: 5 }, { row: 3, col: 6 }, { row: 6, col: 1 }, { row: 6, col: 5 }], expectedMinMoves: 29, parTimeSec: 255, grid: [[t(), c(270), t(), r(), t(), c(270), t()], [r(), a(270, 90), o(0, 90), e(0, 180), e(270, 90), e(90, 270), r()], [t(), o(90, 0), t(), o(90, 0), o(90, 0), t(), t()], [h(0), u(0), o(0, 90), u(0), u(0), o(0, 90), c(0)], [e(270, 90), a(90, 270), t(), o(90, 0), o(90, 0), t(), r()], [e(180, 0), u(0), o(0, 90), e(90, 270), e(180, 0), e(0, 180), r()], [t(), c(90), t(), r(), t(), c(90), t()]] }, { id: 100, regionId: "turkmen_sahra", destinationId: "maraveh_tappeh", titleFa: "\u0646\u0628\u0636 \u0635\u062F\u06AF\u0627\u0646\u0647 \u0622\u0628 \u0627\u06CC\u0631\u0627\u0646", subtitleFa: "\u0622\u0632\u0645\u0648\u0646 \u0634\u06A9\u0648\u0647\u0645\u0646\u062F \u0645\u0631\u062D\u0644\u0647 \u0635\u062F\u0645\u061B \u0647\u0646\u062F\u0633\u0647 \u0645\u062A\u0642\u0627\u0631\u0646 \u062A\u0631\u06A9\u0645\u0646\u200C\u0635\u062D\u0631\u0627 \u0628\u0627 \u067E\u0646\u062C \u0645\u0642\u0635\u062F \u0627\u0632 \u06CC\u06A9 \u0633\u0631\u0686\u0634\u0645\u0647 \u0645\u0631\u06A9\u0632\u06CC", difficulty: "expert", rows: 7, cols: 7, source: { row: 3, col: 2 }, destination: { row: 0, col: 0 }, destinations: [{ row: 0, col: 0 }, { row: 0, col: 6 }, { row: 3, col: 6 }, { row: 6, col: 0 }, { row: 6, col: 6 }], expectedMinMoves: 45, parTimeSec: 265, grid: [[c(270), t(), r(), t(), r(), t(), c(270)], [a(270, 90), o(0, 90), e(0, 180), e(270, 90), o(0, 90), a(0, 180), a(90, 270)], [o(90, 0), t(), e(180, 0), a(90, 270), t(), a(270, 90), e(90, 270)], [e(180, 0), e(0, 180), h(0), u(0), o(0, 90), u(0), c(0)], [t(), o(90, 0), e(270, 90), a(90, 270), t(), o(90, 0), r()], [e(270, 90), a(180, 0), e(90, 270), e(180, 0), o(0, 90), a(180, 0), e(0, 180)], [c(90), t(), r(), t(), r(), t(), c(90)]] }];
  var Tt = [{ id: 1, regionId: "yazd", destinationId: "yazd", titleFa: "\u0686\u0634\u0645\u0647 \u0646\u062E\u0633\u062A", subtitleFa: "\u0627\u062A\u0635\u0627\u0644 \u0645\u0633\u062A\u0642\u06CC\u0645 \u0633\u0631\u0686\u0634\u0645\u0647 \u0628\u0647 \u0645\u0638\u0647\u0631 \u0642\u0646\u0627\u062A", difficulty: "easy", rows: 4, cols: 4, source: { row: 0, col: 0 }, destination: { row: 3, col: 3 }, destinations: [{ row: 3, col: 3 }], expectedMinMoves: 6, parTimeSec: 35, grid: [[h(0), o(0, 90), e(0, 180), r()], [r(), t(), o(90, 0), r()], [r(), t(), e(270, 0), e(90, 180)], [t(), r(), r(), c(90)]] }, { id: 2, regionId: "yazd", destinationId: "yazd", titleFa: "\u06A9\u0648\u0686\u0647 \u062E\u0634\u062A\u06CC", subtitleFa: "\u0639\u0628\u0648\u0631 \u0622\u0628 \u0627\u0632 \u067E\u06CC\u0686\u200C\u0648\u062E\u0645 \u0633\u0646\u06AF\u200C\u0647\u0627\u06CC \u06A9\u0648\u06CC\u0631", difficulty: "easy", rows: 4, cols: 4, source: { row: 0, col: 0 }, destination: { row: 3, col: 1 }, destinations: [{ row: 3, col: 1 }], expectedMinMoves: 11, parTimeSec: 50, grid: [[h(90), t(), e(0, 90), e(90, 180)], [e(180, 0), o(0, 90), e(90, 270), o(90, 0)], [t(), t(), e(0, 90), e(180, 270)], [r(), c(180), e(180, 270), r()]] }, { id: 3, regionId: "yazd", destinationId: "meybod", titleFa: "\u0627\u0646\u0634\u0639\u0627\u0628 \u0628\u0627\u063A", subtitleFa: "\u062A\u0642\u0633\u06CC\u0645 \u062C\u0631\u06CC\u0627\u0646 \u0622\u0628 \u0628\u0647 \u062F\u0648 \u0628\u0627\u063A\u0633\u062A\u0627\u0646 \u0628\u0627 \u0633\u0647\u200C\u0631\u0627\u0647\u06CC", difficulty: "easy", rows: 5, cols: 5, source: { row: 2, col: 0 }, destination: { row: 0, col: 4 }, destinations: [{ row: 0, col: 4 }, { row: 4, col: 4 }], expectedMinMoves: 11, parTimeSec: 65, grid: [[r(), r(), e(270, 90), o(0, 90), c(0)], [r(), t(), o(90, 0), t(), r()], [h(0), o(0, 90), a(90, 270), r(), t()], [r(), t(), e(180, 0), e(90, 180), r()], [r(), r(), r(), e(270, 0), c(0)]] }, { id: 4, regionId: "yazd", destinationId: "meybod", titleFa: "\u0686\u0647\u0627\u0631\u0633\u0648\u06CC \u0642\u0646\u0627\u062A", subtitleFa: "\u062A\u0642\u0627\u0637\u0639 \u0686\u0647\u0627\u0631\u0631\u0627\u0647\u06CC \u0648 \u0686\u0631\u062E\u0634 \u0628\u0633\u062A\u0647 \u0628\u062F\u0648\u0646 \u0646\u0634\u062A", difficulty: "easy", rows: 5, cols: 5, source: { row: 2, col: 0 }, destination: { row: 4, col: 4 }, destinations: [{ row: 4, col: 4 }], expectedMinMoves: 15, parTimeSec: 80, grid: [[r(), r(), e(270, 90), o(0, 90), e(0, 180)], [r(), t(), o(90, 0), t(), o(90, 0)], [h(0), o(0, 90), u(0), o(0, 90), e(90, 270)], [r(), t(), o(90, 0), t(), r()], [r(), r(), e(180, 0), o(0, 90), c(0)]] }, { id: 5, regionId: "yazd", destinationId: "ardakan", titleFa: "\u062D\u0635\u0627\u0631 \u06A9\u0648\u06CC\u0631", subtitleFa: "\u0634\u0628\u06A9\u0647 \u0645\u062A\u0642\u0627\u0631\u0646 \u0622\u0628\u200C\u0631\u0633\u0627\u0646\u06CC \u0628\u0647 \u062F\u0648 \u0622\u0628\u200C\u0627\u0646\u0628\u0627\u0631", difficulty: "normal", rows: 5, cols: 5, source: { row: 0, col: 2 }, destination: { row: 2, col: 0 }, destinations: [{ row: 2, col: 0 }, { row: 2, col: 4 }], expectedMinMoves: 14, parTimeSec: 90, grid: [[r(), t(), h(90), t(), r()], [r(), e(270, 90), a(180, 0), e(90, 180), r()], [c(180), a(90, 270), t(), a(270, 90), c(0)], [r(), e(180, 0), o(0, 90), e(90, 270), r()], [e(0, 0), r(), t(), r(), e(90, 90)]] }, { id: 6, regionId: "yazd", destinationId: "ardakan", titleFa: "\u0642\u0644\u0628 \u0642\u0646\u0627\u062A", subtitleFa: "\u0645\u0647\u0646\u062F\u0633\u06CC \u06A9\u0627\u0645\u0644 \u0642\u0646\u0627\u062A \u0628\u0627 \u062A\u0642\u0627\u0637\u0639\u200C\u0647\u0627 \u0648 \u0634\u0627\u062E\u0647\u200C\u0647\u0627\u06CC \u0647\u0645\u200C\u0632\u0645\u0627\u0646", difficulty: "normal", rows: 5, cols: 5, source: { row: 0, col: 0 }, destination: { row: 0, col: 4 }, destinations: [{ row: 0, col: 4 }, { row: 4, col: 0 }], expectedMinMoves: 21, parTimeSec: 115, grid: [[h(0), e(0, 180), t(), e(270, 90), c(0)], [t(), a(270, 90), e(90, 180), o(90, 0), r()], [r(), e(180, 0), u(0), e(90, 270), t()], [t(), r(), a(270, 90), e(0, 180), t()], [c(180), o(0, 90), a(180, 0), e(90, 270), r()]] }, { id: 7, regionId: "yazd", destinationId: "taft", titleFa: "\u0622\u0628\u200C\u0627\u0646\u0628\u0627\u0631 \u0628\u0627\u062F\u06AF\u06CC\u0631", subtitleFa: "\u0647\u062F\u0627\u06CC\u062A \u062C\u0631\u06CC\u0627\u0646 \u0627\u0632 \u06A9\u0646\u0627\u0631 \u0633\u0646\u06AF\u200C\u0628\u0633\u062A\u0631 \u0645\u0631\u06A9\u0632\u06CC \u0628\u0647 \u062F\u0648 \u0622\u0628\u200C\u0627\u0646\u0628\u0627\u0631", difficulty: "normal", rows: 5, cols: 5, source: { row: 0, col: 0 }, destination: { row: 0, col: 4 }, destinations: [{ row: 0, col: 4 }, { row: 4, col: 4 }], expectedMinMoves: 17, parTimeSec: 95, grid: [[h(90), t(), e(0, 90), o(0, 90), c(0)], [o(90, 0), e(270, 90), e(90, 270), r(), t()], [e(180, 0), a(90, 270), t(), t(), r()], [r(), e(270, 0), o(0, 90), e(0, 180), r()], [r(), t(), r(), e(180, 0), c(0)]] }, { id: 8, regionId: "yazd", destinationId: "taft", titleFa: "\u06A9\u0627\u0631\u0648\u0627\u0646\u0633\u0631\u0627\u06CC \u06A9\u0647\u0646", subtitleFa: "\u0622\u062E\u0631\u06CC\u0646 \u0642\u0646\u0627\u062A \u06CC\u0632\u062F \u0628\u0627 \u0635\u062D\u0646 \u0628\u0633\u062A\u0647 \u0648 \u062F\u0648 \u0645\u0638\u0647\u0631 \u0647\u0645\u200C\u0632\u0645\u0627\u0646", difficulty: "normal", rows: 5, cols: 5, source: { row: 4, col: 0 }, destination: { row: 0, col: 2 }, destinations: [{ row: 0, col: 2 }, { row: 4, col: 4 }], expectedMinMoves: 17, parTimeSec: 105, grid: [[t(), r(), c(270), r(), t()], [r(), e(0, 90), a(180, 0), e(90, 180), r()], [t(), a(270, 90), a(0, 180), e(180, 270), t()], [e(270, 90), e(90, 270), e(180, 0), e(90, 180), r()], [h(270), r(), t(), e(270, 0), c(0)]] }];
  var It = [{ id: 25, regionId: "zanjan", destinationId: "zanjan", titleFa: "\u062F\u0634\u062A \u0632\u0646\u062C\u0627\u0646", subtitleFa: "\u062F\u0648 \u062D\u0644\u0642\u0647 \u0645\u062A\u0642\u0627\u0631\u0646 \u067E\u06CC\u0631\u0627\u0645\u0648\u0646 \u067E\u0644 \u0645\u06CC\u0627\u0646\u06CC \u062F\u0631 \u062F\u0634\u062A \u06A9\u0648\u0647\u067E\u0627\u06CC\u0647\u200C\u0627\u06CC", difficulty: "hard", rows: 5, cols: 5, source: { row: 2, col: 0 }, destination: { row: 0, col: 4 }, destinations: [{ row: 0, col: 4 }, { row: 4, col: 4 }], expectedMinMoves: 17, parTimeSec: 120, grid: [[t(), e(270, 90), o(0, 90), a(0, 180), c(0)], [r(), o(90, 0), t(), o(90, 0), t()], [h(0), u(0), o(0, 90), a(90, 270), r()], [t(), o(90, 0), r(), o(90, 0), t()], [r(), e(180, 0), o(0, 90), a(180, 0), c(0)]] }, { id: 26, regionId: "zanjan", destinationId: "zanjan", titleFa: "\u06AF\u0630\u0631\u06AF\u0627\u0647 \u06A9\u0648\u0647\u067E\u0627\u06CC\u0647", subtitleFa: "\u0627\u0646\u0634\u0639\u0627\u0628 \u0633\u0647\u200C\u06AF\u0627\u0646\u0647 \u062F\u0631 \u0628\u0633\u062A\u0631 \u0633\u0646\u06AF\u06CC \u062F\u0627\u0645\u0646\u0647 \u0632\u0646\u062C\u0627\u0646", difficulty: "hard", rows: 5, cols: 5, source: { row: 4, col: 0 }, destination: { row: 0, col: 0 }, destinations: [{ row: 0, col: 0 }, { row: 0, col: 4 }, { row: 4, col: 4 }], expectedMinMoves: 20, parTimeSec: 130, grid: [[c(270), t(), e(270, 90), o(0, 90), c(0)], [o(90, 0), e(270, 90), a(90, 270), t(), r()], [a(270, 90), a(180, 0), a(270, 0), e(0, 180), t()], [o(90, 0), t(), r(), e(180, 0), e(0, 180)], [h(270), r(), t(), r(), c(90)]] }, { id: 27, regionId: "zanjan", destinationId: "ijrud", titleFa: "\u062F\u0631\u0647 \u0627\u06CC\u062C\u0631\u0648\u062F", subtitleFa: "\u062F\u0648 \u0634\u0627\u062E\u0647 \u0647\u0645\u200C\u0632\u0645\u0627\u0646 \u062F\u0631 \u067E\u06CC\u0686\u200C\u0648\u062E\u0645 \u062F\u0631\u0647 \u0633\u0628\u0632 \u0627\u06CC\u062C\u0631\u0648\u062F", difficulty: "hard", rows: 5, cols: 5, source: { row: 0, col: 2 }, destination: { row: 4, col: 1 }, destinations: [{ row: 4, col: 1 }, { row: 4, col: 3 }], expectedMinMoves: 15, parTimeSec: 125, grid: [[t(), r(), h(90), r(), t()], [e(270, 90), a(0, 180), a(180, 0), a(90, 180), e(0, 180)], [e(270, 0), u(0), o(0, 90), u(0), e(90, 270)], [r(), o(90, 0), t(), o(90, 0), r()], [t(), c(90), t(), c(90), t()]] }, { id: 28, regionId: "zanjan", destinationId: "ijrud", titleFa: "\u062A\u0646\u06AF\u0647 \u06A9\u0648\u0647\u0633\u062A\u0627\u0646\u06CC \u0627\u06CC\u062C\u0631\u0648\u062F", subtitleFa: "\u0639\u0628\u0648\u0631 \u062C\u0631\u06CC\u0627\u0646 \u0627\u0632 \u062A\u0646\u06AF\u0647 \u0635\u062E\u0631\u0647\u200C\u0627\u06CC \u0628\u0647 \u0633\u0647 \u062F\u0634\u062A \u067E\u06CC\u0631\u0627\u0645\u0648\u0646", difficulty: "hard", rows: 6, cols: 6, source: { row: 0, col: 0 }, destination: { row: 0, col: 5 }, destinations: [{ row: 0, col: 5 }, { row: 3, col: 5 }, { row: 5, col: 0 }], expectedMinMoves: 29, parTimeSec: 155, grid: [[h(0), e(0, 180), t(), e(270, 90), o(0, 90), c(0)], [t(), e(180, 0), o(0, 90), a(90, 270), t(), r()], [e(270, 90), o(0, 90), e(0, 180), e(270, 0), e(0, 180), t()], [o(90, 0), t(), a(270, 90), o(0, 90), a(180, 0), c(0)], [a(270, 90), o(0, 90), e(90, 270), t(), r(), r()], [c(90), t(), r(), r(), t(), r()]] }, { id: 29, regionId: "zanjan", destinationId: "soltaniyeh", titleFa: "\u062F\u0634\u062A \u0633\u0644\u0637\u0627\u0646\u06CC\u0647", subtitleFa: "\u062D\u0644\u0642\u0647 \u06AF\u0633\u062A\u0631\u062F\u0647 \u0622\u0628\u200C\u0631\u0633\u0627\u0646\u06CC \u062F\u0631 \u067E\u0647\u0646\u0647\u200C\u06CC \u062F\u0634\u062A \u0633\u0644\u0637\u0627\u0646\u06CC\u0647", difficulty: "hard", rows: 6, cols: 6, source: { row: 5, col: 2 }, destination: { row: 0, col: 0 }, destinations: [{ row: 0, col: 0 }, { row: 0, col: 5 }, { row: 5, col: 5 }], expectedMinMoves: 24, parTimeSec: 150, grid: [[c(180), e(0, 180), t(), t(), e(270, 90), c(0)], [r(), a(270, 90), o(0, 90), o(0, 90), a(90, 270), r()], [t(), o(90, 0), t(), t(), o(90, 0), t()], [r(), e(180, 0), a(0, 180), o(0, 90), a(90, 270), r()], [t(), r(), o(90, 0), t(), e(180, 0), e(0, 180)], [r(), r(), h(270), r(), t(), c(90)]] }, { id: 30, regionId: "zanjan", destinationId: "soltaniyeh", titleFa: "\u062D\u0648\u0636\u0686\u0647 \u06AF\u0646\u0628\u062F \u0641\u06CC\u0631\u0648\u0632\u0647", subtitleFa: "\u062A\u0648\u0627\u0632\u0646 \u062F\u0648 \u062A\u0642\u0627\u0637\u0639 \u0686\u0647\u0627\u0631\u0631\u0627\u0647\u06CC \u0648 \u0633\u0647 \u0645\u062F\u0627\u0631 \u0647\u0645\u200C\u0645\u0631\u06A9\u0632", difficulty: "expert", rows: 6, cols: 6, source: { row: 3, col: 0 }, destination: { row: 0, col: 2 }, destinations: [{ row: 0, col: 2 }, { row: 2, col: 5 }, { row: 5, col: 2 }], expectedMinMoves: 21, parTimeSec: 155, grid: [[t(), r(), c(270), r(), t(), r()], [r(), e(270, 90), u(0), o(0, 90), e(0, 180), t()], [t(), o(90, 0), a(270, 90), e(0, 180), a(270, 90), c(0)], [h(0), u(0), a(180, 0), a(270, 0), e(90, 270), t()], [t(), e(180, 0), e(0, 180), t(), r(), r()], [r(), t(), c(90), r(), r(), t()]] }, { id: 31, regionId: "zanjan", destinationId: "mahneshan", titleFa: "\u062A\u067E\u0647\u200C\u0647\u0627\u06CC \u0631\u0646\u06AF\u06CC\u0646 \u0645\u0627\u0647\u0646\u0634\u0627\u0646", subtitleFa: "\u0645\u0633\u06CC\u0631\u0647\u0627\u06CC \u067E\u0631\u067E\u06CC\u0686 \u062F\u0631 \u0645\u06CC\u0627\u0646 \u0644\u0627\u06CC\u0647\u200C\u0647\u0627\u06CC \u0631\u0633\u0648\u0628\u06CC \u0645\u0627\u0647\u0646\u0634\u0627\u0646", difficulty: "expert", rows: 6, cols: 6, source: { row: 0, col: 5 }, destination: { row: 0, col: 0 }, destinations: [{ row: 0, col: 0 }, { row: 5, col: 0 }, { row: 5, col: 5 }], expectedMinMoves: 33, parTimeSec: 175, grid: [[c(180), e(0, 180), t(), e(270, 90), o(0, 90), h(180)], [t(), e(180, 0), o(0, 90), a(90, 270), t(), r()], [e(270, 90), o(0, 90), e(0, 180), a(270, 90), e(0, 180), t()], [o(90, 0), t(), e(180, 0), u(0), e(90, 270), r()], [a(270, 90), o(0, 90), o(0, 90), a(180, 0), o(0, 90), e(0, 180)], [c(90), t(), r(), t(), r(), c(90)]] }, { id: 32, regionId: "zanjan", destinationId: "mahneshan", titleFa: "\u062F\u0631\u0647 \u0642\u0632\u0644\u200C\u0627\u0648\u0632\u0646", subtitleFa: "\u0622\u0632\u0645\u0648\u0646 \u067E\u0627\u06CC\u0627\u0646\u06CC \u0645\u0633\u06CC\u0631 \u0632\u0646\u062C\u0627\u0646 \u0628\u0627 \u0633\u0647 \u0645\u062F\u0627\u0631 \u0641\u0634\u0627\u0631 \u0648 \u0633\u0647 \u0645\u0642\u0635\u062F", difficulty: "expert", rows: 6, cols: 6, source: { row: 5, col: 0 }, destination: { row: 0, col: 0 }, destinations: [{ row: 0, col: 0 }, { row: 0, col: 5 }, { row: 3, col: 5 }], expectedMinMoves: 32, parTimeSec: 180, grid: [[c(270), t(), e(270, 90), o(0, 90), o(0, 90), c(0)], [o(90, 0), e(270, 90), a(90, 270), t(), e(270, 90), e(0, 180)], [a(270, 90), u(0), a(180, 0), a(0, 180), a(270, 0), e(90, 270)], [e(180, 0), a(90, 270), t(), e(180, 0), o(0, 90), c(0)], [t(), o(90, 0), r(), t(), r(), t()], [h(0), e(90, 270), r(), r(), r(), r()]] }];
  var ue = [...Tt, ...yt, ...gt, ...It, ...ht, ...mt, ...ft, ..._t, ...wt, ...bt, ...Et, ...St];
  var Ue = 200, z = 16 * 1024, Me = 1, Rt = [1];
  function ao(n) {
    return n.grid.map((i, l) => i.map((s, d) => ({ row: l, col: d, type: s.type, rotation: s.initialRotation, visualRotation: s.initialRotation, locked: !!s.locked })));
  }
  function Ge(n, i) {
    let l = n.challengeType;
    if (l !== "campaign" && l !== "daily" && l !== "friend") return { ok: false, httpStatus: 400, code: "INVALID_CHALLENGE_TYPE", message: 'challengeType must be "campaign", "daily", or "friend".' };
    let s = typeof n.challengeId == "string" ? n.challengeId.trim() : "";
    if (!s || s.length > 64) return { ok: false, httpStatus: 400, code: "INVALID_CHALLENGE_ID", message: "challengeId must be a non-empty string up to 64 characters." };
    let d = n.algoVersion;
    if (typeof d != "number" || !Number.isInteger(d)) return { ok: false, httpStatus: 400, code: "UNSUPPORTED_ALGO_VERSION", message: "algoVersion must be a supported integer." };
    if (l === "campaign") {
      if (!Rt.includes(d)) return { ok: false, httpStatus: 400, code: "UNSUPPORTED_ALGO_VERSION", message: `Unsupported campaign puzzle algorithm version: ${d}.`, details: { supportedVersions: [...Rt] } };
      let f = /^campaign-(\d+)$/i.exec(s), g = typeof n.levelId == "number" && Number.isInteger(n.levelId) ? n.levelId : f ? Number.parseInt(f[1], 10) : NaN;
      if (!Number.isInteger(g) || g < 1 || g > ue.length) return { ok: false, httpStatus: 400, code: "INVALID_LEVEL_ID", message: `Campaign levelId must be an integer between 1 and ${ue.length}.` };
      let w = `campaign-${g}`;
      if (s.toLowerCase() !== w) return { ok: false, httpStatus: 400, code: "CHALLENGE_ID_MISMATCH", message: `challengeId must match "${w}" for levelId=${g}.` };
      let _ = ue.find((m) => m.id === g);
      return _ ? { ok: true, challengeType: "campaign", challengeId: w, dateKey: null, algoVersion: Me, templateId: `campaign_lvl_${_.id}`, level: _ } : { ok: false, httpStatus: 400, code: "INVALID_LEVEL_ID", message: `Unknown campaign levelId: ${g}.` };
    }
    if (l === "daily") {
      if (!te.includes(d)) return { ok: false, httpStatus: 400, code: "UNSUPPORTED_ALGO_VERSION", message: `Unsupported daily puzzle algorithm version: ${d}.`, details: { supportedVersions: [...te] } };
      let f = typeof n.dateKey == "string" ? n.dateKey.trim() : "";
      if (!Y(f)) return { ok: false, httpStatus: 400, code: "INVALID_DATE_KEY", message: "Daily challenge verification requires a valid YYYY-MM-DD dateKey." };
      let g = j(i?.now ?? /* @__PURE__ */ new Date()), w = Ae(f, g);
      if (w === null || w < 0) return { ok: false, httpStatus: 400, code: "FUTURE_DATE_NOT_ALLOWED", message: "Submissions for future Tehran calendar dates are not allowed.", details: { serverTodayKey: g, submittedDateKey: f } };
      let _ = ve(f, d);
      return s !== _.challengeId ? { ok: false, httpStatus: 400, code: "CHALLENGE_ID_MISMATCH", message: "challengeId does not match the authoritative daily challenge for the given dateKey and algoVersion." } : { ok: true, challengeType: "daily", challengeId: _.challengeId, dateKey: _.dateKey, algoVersion: ee, templateId: _.templateId, level: _.level };
    }
    if (!Le.includes(d)) return { ok: false, httpStatus: 400, code: "UNSUPPORTED_ALGO_VERSION", message: `Unsupported friend challenge algorithm version: ${d}.`, details: { supportedVersions: [...Le] } };
    let p = de(s);
    return p.ok ? p.challenge.algoVersion !== d ? { ok: false, httpStatus: 400, code: "CHALLENGE_ID_MISMATCH", message: "algoVersion does not match the friend challenge identifier." } : { ok: true, challengeType: "friend", challengeId: p.challenge.challengeId, dateKey: null, algoVersion: se, templateId: p.challenge.templateId, level: p.challenge.level } : { ok: false, httpStatus: 400, code: p.reason === "unsupported_version" ? "UNSUPPORTED_ALGO_VERSION" : "INVALID_FRIEND_CHALLENGE", message: `Invalid friend challenge code (${p.reason}).` };
  }
  function $e(n, i) {
    if (!n || typeof n != "object" || Array.isArray(n)) return { ok: false, httpStatus: 400, code: "INVALID_ACTIONS_FORMAT", message: "Submission payload must be a JSON object." };
    let l = n, s = Ge(l, i);
    if (!s.ok) return s;
    let d = l.actions;
    if (!Array.isArray(d)) return { ok: false, httpStatus: 400, code: "INVALID_ACTIONS_FORMAT", message: "actions must be an array of { row, col } rotation steps." };
    if (d.length === 0) return { ok: false, httpStatus: 422, code: "SOLUTION_INCOMPLETE", message: "Action sequence cannot be empty." };
    if (d.length > Ue) return { ok: false, httpStatus: 400, code: "ACTION_LIMIT_EXCEEDED", message: `Action sequence exceeds maximum allowed length of ${Ue}.`, details: { maxActions: Ue, received: d.length } };
    let { level: p, challengeType: f, challengeId: g, dateKey: w, algoVersion: _, templateId: m } = s, b = ao(p);
    for (let y = 0; y < d.length; y++) {
      let v = d[y];
      if (!v || typeof v != "object" || Array.isArray(v)) return { ok: false, httpStatus: 400, code: "INVALID_ACTION_COORDINATES", message: `Action at index ${y} must be an object with integer row and col.` };
      let A = v.row, N = v.col;
      if (typeof A != "number" || typeof N != "number" || !Number.isInteger(A) || !Number.isInteger(N) || A < 0 || A >= p.rows || N < 0 || N >= p.cols) return { ok: false, httpStatus: 400, code: "INVALID_ACTION_COORDINATES", message: `Action at index ${y} has out-of-bounds coordinates for ${p.rows}x${p.cols} board.` };
      let R = b[A][N];
      if (!ie(R.type, R.locked)) return { ok: false, httpStatus: 422, code: "INVALID_ACTION_TILE", message: `Action at index ${y} attempted to rotate a fixed or non-rotatable tile (${R.type}) at (${A},${N}).` };
      R.rotation = ce(R.rotation), R.visualRotation += 90;
    }
    let S = ae(b);
    if (!S.isValidSolution) return S.leaks.length > 0 ? { ok: false, httpStatus: 422, code: "SOLUTION_HAS_LEAKS", message: "Replayed solution has water leaks and is not valid.", details: { leakCount: S.leaks.length, allDestinationsReached: S.allDestinationsReached } } : { ok: false, httpStatus: 422, code: "SOLUTION_INCOMPLETE", message: "Replayed solution does not reach all required destinations.", details: { unreachedDestinations: S.unreachedDestinations.length } };
    let E = d.length, I = pt({ verifiedSolved: true, verifiedMoves: E, trustedExpectedMinMoves: p.expectedMinMoves, difficulty: p.difficulty });
    return { ok: true, challengeType: f, challengeId: g, dateKey: w, algoVersion: _, scoringVersion: B, templateId: m, difficulty: p.difficulty, rows: p.rows, cols: p.cols, verifiedMoves: E, trustedExpectedMinMoves: p.expectedMinMoves, rankedScore: I };
  }
  var he = new TextEncoder(), so = new TextDecoder("utf-8"), lo = new Uint32Array([1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298]);
  function K(n, i) {
    return n >>> i | n << 32 - i;
  }
  function ye(n) {
    let i = n.length, l = Math.floor(i * 8 / 4294967296), s = i * 8 >>> 0, d = Math.ceil((i + 9) / 64) * 64, p = new Uint8Array(d);
    p.set(n, 0), p[i] = 128;
    let f = new DataView(p.buffer);
    f.setUint32(d - 8, l, false), f.setUint32(d - 4, s, false);
    let g = 1779033703, w = 3144134277, _ = 1013904242, m = 2773480762, b = 1359893119, S = 2600822924, E = 528734635, I = 1541459225, y = new Uint32Array(64);
    for (let N = 0; N < d; N += 64) {
      for (let C = 0; C < 16; C++) y[C] = f.getUint32(N + C * 4, false);
      for (let C = 16; C < 64; C++) {
        let _e = K(y[C - 15], 7) ^ K(y[C - 15], 18) ^ y[C - 15] >>> 3, q = K(y[C - 2], 17) ^ K(y[C - 2], 19) ^ y[C - 2] >>> 10;
        y[C] = y[C - 16] + _e + y[C - 7] + q >>> 0;
      }
      let R = g, O = w, k = _, L = m, P = b, F = S, U = E, J = I;
      for (let C = 0; C < 64; C++) {
        let _e = K(P, 6) ^ K(P, 11) ^ K(P, 25), q = P & F ^ ~P & U, re = J + _e + q + lo[C] + y[C] >>> 0, Ee = K(R, 2) ^ K(R, 13) ^ K(R, 22), Gt = R & O ^ R & k ^ O & k, $t = Ee + Gt >>> 0;
        J = U, U = F, F = P, P = L + re >>> 0, L = k, k = O, O = R, R = re + $t >>> 0;
      }
      g = g + R >>> 0, w = w + O >>> 0, _ = _ + k >>> 0, m = m + L >>> 0, b = b + P >>> 0, S = S + F >>> 0, E = E + U >>> 0, I = I + J >>> 0;
    }
    let v = new Uint8Array(32), A = new DataView(v.buffer);
    return A.setUint32(0, g, false), A.setUint32(4, w, false), A.setUint32(8, _, false), A.setUint32(12, m, false), A.setUint32(16, b, false), A.setUint32(20, S, false), A.setUint32(24, E, false), A.setUint32(28, I, false), v;
  }
  function De(n) {
    let i = ye(he.encode(n)), l = "";
    for (let s = 0; s < i.length; s++) l += i[s].toString(16).padStart(2, "0");
    return l;
  }
  function At(n, i) {
    let s = he.encode(n);
    s.length > 64 && (s = ye(s));
    let d = new Uint8Array(64);
    d.set(s, 0);
    let p = new Uint8Array(64), f = new Uint8Array(64);
    for (let b = 0; b < 64; b++) p[b] = d[b] ^ 92, f[b] = d[b] ^ 54;
    let g = he.encode(i), w = new Uint8Array(64 + g.length);
    w.set(f, 0), w.set(g, 64);
    let _ = ye(w), m = new Uint8Array(64 + _.length);
    return m.set(p, 0), m.set(_, 64), ye(m);
  }
  function co(n, i) {
    if (n.length !== i.length) return false;
    let l = 0;
    for (let s = 0; s < n.length; s++) l |= n.charCodeAt(s) ^ i.charCodeAt(s);
    return l === 0;
  }
  var oe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  function He(n) {
    let i = "";
    for (let l = 0; l < n.length; l += 3) {
      let s = n[l], d = l + 1 < n.length ? n[l + 1] : 0, p = l + 2 < n.length ? n[l + 2] : 0;
      i += oe[s >> 2], i += oe[(s & 3) << 4 | d >> 4], l + 1 < n.length && (i += oe[(d & 15) << 2 | p >> 6]), l + 2 < n.length && (i += oe[p & 63]);
    }
    return i.replace(/\+/g, "-").replace(/\//g, "_");
  }
  function uo(n) {
    return He(he.encode(n));
  }
  function po(n) {
    if (!/^[A-Za-z0-9_-]+$/.test(n)) return null;
    let i = n.replace(/-/g, "+").replace(/_/g, "/"), l = (4 - i.length % 4) % 4, s = i + "=".repeat(l), d = [];
    for (let p = 0; p < s.length; p += 4) {
      let f = oe.indexOf(s[p]), g = oe.indexOf(s[p + 1]), w = s[p + 2] === "=" ? -1 : oe.indexOf(s[p + 2]), _ = s[p + 3] === "=" ? -1 : oe.indexOf(s[p + 3]);
      if (f < 0 || g < 0 || s[p + 2] !== "=" && w < 0 || s[p + 3] !== "=" && _ < 0) return null;
      d.push(f << 2 | g >> 4), w >= 0 && d.push((g & 15) << 4 | w >> 2), _ >= 0 && d.push((w & 3) << 6 | _);
    }
    try {
      return so.decode(new Uint8Array(d));
    } catch {
      return null;
    }
  }
  function xe(n = 12) {
    let i = new Uint8Array(n);
    if (typeof globalThis.crypto < "u" && typeof globalThis.crypto.getRandomValues == "function") globalThis.crypto.getRandomValues(i);
    else {
      let s = `${Date.now()}:${Math.random()}:${Math.random()}`, d = ye(he.encode(s));
      i.set(d.subarray(0, Math.min(n, d.length)));
    }
    let l = "";
    for (let s = 0; s < i.length; s++) l += i[s].toString(16).padStart(2, "0");
    return l;
  }
  function vt(n, i) {
    let l = uo(JSON.stringify(n)), s = At(i, `qanatchi:attempt:v1:${l}`), d = He(s);
    return `${l}.${d}`;
  }
  function Lt(n, i, l) {
    let s = n.trim(), d = s.indexOf(".");
    if (d <= 0 || d === s.length - 1 || s.indexOf(".", d + 1) !== -1) return { ok: false, reason: "malformed" };
    let p = s.slice(0, d), f = s.slice(d + 1), g = He(At(i, `qanatchi:attempt:v1:${p}`));
    if (!co(f, g)) return { ok: false, reason: "invalid_signature" };
    let w = po(p);
    if (!w) return { ok: false, reason: "malformed" };
    let _;
    try {
      _ = JSON.parse(w);
    } catch {
      return { ok: false, reason: "malformed" };
    }
    if (!_ || typeof _ != "object" || Array.isArray(_)) return { ok: false, reason: "malformed" };
    let m = _;
    return m.v !== 1 || typeof m.nonceId != "string" || !/^[a-zA-Z0-9_-]{8,64}$/.test(m.nonceId) || m.challengeType !== "campaign" && m.challengeType !== "daily" && m.challengeType !== "friend" || typeof m.challengeId != "string" || typeof m.playerIdHash != "string" || typeof m.issuedAtMs != "number" || typeof m.expiresAtMs != "number" || typeof m.minSolveMs != "number" ? { ok: false, reason: "malformed" } : l > m.expiresAtMs ? { ok: false, reason: "expired" } : { ok: true, claims: { v: 1, nonceId: m.nonceId, challengeType: m.challengeType, challengeId: m.challengeId, playerIdHash: m.playerIdHash, issuedAtMs: m.issuedAtMs, expiresAtMs: m.expiresAtMs, minSolveMs: m.minSolveMs } };
  }
  var fo = { QANATCHI_CONFIG: () => typeof QANATCHI_CONFIG < "u" ? QANATCHI_CONFIG : void 0, ENV: () => typeof ENV < "u" ? ENV : void 0, env: () => typeof env < "u" ? env : void 0, vars: () => typeof vars < "u" ? vars : void 0, APP_ENV: () => typeof APP_ENV < "u" ? APP_ENV : void 0, EC_URL: () => typeof EC_URL < "u" ? EC_URL : void 0, ALLOWED_ORIGINS: () => typeof ALLOWED_ORIGINS < "u" ? ALLOWED_ORIGINS : void 0, LEADERBOARD_STORAGE_DRIVER: () => typeof LEADERBOARD_STORAGE_DRIVER < "u" ? LEADERBOARD_STORAGE_DRIVER : void 0, LEADERBOARD_DATABASE_URL: () => typeof LEADERBOARD_DATABASE_URL < "u" ? LEADERBOARD_DATABASE_URL : void 0, LEADERBOARD_DATABASE_TOKEN: () => typeof LEADERBOARD_DATABASE_TOKEN < "u" ? LEADERBOARD_DATABASE_TOKEN : void 0, LEADERBOARD_DATABASE_PASSWORD: () => typeof LEADERBOARD_DATABASE_PASSWORD < "u" ? LEADERBOARD_DATABASE_PASSWORD : void 0, EDGE_SIGNING_SECRET: () => typeof EDGE_SIGNING_SECRET < "u" ? EDGE_SIGNING_SECRET : void 0, REQUIRE_ATTEMPT_TOKEN: () => typeof REQUIRE_ATTEMPT_TOKEN < "u" ? REQUIRE_ATTEMPT_TOKEN : void 0, RATE_LIMIT_MAX_PER_MIN: () => typeof RATE_LIMIT_MAX_PER_MIN < "u" ? RATE_LIMIT_MAX_PER_MIN : void 0, ENABLE_STRUCTURED_LOGS: () => typeof ENABLE_STRUCTURED_LOGS < "u" ? ENABLE_STRUCTURED_LOGS : void 0 };
  function Be(n) {
    let i = fo[n];
    if (i) try {
      return i();
    } catch {
      return;
    }
  }
  function pe(n, i) {
    let s = globalThis[n] ?? Be(n);
    if (s && typeof s == "object" && !Array.isArray(s)) return s[i];
  }
  function xt(n) {
    try {
      if (typeof self < "u" && self && typeof self == "object") return self[n];
    } catch {
      return;
    }
  }
  function mo(n) {
    let i = globalThis, l = n?.QANATCHI_CONFIG ?? i.QANATCHI_CONFIG ?? xt("QANATCHI_CONFIG") ?? Be("QANATCHI_CONFIG") ?? pe("ENV", "QANATCHI_CONFIG") ?? pe("env", "QANATCHI_CONFIG") ?? pe("vars", "QANATCHI_CONFIG");
    if (l) {
      if (typeof l == "object" && !Array.isArray(l)) return l;
      if (typeof l == "string") {
        let s = l.trim();
        if (s.startsWith("{")) try {
          let d = JSON.parse(s);
          if (d && typeof d == "object" && !Array.isArray(d)) return d;
        } catch {
          return;
        }
      }
    }
  }
  function ze(n, i) {
    if (i && i[n] !== void 0) return i[n];
    let l = globalThis;
    if (l[n] !== void 0) return l[n];
    let s = xt(n);
    if (s !== void 0) return s;
    let d = Be(n);
    if (d !== void 0) return d;
    let p = pe("ENV", n) ?? pe("env", n) ?? pe("vars", n);
    if (p !== void 0) return p;
    let f = mo(i);
    if (f && f[n] !== void 0) return f[n];
  }
  function W(n, i) {
    let l = ze(n, i);
    if (typeof l == "string" && l.trim().length > 0) return l.trim();
    if (l && typeof l == "object" && !Array.isArray(l)) {
      let s = l.value;
      if (typeof s == "string" && s.trim().length > 0) return s.trim();
    }
  }
  function Mt(n, i, l) {
    let s = ze(n, l);
    if (typeof s == "boolean") return s;
    let d = W(n, l);
    if (!d) return i;
    let p = d.toLowerCase();
    return p === "1" || p === "true" || p === "yes" ? true : p === "0" || p === "false" || p === "no" ? false : i;
  }
  function go(n, i, l, s, d) {
    let p = ze(n, d);
    if (typeof p == "number" && Number.isFinite(p)) return Math.min(s, Math.max(l, Math.trunc(p)));
    let f = W(n, d);
    if (!f || !/^\d+$/.test(f)) return i;
    let g = Number.parseInt(f, 10);
    return Number.isFinite(g) ? Math.min(s, Math.max(l, g)) : i;
  }
  function yo(n) {
    let i = n.toLowerCase();
    return i === "localhost" || i === "127.0.0.1" || i === "[::1]" || i === "::1";
  }
  function Dt(n, i) {
    if (!n) return [];
    let l = i === "development", s = [];
    for (let d of n.split(",")) {
      let p = d.trim();
      if (!(!p || p === "*" || p.toLowerCase() === "null")) try {
        let f = new URL(p), g = f.protocol === "https:", w = l && f.protocol === "http:" && yo(f.hostname);
        (g || w) && (s.includes(f.origin) || s.push(f.origin));
      } catch {
      }
    }
    return s;
  }
  function Ot(n, i) {
    let l = n?.appEnv ?? W("APP_ENV", i) ?? "production", s = n?.ecUrlPresent ?? !!W("EC_URL", i), d = W("ALLOWED_ORIGINS", i), p = n?.allowedOrigins ? Dt(n.allowedOrigins.join(","), l) : Dt(d, l), f = n?.storageDriver ?? W("LEADERBOARD_STORAGE_DRIVER", i) ?? "unconfigured", g = n?.storageUrl ?? W("LEADERBOARD_DATABASE_URL", i), w = n?.storageToken ?? W("LEADERBOARD_DATABASE_TOKEN", i) ?? W("LEADERBOARD_DATABASE_PASSWORD", i), _ = n?.signingSecret ?? W("EDGE_SIGNING_SECRET", i), m = n?.requireAttemptToken ?? Mt("REQUIRE_ATTEMPT_TOKEN", false, i), b = n?.rateLimitMaxPerMin ?? go("RATE_LIMIT_MAX_PER_MIN", 60, 5, 1e3, i), S = n?.structuredLogsEnabled ?? Mt("ENABLE_STRUCTURED_LOGS", l !== "test", i), E = n?.storageConfigured ?? false;
    return { appEnv: l, ecUrlPresent: s, allowedOrigins: p, storageConfigured: E, storageDriver: f, storageUrl: g, storageToken: w, signingSecret: _, requireAttemptToken: m, rateLimitMaxPerMin: b, structuredLogsEnabled: S };
  }
  var ho = /password|secret|token|authorization|cookie|api_key|apikey|database_url|connection_string/i;
  function Ke(n, i = 0) {
    if (i > 3) return "[truncated]";
    if (n == null) return n;
    if (typeof n == "string") return n.length > 160 ? `${n.slice(0, 157)}...` : n;
    if (typeof n == "number" || typeof n == "boolean") return n;
    if (Array.isArray(n)) return n.slice(0, 10).map((l) => Ke(l, i + 1));
    if (typeof n == "object") {
      let l = {};
      for (let [s, d] of Object.entries(n)) ho.test(s) ? l[s] = "[REDACTED]" : l[s] = Ke(d, i + 1);
      return l;
    }
    return String(n);
  }
  function Nt(n, i = true) {
    if (i) try {
      let l = n.details ? Ke(n.details) : void 0, s = { ...n, ...l ? { details: l } : {} }, d = JSON.stringify(s);
      n.level === "error" ? console.error(d) : n.level === "warn" ? console.warn(d) : console.log(d);
    } catch {
    }
  }
  var x = class extends Error {
    constructor(l = "Durable leaderboard storage is not provisioned or configured in this Edge deployment.") {
      super(l);
      this.code = "STORAGE_NOT_CONFIGURED";
      this.name = "StorageNotConfiguredError";
    }
  }, V = class extends Error {
    constructor(l = "Persistent leaderboard storage is temporarily unavailable.") {
      super(l);
      this.code = "STORAGE_UNAVAILABLE";
      this.name = "StorageUnavailableError";
    }
  }, Oe = class extends Error {
    constructor(l = "This attempt token has already been consumed.") {
      super(l);
      this.code = "NONCE_ALREADY_USED";
      this.name = "NonceAlreadyUsedError";
    }
  };
  var wo = 4e3;
  function D(n, i = 0) {
    if (typeof n == "number" && Number.isFinite(n)) return Math.trunc(n);
    if (typeof n == "string" && n.trim() !== "") {
      let l = Number.parseInt(n, 10);
      if (Number.isFinite(l)) return l;
    }
    return i;
  }
  function M(n, i = "") {
    return typeof n == "string" ? n : n instanceof Date ? n.toISOString() : typeof n == "number" || typeof n == "boolean" ? String(n) : i;
  }
  function We(n, i) {
    let l = D(n.stars, 1), s = l >= 3 ? 3 : l === 2 ? 2 : 1;
    return { rank: D(n.rank, i), submissionId: M(n.submission_id), playerIdHash: M(n.player_id_hash), displayLabel: M(n.display_label, "\u0645\u0633\u0627\u0641\u0631 \u0642\u0646\u0627\u062A"), challengeType: M(n.challenge_type, "daily"), challengeId: M(n.challenge_id), dateKey: n.date_key ? M(n.date_key) : null, score: D(n.score, 0), stars: s, verifiedMoves: D(n.verified_moves, 1), performanceTier: M(n.performance_tier, "striver"), performanceLabelFa: M(n.performance_label_fa, "\u062A\u0644\u0627\u0634\u06AF\u0631 \u06A9\u0648\u06CC\u0631"), scoringVersion: D(n.scoring_version, 2), submittedAt: M(n.submitted_at) };
  }
  var fe = class {
    constructor(i) {
      this.isConfigured = true;
      if (!i.endpointUrl || !i.endpointUrl.trim()) throw new x("LEADERBOARD_DATABASE_URL is required for postgres-http storage.");
      this.endpointUrl = i.endpointUrl.trim().replace(/\/+$/, ""), this.authToken = i.authToken?.trim() || void 0, this.authMode = i.authMode ?? "bearer", this.timeoutMs = i.timeoutMs ?? wo, this.fetchImpl = i.fetchImpl, this.driverName = i.driverName ?? "postgres-http";
    }
    async executeSql(i, l = []) {
      let s = this.fetchImpl ?? (typeof fetch == "function" ? fetch : null);
      if (!s) throw new V("Global fetch API is unavailable in this runtime.");
      let d = typeof AbortController < "u" ? new AbortController() : null, p = d !== null ? globalThis.setTimeout(() => {
        d.abort();
      }, this.timeoutMs) : null, f = { "Content-Type": "application/json", Accept: "application/json" };
      this.authToken && (this.authMode === "neon-connection-string" ? f["Neon-Connection-String"] = this.authToken : f.Authorization = `Bearer ${this.authToken}`);
      try {
        let g = this.endpointUrl.endsWith("/sql") ? this.endpointUrl : `${this.endpointUrl}/sql`, w = await s(g, { method: "POST", headers: f, body: JSON.stringify({ query: i, params: l }), signal: d?.signal }), _ = await w.text(), m = null;
        try {
          m = _ ? JSON.parse(_) : null;
        } catch {
          m = null;
        }
        if (!w.ok || !m || !Array.isArray(m.rows) && typeof m.rowCount != "number") {
          let b = m && typeof m.code == "string" ? String(m.code).trim() : "", S = /^[0-9A-Z]{5}$/.test(b) ? b : void 0;
          throw new V(`Durable storage gateway returned HTTP ${w.status}${S ? ` (${S})` : ""}.`);
        }
        return Array.isArray(m.rows) ? m.rows : [];
      } catch (g) {
        throw g instanceof V ? g : g instanceof Error && g.name === "AbortError" ? new V("Durable storage request timed out.") : new V("Failed to communicate with durable PostgreSQL HTTP gateway.");
      } finally {
        p !== null && globalThis.clearTimeout(p);
      }
    }
    async ping() {
      let i = Date.now();
      return await this.executeSql("SELECT 1 AS alive", []), { ok: true, latencyMs: Math.max(0, Date.now() - i) };
    }
    async hasDuplicateSubmission(i) {
      return (await this.executeSql("SELECT 1 AS found FROM verified_submissions WHERE submission_fingerprint = $1 LIMIT 1", [i])).length > 0;
    }
    async saveVerifiedSubmission(i) {
      await this.executeSql(`
        INSERT INTO players (player_id_hash, display_label, updated_at)
        VALUES ($1, $2, NOW())
        ON CONFLICT (player_id_hash) DO UPDATE
          SET display_label = EXCLUDED.display_label,
              updated_at = NOW();
      `, [i.playerIdHash, i.displayLabel]);
      let s = (await this.executeSql(`
        INSERT INTO verified_submissions (
          submission_id, submission_fingerprint, idempotency_key,
          player_id_hash, display_label, challenge_type, challenge_id,
          date_key, algo_version, scoring_version, score, stars,
          verified_moves, performance_tier, performance_label_fa,
          elapsed_ms_server, timing_verified, nonce_id, submitted_at
        )
        VALUES (
          $1, $2, $3,
          $4, $5, $6, $7,
          $8, $9, $10, $11, $12,
          $13, $14, $15,
          $16, $17, $18, $19::TIMESTAMPTZ
        )
        ON CONFLICT DO NOTHING
        RETURNING submission_id;
      `, [i.submissionId, i.submissionFingerprint, i.idempotencyKey, i.playerIdHash, i.displayLabel, i.challengeType, i.challengeId, i.dateKey, i.algoVersion, i.scoringVersion, i.score, i.stars, i.verifiedMoves, i.performanceTier, i.performanceLabelFa, i.elapsedMsServer, i.timingVerified, i.nonceId, i.submittedAt])).length === 0, d = false;
      s || (d = (await this.executeSql(`
          INSERT INTO leaderboard_best (
            challenge_type, challenge_id, player_id_hash, submission_id,
            display_label, date_key, algo_version, scoring_version,
            score, stars, verified_moves, performance_tier, performance_label_fa,
            submitted_at, updated_at
          )
          VALUES (
            $1, $2, $3, $4,
            $5, $6, $7, $8,
            $9, $10, $11, $12, $13,
            $14::TIMESTAMPTZ, NOW()
          )
          ON CONFLICT (challenge_type, challenge_id, player_id_hash) DO UPDATE
            SET submission_id = EXCLUDED.submission_id,
                display_label = EXCLUDED.display_label,
                scoring_version = EXCLUDED.scoring_version,
                score = EXCLUDED.score,
                stars = EXCLUDED.stars,
                verified_moves = EXCLUDED.verified_moves,
                performance_tier = EXCLUDED.performance_tier,
                performance_label_fa = EXCLUDED.performance_label_fa,
                submitted_at = EXCLUDED.submitted_at,
                updated_at = NOW()
            WHERE (EXCLUDED.score > leaderboard_best.score)
               OR (EXCLUDED.score = leaderboard_best.score AND EXCLUDED.stars > leaderboard_best.stars)
               OR (EXCLUDED.score = leaderboard_best.score AND EXCLUDED.stars = leaderboard_best.stars AND EXCLUDED.verified_moves < leaderboard_best.verified_moves)
          RETURNING submission_id;
        `, [i.challengeType, i.challengeId, i.playerIdHash, i.submissionId, i.displayLabel, i.dateKey, i.algoVersion, i.scoringVersion, i.score, i.stars, i.verifiedMoves, i.performanceTier, i.performanceLabelFa, i.submittedAt])).length > 0, await this.executeSql(`
          UPDATE players
          SET verified_submissions = verified_submissions + 1,
              best_daily_score = CASE WHEN $2::TEXT = 'daily' THEN GREATEST(best_daily_score, $3::INTEGER) ELSE best_daily_score END,
              best_friend_score = CASE WHEN $2::TEXT = 'friend' THEN GREATEST(best_friend_score, $3::INTEGER) ELSE best_friend_score END,
              total_verified_score = COALESCE((
                SELECT SUM(score)
                FROM leaderboard_best
                WHERE player_id_hash = $1
              ), 0),
              updated_at = NOW()
          WHERE player_id_hash = $1;
        `, [i.playerIdHash, i.challengeType, i.score]));
      let p = await this.getPlayerBest({ challengeType: i.challengeType, challengeId: i.challengeId, playerIdHash: i.playerIdHash });
      if (!p && s && (await this.executeSql(`
          INSERT INTO leaderboard_best (
            challenge_type, challenge_id, player_id_hash, submission_id,
            display_label, date_key, algo_version, scoring_version,
            score, stars, verified_moves, performance_tier, performance_label_fa,
            submitted_at, updated_at
          )
          SELECT
            challenge_type, challenge_id, player_id_hash, submission_id,
            display_label, date_key, algo_version, scoring_version,
            score, stars, verified_moves, performance_tier, performance_label_fa,
            submitted_at, NOW()
          FROM verified_submissions
          WHERE challenge_type = $1 AND challenge_id = $2 AND player_id_hash = $3
          ORDER BY score DESC, stars DESC, verified_moves ASC, submitted_at ASC
          LIMIT 1
          ON CONFLICT (challenge_type, challenge_id, player_id_hash) DO NOTHING;
        `, [i.challengeType, i.challengeId, i.playerIdHash]), p = await this.getPlayerBest({ challengeType: i.challengeType, challengeId: i.challengeId, playerIdHash: i.playerIdHash })), !p) throw new V("PostgreSQL submission query returned no leaderboard entry.");
      return { duplicate: s, isNewBest: d, entry: p };
    }
    async queryLeaderboardPage(i, l, s, d) {
      let f = await this.executeSql(`
      WITH ranked AS (
        SELECT
          ROW_NUMBER() OVER (
            ORDER BY score DESC, verified_moves ASC, submitted_at ASC, submission_id ASC
          ) AS rank,
          submission_id, player_id_hash, display_label, challenge_type,
          challenge_id, date_key, score, stars, verified_moves,
          performance_tier, performance_label_fa, scoring_version, submitted_at
        FROM leaderboard_best
        WHERE challenge_type = $1 AND challenge_id = $2
      ),
      total_count AS (
        SELECT COUNT(*)::INTEGER AS total FROM ranked
      )
      SELECT tc.total, r.*
      FROM total_count tc
      LEFT JOIN ranked r ON TRUE
      ORDER BY r.rank ASC NULLS LAST
      LIMIT $3 OFFSET $4;
    `, [i, l, s, d]), g = f.length > 0 ? D(f[0].total, 0) : 0, w = f.filter((_) => !!_.submission_id).map((_, m) => We(_, d + m + 1));
      return { total: g, limit: s, offset: d, hasMore: d + w.length < g, entries: w };
    }
    async getDailyLeaderboard(i) {
      return this.queryLeaderboardPage("daily", i.challengeId, i.limit, i.offset);
    }
    async getFriendLeaderboard(i) {
      return this.queryLeaderboardPage("friend", i.challengeId, i.limit, i.offset);
    }
    async getGlobalLeaderboard(i) {
      let s = await this.executeSql(`
      WITH aggregated AS (
        SELECT
          p.player_id_hash,
          p.display_label,
          p.total_verified_score AS total_score,
          GREATEST(p.best_daily_score, p.best_friend_score) AS best_single_score,
          p.verified_submissions,
          COALESCE(COUNT(lb.challenge_id), 0)::INTEGER AS challenges_completed,
          COALESCE(MAX(lb.submitted_at), p.updated_at) AS last_submitted_at
        FROM players p
        INNER JOIN leaderboard_best lb ON lb.player_id_hash = p.player_id_hash
        GROUP BY p.player_id_hash, p.display_label, p.total_verified_score, p.best_daily_score, p.best_friend_score, p.verified_submissions, p.updated_at
      ),
      ranked AS (
        SELECT
          ROW_NUMBER() OVER (
            ORDER BY total_score DESC, best_single_score DESC, verified_submissions DESC, player_id_hash ASC
          ) AS rank,
          player_id_hash,
          display_label,
          total_score,
          best_single_score,
          verified_submissions,
          challenges_completed,
          last_submitted_at
        FROM aggregated
      ),
      total_count AS (
        SELECT COUNT(*)::INTEGER AS total FROM ranked
      )
      SELECT tc.total, r.*
      FROM total_count tc
      LEFT JOIN ranked r ON TRUE
      ORDER BY r.rank ASC NULLS LAST
      LIMIT $1 OFFSET $2;
    `, [i.limit, i.offset]), d = s.length > 0 ? D(s[0].total, 0) : 0, p = s.filter((g) => !!g.player_id_hash).map((g, w) => ({ rank: D(g.rank, i.offset + w + 1), playerIdHash: M(g.player_id_hash), displayLabel: M(g.display_label, "\u0645\u0633\u0627\u0641\u0631 \u0642\u0646\u0627\u062A"), totalScore: D(g.total_score, 0), bestSingleScore: D(g.best_single_score, 0), verifiedSubmissions: D(g.verified_submissions, 0), challengesCompleted: D(g.challenges_completed, 0), lastSubmittedAt: M(g.last_submitted_at) })), f;
      if (i.playerIdHash) {
        let g = await this.executeSql(`
          WITH aggregated AS (
            SELECT
              p.player_id_hash,
              p.display_label,
              p.total_verified_score AS total_score,
              GREATEST(p.best_daily_score, p.best_friend_score) AS best_single_score,
              p.verified_submissions,
              COALESCE(COUNT(lb.challenge_id), 0)::INTEGER AS challenges_completed,
              COALESCE(MAX(lb.submitted_at), p.updated_at) AS last_submitted_at
            FROM players p
            INNER JOIN leaderboard_best lb ON lb.player_id_hash = p.player_id_hash
            GROUP BY p.player_id_hash, p.display_label, p.total_verified_score, p.best_daily_score, p.best_friend_score, p.verified_submissions, p.updated_at
          ),
          ranked AS (
            SELECT
              ROW_NUMBER() OVER (
                ORDER BY total_score DESC, best_single_score DESC, verified_submissions DESC, player_id_hash ASC
              ) AS rank,
              player_id_hash, display_label, total_score, best_single_score,
              verified_submissions, challenges_completed, last_submitted_at
            FROM aggregated
          )
          SELECT * FROM ranked WHERE player_id_hash = $1 LIMIT 1;
        `, [i.playerIdHash]);
        if (g.length > 0) {
          let w = g[0];
          f = { rank: D(w.rank, 1), playerIdHash: M(w.player_id_hash), displayLabel: M(w.display_label, "\u0645\u0633\u0627\u0641\u0631 \u0642\u0646\u0627\u062A"), totalScore: D(w.total_score, 0), bestSingleScore: D(w.best_single_score, 0), verifiedSubmissions: D(w.verified_submissions, 0), challengesCompleted: D(w.challenges_completed, 0), lastSubmittedAt: M(w.last_submitted_at) };
        } else f = null;
      }
      return { total: d, limit: i.limit, offset: i.offset, hasMore: i.offset + p.length < d, entries: p, ...i.playerIdHash ? { playerEntry: f } : {} };
    }
    async getPlayerBest(i) {
      let l = await this.executeSql(`
        WITH ranked AS (
          SELECT
            ROW_NUMBER() OVER (
              ORDER BY score DESC, verified_moves ASC, submitted_at ASC, submission_id ASC
            ) AS rank,
            submission_id, player_id_hash, display_label, challenge_type,
            challenge_id, date_key, score, stars, verified_moves,
            performance_tier, performance_label_fa, scoring_version, submitted_at
          FROM leaderboard_best
          WHERE challenge_type = $1 AND challenge_id = $2
        )
        SELECT * FROM ranked WHERE player_id_hash = $3 LIMIT 1;
      `, [i.challengeType, i.challengeId, i.playerIdHash]);
      return l.length === 0 ? null : We(l[0], 1);
    }
    async getPlayerProfile(i) {
      let l = await this.executeSql(`SELECT player_id_hash, display_label, verified_submissions, best_daily_score, best_friend_score, total_verified_score, created_at, updated_at
       FROM players WHERE player_id_hash = $1 LIMIT 1`, [i]);
      if (l.length === 0) return null;
      let s = l[0], d = await this.executeSql(`SELECT submission_id, player_id_hash, display_label, challenge_type, challenge_id, date_key,
              score, stars, verified_moves, performance_tier, performance_label_fa, scoring_version, submitted_at
       FROM verified_submissions
       WHERE player_id_hash = $1
       ORDER BY submitted_at DESC
       LIMIT 15`, [i]);
      return { playerIdHash: M(s.player_id_hash), displayLabel: M(s.display_label, "\u0645\u0633\u0627\u0641\u0631 \u0642\u0646\u0627\u062A"), verifiedSubmissions: D(s.verified_submissions, 0), bestDailyScore: D(s.best_daily_score, 0), bestFriendScore: D(s.best_friend_score, 0), totalVerifiedScore: D(s.total_verified_score, 0), createdAt: M(s.created_at), updatedAt: M(s.updated_at), recentSubmissions: d.map((p, f) => We(p, f + 1)) };
    }
    async upsertPlayerProfile(i) {
      await this.executeSql(`INSERT INTO players (player_id_hash, display_label, created_at, updated_at)
       VALUES ($1, $2, $3::TIMESTAMPTZ, $3::TIMESTAMPTZ)
       ON CONFLICT (player_id_hash) DO UPDATE
         SET display_label = EXCLUDED.display_label,
             updated_at = EXCLUDED.updated_at`, [i.playerIdHash, i.displayLabel, i.nowIso]), await this.executeSql("UPDATE leaderboard_best SET display_label = $2, updated_at = NOW() WHERE player_id_hash = $1", [i.playerIdHash, i.displayLabel]);
      let l = await this.getPlayerProfile(i.playerIdHash);
      if (!l) throw new V("Failed to read back upserted player profile.");
      return l;
    }
    async saveAttemptNonce(i) {
      await this.executeSql(`INSERT INTO challenge_nonces (
         nonce_id, challenge_type, challenge_id, player_id_hash,
         issued_at_ms, expires_at_ms, min_solve_ms
       ) VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (nonce_id) DO NOTHING`, [i.nonceId, i.challengeType, i.challengeId, i.playerIdHash, i.issuedAtMs, i.expiresAtMs, i.minSolveMs]);
    }
    async consumeAttemptNonce(i) {
      return { consumed: (await this.executeSql(`UPDATE challenge_nonces
       SET consumed_at = $5::TIMESTAMPTZ
       WHERE nonce_id = $1
         AND challenge_type = $2
         AND challenge_id = $3
         AND player_id_hash = $4
         AND consumed_at IS NULL
       RETURNING nonce_id`, [i.nonceId, i.challengeType, i.challengeId, i.playerIdHash, i.nowIso])).length > 0 };
    }
    async saveFriendChallenge(i) {
      i.createdByHash && await this.executeSql(`INSERT INTO players (player_id_hash, display_label)
         VALUES ($1, '\u0645\u0633\u0627\u0641\u0631 \u0642\u0646\u0627\u062A')
         ON CONFLICT (player_id_hash) DO NOTHING`, [i.createdByHash]);
      let s = (await this.executeSql(`INSERT INTO friend_challenges (
         challenge_id, algo_version, template_id, seed, difficulty,
         title_fa, created_by_hash, expires_at, created_at
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8::TIMESTAMPTZ, $9::TIMESTAMPTZ)
       ON CONFLICT (challenge_id) DO UPDATE
         SET expires_at = COALESCE(friend_challenges.expires_at, EXCLUDED.expires_at)
       RETURNING challenge_id, algo_version, template_id, seed, difficulty, title_fa, created_by_hash, expires_at, created_at`, [i.challengeId, i.algoVersion, i.templateId, i.seed, i.difficulty, i.titleFa, i.createdByHash, i.expiresAt, i.createdAt]))[0], d = await this.executeSql("SELECT COUNT(*)::INTEGER AS cnt FROM leaderboard_best WHERE challenge_type = 'friend' AND challenge_id = $1", [i.challengeId]);
      return { challengeId: M(s.challenge_id, i.challengeId), algoVersion: D(s.algo_version, i.algoVersion), templateId: M(s.template_id, i.templateId), seed: D(s.seed, i.seed), difficulty: M(s.difficulty, i.difficulty), titleFa: M(s.title_fa, i.titleFa), rows: i.rows, cols: i.cols, expectedMinMoves: i.expectedMinMoves, parTimeSec: i.parTimeSec, createdByHash: s.created_by_hash ? M(s.created_by_hash) : null, expiresAt: s.expires_at ? M(s.expires_at) : null, createdAt: M(s.created_at, i.createdAt), participantCount: d.length > 0 ? D(d[0].cnt, 0) : 0 };
    }
    async getFriendChallenge(i) {
      let l = await this.executeSql(`SELECT fc.challenge_id, fc.algo_version, fc.template_id, fc.seed, fc.difficulty,
              fc.title_fa, fc.created_by_hash, fc.expires_at, fc.created_at,
              (SELECT COUNT(*)::INTEGER FROM leaderboard_best lb WHERE lb.challenge_type = 'friend' AND lb.challenge_id = fc.challenge_id) AS participant_count
       FROM friend_challenges fc
       WHERE fc.challenge_id = $1
       LIMIT 1`, [i]);
      if (l.length === 0) return null;
      let s = l[0];
      return { challengeId: M(s.challenge_id), algoVersion: D(s.algo_version, 1), templateId: M(s.template_id), seed: D(s.seed, 0), difficulty: M(s.difficulty, "normal"), titleFa: M(s.title_fa), rows: 5, cols: 5, expectedMinMoves: 1, parTimeSec: 60, createdByHash: s.created_by_hash ? M(s.created_by_hash) : null, expiresAt: s.expires_at ? M(s.expires_at) : null, createdAt: M(s.created_at), participantCount: D(s.participant_count, 0) };
    }
    async checkRateLimit(i) {
      let s = await this.executeSql(`
      INSERT INTO rate_limit_buckets (bucket_key, window_start_ms, request_count, updated_at)
      VALUES ($1, $2, 1, NOW())
      ON CONFLICT (bucket_key) DO UPDATE
        SET window_start_ms = CASE
              WHEN ($2 - rate_limit_buckets.window_start_ms) >= $3 THEN $2
              ELSE rate_limit_buckets.window_start_ms
            END,
            request_count = CASE
              WHEN ($2 - rate_limit_buckets.window_start_ms) >= $3 THEN 1
              ELSE rate_limit_buckets.request_count + 1
            END,
            updated_at = NOW()
      RETURNING window_start_ms, request_count;
    `, [i.bucketKey, i.nowMs, i.windowMs]);
      if (s.length === 0) return { allowed: true, remaining: i.maxRequests - 1, retryAfterSec: 0 };
      let d = D(s[0].window_start_ms, i.nowMs), p = D(s[0].request_count, 1), f = p <= i.maxRequests, g = Math.max(0, i.maxRequests - p), w = f ? 0 : Math.max(1, Math.ceil((d + i.windowMs - i.nowMs) / 1e3));
      return { allowed: f, remaining: g, retryAfterSec: w };
    }
  };
  var X = class {
    constructor() {
      this.isConfigured = false;
      this.driverName = "unconfigured";
    }
    async ping() {
      throw new x();
    }
    async saveVerifiedSubmission(i) {
      throw new x();
    }
    async getDailyLeaderboard(i) {
      throw new x();
    }
    async getFriendLeaderboard(i) {
      throw new x();
    }
    async getGlobalLeaderboard(i) {
      throw new x();
    }
    async getPlayerBest(i) {
      throw new x();
    }
    async hasDuplicateSubmission(i) {
      throw new x();
    }
    async getPlayerProfile(i) {
      throw new x();
    }
    async upsertPlayerProfile(i) {
      throw new x();
    }
    async saveAttemptNonce(i) {
      throw new x();
    }
    async consumeAttemptNonce(i) {
      throw new x();
    }
    async saveFriendChallenge(i) {
      throw new x();
    }
    async getFriendChallenge(i) {
      throw new x();
    }
    async checkRateLimit(i) {
      throw new x();
    }
  };
  function Ye(n) {
    return /^postgres(ql)?:\/\//i.test(n.trim());
  }
  function Ct(n) {
    let i = (n.storageDriver ?? "").trim().toLowerCase(), l = (n.storageUrl ?? "").trim(), s = (n.storageToken ?? "").trim();
    if (!l) return new X();
    if (i === "neon-http" || i === "neon") {
      try {
        if (Ye(l)) {
          let g = new URL(l);
          if (!g.hostname) return new X();
          let w = s && Ye(s) ? s : l;
          return new fe({ endpointUrl: `https://${g.hostname}/sql`, authToken: w, authMode: "neon-connection-string", driverName: "neon-http" });
        }
        let d = new URL(l), p = d.protocol === "https:", f = n.appEnv === "development" && d.protocol === "http:" && (d.hostname === "localhost" || d.hostname === "127.0.0.1");
        if ((p || f) && s) return new fe({ endpointUrl: d.toString(), authToken: s, authMode: "neon-connection-string", driverName: "neon-http" });
      } catch {
        return new X();
      }
      return new X();
    }
    if (i === "postgres-http") try {
      let d = new URL(l), p = d.protocol === "https:", f = n.appEnv === "development" && d.protocol === "http:" && (d.hostname === "localhost" || d.hostname === "127.0.0.1");
      if (p || f) {
        let g = d.hostname.toLowerCase().endsWith(".neon.tech") && !!(s && Ye(s));
        return new fe({ endpointUrl: d.toString(), authToken: s || void 0, authMode: g ? "neon-connection-string" : "bearer", driverName: g ? "neon-http" : "postgres-http" });
      }
    } catch {
      return new X();
    }
    return new X();
  }
  var bo = 20, Ft = 50, Z = /^[a-zA-Z0-9_-]{12,64}$/, _o = /^[a-zA-Z0-9_.:-]{8,80}$/, Eo = 7200 * 1e3, So = 168, To = 720, Xe = 6e4, Io = new TextEncoder(), Ne = /* @__PURE__ */ new Map();
  function Ro(n, i, l) {
    Ne.size > 2e3 && Ne.clear();
    let s = Ne.get(n);
    return !s || l - s.windowStartMs >= Xe ? (Ne.set(n, { windowStartMs: l, count: 1 }), { allowed: true, retryAfterSec: 0 }) : (s.count += 1, s.count > i ? { allowed: false, retryAfterSec: Math.max(1, Math.ceil((s.windowStartMs + Xe - l) / 1e3)) } : { allowed: true, retryAfterSec: 0 });
  }
  function Vt(n, i) {
    let l = n.headers.get("origin");
    if (!l) return {};
    let s = "";
    try {
      s = new URL(n.url).origin;
    } catch {
      s = "";
    }
    return l === s || i.allowedOrigins.includes(l) ? { "Access-Control-Allow-Origin": l, "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type, Idempotency-Key, X-Request-Id", "Access-Control-Expose-Headers": "X-Request-Id, Retry-After", Vary: "Origin" } : { Vary: "Origin" };
  }
  function $(n, i, l, s, d, p) {
    let f = { "Content-Type": "application/json; charset=utf-8", "X-Content-Type-Options": "nosniff", "X-Frame-Options": "DENY", "Referrer-Policy": "no-referrer", "Cache-Control": "no-store", "X-Request-Id": d, ...Vt(l, s), ...p ?? {} };
    return new Response(JSON.stringify(n), { status: i, headers: f });
  }
  function T(n, i, l, s, d, p, f, g) {
    return $({ ok: false, apiVersion: "v1", requestId: p, error: f ? { code: i, message: l, details: f } : { code: i, message: l } }, n, s, d, p, g);
  }
  async function we(n, i, l) {
    if (!(n.headers.get("content-type") ?? "").toLowerCase().includes("application/json")) return { ok: false, response: T(415, "UNSUPPORTED_MEDIA_TYPE", "Content-Type must be application/json.", n, i, l) };
    let d = n.headers.get("content-length");
    if (d) {
      let f = Number.parseInt(d, 10);
      if (Number.isFinite(f) && f > z) return { ok: false, response: T(413, "PAYLOAD_TOO_LARGE", `Request body exceeds maximum allowed size of ${z} bytes.`, n, i, l, { maxBytes: z }) };
    }
    let p = "";
    try {
      if (n.body && typeof n.body.getReader == "function") {
        let f = n.body.getReader(), g = new TextDecoder("utf-8"), w = 0, _ = [];
        for (; ; ) {
          let { done: m, value: b } = await f.read();
          if (m) break;
          if (b) {
            if (w += b.byteLength, w > z) {
              try {
                await f.cancel();
              } catch {
              }
              return { ok: false, response: T(413, "PAYLOAD_TOO_LARGE", `Request body exceeds maximum allowed size of ${z} bytes.`, n, i, l, { maxBytes: z, receivedBytes: w }) };
            }
            _.push(g.decode(b, { stream: true }));
          }
        }
        _.push(g.decode()), p = _.join("");
      } else {
        p = await n.text();
        let f = Io.encode(p).byteLength;
        if (f > z) return { ok: false, response: T(413, "PAYLOAD_TOO_LARGE", `Request body exceeds maximum allowed size of ${z} bytes.`, n, i, l, { maxBytes: z, receivedBytes: f }) };
      }
    } catch {
      return { ok: false, response: T(400, "INVALID_BODY", "Unable to read request body.", n, i, l) };
    }
    if (!p.trim()) return { ok: false, response: T(400, "INVALID_JSON", "Request body cannot be empty.", n, i, l) };
    try {
      return { ok: true, data: JSON.parse(p) };
    } catch {
      return { ok: false, response: T(400, "INVALID_JSON", "Malformed JSON request body.", n, i, l) };
    }
  }
  function je(n) {
    let i = n.searchParams.get("limit"), l = n.searchParams.get("offset"), s = bo;
    if (i !== null && i !== "") {
      if (!/^\d+$/.test(i)) return { error: "limit must be a positive integer." };
      let p = Number.parseInt(i, 10);
      if (p < 1 || p > Ft) return { error: `limit must be between 1 and ${Ft}.` };
      s = p;
    }
    let d = 0;
    if (l !== null && l !== "") {
      if (!/^\d+$/.test(l)) return { error: "offset must be a non-negative integer." };
      let p = Number.parseInt(l, 10);
      if (p < 0 || p > 1e4) return { error: "offset must be between 0 and 10000." };
      d = p;
    }
    return { limit: s, offset: d };
  }
  function kt(n) {
    if (typeof n != "string") return "\u0645\u0633\u0627\u0641\u0631 \u0642\u0646\u0627\u062A";
    let i = n.replace(/[\u0000-\u001F\u007F<>]/g, "").replace(/\s+/g, " ").trim().slice(0, 24);
    return i.length >= 2 ? i : "\u0645\u0633\u0627\u0641\u0631 \u0642\u0646\u0627\u062A";
  }
  function Q(n) {
    return `p_${De(`qanatchi:anon:v1:${n}`).slice(0, 24)}`;
  }
  function Ao(n, i, l) {
    let s = l.map((d) => `${d.row},${d.col}`).join(";");
    return `sub_${De(`qanatchi:sub:v1:${n}:${i}:${s}`).slice(0, 32)}`;
  }
  function vo(n) {
    let i = n.headers.get("x-forwarded-for")?.split(",")[0]?.trim(), l = n.headers.get("ar-real-ip")?.trim() ?? n.headers.get("x-real-ip")?.trim() ?? i ?? "unknown";
    return De(`qanatchi:ip:${l}`).slice(0, 16);
  }
  function Ze(n) {
    return n.signingSecret && n.signingSecret.length >= 16 ? n.signingSecret : n.appEnv === "development" || n.appEnv === "test" ? "qanatchi-local-dev-ephemeral-signing-key-only" : null;
  }
  function Lo(n, i) {
    let l = n.headers.get("idempotency-key")?.trim() ?? "", s = typeof i.idempotencyKey == "string" ? i.idempotencyKey.trim() : "", d = l || s;
    return !d || !_o.test(d) ? null : d;
  }
  async function Ut(n, i) {
    let l = Date.now(), s = Ot(i?.configOverrides, i?.bindings), d = i?.storage ?? Ct(s), p = { ...s, storageConfigured: d.isConfigured, storageDriver: d.driverName }, f = n.headers.get("x-request-id")?.trim(), g = f && /^[a-zA-Z0-9_-]{8,48}$/.test(f) ? f : `req_${xe(8)}`, w = "/", _, m;
    try {
      try {
        w = new URL(n.url).pathname.replace(/\/+$/, "") || "/";
      } catch {
        w = "/invalid-url";
      }
      if (m = await Mo(n, d, p, g, i), m.status >= 400 && !_) try {
        let E = await m.clone().json();
        typeof E?.error?.code == "string" && (_ = E.error.code);
      } catch {
      }
    } catch {
      _ = "INTERNAL_ERROR", m = T(500, "INTERNAL_ERROR", "An unexpected server error occurred.", n, p, g);
    }
    let b = Math.max(0, Date.now() - l), S;
    if (w === "/api/v1/ready" && !p.storageConfigured) try {
      let E = globalThis, I = Object.getOwnPropertyNames(E).filter((A) => /^[A-Z][A-Z0-9_]{2,}$/.test(A)).slice(0, 20), y = E.process, v = y && typeof y == "object" && y.env && typeof y.env == "object" ? Object.keys(y.env).filter((A) => /^[A-Z][A-Z0-9_]{2,}$/.test(A)).slice(0, 20) : [];
      S = { upperGlobalKeys: I, hasLexicalQanatchi: typeof globalThis.QANATCHI_CONFIG, procEnvUpperKeys: v, eventBindingKeys: i?.bindings ? Object.keys(i.bindings).slice(0, 20) : [] };
    } catch {
      S = void 0;
    }
    return Nt({ ts: new Date(l).toISOString(), level: m.status >= 500 ? "error" : m.status >= 400 ? "warn" : "info", requestId: g, method: n.method.toUpperCase(), path: w, status: m.status, durationMs: b, storageDriver: p.storageDriver, ..._ ? { errorCode: _ } : {}, ...S ? { details: S } : {} }, p.structuredLogsEnabled), m;
  }
  async function be(n, i, l, s, d, p, f) {
    let g = vo(n), w = `${d}:${f ?? g}`, _ = Ro(w, l.rateLimitMaxPerMin, p);
    if (!_.allowed) return T(429, "RATE_LIMIT_EXCEEDED", "Too many requests. Please try again shortly.", n, l, s, { retryAfterSec: _.retryAfterSec }, { "Retry-After": String(_.retryAfterSec) });
    if (i.isConfigured) try {
      let m = await i.checkRateLimit({ bucketKey: w, windowMs: Xe, maxRequests: l.rateLimitMaxPerMin, nowMs: p });
      if (!m.allowed) return T(429, "RATE_LIMIT_EXCEEDED", "Too many requests. Please try again shortly.", n, l, s, { retryAfterSec: m.retryAfterSec }, { "Retry-After": String(m.retryAfterSec) });
    } catch {
    }
    return null;
  }
  async function Pt(n) {
    let { payload: i, challengeType: l, challengeId: s, playerIdHash: d, consumeInStorage: p, storage: f, config: g, request: w, requestId: _, now: m } = n, b = typeof i.attemptToken == "string" ? i.attemptToken.trim() : "";
    if (!b) return g.requireAttemptToken ? { ok: false, response: T(400, "ATTEMPT_TOKEN_REQUIRED", "A signed server attemptToken is required for ranked submissions.", w, g, _) } : { ok: true, timingVerified: false, serverElapsedMs: null, nonceId: null };
    let S = Ze(g);
    if (!S) return { ok: false, response: T(503, "SIGNING_SECRET_NOT_CONFIGURED", "Attempt token verification requires EDGE_SIGNING_SECRET in production.", w, g, _) };
    let E = m.getTime(), I = Lt(b, S, E);
    if (!I.ok) {
      let A = I.reason === "expired" ? "ATTEMPT_TOKEN_EXPIRED" : "INVALID_ATTEMPT_TOKEN";
      return { ok: false, response: T(400, A, I.reason === "expired" ? "Attempt token has expired. Please start a fresh attempt." : "Attempt token signature or format is invalid.", w, g, _) };
    }
    let { claims: y } = I;
    if (y.challengeType !== l || y.challengeId !== s || y.playerIdHash !== d) return { ok: false, response: T(400, "ATTEMPT_TOKEN_MISMATCH", "Attempt token does not match the submitted challenge or player.", w, g, _) };
    let v = E - y.issuedAtMs;
    return v < y.minSolveMs ? { ok: false, response: T(422, "IMPOSSIBLE_SOLVE_TIME", "Submitted completion elapsed time is below the physical minimum solve threshold.", w, g, _, { serverElapsedMs: v, minSolveMs: y.minSolveMs }) } : p && f.isConfigured && !(await f.consumeAttemptNonce({ nonceId: y.nonceId, challengeType: l, challengeId: s, playerIdHash: d, nowIso: m.toISOString() })).consumed ? { ok: false, response: T(409, "NONCE_ALREADY_USED", "This attempt token has already been used or was never issued.", w, g, _) } : { ok: true, timingVerified: p ? f.isConfigured : true, serverElapsedMs: v, nonceId: y.nonceId };
  }
  async function Mo(n, i, l, s, d) {
    let p = d?.now ? d.now() : /* @__PURE__ */ new Date(), f = p.getTime(), g;
    try {
      g = new URL(n.url);
    } catch {
      return T(400, "INVALID_URL", "Request URL is invalid.", n, l, s);
    }
    if (g.search.length > 2048) return T(414, "URI_TOO_LONG", "Request query string exceeds maximum allowed length.", n, l, s);
    let w = g.pathname.replace(/\/+$/, "") || "/", _ = n.method.toUpperCase();
    if (_ === "OPTIONS" && w.startsWith("/api/v1/")) return new Response(null, { status: 204, headers: { "X-Content-Type-Options": "nosniff", "X-Frame-Options": "DENY", "Referrer-Policy": "no-referrer", "Cache-Control": "no-store", "X-Request-Id": s, ...Vt(n, l) } });
    if (w === "/api/v1/health") {
      if (_ !== "GET") return T(405, "METHOD_NOT_ALLOWED", "Only GET is allowed for /api/v1/health.", n, l, s, void 0, { Allow: "GET, OPTIONS" });
      let m = !!Ze(l), b = { ok: true, apiVersion: "v1", requestId: s, status: "ok", runtime: { platform: "arvancloud-edge", environment: l.appEnv, ecUrlConfigured: l.ecUrlPresent }, serverDateTehran: j(p), serverTimeIso: p.toISOString(), algorithms: { dailyPuzzleVersion: ee, friendChallengeVersion: se, campaignPuzzleVersion: Me, rankedScoringVersion: B, localScoringVersion: Ve }, storage: { configured: i.isConfigured, status: i.isConfigured ? "configured" : "not_configured", driver: i.driverName }, features: { dailyMetadata: true, serverVerification: true, campaignVerification: true, globalLeaderboard: i.isConfigured, serverVerifiedTiming: m && i.isConfigured, onlineFriendChallenges: i.isConfigured, playerProfiles: i.isConfigured } };
      return $(b, 200, n, l, s);
    }
    if (w === "/api/v1/ready") {
      if (_ !== "GET") return T(405, "METHOD_NOT_ALLOWED", "Only GET is allowed for /api/v1/ready.", n, l, s, void 0, { Allow: "GET, OPTIONS" });
      if (!i.isConfigured) return T(503, "STORAGE_NOT_CONFIGURED", "Edge API is alive, but durable storage is not configured.", n, l, s);
      try {
        let m = await i.ping(), b = { ok: true, apiVersion: "v1", requestId: s, ready: true, storage: { configured: true, driver: i.driverName, reachable: true, latencyMs: m.latencyMs }, serverTimeIso: p.toISOString() };
        return $(b, 200, n, l, s);
      } catch (m) {
        return m instanceof x ? T(503, m.code, m.message, n, l, s) : T(503, "STORAGE_UNAVAILABLE", "Durable storage ping failed.", n, l, s);
      }
    }
    if (w === "/api/v1/version") {
      if (_ !== "GET") return T(405, "METHOD_NOT_ALLOWED", "Only GET is allowed for /api/v1/version.", n, l, s, void 0, { Allow: "GET, OPTIONS" });
      let m = { ok: true, apiVersion: "v1", requestId: s, platform: "arvancloud-edge", totalCampaignLevels: ue.length, algorithms: { dailyPuzzleVersion: ee, friendChallengeVersion: se, campaignPuzzleVersion: Me, rankedScoringVersion: B, localScoringVersion: Ve }, supportedChallengeTypes: ["campaign", "daily", "friend"] };
      return $(m, 200, n, l, s, { "Cache-Control": "public, max-age=60" });
    }
    if (w === "/api/v1/daily") {
      if (_ !== "GET") return T(405, "METHOD_NOT_ALLOWED", "Only GET is allowed for /api/v1/daily.", n, l, s, void 0, { Allow: "GET, OPTIONS" });
      let m = g.searchParams.get("algoVersion"), b = ee;
      if (m !== null && m !== "") {
        if (!/^\d+$/.test(m)) return T(400, "UNSUPPORTED_ALGO_VERSION", "algoVersion must be a supported integer.", n, l, s, { supportedVersions: [...te] });
        if (b = Number.parseInt(m, 10), !te.includes(b)) return T(400, "UNSUPPORTED_ALGO_VERSION", `Unsupported daily puzzle algorithm version: ${b}.`, n, l, s, { supportedVersions: [...te] });
      }
      let S = j(p), E = ve(S, b), I = { ok: true, apiVersion: "v1", requestId: s, daily: { challengeId: E.challengeId, dateKey: E.dateKey, persianDateFa: E.persianDateFa, algoVersion: E.algoVersion, templateId: E.templateId, seed: E.seed, titleFa: E.titleFa, introFa: E.introFa, difficulty: E.difficulty, rows: E.level.rows, cols: E.level.cols, expectedMinMoves: E.level.expectedMinMoves, parTimeSec: E.level.parTimeSec } };
      return $(I, 200, n, l, s, { "Cache-Control": "public, max-age=60" });
    }
    if (w === "/api/v1/challenges/start") {
      if (_ !== "POST") return T(405, "METHOD_NOT_ALLOWED", "Only POST is allowed for /api/v1/challenges/start.", n, l, s, void 0, { Allow: "POST, OPTIONS" });
      let m = await we(n, l, s);
      if (!m.ok) return m.response;
      if (!m.data || typeof m.data != "object" || Array.isArray(m.data)) return T(400, "INVALID_REQUEST", "Request body must be a JSON object.", n, l, s);
      let b = m.data, S = typeof b.playerId == "string" ? b.playerId.trim() : "";
      if (!Z.test(S)) return T(400, "INVALID_PLAYER_ID", "playerId must be an anonymous opaque identifier (12-64 characters).", n, l, s);
      let E = Q(S), I = await be(n, i, l, s, "start", f, E);
      if (I) return I;
      let y = Ge(b, { now: p });
      if (!y.ok) return T(y.httpStatus, y.code, y.message, n, l, s, y.details);
      let v = Ze(l);
      if (!v) return T(503, "SIGNING_SECRET_NOT_CONFIGURED", "EDGE_SIGNING_SECRET is not configured in this production deployment.", n, l, s);
      let A = `n_${xe(12)}`, N = Math.min(4e3, Math.max(500, y.level.expectedMinMoves * 200)), R = f + Eo, O = vt({ v: 1, nonceId: A, challengeType: y.challengeType, challengeId: y.challengeId, playerIdHash: E, issuedAtMs: f, expiresAtMs: R, minSolveMs: N }, v), k = false;
      if (i.isConfigured) try {
        await i.saveAttemptNonce({ nonceId: A, challengeType: y.challengeType, challengeId: y.challengeId, playerIdHash: E, issuedAtMs: f, expiresAtMs: R, minSolveMs: N }), k = true;
      } catch {
        k = false;
      }
      let L = { ok: true, apiVersion: "v1", requestId: s, attempt: { attemptToken: O, nonceId: A, challengeType: y.challengeType, challengeId: y.challengeId, issuedAtIso: new Date(f).toISOString(), expiresAtIso: new Date(R).toISOString(), minSolveTimeMs: N, persistedNonce: k } };
      return $(L, 201, n, l, s);
    }
    if (w === "/api/v1/challenges/verify") {
      if (_ !== "POST") return T(405, "METHOD_NOT_ALLOWED", "Only POST is allowed for /api/v1/challenges/verify.", n, l, s, void 0, { Allow: "POST, OPTIONS" });
      let m = await we(n, l, s);
      if (!m.ok) return m.response;
      let b = await be(n, i, l, s, "verify", f);
      if (b) return b;
      let S = $e(m.data, { now: p });
      if (!S.ok) return T(S.httpStatus, S.code, S.message, n, l, s, S.details);
      let E = m.data, I = false, y = null;
      if (typeof E.attemptToken == "string" && E.attemptToken.trim()) {
        let A = typeof E.playerId == "string" ? E.playerId.trim() : "";
        if (!Z.test(A)) return T(400, "INVALID_PLAYER_ID", "playerId is required when verifying with an attemptToken.", n, l, s);
        let N = await Pt({ payload: E, challengeType: S.challengeType, challengeId: S.challengeId, playerIdHash: Q(A), consumeInStorage: false, storage: i, config: l, request: n, requestId: s, now: p });
        if (!N.ok) return N.response;
        I = N.timingVerified, y = N.serverElapsedMs;
      }
      let v = { ok: true, apiVersion: "v1", requestId: s, verification: { verified: true, challengeType: S.challengeType, challengeId: S.challengeId, dateKey: S.dateKey, algoVersion: S.algoVersion, scoringVersion: S.scoringVersion, templateId: S.templateId, difficulty: S.difficulty, rows: S.rows, cols: S.cols, verifiedMoves: S.verifiedMoves, trustedExpectedMinMoves: S.trustedExpectedMinMoves, rankedScore: S.rankedScore, timingVerified: I, serverElapsedMs: y } };
      return $(v, 200, n, l, s);
    }
    if (w === "/api/v1/friend-challenges") {
      if (_ !== "POST") return T(405, "METHOD_NOT_ALLOWED", "Only POST is allowed for /api/v1/friend-challenges.", n, l, s, void 0, { Allow: "POST, OPTIONS" });
      let m = await we(n, l, s);
      if (!m.ok) return m.response;
      if (!m.data || typeof m.data != "object" || Array.isArray(m.data)) return T(400, "INVALID_REQUEST", "Request body must be a JSON object.", n, l, s);
      let b = m.data, S = await be(n, i, l, s, "friend_create", f);
      if (S) return S;
      let E = typeof b.playerId == "string" ? b.playerId.trim() : "", I = E && Z.test(E) ? Q(E) : null, y;
      if (typeof b.challengeId == "string" && b.challengeId.trim()) {
        let A = de(b.challengeId.trim());
        if (!A.ok) return T(400, A.reason === "unsupported_version" ? "UNSUPPORTED_ALGO_VERSION" : "INVALID_FRIEND_CHALLENGE", `Invalid friend challenge code (${A.reason}).`, n, l, s);
        y = A.challenge;
      } else {
        let A = b.difficulty === "normal" || b.difficulty === "medium" || b.difficulty === "challenging" || b.difficulty === "hard" || b.difficulty === "expert" ? b.difficulty : "any", N = `${f}-${xe(8)}-${I ?? "anon"}`;
        y = ut(A, N);
      }
      let v = null;
      if (b.expiresInHours !== null) {
        let A = typeof b.expiresInHours == "number" && Number.isFinite(b.expiresInHours) ? Math.min(To, Math.max(1, Math.round(b.expiresInHours))) : So;
        v = new Date(f + A * 3600 * 1e3).toISOString();
      }
      if (!i.isConfigured) return T(503, "STORAGE_NOT_CONFIGURED", "Durable storage is not configured to persist friend challenges on the server.", n, l, s, { challengeId: y.challengeId, algoVersion: y.algoVersion });
      try {
        let A = await i.saveFriendChallenge({ challengeId: y.challengeId, algoVersion: y.algoVersion, templateId: y.templateId, seed: y.seed, difficulty: y.difficulty, titleFa: y.titleFa, rows: y.level.rows, cols: y.level.cols, expectedMinMoves: y.level.expectedMinMoves, parTimeSec: y.level.parTimeSec, createdByHash: I, expiresAt: v, createdAt: p.toISOString() });
        return $({ ok: true, apiVersion: "v1", requestId: s, friendChallenge: A }, 201, n, l, s);
      } catch (A) {
        return A instanceof V || A instanceof x ? T(503, A.code, A.message, n, l, s) : T(500, "STORAGE_ERROR", "Failed to save friend challenge metadata.", n, l, s);
      }
    }
    if (w.startsWith("/api/v1/friend-challenges/")) {
      if (_ !== "GET") return T(405, "METHOD_NOT_ALLOWED", "Only GET is allowed for /api/v1/friend-challenges/:challengeId.", n, l, s, void 0, { Allow: "GET, OPTIONS" });
      let m = decodeURIComponent(w.slice(26)).trim(), b = de(m);
      if (!b.ok) return T(400, b.reason === "unsupported_version" ? "UNSUPPORTED_ALGO_VERSION" : "INVALID_FRIEND_CHALLENGE", `Invalid friend challenge code (${b.reason}).`, n, l, s);
      let S = null;
      if (i.isConfigured) try {
        if (S = await i.getFriendChallenge(b.challenge.challengeId), S?.expiresAt && Date.parse(S.expiresAt) < f) return T(410, "CHALLENGE_EXPIRED", "This friend challenge has expired.", n, l, s, { challengeId: S.challengeId, expiresAt: S.expiresAt });
      } catch {
        S = null;
      }
      let E = b.challenge, I = { ok: true, apiVersion: "v1", requestId: s, friendChallenge: { challengeId: E.challengeId, algoVersion: E.algoVersion, templateId: E.templateId, seed: E.seed, difficulty: E.difficulty, titleFa: E.titleFa, rows: E.level.rows, cols: E.level.cols, expectedMinMoves: E.level.expectedMinMoves, parTimeSec: E.level.parTimeSec, createdByHash: S?.createdByHash ?? null, expiresAt: S?.expiresAt ?? null, createdAt: S?.createdAt ?? p.toISOString(), participantCount: S?.participantCount ?? 0 } };
      return $(I, 200, n, l, s);
    }
    if (w === "/api/v1/leaderboards/daily") {
      if (_ !== "GET") return T(405, "METHOD_NOT_ALLOWED", "Only GET is allowed for /api/v1/leaderboards/daily.", n, l, s, void 0, { Allow: "GET, OPTIONS" });
      let m = (g.searchParams.get("date") ?? j(p)).trim();
      if (!Y(m)) return T(400, "INVALID_DATE_KEY", "date query parameter must be a valid YYYY-MM-DD Tehran date.", n, l, s);
      let b = je(g);
      if ("error" in b) return T(400, "INVALID_PAGINATION", b.error, n, l, s);
      let S = g.searchParams.get("playerId")?.trim() ?? "", E = S && Z.test(S) ? Q(S) : null, I = `daily-v${ee}-${m}`;
      if (!i.isConfigured) return T(503, "STORAGE_NOT_CONFIGURED", "Durable leaderboard storage is not configured in this Edge deployment.", n, l, s, { challengeType: "daily", dateKey: m });
      try {
        let y = await i.getDailyLeaderboard({ dateKey: m, challengeId: I, limit: b.limit, offset: b.offset }), v = E ? await i.getPlayerBest({ challengeType: "daily", challengeId: I, playerIdHash: E }) : null, A = { ok: true, apiVersion: "v1", requestId: s, leaderboard: { challengeType: "daily", challengeId: I, dateKey: m, scoringVersion: B, total: y.total, limit: y.limit, offset: y.offset, hasMore: y.hasMore, entries: y.entries, ...E ? { playerBest: v } : {} } };
        return $(A, 200, n, l, s);
      } catch (y) {
        return y instanceof x || y instanceof V ? T(503, y.code, y.message, n, l, s) : T(500, "STORAGE_ERROR", "Failed to retrieve daily leaderboard.", n, l, s);
      }
    }
    if (w === "/api/v1/leaderboards/friend") {
      if (_ !== "GET") return T(405, "METHOD_NOT_ALLOWED", "Only GET is allowed for /api/v1/leaderboards/friend.", n, l, s, void 0, { Allow: "GET, OPTIONS" });
      let m = (g.searchParams.get("challengeId") ?? "").trim(), b = de(m);
      if (!b.ok) return T(400, b.reason === "unsupported_version" ? "UNSUPPORTED_ALGO_VERSION" : "INVALID_FRIEND_CHALLENGE", `Invalid friend challengeId (${b.reason}).`, n, l, s);
      let S = je(g);
      if ("error" in S) return T(400, "INVALID_PAGINATION", S.error, n, l, s);
      let E = g.searchParams.get("playerId")?.trim() ?? "", I = E && Z.test(E) ? Q(E) : null;
      if (!i.isConfigured) return T(503, "STORAGE_NOT_CONFIGURED", "Durable leaderboard storage is not configured in this Edge deployment.", n, l, s, { challengeType: "friend", challengeId: b.challenge.challengeId });
      try {
        let y = await i.getFriendLeaderboard({ challengeId: b.challenge.challengeId, limit: S.limit, offset: S.offset }), v = I ? await i.getPlayerBest({ challengeType: "friend", challengeId: b.challenge.challengeId, playerIdHash: I }) : null, A = { ok: true, apiVersion: "v1", requestId: s, leaderboard: { challengeType: "friend", challengeId: b.challenge.challengeId, dateKey: null, scoringVersion: B, total: y.total, limit: y.limit, offset: y.offset, hasMore: y.hasMore, entries: y.entries, ...I ? { playerBest: v } : {} } };
        return $(A, 200, n, l, s);
      } catch (y) {
        return y instanceof x || y instanceof V ? T(503, y.code, y.message, n, l, s) : T(500, "STORAGE_ERROR", "Failed to retrieve friend challenge leaderboard.", n, l, s);
      }
    }
    if (w === "/api/v1/leaderboards/global") {
      if (_ !== "GET") return T(405, "METHOD_NOT_ALLOWED", "Only GET is allowed for /api/v1/leaderboards/global.", n, l, s, void 0, { Allow: "GET, OPTIONS" });
      let m = je(g);
      if ("error" in m) return T(400, "INVALID_PAGINATION", m.error, n, l, s);
      let b = g.searchParams.get("playerId")?.trim() ?? "", S = b && Z.test(b) ? Q(b) : null;
      if (!i.isConfigured) return T(503, "STORAGE_NOT_CONFIGURED", "Durable leaderboard storage is not configured in this Edge deployment.", n, l, s, { scope: "global" });
      try {
        let E = await i.getGlobalLeaderboard({ limit: m.limit, offset: m.offset, playerIdHash: S }), I = { ok: true, apiVersion: "v1", requestId: s, leaderboard: { scope: "global", scoringVersion: B, total: E.total, limit: E.limit, offset: E.offset, hasMore: E.hasMore, entries: E.entries, ...S ? { playerEntry: E.playerEntry ?? null } : {} } };
        return $(I, 200, n, l, s);
      } catch (E) {
        return E instanceof x || E instanceof V ? T(503, E.code, E.message, n, l, s) : T(500, "STORAGE_ERROR", "Failed to retrieve global leaderboard.", n, l, s);
      }
    }
    if (w === "/api/v1/leaderboards/submit") {
      if (_ !== "POST") return T(405, "METHOD_NOT_ALLOWED", "Only POST is allowed for /api/v1/leaderboards/submit.", n, l, s, void 0, { Allow: "POST, OPTIONS" });
      let m = await we(n, l, s);
      if (!m.ok) return m.response;
      if (!m.data || typeof m.data != "object" || Array.isArray(m.data)) return T(400, "INVALID_SUBMISSION", "Submission payload must be a JSON object.", n, l, s);
      let b = m.data, S = typeof b.playerId == "string" ? b.playerId.trim() : "";
      if (!Z.test(S)) return T(400, "INVALID_PLAYER_ID", "playerId must be an anonymous opaque identifier (12-64 alphanumeric/underscore/hyphen characters).", n, l, s);
      let E = Q(S), I = await be(n, i, l, s, "submit", f, E);
      if (I) return I;
      let y = $e(b, { now: p });
      if (!y.ok) return T(y.httpStatus, y.code, y.message, n, l, s, y.details);
      if (y.challengeType === "friend" && i.isConfigured) try {
        let L = await i.getFriendChallenge(y.challengeId);
        if (L?.expiresAt && Date.parse(L.expiresAt) < f) return T(410, "CHALLENGE_EXPIRED", "This friend challenge has expired and no longer accepts new scores.", n, l, s);
      } catch {
      }
      if (!i.isConfigured) return T(503, "STORAGE_NOT_CONFIGURED", "Solution verified, but durable leaderboard storage is not configured in this Edge deployment.", n, l, s, { verified: true, verifiedScore: y.rankedScore.score, verifiedMoves: y.verifiedMoves, scoringVersion: y.scoringVersion });
      let v = kt(b.displayLabel), A = p.toISOString(), N = b.actions, R = Ao(E, y.challengeId, N), O = `${R.slice(0, 20)}_${p.getTime().toString(36)}`, k = Lo(n, b);
      try {
        let L = await Pt({ payload: b, challengeType: y.challengeType, challengeId: y.challengeId, playerIdHash: E, consumeInStorage: true, storage: i, config: l, request: n, requestId: s, now: p });
        if (!L.ok) return L.response;
        let P = await i.saveVerifiedSubmission({ submissionId: O, submissionFingerprint: R, idempotencyKey: k, playerIdHash: E, displayLabel: v, challengeType: y.challengeType, challengeId: y.challengeId, dateKey: y.dateKey, algoVersion: y.algoVersion, scoringVersion: y.scoringVersion, score: y.rankedScore.score, stars: y.rankedScore.stars, verifiedMoves: y.verifiedMoves, performanceTier: y.rankedScore.performanceTier, performanceLabelFa: y.rankedScore.performanceLabelFa, elapsedMsServer: L.serverElapsedMs, timingVerified: L.timingVerified, nonceId: L.nonceId, submittedAt: A }), F = { ok: true, apiVersion: "v1", requestId: s, submission: { accepted: true, duplicate: P.duplicate, isNewBest: P.isNewBest, timingVerified: L.timingVerified, serverElapsedMs: L.serverElapsedMs, entry: P.entry } };
        return $(F, P.duplicate ? 200 : 201, n, l, s);
      } catch (L) {
        return L instanceof Oe ? T(409, L.code, L.message, n, l, s) : L instanceof x || L instanceof V ? T(503, L.code, L.message, n, l, s) : T(500, "STORAGE_ERROR", "Failed to save verified leaderboard submission.", n, l, s);
      }
    }
    if (w === "/api/v1/players/me") {
      if (_ !== "GET") return T(405, "METHOD_NOT_ALLOWED", "Only GET is allowed for /api/v1/players/me.", n, l, s, void 0, { Allow: "GET, OPTIONS" });
      let m = g.searchParams.get("playerId")?.trim() ?? "";
      if (!Z.test(m)) return T(400, "INVALID_PLAYER_ID", "playerId query parameter must be an anonymous opaque identifier (12-64 chars).", n, l, s);
      if (!i.isConfigured) return T(503, "STORAGE_NOT_CONFIGURED", "Durable player profile storage is not configured.", n, l, s);
      let b = Q(m);
      try {
        let E = await i.getPlayerProfile(b) ?? { playerIdHash: b, displayLabel: "\u0645\u0633\u0627\u0641\u0631 \u0642\u0646\u0627\u062A", verifiedSubmissions: 0, bestDailyScore: 0, bestFriendScore: 0, totalVerifiedScore: 0, createdAt: p.toISOString(), updatedAt: p.toISOString(), recentSubmissions: [] };
        return $({ ok: true, apiVersion: "v1", requestId: s, profile: E }, 200, n, l, s);
      } catch (S) {
        return S instanceof x || S instanceof V ? T(503, S.code, S.message, n, l, s) : T(500, "STORAGE_ERROR", "Failed to load player profile.", n, l, s);
      }
    }
    if (w === "/api/v1/players/profile") {
      if (_ !== "POST") return T(405, "METHOD_NOT_ALLOWED", "Only POST is allowed for /api/v1/players/profile.", n, l, s, void 0, { Allow: "POST, OPTIONS" });
      let m = await we(n, l, s);
      if (!m.ok) return m.response;
      if (!m.data || typeof m.data != "object" || Array.isArray(m.data)) return T(400, "INVALID_REQUEST", "Profile payload must be a JSON object.", n, l, s);
      let b = m.data, S = typeof b.playerId == "string" ? b.playerId.trim() : "";
      if (!Z.test(S)) return T(400, "INVALID_PLAYER_ID", "playerId must be an anonymous opaque identifier (12-64 chars).", n, l, s);
      if (!i.isConfigured) return T(503, "STORAGE_NOT_CONFIGURED", "Durable player profile storage is not configured.", n, l, s);
      let E = Q(S), I = await be(n, i, l, s, "profile", f, E);
      if (I) return I;
      let y = kt(b.displayLabel);
      try {
        let v = await i.upsertPlayerProfile({ playerIdHash: E, displayLabel: y, nowIso: p.toISOString() });
        return $({ ok: true, apiVersion: "v1", requestId: s, profile: v }, 200, n, l, s);
      } catch (v) {
        return v instanceof x || v instanceof V ? T(503, v.code, v.message, n, l, s) : T(500, "STORAGE_ERROR", "Failed to update player profile.", n, l, s);
      }
    }
    return T(404, "NOT_FOUND", `Unknown API route: ${w}`, n, l, s);
  }
  addEventListener("fetch", (n) => {
    let i = n, l = i.env && typeof i.env == "object" ? i.env : i.bindings && typeof i.bindings == "object" ? i.bindings : void 0;
    i.respondWith(Ut(i.request, l ? { bindings: l } : void 0));
  });
})();
