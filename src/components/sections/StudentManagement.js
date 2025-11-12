import React, { useMemo, useState } from "react";
import "./StudentManagement.css";
import { sampleStudents } from "../../data/sampleStudents";

export default function StudentManagement() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const data = useMemo(() => sampleStudents || [], []);

  const pageCount = Math.max(1, Math.ceil(data.length / pageSize));
  const pageSafe = Math.min(Math.max(page, 1), pageCount);
  const currentData = useMemo(() => {
    const start = (pageSafe - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, pageSafe, pageSize]);

  const handleEdit = (item) => {
    // TODO: open edit modal
    alert(`Sửa (giả lập): ${item.name}`);
  };
  const handleDelete = (item) => {
    if (window.confirm(`Xác nhận xóa ${item.name}?`)) {
      // TODO: perform delete
      alert(`Đã xóa (giả lập): ${item.name}`);
    }
  };

  const exportCSV = (useCurrentPage = false) => {
    const rows = (useCurrentPage ? currentData : data).map((s) => ({
      semester: s.semester,
      studentId: s.studentId,
      name: s.name,
      classCode: s.classCode,
      status: s.status,
      time: s.time,
      note: s.note || "",
    }));
    if (!rows.length) return alert("Không có dữ liệu để xuất.");
    const header = [
      "Mã học kỳ",
      "Mã SV",
      "Họ và tên",
      "Mã Lớp",
      "Tình trạng",
      "Thời gian",
      "Ghi chú",
    ];
    const csv = [
      header.join(","),
      ...rows.map((r) =>
        [r.semester, r.studentId, r.name, r.classCode, r.status, r.time, r.note]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(",")
      ),
    ].join("\r\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `students_${useCurrentPage ? "page" + pageSafe : "all"}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="student-management">
      <div className="sm-toolbar">
        <div className="sm-toolbar-left">
          <button className="btn">Thêm</button>
          <button className="btn btn-outline" onClick={() => exportCSV(false)}>
            Xuất
          </button>
        </div>
        <div className="sm-toolbar-right">
          <label>
            Hiển thị
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
            >
              {[5, 10, 20].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="sm-card">
        <table className="sm-table" role="table" aria-label="Danh sách sinh viên">
          <thead>
            <tr>
              <th>Mã học kỳ</th>
              <th>Mã SV</th>
              <th>Họ và tên</th>
              <th>Mã Lớp</th>
              <th>Tình trạng</th>
              <th>Thời gian</th>
              <th>Ghi chú</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-data">
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              currentData.map((s) => (
                <tr key={s.id}>
                  <td data-label="Mã học kỳ">{s.semester}</td>
                  <td data-label="Mã SV">
                    <span className="badge">{s.studentId}</span>
                  </td>
                  <td data-label="Họ và tên">{s.name}</td>
                  <td data-label="Mã Lớp">{s.classCode}</td>
                  <td data-label="Tình trạng">{s.status}</td>
                  <td data-label="Thời gian">{s.time}</td>
                  <td data-label="Ghi chú" title={s.note} className="note">
                    {s.note}
                  </td>
                  <td data-label="Hành động">
                    <div className="actions">
                      <button className="btn btn-sm" onClick={() => handleEdit(s)}>
                        Sửa
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(s)}
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="sm-pagination">
        <button
          className="pg-btn"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={pageSafe <= 1}
        >
          Prev
        </button>
        <span className="pg-info">
          {pageSafe} / {pageCount}
        </span>
        <button
          className="pg-btn"
          onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
          disabled={pageSafe >= pageCount}
        >
          Next
        </button>
      </div>
    </section>
  );
}