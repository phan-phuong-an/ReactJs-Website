  import React, { useMemo, useState } from 'react';
  import './StudentManagement.css';
  import StudentForm from './StudentForm';
  import { sampleStudents } from '../../data/sampleStudents';

  const formatDate = (value) => {
    if (!value && value !== 0) return '';
   
    if (value instanceof Date && !isNaN(value)) {
      const d = String(value.getDate()).padStart(2, '0');
      const m = String(value.getMonth() + 1).padStart(2, '0');
      const y = value.getFullYear();
      return `${d}/${m}/${y}`;
    }
    const s = String(value).trim();
  
    const isoMatch = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) {
      return `${isoMatch[3]}/${isoMatch[2]}/${isoMatch[1]}`;
    }
   
    const dmyMatch = s.match(/^(\d{2})-(\d{2})-(\d{4})$/);
    if (dmyMatch) {
      return `${dmyMatch[1]}/${dmyMatch[2]}/${dmyMatch[3]}`;
    }
   
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(s)) return s;
  
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
              <th>Mã học kỳ</th>
              <th>Mã SV</th>
              <th>Họ và tên</th>
              <th>Mã Lớp</th>
              <th>Tình trạng</th>
              <th>Thời gian</th>
              <th>Ghi chú</th>
              <th style={{ width: 120 }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '24px' }}>
                  Không có dữ liệu
                </td>
              </tr>
            )}

            {rows.map((r) => (
              <tr key={r.id}>
                <td>{r.hk}</td>  
                <td>
                  <span className="badge">{r.ms}</span>
                </td>
                <td>{r.name}</td>
                <td>{r.cls}</td>
                <td>{r.status}</td>
                <td>{formatDate(r.time)}</td>
                <td
                  title={r.note}
                  style={{
                    maxWidth: 200,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {r.note}
                </td>
                <td>
                  <button className="btn btn-outline" onClick={() => onEdit?.(r)}>
                    Sửa
                  </button>{' '}
                  <button className="btn" onClick={() => onDelete?.(r.id)}>
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  export default function StudentManagement() {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);

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

    const pageCount = Math.max(1, Math.ceil(data.length / pageSize));
    const pageSafe = Math.min(Math.max(page, 1), pageCount);
    const currentData = useMemo(() => {
      const start = (pageSafe - 1) * pageSize;
      return data.slice(start, start + pageSize);
    }, [data, pageSafe, pageSize]);

    const handleEdit = (row) => {
      setEditing(row);
      setShowForm(true);
    };

    const handleDelete = (id) => {
      if (window.confirm('Xác nhận xóa?')) {
        setData(prev => {
          const next = prev.filter(p => p.id !== id);
          const nextPageCount = Math.max(1, Math.ceil(next.length / pageSize));
          if (page > nextPageCount) setPage(nextPageCount);
          return next;
        });
      }
    };

    const exportCSV = () => {
      const header = [
        'Mã học kỳ',
        'Mã SV',
        'Họ và tên',
        'Mã Lớp',
        'Tình trạng',
        'Thời gian',
        'Ghi chú'
      ];
      
      const rows = data.map((s) => [
        s.hk, 
        s.ms, 
        s.name, 
        s.cls, 
        s.status, 
        s.time, 
        s.note ?? ''
      ]);
      
      const csv = [header.join(','), 
      ...rows.map(r => r.map(v => `"${String(v ?? '').replace(/"/g,'""')}"`)
      .join(','))].join('\r\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a'); 
      a.href = url; 
      a.download = 'students.csv'; 
      a.click(); a.remove(); 
      URL.revokeObjectURL(url);
    };

    return (
      <section className="student-management">
        <div className="toolbar">
          <div className="left">
            <button className="btn btn-primary" onClick={() => { setShowForm(true); setEditing(null); }}>Thêm</button>
            <button className="btn btn-outline" onClick={exportCSV}>Xuất</button>
          </div>
        </div>
    
        <StudentTable rows={currentData} onEdit={handleEdit} onDelete={handleDelete} />

        <div className="pagination">
          <button className="pg-btn" onClick={() => setPage(p => Math.max(1,p-1))} disabled={pageSafe <= 1}>Prev</button>
          <span className="pg-info">{pageSafe} / {pageCount}</span>
          <button className="pg-btn" onClick={() => setPage(p => 
            Math.min(pageCount,p+1))} disabled={pageSafe >= pageCount}>
              Next
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