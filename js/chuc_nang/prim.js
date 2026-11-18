// =====================================================
// 2.3 CÂY KHUNG NHỎ NHẤT - THUẬT TOÁN PRIM (đồ thị vô hướng, loai 1-3)
// =====================================================
// T = tập đỉnh đã vào cây, bắt đầu từ 1 đỉnh. Mỗi bước: trong các cạnh nối một đỉnh thuộc T với
// một đỉnh ngoài T, chọn cạnh có trọng số nhỏ nhất (bằng nhau thì lấy cạnh nhập trước), thêm vào cây.
// Lặp đến khi đủ n − 1 cạnh. Không đủ -> đồ thị không liên thông, không có cây khung.
(function () {
    const MAU_PRIM = "#059669";
    const MAU_HIEN_TAI = "#ef4444";   // cạnh vừa thêm ở bước hiện tại
    const MAU_UNG_VIEN = "#0ea5e9";   // cạnh ứng viên (nối cây với đỉnh ngoài cây)
    let kq = null;

    // ---- Mô phỏng từng bước: bước s = cây đã có s cạnh (kq.chon[0..s-1]) ----
    function trangThai(s) {
        const trongT = Array(n).fill(false);
        trongT[kq.start] = true;
        for (let i = 0; i < s; i++) trongT[kq.chon[i].moi] = true;
        const ungVien = [];
        edges.forEach((e, k) => { if (trongT[e.x] !== trongT[e.y]) ungVien.push(k); });
        return { trongT, ungVien };
    }

    const tb = taoTungBuoc({
        sanSang: () => !!kq && !kq.loi,
        chay: () => chay(),
        tong: () => kq.chon.length,
        ve: s => {
            const { ungVien } = trangThai(s);
            if (s < kq.chon.length) ungVien.forEach(k => { toMauCanh[k] = { mau: MAU_UNG_VIEN, dayNet: 4, netDut: true }; });   // ứng viên: nét đứt xanh dương
            for (let i = 0; i < s; i++) toMauCanh[kq.chon[i].k] = { mau: i === s - 1 ? MAU_HIEN_TAI : MAU_PRIM, dayNet: i === s - 1 ? 9 : 7, tienTo: `${i + 1}. ` };
            dinhNoiBat = s === 0 ? kq.start : kq.chon[s - 1].moi;
            thongBaoHinh = s === 0
                ? `Prim: bắt đầu từ ${nhanDinh(kq.start)} (bước 0/${kq.chon.length})`
                : `Prim — bước ${s}/${kq.chon.length}: thêm ${nhanCanhNgan(kq.chon[s - 1].k)}, w = ${kq.chon[s - 1].w} · tổng = ${kq.chon[s - 1].tong}`;
        }
    });

    function htmlBuoc() {
        const s = tb.buoc();
        if (s === null) return "";
        const T = kq.chon.length, { trongT, ungVien } = trangThai(s);
        const trongCay = dsDinh().filter(v => trongT[v]).map(nhanDinh).join(", ");
        let h = `<div class="npt-step"><b>▶ Đang mô phỏng:</b> bước ${s}/${T}</div>`;
        h += `<div class="npt-path">T = {${trongCay}} (đỉnh đã vào cây).</div>`;
        if (s > 0) h += `<div class="npt-path">Vừa thêm cạnh ${nhanCanhNgan(kq.chon[s - 1].k)}, w = ${kq.chon[s - 1].w}, đỉnh mới <b>${nhanDinh(kq.chon[s - 1].moi)}</b>.</div>`;
        if (s < T) {
            h += `<div class="npt-path">Cạnh ứng viên (nối T với đỉnh ngoài T, nét đứt xanh dương): ${ungVien.map(k => `${nhanCanhNgan(k)}·${trongSo(edges[k])}`).join(", ")}.</div>`;
            h += `<div class="npt-path">→ Bước kế tiếp chọn cạnh nhỏ nhất: <b>${nhanCanhNgan(kq.chon[s].k)}</b> (w = ${kq.chon[s].w}).</div>`;
        } else h += `<div class="npt-total">Đã đủ ${T} cạnh — xong cây khung, tổng = ${kq.tong} ✔</div>`;
        return h;
    }

    function chay() {
        resetChucNang();
        kq = null;
        if (coHuong()) { kq = { loi: "Thuật toán Prim chỉ dùng cho đồ thị vô hướng (loại 1–3)." }; return hienThiThongTin(); }
        if (n < 1) return;
        const start = docXuatPhat(0, false);
        if (start === null) return hienThiThongTin();

        const trongT = Array(n).fill(false), chon = [];
        trongT[start] = true;
        let tong = 0;
        for (let b = 1; b < n; b++) {
            let tot = -1;
            edges.forEach((e, k) => {
                if (trongT[e.x] === trongT[e.y]) return;          // cả hai trong T (hoặc cùng ngoài T, vòng khuyên)
                if (tot === -1 || trongSo(e) < trongSo(edges[tot])) tot = k;
            });
            if (tot === -1) { kq = { loi: "Đồ thị không liên thông nên không có cây khung." }; return hienThiThongTin(); }
            const e = edges[tot], moi = trongT[e.x] ? e.y : e.x;
            trongT[moi] = true; tong += trongSo(e);
            chon.push({ k: tot, moi, w: trongSo(e), tong });
        }
        kq = { start, chon, tong };
        chon.forEach((c, i) => { toMauCanh[c.k] = { mau: MAU_PRIM, dayNet: 7, tienTo: `${i + 1}. ` }; });
        thongBaoHinh = `Cây khung nhỏ nhất (Prim): ${chon.length} cạnh, tổng trọng số = ${tong}`;
        veDoThi();
        hienThiThongTin();
    }

    function html() {
        if (!kq) return "";
        let h = '<br><h3>🌲 Cây khung nhỏ nhất (Prim)</h3><div class="npt-wrap">';
        if (kq.loi) return h + `<div class="euler-no">✖ ${kq.loi}</div></div>`;
        h += htmlBuoc();
        h += `<div class="npt-step">Bắt đầu từ đỉnh ${nhanDinh(kq.start)}. Cây khung có n − 1 = ${n - 1} cạnh:</div>`;
        h += '<div class="kr-scroll"><table class="kr-table"><tr><th>Thứ tự</th><th>Cạnh được chọn</th><th>Đỉnh mới</th><th>Trọng số</th><th>Tổng tích lũy</th></tr>';
        kq.chon.forEach((c, i) => {
            h += `<tr${tb.buoc() !== null && i >= tb.buoc() ? ' style="opacity:.35"' : ""}><td>${i + 1}</td><td class="kr-chon">${nhanCanhNgan(c.k)}</td><td>${nhanDinh(c.moi)}</td><td>${c.w}</td><td>${c.tong}</td></tr>`;
        });
        h += "</table></div>";
        h += `<div class="npt-step">Các cạnh thuộc cây khung (tô xanh trên hình): ${kq.chon.map(c => nhanCanhNgan(c.k)).join(", ")}.</div>`;
        h += `<div class="npt-total">Tổng trọng số cây khung nhỏ nhất = ${kq.tong}</div>`;
        return h + "</div>";
    }

    dangKyChucNang({
        id: "prim",
        ten: "🌲 Cây khung nhỏ nhất (Prim)",
        mota: "Tìm cây khung nhỏ nhất của đồ thị vô hướng có trọng số bằng thuật toán Prim. Cạnh không có trọng số tính w = 1.",
        nut: [{ nhan: "🌲 Tìm cây khung nhỏ nhất (Prim)", chay, kieu: "success" }, ...tb.nut],
        html,
        reset: () => { kq = null; tb.datLai(); }
    });
})();
