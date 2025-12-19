import React, { useState, useEffect, useMemo, useCallback} from 'react';
import './StudentManagement.css';
import StudentForm from './StudentForm';
import { apiFetch } from '../../api/fetchClient';
import { useNavigate } from 'react-router-dom'; 
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
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalItems, setTotalItems] = useState(0);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchData = useCallback(async (currentPage, currentPageSize) => {
        setLoading(true);
        setError(null);

           try {
                const resp = await apiFetch.get('/api/forminstances/my', { 
                    page: currentPage,
                    limit: currentPageSize, 
                });
                   
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
        }, []);

    useEffect(() => {
        fetchData(page, pageSize);
        try {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (_) {
            window.scrollTo(0, 0);
        }
    }, [page, pageSize, fetchData]);

 
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

    const handleDelete = async (id) => {
        if (window.confirm('Xác nhận xóa ?')) {
            try {
                await apiFetch.delete(`/api/forminstances/${id}`); 
                
                setData(prev => prev.filter(item => item.id !== id));
                
                alert("Đã xóa thành công!");
            } catch (error) {
                console.error("Lỗi khi xóa:", error);
                alert("Không thể xóa bản ghi này.");
            }
        }
    };

const handleFormSubmit = async (formData) => {
    setLoading(true);
    try {
        const instanceData = {
            ...(formData.id && { id: formData.id }),
            
            personid: formData.personId || null, 
            name: (formData.name || '').substring(0, 255),
            birthday: formData.birthday,
            gender: formData.gender, 
            address: (formData.address || '').substring(0, 255),
            months: formData.months,
            parentname: (formData.parentname || '').substring(0, 255),
            phone: (formData.phone || '').substring(0, 255),
            
            formid: formData.formId || 1,      
            periodid: formData.periodId || 1,  
            orgunitid: formData.orgUnitId || 1,
            
            ispasses: formData.ispasses === true,
            description: (formData.description || '').substring(0, 255),
            surveyby: (formData.surveyby || '').substring(0, 255),
            surveyplace: (formData.surveyplace || '').substring(0, 255),   
        };

        const payload = {
            instance: instanceData,
            values: [] 
        };
        
        let response;
        if (formData.id && formData.id !== 0) {
            response = await apiFetch.put(`/api/forminstances/${formData.id}`, payload);
            await fetchData(page, pageSize); 

        } else {  
            response = await apiFetch.post('/api/forminstances', payload);
            setPage(1);
            await fetchData(1, pageSize);
        }

        console.log("Kết quả trả về: ", response);
        setShowForm(false);
        setEditing(null);
        alert(formData.id ? 'Cập nhật thành công!' : 'Thêm mới thành công!');

    } catch (err) {
        console.error("Lỗi khi submit: ", err);
        const message = err.data && err.data.message ? err.data.message : err.message;
        if (message.includes("value too long")) {
            alert('Dữ liệu nhập vào quá dài. Vui lòng kiểm tra lại các trường thông tin.');

        } else {
            alert(`Lỗi hệ thống: ${message}`);
        }
    
    } finally {
        setLoading(false);
    }
};

    const renderActions = (row) => (
        <td className="text-center">
            <div className="btn-group btn-group-sm" role="group" aria-label="Actions">
                <button className="btn btn-outline-secondary" onClick={() => handleEdit(row)}>Sửa</button>
                <button className="btn btn-outline-danger" onClick={() => handleDelete(row.id)}>Xóa</button>
            </div>
        </td>
    );

    return (
        <div className="sm-root container-fluid py-3">
            <div className="card shadow-sm mb-3">
                <div className="card-body d-flex flex-wrap gap-2 align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-3">
                        <h2 className="h4 mb-0">Student Sàng lọc</h2>
                    </div>

                    <div className="ms-auto" style={{maxWidth: 320, width: '100%'}}>
                        <div className="input-group input-group-sm">
                            <span className="input-group-text" id="search-addon">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                </svg>
                            </span>
                            <input 
                                type="text" 
                                className="form-control"
                                placeholder="Tìm kiếm..." 
                                aria-label="Tìm kiếm"
                                aria-describedby="search-addon"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {loading && <p className="text-muted fst-italic">Đang đồng bộ dữ liệu...</p>}
            {error && <p className="text-danger">Lỗi: {error}</p>}

            <div className="d-flex justify-content-right mb-3">
                <button 
                    className="btn btn-primary"
                    style={{ width: "140px" , height: "30px" }}
                    onClick={() => { setShowForm(true); setEditing(null); }}
                >
                    Thêm mới
                </button>
            </div>

            <div className="card shadow-sm">
                <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
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
                                <td colSpan={6} className="text-center py-4 text-muted">
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
                                        <span className={`badge ${row.isPass ? 'bg-success' : 'bg-warning text-dark'}`}>
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
            </div>

            <div className="d-flex justify-content-end align-items-center gap-2 py-3">
                <button className="btn btn-light btn-sm" disabled={page <= 1} onClick={() => {
                    setPage(p => Math.max(1, p - 1));
                    try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (_) { window.scrollTo(0, 0); }
                }}>Trước</button>
                <span className="text-secondary small">
                    Trang {page} / {pageCount} (Tổng {totalItems})
                </span>
                <button className="btn btn-light btn-sm" disabled={page >= pageCount} onClick={() => {
                    setPage(p => Math.min(pageCount, p + 1));
                    try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (_) { window.scrollTo(0, 0); }
                }}>Sau</button>
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
