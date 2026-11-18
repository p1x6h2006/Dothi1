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

    // Trả về chuỗi lỗi nếu không giải được, null nếu hợp lệ (dùng cả cho nút Euler)
    function loiNguoiDuaThu() {
        if (coHuong()) return "Bài toán người đưa thư ở đây chỉ hỗ trợ đồ thị vô hướng (loại 1–3).";
        if (!edges.length) return "Đồ thị chưa có cạnh nào.";
        if (edges.some(e => trongSo(e) < 0)) return "Có trọng số âm: không áp dụng được (cần trọng số ≥ 0).";
        if (!lienThongCanh(edges)) return "Đồ thị không liên thông: có lặp cạnh cũng không đi hết được mọi cạnh.";
        const deg = Array(n).fill(0);
        edges.forEach(e => { if (e.x === e.y) deg[e.x] += 2; else { deg[e.x]++; deg[e.y]++; } });
        if (deg.filter(d => d % 2 === 1).length > TOI_DA_LE) return `Quá nhiều đỉnh bậc lẻ (tối đa ${TOI_DA_LE}).`;
        return null;
    }

    // Tô các cạnh phải lặp màu xanh lá, ghi "×số lần đi"
    function toCanhLap(r) {
        Object.keys(r.dem).forEach(id => { toMauCanh[id] = { mau: MAU_LAP, dayNet: 6, tienTo: `×${1 + r.dem[id]} ` }; });
    }

    function chay() {
        resetChucNang();
        kq = null;
        const loi = loiNguoiDuaThu();
        if (loi) { kq = { loi }; return hienThiThongTin(); }
        const start = docXuatPhat(dinhCoCanh()[0], true);
        if (start === null) return hienThiThongTin();

        kq = tinh(start);
        if (!kq.loi) {
            toCanhLap(kq);
            thongBaoHinh = `Người đưa thư: tổng trọng số = ${kq.tong}`;
        }
        veDoThi();
        hienThiThongTin();
    }

    // Phần "cạnh lặp + hành trình + tổng" (dùng cho cả mục Người đưa thư và mục Euler)
    function htmlHanhTrinh(r) {
        let h = "";
        if (r.cap.length) {
            const lap = Object.keys(r.dem).map(id => `${nhanCanhNgan(id)}${r.dem[id] > 1 ? " ×" + r.dem[id] : ""}`);
            h += `<div class="npt-step">Cạnh đi lặp (tô xanh lá trên hình): ${lap.join(", ")}.</div>`;
        }
        h += `<div class="npt-step"><b>Hành trình</b> (xuất phát từ ${nhanDinh(r.vs[0])}, ${r.es.length} lượt đi):</div>`;
        h += htmlDay(r.vs, r.es, i => { const it = r.ds[r.es[i]]; return `e${it.goc + 1}${it.lap ? "*" : ""}`; });
        h += `<div class="euler-line">${r.vs.map(nhanDinh).join(" → ")}</div>`;
        h += '<div class="npt-path">Dấu * : lượt đi lặp lại của cạnh.</div>';
        h += `<div class="npt-total">Tổng trọng số hành trình = Σw + m(G) = ${r.sumW} + ${r.mG} = ${r.tong}</div>`;
        return h;
    }

    // Cho nút Euler dùng
    window.loiNguoiDuaThu = loiNguoiDuaThu;
    window.tinhNguoiDuaThu = tinh;
    window.toCanhLapNguoiDuaThu = toCanhLap;
    window.htmlHanhTrinhLap = htmlHanhTrinh;

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
        }
        h += htmlHanhTrinh(kq);
        return h + "</div>";
    }

    dangKyChucNang({
        id: "nguoi-dua-thu",
        ten: "📮 Bài toán người đưa thư",
        mota: "Tìm hành trình có tổng trọng số nhỏ nhất đi qua mọi cạnh ít nhất 1 lần và quay về đỉnh xuất phát (đồ thị vô hướng).",
        nut: [{ nhan: "📮 Giải bài toán người đưa thư", chay, kieu: "success" }],
        html,
        reset: () => { kq = null; }
    });
})();
