// =====================================================
// TRẠNG THÁI DÙNG CHUNG: số đỉnh, danh sách cạnh, vị trí đỉnh, màu
// =====================================================
let n = 5, edges = [], nodes = {}, draggingNode = null;
let graphPalette = { ...PALETTES.light };
const loaiHienTai = () => parseInt($("loai").value);
// loai 1-3: vô hướng | loai 4-5: có hướng
const coHuong = () => loaiHienTai() >= 4;
const dsDinh = () => Array.from({ length: n }, (_, i) => i);

// -----------------------------------------------------
// TÔ MÀU TRÊN HÌNH (dành cho các chức năng thêm sau này: Euler, Kruskal, ...)
//   Chức năng chỉ cần gán giá trị rồi gọi veDoThi(); ve_do_thi.js tự đọc và vẽ.
//
//   toMauCanh[chỉ số cạnh] = { mau: "#f59e0b", dayNet: 6, netDut: true, tienTo: "#1 " }
//        mau    : màu cạnh (bỏ trống = màu mặc định)
//        dayNet : độ dày nét (mặc định 4)
//        netDut : true = vẽ nét đứt
//        tienTo : chữ thêm vào trước nhãn cạnh (vd "#1 ", "✔2 ", "✖ ")
//   dinhNoiBat = chỉ số đỉnh được viền nổi bật (null = không có)
//   thongBaoHinh = dòng chữ hiện ở góc trên trái hình ("" = không hiện)
//   Xóa hết bằng resetChucNang() (js/chuc_nang/dang_ky.js).
// -----------------------------------------------------
let toMauCanh = {};
let dinhNoiBat = null;
let thongBaoHinh = "";
