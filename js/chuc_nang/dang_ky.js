// =====================================================
// ĐĂNG KÝ CHỨC NĂNG: chỗ "cắm" các câu cô giao vào giao diện
// =====================================================
// Mỗi câu / chức năng mới = 1 file mới trong thư mục js/chuc_nang/, gọi dangKyChucNang({...}).
// Khung giao diện lo phần còn lại: hiện nút ở khung Điều khiển, hiện kết quả ở khung Thông tin,
// xóa kết quả khi đồ thị bị sửa, lưu / khôi phục.
//
// dangKyChucNang({
//     id:    "ma-tran-ke",                 // tên không trùng (bắt buộc)
//     ten:   "Ma trận kề",                 // tiêu đề nhóm nút ở khung Điều khiển (bỏ trống = không hiện nhóm nút)
//     mota:  "Hiện ma trận kề của đồ thị", // dòng giải thích nhỏ dưới tiêu đề (tùy chọn)
//     truong:[ { id: "oXuatPhat", nhan: "Đỉnh xuất phát", placeholder: "bỏ trống = tự chọn" } ],   // ô nhập (tùy chọn)
//     nut:   [ { nhan: "Tính", chay: () => {...}, kieu: "success" } ],   // các nút (kieu: success | info | danger | bỏ trống)
//     html:  () => "<h3>Ma trận kề</h3>…", // trả về HTML hiện ở khung Thông tin (tùy chọn)
//     reset: () => {...},                  // gọi khi đồ thị bị sửa / reset: xóa kết quả cũ (tùy chọn)
//     luu:   () => ({...}),                // dữ liệu cần lưu cùng đồ thị (tùy chọn)
//     khoiPhuc: d => {...}                 // nhận lại dữ liệu đã lưu khi mở lại trang (tùy chọn)
// });
//
// Xem ví dụ đầy đủ trong js/chuc_nang/vi_du_mau.js.txt (đổi đuôi thành .js và thêm <script> vào index.html để chạy thử).

const DS_CHUC_NANG = [];

function dangKyChucNang(cn) {
    if (!cn || !cn.id) return console.error("dangKyChucNang: thiếu id");
    if (DS_CHUC_NANG.some(c => c.id === cn.id)) return console.error("dangKyChucNang: trùng id " + cn.id);
    DS_CHUC_NANG.push(cn);
    veNutChucNang();
    if (Object.keys(nodes).length) hienThiThongTin();
}

// Vẽ các nút của mọi chức năng vào khung Điều khiển (#chucNangDieuKhien)
function veNutChucNang() {
    const kv = $("chucNangDieuKhien");
    if (!kv) return;
    kv.innerHTML = "";
    DS_CHUC_NANG.filter(c => c.ten || (c.nut && c.nut.length) || (c.truong && c.truong.length)).forEach(c => {
        if (c.ten) { const h = document.createElement("h3"); h.textContent = c.ten; kv.appendChild(h); }
        if (c.mota) { const d = document.createElement("div"); d.className = "note hint"; d.textContent = c.mota; kv.appendChild(d); }
        (c.truong || []).forEach(t => {
            const lb = document.createElement("label"); lb.textContent = t.nhan + ":"; kv.appendChild(lb);
            const inp = document.createElement("input");
            inp.type = "text"; inp.autocomplete = "off"; inp.id = t.id; inp.placeholder = t.placeholder || "";
            kv.appendChild(inp);
        });
        (c.nut || []).forEach(b => {
            const btn = document.createElement("button");
            if (b.kieu) btn.className = b.kieu;
            btn.textContent = b.nhan;
            btn.addEventListener("click", () => b.chay());
            kv.appendChild(btn);
        });
        kv.appendChild(document.createElement("hr"));
    });
}

// Xóa mọi phần tô màu trên hình + kết quả của từng chức năng (gọi khi đồ thị đổi)
function resetChucNang() {
    toMauCanh = {};
    dinhNoiBat = null;
    thongBaoHinh = "";
    DS_CHUC_NANG.forEach(c => { if (c.reset) c.reset(); });
}

const duLieuChucNang = () => Object.fromEntries(DS_CHUC_NANG.filter(c => c.luu).map(c => [c.id, c.luu()]));
function khoiPhucChucNang(d) {
    DS_CHUC_NANG.forEach(c => { if (c.khoiPhuc && d && d[c.id] !== undefined) c.khoiPhuc(d[c.id]); });
}

function capNhatTenLoai() {
    $("loaiDangChon").textContent = $("loai").selectedOptions[0].textContent;
}

// Dựng khung Thông tin (cột phải): gom HTML của mọi chức năng đã đăng ký
function hienThiThongTin() {
    const dangMo = new Set([...document.querySelectorAll("#thongTin details[data-key][open]")].map(d => d.dataset.key));
    const phan = DS_CHUC_NANG.filter(c => c.html).map(c => c.html()).join("");
    $("thongTin").innerHTML =
        `<div class="note hint"><b>Đồ thị:</b> ${n} đỉnh, ${edges.length} cạnh.</div>` +
        (phan || (DS_CHUC_NANG.length ? '<div class="note hint"><i>Chọn một chức năng ở khung Điều khiển để xem kết quả tại đây.</i></div>' : ""));
    document.querySelectorAll("#thongTin details[data-key]").forEach(d => { if (dangMo.has(d.dataset.key)) d.open = true; });
    if (typeof luuTuDong === "function") luuTuDong();   // tự động lưu (luu_tru.js)
}
