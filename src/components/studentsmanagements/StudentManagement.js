import React, { useMemo, useState } from 'react';
import './StudentManagement.css'; 
import StudentForm from './StudentForm';
import { sampleStudents } from '../../data/sampleStudents'; 


const formatDate = (value) => {
  if (!value) return '';
  const s = String(value).trim();
  const parsed = new Date(s);
  if (!isNaN(parsed)) {
    const d = String(parsed.getDate()).padStart(2, '0');
    const m = String(parsed.getMonth() + 1).padStart(2, '0');
    const y = parsed.getFullYear();
    return `${d}/${m}/${y}`;
  }
  return s;
};


const StudentTable = ({ rows = [], onEdit, onDelete }) => {
  return (
    <div className="table-card">
      <table className="student-table">
        <thead>
          <tr>
            <th>Mã HK</th>
            <th>Mã SV</th>
            <th>Họ và tên</th>
            <th>Mã Lớp</th>
            <th>Tình trạng</th>
            <th>Thời gian</th>
            <th>Ghi chú</th>
            <th style={{ width: 110, textAlign: 'center' }}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={8} style={{ textAlign: 'center', padding: '30px', color: '#888' }}>
                Không tìm thấy dữ liệu phù hợp
              </td>
            </tr>
          )}

          {rows.map((r) => (
            <tr key={r.id}>
              <td>{r.hk}</td>
              <td><span className="badge">{r.ms}</span></td>
              <td style={{ fontWeight: 600, color: '#2c3e50' }}>{r.name}</td>
              <td>{r.cls}</td>
              <td>
                <span className={`status-badge ${r.status === 'Đạt' || r.status === 'Pass' ? 'status-pass' : 'status-warning'}`}>
                  {r.status}
                </span>
              </td>
              <td>{formatDate(r.time)}</td>
              <td title={r.note}>
                <div style={{ 
                    maxWidth: '200px', 
                    whiteSpace: 'nowrap', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis' 
                }}>
                    {r.note}
                </div>
              </td>
              <td style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
                    <button className="btn btn-sm btn-outline" onClick={() => onEdit?.(r)}>Sửa</button>
                    <button className="btn btn-sm btn-danger" onClick={() => onDelete?.(r.id)}>Xóa</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default function StudentManagement() {
  const [data, setData] = useState(() => {
    if (!Array.isArray(sampleStudents)) return [];

    return sampleStudents.map((s, idx) => ({
      id: s.id ?? s.studentId ?? Date.now() + idx,
      hk: s.semester ?? s.hk ?? '',
      ms: s.studentId ?? s.ms ?? '',
      name: s.name ?? '',
      cls: s.classCode ?? s.cls ?? '',
      status: s.status ?? '',
      time: s.time ?? s.date ?? '',
      note: s.note ?? '',
    }));
  });


  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

 
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    const lowerTerm = searchTerm.toLowerCase();
    return data.filter(item => 
        item.name.toLowerCase().includes(lowerTerm) ||
        String(item.ms).includes(lowerTerm) ||
        item.cls.toLowerCase().includes(lowerTerm)
    );
  }, [data, searchTerm]);


  const pageCount = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const pageSafe = Math.min(Math.max(page, 1), pageCount);
  
  const currentTableData = useMemo(() => {
    const start = (pageSafe - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, pageSafe, pageSize]);


  const handleEdit = (row) => {
    setEditing(row);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Xác nhận xóa bản ghi này?')) {
      setData(prev => prev.filter(p => p.id !== id));

      if (pageSafe > 1 && currentTableData.length === 1) {
          setPage(pageSafe - 1);
      }
    }
  };

  return (
    <section className="student-management">
      <div className="toolbar">
        <div className="toolbar-left">
          <button className="btn btn-primary" onClick={() => { setShowForm(true); setEditing(null); }}>
            Thêm
          </button>
          <button className="btn btn-outline" onClick={() => alert("Chức năng xuất CSV (Offline)")}>
            Xuất
          </button>
        </div>
      </div>
      <StudentTable rows={currentTableData} onEdit={handleEdit} onDelete={handleDelete} />

      <div className="pagination">
        <button className="pg-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={pageSafe <= 1}>
          Trước
        </button>
        <span className="pg-info">
          Trang {pageSafe} / {pageCount}
        </span>
        <button className="pg-btn" onClick={() => setPage(p => Math.min(pageCount, p + 1))} disabled={pageSafe >= pageCount}>
          Sau
        </button>
      </div>
      
      {showForm && (
        <StudentForm
          initial={editing}
          onCancel={() => { setShowForm(false); setEditing(null); }}
          onSubmit={(form) => {
            if (form.id) {
     
              setData(prev => prev.map(p => (p.id === form.id ? { ...p, ...form } : p)));
            } else {

              const id = Date.now();
              setData(prev => [{ ...form, id }, ...prev]);
            }
            setShowForm(false);
            setEditing(null);
          }}
        />
      )}
    </section>
  );
}