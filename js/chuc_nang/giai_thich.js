// =====================================================
// 2.4 GIẢI THÍCH CHƯƠNG TRÌNH: cấu trúc, chức năng chính, nguyên lý, cách vận dụng thuật toán
// =====================================================
(function () {
    let hien = false;

    const NOI_DUNG = `
<br><h3>📖 Giải thích chương trình</h3>
<div class="giai-body">
<div class="giai-step"><b>1. Cấu trúc chương trình</b>
<div class="giai-line"><b>index.html + css/style.css</b>: giao diện (màn hình chọn loại, khung Điều khiển, vùng vẽ SVG, khung Thông tin, 3 theme).</div>
<div class="giai-line"><b>js/dung_chung/</b>: cấu hình, trạng thái dùng chung (n, edges, nodes), kiểm tra dữ liệu nhập.</div>
<div class="giai-line"><b>js/loi/</b>: dựng đồ thị &amp; thêm/xóa/sửa cạnh (chinh_sua_canh.js), vẽ SVG &amp; kéo đỉnh (ve_do_thi.js), tự lưu (luu_tru.js).</div>
<div class="giai-line"><b>js/chuc_nang/</b>: các chức năng cắm vào qua dangKyChucNang — chu_trinh_euler.js, nguoi_dua_thu.js, prim.js.</div></div>

<div class="giai-step"><b>2. Các chức năng chính</b>
<div class="giai-line">Nhập &amp; quản lý đồ thị: chọn 1 trong 5 loại, nhập cạnh <code>x y</code> hoặc <code>x y w</code>, thêm/xóa/sửa cạnh, kéo thả đỉnh.</div>
<div class="giai-line">Chu trình Euler: kiểm tra điều kiện và tìm chu trình.</div>
<div class="giai-line">Người đưa thư: hành trình ngắn nhất đi qua mọi cạnh.</div>
<div class="giai-line">Cây khung nhỏ nhất bằng Prim.</div></div>

<div class="giai-step"><b>3. Nguyên lý hoạt động</b>
<div class="giai-line">Đồ thị lưu bằng danh sách cạnh <code>edges = [{x, y, w}]</code> và số đỉnh <code>n</code>. Mỗi khi dữ liệu đổi, <code>veDoThi()</code> vẽ lại SVG và <code>hienThiThongTin()</code> dựng lại khung Thông tin. Mỗi chức năng đọc <code>edges</code>, tính kết quả, rồi tô màu cạnh (<code>toMauCanh</code>) và ghi kết quả ra khung Thông tin.</div></div>

<div class="giai-step"><b>4. Vận dụng thuật toán đã học</b>
<div class="giai-line"><b>Euler</b>: vô hướng có chu trình Euler ⇔ liên thông và mọi đỉnh bậc chẵn; có hướng ⇔ liên thông yếu và deg⁺ = deg⁻ mọi đỉnh. Khi thỏa, dùng thuật toán Hierholzer (đi theo cạnh chưa dùng, kẹt thì lùi và ghép chu trình con) để liệt kê chu trình. Nếu đồ thị vô hướng liên thông nhưng có đỉnh bậc lẻ thì chương trình lặp lại (nhân đôi) các cạnh dọc đường đi ngắn nhất giữa các cặp đỉnh lẻ (cách ghép như ở bài toán người đưa thư) để mọi đỉnh thành bậc chẵn, rồi mới tìm chu trình Euler.</div>
<div class="giai-line"><b>Người đưa thư</b>: nếu có đỉnh bậc lẻ thì không có chu trình Euler, phải đi lặp một số cạnh. Tìm các đỉnh bậc lẻ V<sub>o</sub>; tính đường đi ngắn nhất mọi cặp bằng Floyd–Warshall; ghép V<sub>o</sub> thành các cặp có tổng khoảng cách nhỏ nhất m(G) (quy hoạch động bitmask); lặp lại các cạnh dọc các đường đó để mọi đỉnh thành bậc chẵn; chạy Hierholzer. Tổng trọng số hành trình = Σw + m(G).</div>
<div class="giai-line"><b>Prim</b>: tham lam. Bắt đầu từ 1 đỉnh; mỗi bước chọn cạnh nhỏ nhất nối cây hiện tại với đỉnh ngoài cây (không tạo chu trình); dừng khi đủ n − 1 cạnh. Nếu không chọn được cạnh nào trước khi đủ thì đồ thị không liên thông.</div></div>
</div>`;

    dangKyChucNang({
        id: "giai-thich",
        ten: "📖 Giải thích chương trình",
        nut: [{ nhan: "📖 Xem / ẩn giải thích chương trình", chay: () => { hien = !hien; hienThiThongTin(); }, kieu: "info" }],
        html: () => hien ? NOI_DUNG : "",
        reset: () => { /* giữ nguyên trạng thái xem/ẩn */ }
    });
})();
