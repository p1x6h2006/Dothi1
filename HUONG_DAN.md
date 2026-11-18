# Mô phỏng đồ thị — bản chỉ có giao diện

Bản này giữ **giao diện + phần lõi** (chọn loại đồ thị, tạo / thêm / xóa / sửa cạnh, vẽ SVG, kéo thả đỉnh,
3 theme, nhãn số/chữ, đổi màu, tự lưu / reset). Đã có đủ các chức năng của **Phần 2**: 2.1 nhập & hiển thị đồ thị, 2.2 chu trình Euler + người đưa thư,
2.3 cây khung nhỏ nhất (Prim), 2.4 giải thích chương trình (nút "Giải thích chương trình").

## Phiên đồ thị
Mỗi phiên là một đồ thị riêng (khung Điều khiển → 🗂️ Phiên đồ thị): **➕ Phiên mới**, **✏️ Đổi tên**, **🗑️ Xóa**; bấm vào phiên nào thì đồ thị đó hiện ra. Tự lưu trong trình duyệt; mở lại trang vẫn còn đủ các phiên. **Reset** chỉ xóa đồ thị của phiên đang xem.

## Mở chạy
Mở `index.html` bằng trình duyệt (không cần cài gì).

## Cấu trúc
```
index.html
css/style.css                 # giao diện (đã chứa sẵn CSS cho các bảng, Euler, Kruskal... để dùng lại)
js/chinh.js                   # khởi động
js/dung_chung/                # cau_hinh, trang_thai, kiem_tra
js/giao_dien/                 # doi_giao_dien (theme, chọn loại), hieu_ung_phi_kiem (nền)
js/loi/                       # chinh_sua_canh, ve_do_thi, luu_tru
js/chuc_nang/dang_ky.js       # ★ chỗ cắm chức năng mới
js/chuc_nang/chu_trinh_euler.js, nguoi_dua_thu.js, prim.js, giai_thich.js
```

## Thêm một câu mới (3 bước)
1. Tạo file `js/chuc_nang/ten_cau.js` (copy từ `prim.js` cho gọn):
   ```js
   dangKyChucNang({
       id: "ten-cau", ten: "Tên câu",
       nut:  [{ nhan: "Chạy", chay: () => { /* thuật toán */ }, kieu: "success" }],
       html: () => "<h3>Kết quả</h3>…",     // hiện ở khung Thông tin bên phải
       reset: () => { /* xóa kết quả cũ */ }
   });
   ```
2. Dán `<script src="js/chuc_nang/ten_cau.js"></script>` vào `index.html`, **trước** `js/chinh.js`.
3. Xong: nút tự hiện ở khung Điều khiển, kết quả hiện ở khung Thông tin.

## Dữ liệu đồ thị để viết thuật toán
`n` (số đỉnh), `edges` (`{x,y}` hoặc `{x,y,w}`), `loaiHienTai()` (1–5), `coHuong()`, `dsDinh()`, `nhanDinh(i)` (nhãn hiển thị).

## Tô màu trên hình
Gán rồi gọi `veDoThi()`:
- `toMauCanh[chỉ số cạnh] = { mau, dayNet, netDut, tienTo }`
- `dinhNoiBat = chỉ số đỉnh`
- `thongBaoHinh = "chữ ở góc trên trái hình"`

`resetChucNang()` xóa hết (tự gọi khi sửa đồ thị / đổi nhãn / reset).
