import React, { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { parseISO } from 'date-fns';
import './Modal.css';

const parseToDate = (val) => {
  if (!val && val !== 0) return null;
  if (val instanceof Date && !isNaN(val)) return val;
  const s = String(val).trim();
  
  try {
    const d = parseISO(s);
    if (!isNaN(d)) return d;
  } catch (e) {
 
  }

  let m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (m) {
    const d = new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
    if (!isNaN(d)) return d;
  }

  m = s.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (m) {
    const d = new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
    if (!isNaN(d)) return d;
  }

  const parsed = new Date(s);
  if (!isNaN(parsed)) return parsed;
  return null;
};

const CustomDateInput = React.forwardRef(({ value, onClick, placeholder }, ref) => (
  <div className="date-wrapper" style={{ position: 'relative' }}>
    <input
      ref={ref}
      readOnly
      className="date-input"
      onClick={onClick}
      value={value || ''}
      placeholder={placeholder}
      style={{ width: '100%', paddingRight: 44, boxSizing: 'border-box' }}
    />

    <button
      type="button"
      className="date-icon-btn"
      onClick={onClick}
      aria-label="Mở lịch"
      style={{
        position: 'absolute',
        right: 8,
        top: '50%',
        transform: 'translateY(-50%)',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        padding: 6,
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.2" />
        <path d="M16 3v4M8 3v4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>

    </button>
  </div>
));
CustomDateInput.displayName = 'CustomDateInput';

export default function StudentForm({ initial = null, onCancel, onSubmit }) {
  const [form, setForm] = useState({
    id: null,
    hk: '',
    ms: '',
    name: '',
    cls: '',
    status: '',
    time: '',
    note: '',
  });

  const [dateObj, setDateObj] = useState(parseToDate(initial?.time));
  const dateRef = useRef(null);

  useEffect(() => {
    if (initial) {
      setForm({
        id: initial.id ?? null,
        hk: initial.hk ?? '',
        ms: initial.ms ?? '',
        name: initial.name ?? '',
        cls: initial.cls ?? '',
        status: initial.status ?? '',
        time: initial.time ?? '',
        note: initial.note ?? '',
      });
      setDateObj(parseToDate(initial.time));
    } else {
      setForm({
        id: null,
        hk: '',
        ms: '',
        name: '',
        cls: '',
        status: '',
        time: '',
        note: '',
      });
      setDateObj(null);
    }
  }, [initial]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (d) => {
    setDateObj(d);
    const iso = d ? d.toISOString().slice(0, 10) : '';
    setForm((prev) => ({ ...prev, time: iso }));
  };

  const submit = (e) => {
    e.preventDefault();
    if (!form.ms || !form.name) {
      alert('Mã SV và Họ tên là bắt buộc');
      return;
    }
    onSubmit({ ...form });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>{form.id ? 'Sửa tình trạng sinh viên' : 'Thêm sinh viên'}</h3>

        <form onSubmit={submit}>
          <div className="form-row">
            <label>Mã học kỳ</label>
            <input name="hk" value={form.hk} onChange={handleChange} />
          </div>

          <div className="form-row">
            <label>Mã sinh viên</label>
            <input name="ms" value={form.ms} onChange={handleChange} />
          </div>

          <div className="form-row">
            <label>Họ và tên</label>
            <input name="name" value={form.name} onChange={handleChange} />
          </div>

          <div className="form-row">
            <label>Mã lớp</label>
            <input name="cls" value={form.cls} onChange={handleChange} />
          </div>

          <div className="form-row">
            <label>Tình trạng</label>
            <input name="status" value={form.status} onChange={handleChange} />
          </div>

          <div className="form-row">
            <label>Thời gian</label>
            <DatePicker
              selected={dateObj}
              onChange={handleDateChange}
              dateFormat="dd/MM/yyyy"
              placeholderText="dd/mm/yyyy"
              popperPlacement="top-end"
              customInput={<CustomDateInput />}
              ref={dateRef}
            />
          </div>

          <div className="form-row">
            <label>Ghi chú</label>
            <input name="note" value={form.note} onChange={handleChange} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
            <button type="button" className="btn btn-outline" onClick={onCancel}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary">
              {form.id ? 'Lưu' : 'Thêm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}