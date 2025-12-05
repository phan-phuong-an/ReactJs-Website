import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Modal.css'; 
const getBoolValue = (value) => {
    if (value === 'Nam' || value === true || value === 'Đạt') return true;
    if (value === 'Nữ' || value === false || value === 'Cần theo dõi') return false;
    return ''; 
};

const parseDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
};


const initialFormState = {
    id: null,
    personId: null,
    name: '',
    birthday: null, 
    gender: '', 
    address: '', 
    months: 0, 
    ispasses: true, 
    description: '',
    parentname: '', 
    phone: '',
    surveyby: '', 
    surveyplace: '', 
    surveyNote: '',
    formName: '', 
    orgName: '', 
    periodName: '',
};

export default function StudentForm({ initial = null, onCancel, onSubmit }) {
    const [form, setForm] = useState(initialFormState);


    useEffect(() => {
        if (initial) {
            setForm({
                id: initial.id ?? null,
                personId: initial.personId ?? null,
                name: initial.name ?? '',
                birthday: parseDate(initial.birthday || initial.time), 
                gender: getBoolValue(initial.gender), 
                address: initial.address ?? '',
                months: initial.months ?? 0,
                ispasses: getBoolValue(initial.status || initial.isPass),
                description: initial.description ?? initial.note ?? '', 
                parentname: initial.parentName ?? initial.parent ?? '',
                phone: initial.phone ?? '',
                surveyby: initial.surveyBy ?? '',
                surveyplace: initial.surveyPlace ?? '',
                surveyNote: initial.surveyNote ?? '',
        
                formName: initial.formName ?? initial.form?.name ?? '', 
                orgName: initial.orgName ?? initial.orgunit?.name ?? '', 
                periodName: initial.periodName ?? initial.period?.name ?? '', 
            });
        } else {
            setForm(initialFormState);
        }
    }, [initial]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setForm(prev => ({ ...prev, [name]: type === 'number' ? Number(value) : value }));
    };

    const handleDateChange = (date) => {
        setForm(prev => ({ ...prev, birthday: date }));
    };
    
    const handleSelectChange = (e) => {
        const { name, value } = e.target;
   
        const val = value === 'true' ? true : value === 'false' ? false : value;
        setForm(prev => ({ ...prev, [name]: val }));
    };


    const submit = (e) => {
        e.preventDefault();
        
   
        const dataToSubmit = {
            ...form,
          
            birthday: form.birthday 
            ? new Date(form.birthday.getTime() - (form.birthday.getTimezoneOffset() * 60000)).toISOString().split('T')[0] 
            : null,
    
            ispasses: getBoolValue(form.ispasses),
            gender: getBoolValue(form.gender),

            formName: undefined, 
            orgName: undefined, 
            periodName: undefined,
        };
        
        onSubmit(dataToSubmit); 
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>{form.id ? `Chỉnh Sửa Hồ Sơ #${form.id}` : 'Thêm Hồ Sơ Sàng Lọc Mới'}</h3>
                    {form.periodName && <p style={{ margin: 0, color: '#555', fontSize: '0.9rem' }}>Đợt: {form.periodName} ({form.orgName})</p>}
                </div>

                <form onSubmit={submit}>
                    <div className="form-grid">
                        
                        <div className="form-section-title"> Thông tin liên kết</div>
                        
                        <div className="form-group">
                            <label>Loại Phiếu Sàng Lọc</label>
                            <input value={form.formName || 'N/A'} readOnly className="form-control" />
                        </div>
                        <div className="form-group">
                            <label>Trạm/Đơn vị Y Tế</label>
                            <input value={form.orgName || 'N/A'} readOnly className="form-control" />
                        </div>
                        <div className="form-group">
                            <label>Đợt Sàng Lọc</label>
                            <input value={form.periodName || 'N/A'} readOnly className="form-control" />
                        </div>

                        <div className="form-section-title"> Thông tin trẻ</div>
                        
                        <div className="form-group span-2">
                            <label>Tên trẻ (*)</label>
                            <input name="name" value={form.name} onChange={handleChange} required className="form-control" />
                        </div>
                        <div className="form-group">
                            <label>Giới tính (*)</label>
                            <select name="gender" value={form.gender} onChange={handleSelectChange} required className="form-select">
                                <option value="" disabled>Chọn</option>
                                <option value={true}>Nam</option>
                                <option value={false}>Nữ</option>
                            </select>
                        </div>
                        
                        <div className="form-group">
                            <label>Ngày sinh (*)</label>
                            <DatePicker 
                                selected={form.birthday} 
                                onChange={handleDateChange} 
                                dateFormat="dd/MM/yyyy"
                                placeholderText="dd/mm/yyyy"
                                className="form-control"
                            />
                        </div>
                        <div className="form-group">
                            <label>Số tháng tuổi</label>
                            <input type="number" name="months" value={form.months} readOnly className="form-control" title="Trường này được tính tự động" />
                        </div>
                        <div className="form-group span-3">
                            <label>Địa chỉ</label>
                            <input name="address" value={form.address} onChange={handleChange} className="form-control" />
                        </div>
                        
                        <div className="form-section-title"> Thông tin gia đình</div>
                        <div className="form-group">
                            <label>Tên phụ huynh</label>
                            <input name="parentname" value={form.parentname} onChange={handleChange} className="form-control" />
                        </div>
                        <div className="form-group">
                            <label>SĐT phụ huynh</label>
                            <input name="phone" value={form.phone} onChange={handleChange} className="form-control" />
                        </div>

                        <div className="form-section-title"> Kết quả & Khảo sát</div>
                        
                        <div className="form-group">
                            <label>Trạng thái (*)</label>
                            <select name="ispasses" value={form.ispasses} onChange={handleSelectChange} required className="form-select">
                                <option value="" disabled>Chọn</option>
                                <option value={true}>Đạt</option>
                                <option value={false}>Cần theo dõi</option>
                            </select>
                        </div>
                        <div className="form-group span-2">
                            <label>Người khảo sát</label>
                            <input name="surveyby" value={form.surveyby} onChange={handleChange} className="form-control" />
                        </div>
                        <div className="form-group span-3">
                            <label>Nơi khảo sát</label>
                            <input name="surveyplace" value={form.surveyplace} onChange={handleChange} className="form-control" />
                        </div>
                        <div className="form-group span-3">
                            <label>Kết luận sàng lọc (Description)</label>
                            <textarea name="description" value={form.description} onChange={handleChange} className="form-control" />
                        </div>
                        <div className="form-group span-3">
                            <label>Ghi chú khảo sát (SurveyNote)</label>
                            <textarea name="surveyNote" value={form.surveyNote} onChange={handleChange} className="form-control" />
                        </div>

                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn btn-cancel" onClick={onCancel}>
                            Hủy
                        </button>
                        <button type="submit" className="btn btn-submit">
                            {form.id ? 'Lưu Thay Đổi' : 'Thêm Hồ Sơ'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}