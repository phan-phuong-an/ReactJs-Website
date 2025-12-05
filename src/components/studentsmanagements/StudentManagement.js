import React, { useState, useEffect, useMemo } from 'react';
import './StudentManagement.css';
import StudentForm from './StudentForm';
import { apiFetch } from '../../api/fetchClient';
import 'react-datepicker/dist/react-datepicker.css';


const formatDate = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (isNaN(date)) return String(value);
    return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
};

const normalizeNumber = (item) => {
    return {
        id: item.id,
        personId: item.personId || item.studentId || 0,
        name: item.name || 'Chưa cập nhật',
        birthday: item.birthday || '',
        gender: item.gender ? 'Nam' : 'Nữ',
        address: item.address || '',
        months: item.months || 0,
        parentName: item.parentName || 'N/A',
        phone: item.phone || 'N/A',
        isPass: item.ispasses,
        statusText: item.ispasses ? 'Đạt' : 'Chưa đạt',
        description: item.description || '',
        surveyBy: item.surveyby || 'N/A',
        surveyPlace: item.surveyplace || '',
        surveyNote: item.surveyNote || '',
        createdDate: item.createdDate || '',
        formName: item.form?.name || '',
        formCode: item.form?.code || '',
        orgName: item.orgunit?.name || '',
        periodName: item.period?.name || '',
        periodCode: item.period?.code || '',      
    };
};

export default function StudentManagement() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalItems, setTotalItems] = useState(0);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchData = async (currentPage = page) => {
        setLoading(true);
        setError(null);

           try {
                const resp = await apiFetch.get('/api/forminstances/my', { page, limit: pageSize });
                   
                const rootData = resp?.data?.data;
                const rawList = Array.isArray(rootData?.data) ? rootData.data : [];
                const total = rootData?.pagination?.total || 0;

                const normalizedList = rawList.map(normalizeNumber);
                setData(normalizedList);
                setTotalItems(total);
            

            } catch (err) {
                const msg = err?.data?.message || 'Không thể tải dữ liệu';
                if (err?.status === 401) setError('Phiên đăng nhập hết hạn.');
                else setError(msg);
                
                console.error("StudentManagement Error:", err);
            } finally {
                setLoading(false);
            }
        };

    useEffect(() => {
        fetchData();
    }, [page, pageSize]);

 
    const filteredData = useMemo(() => {
        if (!searchTerm) return data;
        const lower = searchTerm.toLowerCase();
        return data.filter(item => 
            item.name.toLowerCase().includes(lower) || 
            item.parentName.toLowerCase().includes(lower) ||
            item.orgName.toLowerCase().includes(lower) ||
            String(item.id).includes(lower)
        );
    }, [data, searchTerm]);


    const pageCount = Math.max(1, Math.ceil(totalItems / pageSize));

    const handleEdit = (row) => {
        setEditing (row);
        setShowForm(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Xác nhận xóa bản ghi này?')) {
            console.log('Delete record with id:', id);
            setData(prev => prev.filter(item => item.id !== id));
        }
    };

   // Thay thế hàm handleFormSubmit cũ bằng hàm này trong StudentManagement.js

