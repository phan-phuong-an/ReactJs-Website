import React, { useState, useEffect} from 'react';
import './Modal.css';

const StudentForm = ({ initial = null, onCancel, onSubmit }) => {
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

    useEffect(() => {
      if (initial) {
        setForm(initial);
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
        }
  }, [initial]);
 
        const handleChange = (e) => {
            const { name, value } = e.target;
            setForm(prev => ({...prev, [name]: value }));
        };

        const submit  = (e) => {
            e.preventDefault();
            if (!form.ms || !form.name) {
                alert('Mã SV và Họ tên là bắt buộc');
                return;
            }
            onSubmit(form);
        };

        return (
            <div className="modal-backdrop">
                <div className="modal">
                    <h3>{form.id ? 'Sửa tình trạng sinh viên' : 'Thêm sinh viên'}</h3>
                    <form onSubmit = {submit}>

                        <div className = "form-row">
                            <label>Mã học kỳ</label>
                            <input name = "hk" value = {form.hk} onChange = {handleChange} />
                        </div>

                        <div className = "form-row">
                            <label>Mã sinh viên</label>
                            <input name = "ms" value = {form.ms} onChange = {handleChange} />
                        </div>

                        <div className ="form-row">
                            <label>Họ và tên</label>
                            <input name = "name" value = {form.name} onChange = {handleChange} />
                        </div>

                        <div className = "form-row">
                            <label>Mã lớp</label>
                            <input name ="cls" value = {form.cls} onChange = {handleChange} />
                        </div>

                        <div className = "form-row">
                            <label>Tình trạng</label>
                            <input name = "status" value = {form.status} onChange = {handleChange} />
                        </div>

                        <div className = "form-row">
                            <label>Thời gian</label>
                            <input name = "time" value = {form.time} onChange = {handleChange} placeholder = "dd/mm/yyyy" />
                        </div>

                        <div className = "form-row">
                            <label>Ghi chú</label>
                            <input name = "note" value = {form.note} onChange = {handleChange} />
                        </div>

                        <div style = {{display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12}}>
                            <button type = "button" className = "btn outline" onClick = {onCancel}>Hủy</button>
                            <button type = "submit" className = "btn primary">{form.id ? 'Lưu' : 'Thêm'}</button>
                        </div>
                    </form>
                </div>
            </div>
        );
}; 
export default StudentForm;
