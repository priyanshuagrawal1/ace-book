import React from 'react';
import './input.css';
import eyeClosed from '../../images/close-eye.png';
import eye from '../../images/open-eye.png';

interface InputProps {
    label: string;
    handleChange: (name: string, value: string) => void;
    name: string;
    placeholder: string;
    value: string;
    type?: string;
    maxLength?: number;
    error?: string;
}

const Input: React.FC<InputProps> = ({
    label,
    handleChange,
    name,
    placeholder,
    value,
    type = 'text',
    maxLength = Infinity,
    error = '',
}) => {
    const [inputType, setInputType] = React.useState(type);

    function togglePassword() {
        if (inputType === 'password') {
            setInputType('text');
        } else {
            setInputType('password');
        }
    }

    if (type === 'password') {
        return (
            <>
                <label>{label}</label>
                <div className="inputFields">
                    <div className={`passwordDiv ${error.length ? 'error' : ''}`} style={{ display: 'flex' }}>
                        <input
                            value={value}
                            onChange={(e) => handleChange(name, e.target.value)}
                            placeholder={placeholder}
                            className={`input password`}
                            type={inputType}
                            maxLength={maxLength}
                        />
                        <img className={inputType === 'text' ? 'eyeClosed' : 'eye'} onClick={togglePassword} src={inputType === 'text' ? eyeClosed : eye} alt="" />
                    </div>
                    <p className="errorText">{error.length === 0 ? '' : error}</p>
                </div>
            </>
        );
    }

    return (
        <>
            <label>{label}</label>
            <div className="inputFields">
                <input
                    value={value}
                    onChange={(e) => handleChange(name, e.target.value)}
                    placeholder={placeholder}
                    className={`input ${error.length ? 'error' : ''}`}
                    type={inputType}
                    maxLength={maxLength}
                />
                <p className="errorText">{error.length === 0 ? '' : error}</p>
            </div>
        </>
    );
};

export default Input;
