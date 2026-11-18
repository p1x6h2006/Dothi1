// =====================================================
// 2.2 (b) BÀI TOÁN NGƯỜI ĐƯA THƯ (Chinese Postman) - đồ thị vô hướng (loai 1-3)
// =====================================================
// Tìm hành trình có tổng trọng số NHỎ NHẤT đi qua mọi cạnh ít nhất 1 lần rồi quay về đỉnh xuất phát.
//   1) Σw = tổng trọng số các cạnh (cạnh không có w tính 1).
//   2) V_o = các đỉnh bậc lẻ. Rỗng -> đã có chu trình Euler, hành trình = Σw.
//   3) Floyd–Warshall tính đường đi ngắn nhất giữa mọi cặp đỉnh.
//   4) Ghép các đỉnh lẻ thành từng cặp sao cho tổng khoảng cách nhỏ nhất (quy hoạch động theo bitmask) = m(G).
//   5) Lặp lại (nhân đôi) các cạnh dọc đường đi của từng cặp -> mọi đỉnh bậc chẵn -> tìm chu trình Euler (Hierholzer).
//   Tổng hành trình = Σw + m(G).
(function () {
    const MAU_LAP = "#16a34a";
    const TOI_DA_LE = 20;
    const MAU_HIEN_TAI = "#ef4444";   // cạnh đang đi ở bước hiện tại (mô phỏng từng bước)
    let kq = null;

    function tinh(start) {
        const INF = Infinity;
        const deg = Array(n).fill(0);
        edges.forEach(e => { if (e.x === e.y) deg[e.x] += 2; else { deg[e.x]++; deg[e.y]++; } });
        const le = dsDinh().filter(v => deg[v] % 2 === 1);
        const sumW = edges.reduce((s, e) => s + trongSo(e), 0);

        // cạnh ngắn nhất giữa u và v + Floyd–Warshall có dựng lại đường đi
        const canhTot = Array.from({ length: n }, () => Array(n).fill(-1));
        const D = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => i === j ? 0 : INF));
        const next = Array.from({ length: n }, () => Array(n).fill(-1));
        edges.forEach((e, k) => {
            if (e.x === e.y) return;
            [[e.x, e.y], [e.y, e.x]].forEach(([u, v]) => {
                if (canhTot[u][v] === -1 || trongSo(e) < trongSo(edges[canhTot[u][v]])) {
                    canhTot[u][v] = k; D[u][v] = trongSo(e); next[u][v] = v;
                }
            });
        });
        for (let k = 0; k < n; k++) for (let i = 0; i < n; i++) for (let j = 0; j < n; j++)
            if (D[i][k] + D[k][j] < D[i][j]) { D[i][j] = D[i][k] + D[k][j]; next[i][j] = next[i][k]; }
        const duong = (a, b) => { const p = [a]; while (a !== b) { a = next[a][b]; p.push(a); } return p; };

        // ghép cặp nhỏ nhất (bitmask DP)
        const k = le.length, day = (1 << k) - 1;
        const f = new Float64Array(1 << k).fill(INF), chon = new Int32Array(1 << k).fill(-1);
        f[0] = 0;
        for (let mask = 0; mask < day; mask++) {
            if (f[mask] === INF) continue;
            let i = 0; while (mask & (1 << i)) i++;
            for (let j = i + 1; j < k; j++) {
                if (mask & (1 << j)) continue;
                const nm = mask | (1 << i) | (1 << j), c = f[mask] + D[le[i]][le[j]];
                if (c < f[nm]) { f[nm] = c; chon[nm] = mask; }
            }
        }
        const cap = [];
        for (let mask = day; mask > 0; mask = chon[mask]) {
            const bit = mask & ~chon[mask];
            const idx = []; for (let i = 0; i < k; i++) if (bit & (1 << i)) idx.push(i);
            const a = le[idx[0]], b = le[idx[1]], p = duong(a, b);
            cap.push({ a, b, d: D[a][b], p });
        }
        cap.reverse();
        const mG = k ? f[day] : 0;

        // thêm các cạnh lặp rồi tìm chu trình Euler trên đa đồ thị mới
        const ds = edges.map((e, i) => ({ x: e.x, y: e.y, goc: i, lap: false }));
        const dem = {};
        cap.forEach(c => { for (let i = 0; i + 1 < c.p.length; i++) {
            const id = canhTot[c.p[i]][c.p[i + 1]], e = edges[id];
            ds.push({ x: e.x, y: e.y, goc: id, lap: true }); dem[id] = (dem[id] || 0) + 1;
        } });
        const h = hierholzer(ds, start, false);
        if (!h) return { loi: "Không dựng được hành trình (lỗi bất ngờ)." };
        return { le, sumW, cap, mG, dem, ds, vs: h.vs, es: h.es, tong: sumW + mG };
    }

    function chay() {
        resetChucNang();
        kq = null;
        if (coHuong()) { kq = { loi: "Bài toán người đưa thư ở đây chỉ hỗ trợ đồ thị vô hướng (loại 1–3)." }; return hienThiThongTin(); }
        if (!edges.length) { kq = { loi: "Đồ thị chưa có cạnh nào." }; return hienThiThongTin(); }
        if (edges.some(e => trongSo(e) < 0)) { kq = { loi: "Có trọng số âm: không áp dụng được (cần trọng số ≥ 0)." }; return hienThiThongTin(); }
        if (!lienThongCanh(edges)) { kq = { loi: "Đồ thị không liên thông: không có hành trình đi qua mọi cạnh." }; return hienThiThongTin(); }
        const deg = Array(n).fill(0);
        edges.forEach(e => { if (e.x === e.y) deg[e.x] += 2; else { deg[e.x]++; deg[e.y]++; } });
        if (deg.filter(d => d % 2 === 1).length > TOI_DA_LE) { kq = { loi: `Quá nhiều đỉnh bậc lẻ (tối đa ${TOI_DA_LE}).` }; return hienThiThongTin(); }
        const start = docXuatPhat(dinhCoCanh()[0], true);
        if (start === null) return hienThiThongTin();

        kq = tinh(start);
        if (!kq.loi) {
            Object.keys(kq.dem).forEach(id => { toMauCanh[id] = { mau: MAU_LAP, dayNet: 6, tienTo: `×${1 + kq.dem[id]} ` }; });
            thongBaoHinh = `Người đưa thư: tổng trọng số = ${kq.tong}`;
        }
        veDoThi();
        hienThiThongTin();
    }

    // ---- Mô phỏng đường đi: bước s = đã đi s lượt đầu của hành trình (kq.es) ----
    const luotCanh = i => kq.ds[kq.es[i]];                 // lượt đi thứ i (0-based): { x, y, goc, lap }
    const tongDaDi = s => { let t = 0; for (let i = 0; i < s; i++) t += trongSo(edges[luotCanh(i).goc]); return t; };

    const tb = taoTungBuoc({
        sanSang: () => !!kq && !kq.loi,
        chay: () => chay(),
        tong: () => kq.es.length,
        ve: s => {
            const lan = {};                                  // cạnh gốc -> các lượt đã đi (1-based)
            for (let i = 0; i < s; i++) { const g = luotCanh(i).goc; (lan[g] = lan[g] || []).push(i + 1); }
            Object.keys(lan).forEach(g => {
                const dangDi = lan[g].includes(s);
                toMauCanh[g] = {
                    mau: dangDi ? MAU_HIEN_TAI : (kq.dem[g] ? MAU_LAP : MAU_EULER),
                    dayNet: dangDi ? 9 : 6,
                    tienTo: lan[g].map(t => "#" + t).join(",") + " "
                };
            });
            dinhNoiBat = kq.vs[s];
            thongBaoHinh = s === 0
                ? `Người đưa thư: xuất phát tại ${nhanDinh(kq.vs[0])} (bước 0/${kq.es.length})`
                : `Người đưa thư — bước ${s}/${kq.es.length}: ${nhanDinh(kq.vs[s - 1])} → ${nhanDinh(kq.vs[s])} · đã đi ${tongDaDi(s)}/${kq.tong}`;
        }
    });

    function htmlBuoc() {
        const s = tb.buoc();
        if (s === null) return "";
        const T = kq.es.length;
        let h = `<div class="npt-step"><b>▶ Đang mô phỏng đường đi:</b> bước ${s}/${T}</div>`;
        if (s === 0) h += `<div class="npt-path">Đang đứng ở đỉnh xuất phát <b>${nhanDinh(kq.vs[0])}</b>. Bấm "Bước tiếp" để đi.</div>`;
        else {
            const it = luotCanh(s - 1), e = edges[it.goc];
            h += `<div class="npt-path">Vừa đi từ <b>${nhanDinh(kq.vs[s - 1])}</b> đến <b>${nhanDinh(kq.vs[s])}</b> theo cạnh ${nhanCanhNgan(it.goc)}`
                + (e.w !== undefined ? `, w = ${e.w}` : "") + (it.lap ? " — <b>đi lặp lại</b> (cạnh thêm để các đỉnh lẻ thành chẵn)" : "") + ".</div>";
        }
        h += `<div class="npt-total">Đã đi: ${tongDaDi(s)} / ${kq.tong}${s === T ? " — đã về đỉnh xuất phát ✔" : ""}</div>`;
        return h;
    }

    function html() {
        if (!kq) return "";
        let h = '<br><h3>📮 Bài toán người đưa thư</h3><div class="npt-wrap">';
        if (kq.loi) return h + `<div class="euler-no">✖ ${kq.loi}</div></div>`;
        h += `<div class="npt-step"><b>Bước 1.</b> Σw(e) = ${kq.sumW} (cạnh không nhập w tính 1).</div>`;
        h += `<div class="npt-step"><b>Bước 2.</b> Đỉnh bậc lẻ V<sub>o</sub>(G) = ${kq.le.length ? "{" + kq.le.map(nhanDinh).join(", ") + "}" : "∅ (mọi đỉnh bậc chẵn → đã có chu trình Euler)"}.</div>`;
        if (kq.cap.length) {
            h += '<div class="npt-step"><b>Bước 3.</b> Ghép cặp đỉnh lẻ sao cho tổng khoảng cách ngắn nhất nhỏ nhất (Floyd–Warshall):';
            kq.cap.forEach(c => { h += `<div class="npt-path">(${nhanDinh(c.a)}, ${nhanDinh(c.b)}): d = ${c.d}, đường đi ${c.p.map(nhanDinh).join(" → ")}</div>`; });
            h += `</div><div class="npt-m">m(G) = ${kq.mG} (tổng trọng số các cạnh phải đi lặp)</div>`;
            const lap = Object.keys(kq.dem).map(id => `${nhanCanhNgan(id)}${kq.dem[id] > 1 ? " ×" + kq.dem[id] : ""}`);
            h += `<div class="npt-step">Cạnh đi lặp (tô xanh lá trên hình): ${lap.join(", ")}.</div>`;
        }
        h += `<div class="npt-step"><b>Hành trình</b> (xuất phát từ ${nhanDinh(kq.vs[0])}, ${kq.es.length} lượt đi):</div>`;
        const danhDau = i => { const it = kq.ds[kq.es[i]]; const lap = it.lap || false; return `e${it.goc + 1}${lap ? "*" : ""}`; };
        h += htmlBuoc();
        h += htmlDay(kq.vs, kq.es, danhDau, tb.buoc() === null ? undefined : tb.buoc());
        h += `<div class="euler-line">${kq.vs.map(nhanDinh).join(" → ")}</div>`;
        h += '<div class="npt-path">Dấu * : lượt đi lặp lại của cạnh.</div>';
        h += `<div class="npt-total">Tổng trọng số hành trình = Σw + m(G) = ${kq.sumW} + ${kq.mG} = ${kq.tong}</div>`;
        return h + "</div>";
    }

    dangKyChucNang({
        id: "nguoi-dua-thu",
        ten: "📮 Bài toán người đưa thư",
        mota: "Tìm hành trình có tổng trọng số nhỏ nhất đi qua mọi cạnh ít nhất 1 lần và quay về đỉnh xuất phát (đồ thị vô hướng).",
        nut: [{ nhan: "📮 Giải bài toán người đưa thư", chay, kieu: "success" }, ...tb.nut],
        html,
        reset: () => { kq = null; tb.datLai(); }
    });
})();
