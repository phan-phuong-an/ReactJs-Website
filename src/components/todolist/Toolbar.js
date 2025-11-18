import React from 'react';

const Toolbar = ({ onAdd, onExport}) => {
    return (
        <div className = "toolbar">
            <div className = "toolbar-left">
                <button className = "btn" onClick = {onAdd}>Thêm</button>
                <button className = "btn" onClick = {onExport}>Xuất</button>
            </div>

            <div className = "toolbar-right">
            </div>
        </div>
    );
};

export default Toolbar;
