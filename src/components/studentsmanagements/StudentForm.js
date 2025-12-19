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
    ispasses: '', 
    description: '',
    parentname: '',
    phone: '',
    surveyby: '',
    surveyplace: '',
    formName: '',
    orgName: '',
    periodName: '',
};

export default function StudentForm({ initial = null, onCancel, onSubmit }) {
    const [form, setForm] = useState(initialFormState);
    const [errors, setErrors] = useState({});


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
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleDateChange = (date) => {
        setForm(prev => ({ ...prev, birthday: date }));
        if (errors.birthday) {
            setErrors(prev => ({ ...prev, birthday: undefined }));
        }
    };

    const handleSelectChange = (e) => {
        const { name, value } = e.target;

        const val = value === 'true' ? true : value === 'false' ? false : value;
        setForm(prev => ({ ...prev, [name]: val }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!form.name || form.name.trim() === '') {
            newErrors.name = 'Vui lòng nhập tên trẻ.';
        }

        if (form.gender === '' || form.gender === null) {
            newErrors.gender = 'Vui lòng chọn giới tính.';
        }

        if (!form.birthday) {
            newErrors.birthday = 'Vui lòng chọn ngày sinh';
        }
        if (form.ispasses === '' || form.ispasses === null) {
            newErrors.ispasses = 'Vui lòng chọn trạng thái';
        }

        if (form.phone && form.phone.length > 0) {
            const phoneRegex = /^[0-9]{10,11}$/;
            if (!phoneRegex.test(form.phone.replace(/\s/g, ''))) {
                newErrors.phone = 'Số điện thoại không hợp lệ (10-11 số)';
            }
        }

        if (form.name && form.name.length > 255) {
            newErrors.name = 'Tên trẻ không được quá 255 ký tự';
        }

        if (form.parentname && form.parentname.length > 255) {
            newErrors.parentname = 'Tên phụ huynh không được quá 255 ký tự';
        }

        if (form.address && form.address.length > 2000) {
            newErrors.address = 'Địa chỉ không được quá 2000 ký tự';
        }

        if (!form.description || form.description.trim() === '') {
            newErrors.description = 'Vui lòng nhập kết luận sàng lọc.';
        }

        if (form.description && form.description.length > 2000) {
            newErrors.description = 'Kết luận không được quá 2000 ký tự';
        }

        return newErrors;

    };


    const submit = (e) => {
        e.preventDefault();

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            alert('Vui lòng điền đầy đủ thông tin bắt buộc và kiểm tra lại dữ liệu!');
            return;
        }

        setErrors({});

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
        <>
            <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
                <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <form onSubmit={submit} noValidate>
                            <div className="modal-header">
                                <div>
                                    <h5 className="modal-title mb-0">{form.id ? `Chỉnh Sửa Hồ Sơ #${form.id}` : 'Thêm Hồ Sơ Sàng Lọc Mới'}</h5>
                                    {form.periodName && (
                                        <small className="text-muted">Đợt: {form.periodName} ({form.orgName})</small>
                                    )}
                                </div>
                                <button type="button" className="btn-close" aria-label="Close" onClick={onCancel}></button>
                            </div>

                            <div className="modal-body" style={{ maxHeight: '65vh', overflowY: 'auto', paddingBottom: '1.5rem' }}>
                                <div className="mb-2 text-uppercase text-muted small">Thông tin liên kết</div>
                                <div className="row g-3 mb-3">
                                    <div className="col-md-4">
                                        <label className="form-label">Loại Phiếu Sàng Lọc</label>
                                        <input value={form.formName || 'N/A'} readOnly className="form-control" />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">Trạm/Đơn vị Y Tế</label>
                                        <input value={form.orgName || 'N/A'} readOnly className="form-control" />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">Đợt Sàng Lọc</label>
                                        <input value={form.periodName || 'N/A'} readOnly className="form-control" />
                                    </div>
                                </div>

                                <div className="mb-2 text-uppercase text-muted small">Thông tin trẻ</div>
                                <div className="row g-3 mb-3">
                                    <div className="col-md-8">
                                        <label className="form-label">Tên trẻ (*)</label>
                                        <input
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            className="form-control"
                                            maxLength={255}
                                            style={errors.name ? { borderColor: 'red' } : {}}
                                        />
                                        {errors.name && <span className="text-danger small d-block mt-1">{errors.name}</span>}
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">Giới tính (*)</label>
                                        <select
                                            name="gender"
                                            value={form.gender}
                                            onChange={handleSelectChange}
                                            className="form-select"
                                            style={errors.gender ? { borderColor: 'red' } : {}}
                                        >
                                            <option value="" disabled>Chọn</option>
                                            <option value={true}>Nam</option>
                                            <option value={false}>Nữ</option>
                                        </select>
                                        {errors.gender && <span className="text-danger small d-block mt-1">{errors.gender}</span>}
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">Ngày sinh (*)</label>
                                        <DatePicker
                                            selected={form.birthday}
                                            onChange={handleDateChange}
                                            dateFormat="dd/MM/yyyy"
                                            placeholderText="dd/mm/yyyy"
                                            className="form-control w-100"
                                            wrapperClassName="w-100"
                                            style={errors.birthday ? { borderColor: 'red' } : {}}
                                        />
                                        {errors.birthday && <span className="text-danger small d-block mt-1">{errors.birthday}</span>}
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">Số tháng tuổi</label>
                                        <input type="number" name="months" value={form.months} readOnly className="form-control" title="Trường này được tính tự động" />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">Địa chỉ</label>
                                        <input name="address" value={form.address} onChange={handleChange} className="form-control" />
                                    </div>
                                </div>

                                <div className="mb-2 text-uppercase text-muted small">Thông tin gia đình</div>
                                <div className="row g-3 mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label">Tên phụ huynh</label>
                                        <input name="parentname" value={form.parentname} onChange={handleChange} className="form-control" />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">SĐT phụ huynh</label>
                                        <input name="phone" value={form.phone} onChange={handleChange} className="form-control" />
                                    </div>
                                </div>

                                <div className="mb-2 text-uppercase text-muted small">Kết quả & Khảo sát</div>
                                <div className="row g-2">
                                    <div className="col-md-4">
                                        <label className="form-label">Trạng thái (*)</label>
                                        <select
                                            name="ispasses"
                                            value={form.ispasses}
                                            onChange={handleSelectChange}
                                            className="form-select"
                                            style={errors.ispasses ? { borderColor: 'red' } : {}}
                                        >
                                            <option value="" disabled>Chọn</option>
                                            <option value={true}>Đạt</option>
                                            <option value={false}>Cần theo dõi</option>
                                        </select>
                                        {errors.ispasses && <span className="text-danger small d-block mt-1">{errors.ispasses}</span>}
                                    </div>
                                    <div className="col-md-8">
                                        <label className="form-label">Người khảo sát</label>
                                        <input name="surveyby" value={form.surveyby} onChange={handleChange} className="form-control" />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">Nơi khảo sát</label>
                                        <input name="surveyplace" value={form.surveyplace} onChange={handleChange} className="form-control" />
                                    </div>
                                </div>

                                <div className="row g-2 mt-2">
                                    <div className="col-12">
                                        <label className="form-label">Kết luận sàng lọc (Description)</label>
                                        <textarea name="description" value={form.description} onChange={handleChange} className="form-control" rows="3" />
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer d-flex justify-content-between">
                                <button type="button" className="btn btn-secondary" onClick={onCancel}>Hủy</button>
                                <div className="d-flex gap-2">
                                    <button type="submit" className="btn btn-primary"
                                            style={{ width: "120px" , height: "40px" }}
                                    >{form.id ? 'Lưu Thay Đổi' : 'Thêm Hồ Sơ'}</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop fade show"></div>
        </>
    );
}