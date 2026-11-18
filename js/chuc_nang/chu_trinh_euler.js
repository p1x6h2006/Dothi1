// =====================================================
// 2.2 (a) CHU TRÌNH EULER: kiểm tra điều kiện tồn tại + tìm chu trình
// =====================================================
// Chu trình Euler = đi qua MỖI cạnh đúng 1 lần rồi quay về đỉnh xuất phát.
// Điều kiện (xét trên các đỉnh có cạnh; đỉnh cô lập bỏ qua):
//   Vô hướng (loai 1-3): các cạnh cùng một thành phần liên thông VÀ mọi đỉnh có bậc chẵn (vòng khuyên tính bậc 2).
//   Có hướng (loai 4-5): liên thông yếu VÀ mọi đỉnh có deg⁺ = deg⁻.
// Tìm chu trình: thuật toán Hierholzer.
// File này cũng chứa các hàm dùng chung cho nguoi_dua_thu.js: trongSo, hierholzer, lienThongCanh, docXuatPhat.

const trongSo = e => e.w === undefined ? 1 : e.w;   // cạnh không nhập trọng số tính w = 1
const nhanCanhNgan = k => `(${nhanDinh(edges[k].x)},${nhanDinh(edges[k].y)})`;
const MAU_EULER = "#f59e0b";

const dinhCoCanh = () => dsDinh().filter(v => edges.some(e => e.x === v || e.y === v));

// Các cạnh (kể cả cạnh thêm) có cùng một thành phần liên thông (bỏ qua hướng) không?
function lienThongCanh(list) {
    if (!list.length) return true;
    const cha = Array.from({ length: n }, (_, i) => i);
    const tim = v => cha[v] === v ? v : (cha[v] = tim(cha[v]));
    list.forEach(e => { cha[tim(e.x)] = tim(e.y); });
    const goc = tim(list[0].x);
    return list.every(e => tim(e.x) === goc && tim(e.y) === goc);
}

// Hierholzer trên danh sách cạnh `list` ({x,y,...}); huong = có hướng hay không.
// Trả về { vs: dãy đỉnh, es: dãy chỉ số (trong list) của cạnh đã đi } hoặc null nếu không đi hết được.
function hierholzer(list, start, huong) {
    const ke = Array.from({ length: n }, () => []);
    list.forEach((e, k) => {
        ke[e.x].push({ den: e.y, k });
        if (!huong) ke[e.y].push({ den: e.x, k });
    });
    const dung = Array(list.length).fill(false);
    const sv = [start], se = [-1], rv = [], re = [];
    while (sv.length) {
        const v = sv[sv.length - 1], a = ke[v];
        while (a.length && dung[a[a.length - 1].k]) a.pop();
        if (a.length) { const t = a.pop(); dung[t.k] = true; sv.push(t.den); se.push(t.k); }
        else { rv.push(sv.pop()); re.push(se.pop()); }
    }
    rv.reverse(); re.reverse(); re.shift();
    return re.length === list.length ? { vs: rv, es: re } : null;
}

// Đọc ô "Đỉnh xuất phát": bỏ trống -> macDinh; sai -> báo lỗi, trả về null
function docXuatPhat(macDinh, canCoCanh) {
    const t = $("oXuatPhat").value.trim();
    if (t === "") return macDinh;
    const v = docDinh(t);
    if (!kiemTraDinh(v)) { alert(`Đỉnh xuất phát phải nằm từ ${nhanDinh(0)} đến ${nhanDinh(n - 1)}!`); return null; }
    if (canCoCanh && !edges.some(e => e.x === v || e.y === v)) { alert(`Đỉnh ${nhanDinh(v)} không có cạnh nào, hãy chọn đỉnh khác!`); return null; }
    return v;
}

// Dãy đỉnh dạng ô: [A] -e1→ [B] ... ; moc(k) trả về chuỗi nhãn cạnh
function htmlDay(vs, es, moc, dang) {   // dang (tùy chọn): chỉ số đỉnh đang đứng khi mô phỏng từng bước
    let h = '<div class="euler-seq">';
    vs.forEach((v, i) => {
        h += `<span class="euler-v${i === dang ? " euler-v-now" : ""}">${nhanDinh(v)}</span>`;
        if (i < es.length) h += `<span class="euler-e${dang !== undefined && dang !== null && i < dang ? " euler-e-done" : ""}">${moc(i)}</span>`;
    });
    return h + "</div>";
}

