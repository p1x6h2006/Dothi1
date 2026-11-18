// =====================================================
// 2.3 CÂY KHUNG NHỎ NHẤT - THUẬT TOÁN PRIM (đồ thị vô hướng, loai 1-3)
// =====================================================
// T = tập đỉnh đã vào cây, bắt đầu từ 1 đỉnh. Mỗi bước: trong các cạnh nối một đỉnh thuộc T với
// một đỉnh ngoài T, chọn cạnh có trọng số nhỏ nhất (bằng nhau thì lấy cạnh nhập trước), thêm vào cây.
// Lặp đến khi đủ n − 1 cạnh. Không đủ -> đồ thị không liên thông, không có cây khung.
(function () {
    const MAU_PRIM = "#059669";
    let kq = null;

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
        h += `<div class="npt-step">Bắt đầu từ đỉnh ${nhanDinh(kq.start)}. Cây khung có n − 1 = ${n - 1} cạnh:</div>`;
        h += '<div class="kr-scroll"><table class="kr-table"><tr><th>Thứ tự</th><th>Cạnh được chọn</th><th>Đỉnh mới</th><th>Trọng số</th><th>Tổng tích lũy</th></tr>';
        kq.chon.forEach((c, i) => {
            h += `<tr><td>${i + 1}</td><td class="kr-chon">${nhanCanhNgan(c.k)}</td><td>${nhanDinh(c.moi)}</td><td>${c.w}</td><td>${c.tong}</td></tr>`;
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
        nut: [{ nhan: "🌲 Tìm cây khung nhỏ nhất (Prim)", chay, kieu: "success" }],
        html,
        reset: () => { kq = null; }
    });
})();
