import React from 'react';
import { Link } from 'react-router-dom';

const LinkButton = ({
    to,
    children,
    className = '',
    variant = 'primary',
    size = 'medium',
    disabled = false,
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded focus:outline-none transition ease-in-out duration-150';

    const variants = {
        primary: 'bg-[#0c2b64] text-white hover:bg-[var(--logo-ternary)]',
        secondary: ' hover:text-[var(--logo-ternary)] text-gray-700',
        success: 'bg-green-600 text-white hover:bg-green-700',
        danger: 'bg-red-600 text-white hover:bg-red-700',
        warning: 'bg-yellow-600 text-white hover:bg-yellow-700',
        info: 'bg-teal-600 text-white hover:bg-teal-700',
        text: 'text-[var(--white-color)] hover:text-[var(--logo-ternary)]',
    };

    const sizes = {
        small: 'px-3 py-1 text-sm',
        medium: 'px-4 py-2 text-base',
        large: 'px-6 py-3 text-lg',
    };

    // Conditionally apply padding only if the variant is not "text"
    const paddingClass = variant !== 'text' ? sizes[size] : '';

    const finalClassName = `${baseStyles} ${variants[variant]} ${paddingClass} ${className}`;

    return (
        <Link
            to={disabled ? '#' : to}
            className={`${finalClassName} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            {...props}
        >
            {children}
        </Link>
    );
};

export default LinkButton;
