import React from 'react';

const Toolbar = ({ onAdd, onExport}) => {
    return (
        <div className="d-flex justify-content-between align-items-center mb-3 p-2">
            <div className="d-flex gap-2">
                <button className="btn btn-primary" onClick={onAdd}>Thêm</button>
                <button className="btn btn-outline-secondary" onClick={onExport}>Xuất</button>
            </div>
            <div>
                {/* Toolbar right content */}
            </div>
        </div>
    );
};

export default Toolbar;
