import React from 'react';
import './checkbox.css';

interface CheckboxProps {
    label: string;
    onChange: (checked: boolean) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, onChange }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.checked);
    };

    return (
        <label className="checkbox">
            <input type="checkbox" onChange={handleChange} style={{ width: '11px', height: '11px' }} />
            <span> {label} </span>
        </label>
    );
};

export default Checkbox;