(function () {
    let kq = null;   // kết quả để hiện ở khung Thông tin

    function phanTich() {
        const huong = coHuong(), m = edges.length, lyDo = [];
        if (!m) return { ok: false, lyDo: ["Đồ thị chưa có cạnh nào."] };
        const deg = Array(n).fill(0), vao = Array(n).fill(0), ra = Array(n).fill(0);
        edges.forEach(e => {
            if (huong) { ra[e.x]++; vao[e.y]++; }
            else if (e.x === e.y) deg[e.x] += 2;
            else { deg[e.x]++; deg[e.y]++; }
        });
        if (!lienThongCanh(edges)) lyDo.push("Các cạnh không nằm trong cùng một thành phần liên thông" + (huong ? " (xét liên thông yếu)." : "."));
        if (huong) {
            const sai = dinhCoCanh().filter(v => ra[v] !== vao[v]);
            if (sai.length) lyDo.push("Có đỉnh deg⁺ ≠ deg⁻: " + sai.map(v => `${nhanDinh(v)} (deg⁺=${ra[v]}, deg⁻=${vao[v]})`).join(", ") + ".");
        } else {
            const le = dsDinh().filter(v => deg[v] % 2 === 1);
            if (le.length) lyDo.push(`Có ${le.length} đỉnh bậc lẻ: ${le.map(nhanDinh).join(", ")}.`);
        }
        return { ok: lyDo.length === 0, lyDo };
    }

    function chay() {
        resetChucNang();
        const r = phanTich();
        kq = r;
        if (r.ok) {
            const start = docXuatPhat(dinhCoCanh()[0], true);
            if (start === null) { kq = null; return hienThiThongTin(); }
            const h = hierholzer(edges, start, coHuong());
            if (!h) { kq = { ok: false, lyDo: ["Không dựng được chu trình (lỗi bất ngờ)."] }; }
            else {
                r.vs = h.vs; r.es = h.es;
                r.tong = h.es.reduce((s, k) => s + trongSo(edges[k]), 0);
                h.es.forEach((k, i) => { toMauCanh[k] = { mau: MAU_EULER, dayNet: 6, tienTo: `#${i + 1} ` }; });
                thongBaoHinh = `Chu trình Euler: ${h.vs.map(nhanDinh).join(" → ")}`;
            }
        } else if (edges.length) thongBaoHinh = "Không có chu trình Euler";
        veDoThi();
        hienThiThongTin();
    }

    function html() {
        if (!kq) return "";
        let h = '<br><h3>🔄 Chu trình Euler</h3><div class="euler-wrap">';
        if (kq.ok && kq.vs) {
            h += '<div class="euler-yes">✔ Đồ thị CÓ chu trình Euler.</div>';
            h += `<div class="euler-reason">Điều kiện thỏa: liên thông và ${coHuong() ? "mọi đỉnh có deg⁺ = deg⁻" : "mọi đỉnh có bậc chẵn"}.</div>`;
            h += htmlDay(kq.vs, kq.es, i => `e${kq.es[i] + 1}`);
            h += `<div class="euler-line">Chu trình: ${kq.vs.map(nhanDinh).join(" → ")}</div>`;
            h += `<div class="npt-total">Số cạnh: ${kq.es.length} · Tổng trọng số = ${kq.tong}</div>`;
        } else {
            h += '<div class="euler-no">✖ Đồ thị KHÔNG có chu trình Euler.</div>';
            kq.lyDo.forEach(l => { h += `<div class="euler-reason">• ${l}</div>`; });
        }
        return h + "</div>";
    }

    dangKyChucNang({
        id: "chu-trinh-euler",
        ten: "🔄 Chu trình Euler",
        mota: "Kiểm tra điều kiện tồn tại và tìm chu trình Euler (đi qua mỗi cạnh đúng 1 lần, quay về đỉnh xuất phát).",
        truong: [{ id: "oXuatPhat", nhan: "Đỉnh xuất phát (dùng cho Euler, Người đưa thư, Prim)", placeholder: "Bỏ trống = tự chọn" }],
        nut: [{ nhan: "🔄 Kiểm tra & tìm chu trình Euler", chay, kieu: "success" }],
        html,
        reset: () => { kq = null; }
    });
})();
