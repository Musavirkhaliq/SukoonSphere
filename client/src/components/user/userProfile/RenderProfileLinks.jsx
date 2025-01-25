import React from 'react'
import { NavLink } from 'react-router-dom'

const RenderProfileLinks = ({ name, link }) => {
    return (
        <NavLink
            end
            key={name}
            to={link}
            className={({ isActive }) =>
                `relative text-xs md:text-sm transition-all duration-300 ease-out px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg
        ${isActive
                    ? "text-[var(--ternery)] font-extrabold bg-gradient-to-r from-[var(--ternery)]/8 to-[var(--ternery)]/5 shadow-md backdrop-blur-sm rounded-xl"
                    : "text-[var(--primary)] font-bold hover:text-[var(--ternery)] overflow-hidden before:absolute before:inset-0 before:translate-y-full hover:before:translate-y-0 before:bg-[var(--ternery)]/5 before:transition-transform before:duration-300 before:rounded-lg after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-0.5 after:bg-[var(--ternery)] after:transition-all after:duration-300 hover:after:w-1/2 hover:after:-translate-x-1/2"
                }
        flex items-center min-w-[70px] justify-center sm:justify-start`
            }
        >
            <span className="relative z-10 group-hover:translate-x-0.5 transition-transform duration-300">
                {name}
            </span>
        </NavLink>
    )
}

export default RenderProfileLinks