const handleFormSubmit = async (formData) => {
    setLoading(true);
    try {
        // 1. Chuẩn bị dữ liệu cho object "instance" mà BE yêu cầu
        // Lưu ý: BE dùng tên biến chữ thường (lowercase) cho các khóa ngoại lai
        const instanceData = {
            // Nếu có ID thì gán vào, không thì thôi
            ...(formData.id && { id: formData.id }),
            
            // Mapping các trường dữ liệu từ Form sang chuẩn của BE
            personid: formData.personId || null, 
            name: formData.name,
            birthday: formData.birthday,
            gender: formData.gender, // true/false
            address: formData.address,
            months: formData.months,
            parentname: formData.parentname,
            phone: formData.phone,
            
            // Các trường thông tin phiếu/đợt
            formid: formData.formId || 1,      // Backend yêu cầu formid (chữ thường)
            periodid: formData.periodId || 1,  // Backend yêu cầu periodid
            orgunitid: formData.orgUnitId || 1,// Backend yêu cầu orgunitid
            
            // Các trường kết quả
            ispasses: formData.ispasses === true,
            description: formData.description || '',
            surveyby: formData.surveyby || '',
            surveyplace: formData.surveyplace || '',
            
            // Backend nhận "surveyNote" hoặc "surveynote" đều được, nhưng map đúng key instance.surveyNote
            surveyNote: formData.surveyNote || '', 
        };

        // 2. Tạo Payload đúng cấu trúc { instance: {}, values: [] }
        const payload = {
            instance: instanceData,
            values: [] // Gửi mảng rỗng nếu không có giá trị chi tiết, để tránh lỗi destructuring ở BE
        };

        console.log("Payload gửi đi (Fix): ", JSON.stringify(payload, null, 2));
        
        // 3. Gọi API
        // Dựa vào file Router BE: router.put('/:id') là update, router.post('/') là create
        let response;
        
        if (formData.id && formData.id !== 0) {
            // --- TRƯỜNG HỢP CẬP NHẬT (PUT) ---
            // Gọi vào đường dẫn có ID: /api/forminstances/:id
            response = await apiFetch.put(`/api/forminstances/${formData.id}`, payload);
        } else {
            // --- TRƯỜNG HỢP THÊM MỚI (POST) ---
            // Gọi vào đường dẫn gốc: /api/forminstances
            response = await apiFetch.post('/api/forminstances', payload);
        }

        console.log("Kết quả trả về: ", response);

        // Thành công
        setShowForm(false);
        setEditing(null);
        alert(formData.id ? 'Cập nhật thành công!' : 'Thêm mới thành công!');
        
        // Load lại dữ liệu trang 1
        setPage(1);
        await fetchData(1);

    } catch (err) {
        console.error("Lỗi khi submit: ", err);
        const message = err.data && err.data.message ? err.data.message : err.message;
        alert(`Lỗi hệ thống: ${message}`);
    } finally {
        setLoading(false);
    }
};

    const renderActions = (row) => (
        <td style={{ textAlign: 'center' }}>
            <div className ="btn_eit_delete">
                <button className="btn_edit" onClick={() => handleEdit(row)}>
                    Sửa
                </button>
                <button className="btn_delete" onClick={() => handleDelete(row.id)}>
                    Xóa
                </button>
            </div>
        </td>
    );

    return (
        <div className="dashboard-container">
            <div className="dashboard-toolbar">
                <h2 style={{ margin: 0, color: '#333' }}>Student Sàng lọc</h2>

                <div className="search-box">
                    <span className="search-icon" aria-hidden="true">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </span>
                    <input 
                        type="text" 
                        placeholder="Tìm kiếm..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading && <p style={{ fontStyle: 'italic', color: '#666' }}>Đang đồng bộ dữ liệu...</p>}
            {error && <p style={{ color: '#dc3545' }}>Lỗi: {error}</p>}
            
             
                     <button 
                    className="btn_primary" 
                    onClick={() => { setShowForm(true); setEditing(null); }}
                >
                    Thêm mới 
                </button>
            

            <div className="table-wrapper">
                <table className="dash-table">
                    <thead>
                        <tr>
                            <th style={{ width: '18%' }}>Hồ sơ Trẻ</th>
                            <th style={{ width: '15%' }}>Gia đình</th>
                            <th style={{ width: '15%' }}>Đơn vị & Đợt</th>
                            <th style={{ width: '30%' }}>Kết quả & Kết luận</th>
                            <th style={{ width: '14%' }}>Thông tin Khảo sát</th>
                            <th style={{ width: '8%' }}>Hành động</th> 
                        </tr>
                    </thead>

                    <tbody>
                        {filteredData.length === 0 && !loading ? (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: '#999' }}>
                                    Không có dữ liệu hiển thị
                                </td>
                            </tr>
                        ) : (
                            filteredData.map((row) => (
                                <tr key={row.id}>
                            
                                    <td>
                                        <div className="cell-title">{row.name}</div>
                                        <div className="cell-detail">ID: {row.id}</div>
                                        <div className="cell-detail">
                                            {formatDate(row.birthday)} • {row.months} tháng • {row.gender}
                                        </div>
                                    </td>

                          
                                    <td>
                                        <div className="cell-subtitle">{row.parentName}</div>
                                        <div className="cell-detail" style={{ color: '#0d6efd' }}>{row.phone}</div>
                                        <div className="cell-detail" style={{ marginTop: 4 }}>
                                            <i>{row.address}</i>
                                        </div>
                                    </td>

                                    <td>
                                        <div className="cell-org">{row.orgName}</div>
                                        <div className="cell-detail">Đợt: {row.periodCode}</div>
                                        <div className="cell-detail" title={row.formName}>
                                            Form: {row.formCode}
                                        </div>
                                    </td>

                                    <td>
                                        <span className={`badge ${row.isPass ? 'badge-pass' : 'badge-fail'}`}>
                                            {row.statusText}
                                        </span>
                                        <div 
                                            className="cell-detail"
                                            style={{ maxHeight: '60px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}
                                            title={row.description}
                                        >
                                            {row.description}
                                        </div>
                                    </td>

                                    <td>
                                        <div className="cell-detail"><b>Người làm:</b> {row.surveyBy}</div>
                                        <div className="cell-detail"><b>Tại:</b> {row.surveyPlace}</div>
                                        <div className="cell-detail"><b>Ngày:</b> {formatDate(row.createdDate)}</div>
                                    </td>

                                    {renderActions(row)}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="pagination">
                <button className="page-btn" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Trước</button>
                <span style={{ fontSize: '14px', color: '#555' }}>
                    Trang {page} / {pageCount} (Tổng {totalItems})
                </span>
                <button className="page-btn" disabled={page >= pageCount} onClick={() => setPage(p => p + 1)}>Sau</button>
            </div>

            {showForm && (
                <StudentForm
                    initial={editing}
                    onCancel={() => { setShowForm(false); setEditing(null); }}
                    onSubmit={handleFormSubmit}
                />
            )}
        </div>
    );
}
