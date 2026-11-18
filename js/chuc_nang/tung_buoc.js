// =====================================================
// MÔ PHỎNG TỪNG BƯỚC: bộ điều khiển dùng chung (Người đưa thư, Prim)
// =====================================================
// taoTungBuoc({ sanSang, chay, tong, ve }) trả về { nut, buoc, datLai }
//   sanSang() : đã có kết quả hợp lệ chưa
//   chay()    : tính kết quả (chính là nút "giải" của chức năng) - gọi khi người dùng bấm bước mà chưa có kết quả
//   tong()    : tổng số bước (bước 0 = chưa đi gì, bước tong() = xong)
//   ve(s)     : tô màu hình cho bước s (gán toMauCanh / dinhNoiBat / thongBaoHinh, KHÔNG gọi veDoThi)
//   buoc()    : bước hiện tại (null = đang xem toàn bộ kết quả, không ở chế độ từng bước)
//   datLai()  : dừng tự chạy + thoát chế độ từng bước (gọi trong reset của chức năng)
// Mỗi lần đổi bước, trang tự cuộn tới hình để khỏi phải kéo lên xuống.

function cuonToiHinh() {
    const r = svg.getBoundingClientRect();
    if (r.top < 0 || r.bottom > window.innerHeight) svg.scrollIntoView({ behavior: "smooth", block: "center" });
}

function taoTungBuoc(cfg) {
    let s = null, hen = null;
    const dung = () => { if (hen) clearInterval(hen); hen = null; };

    function dat(m) {
        if (!cfg.sanSang()) { cfg.chay(); if (!cfg.sanSang()) return false; }   // chưa có kết quả thì tính trước
        s = Math.max(0, Math.min(cfg.tong(), m));
        toMauCanh = {}; dinhNoiBat = null; thongBaoHinh = "";
        cfg.ve(s);
        veDoThi();
        hienThiThongTin();
        cuonToiHinh();
        return true;
    }

    function tuChay() {
        dung();
        const batDau = (s === null || (cfg.sanSang() && s >= cfg.tong())) ? 0 : s;
        if (!dat(batDau)) return;
        hen = setInterval(() => { if (s >= cfg.tong()) return dung(); dat(s + 1); }, 1000);
    }

    return {
        buoc: () => s,
        datLai: () => { dung(); s = null; },
        nut: [
            { nhan: "⏮ Về đầu", kieu: "info", chay: () => { dung(); dat(0); } },
            { nhan: "◀ Bước trước", kieu: "info", chay: () => { dung(); dat(s === null ? 0 : s - 1); } },
            { nhan: "Bước tiếp ▶", kieu: "success", chay: () => { dung(); dat(s === null ? 1 : s + 1); } },
            { nhan: "⏩ Tự chạy", kieu: "success", chay: tuChay },
            { nhan: "⏸ Dừng", kieu: "danger", chay: dung }
        ]
    };
}
