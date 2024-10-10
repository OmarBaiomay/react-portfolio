import React from 'react'

import PropTypes from 'prop-types'


function Button({href="#", target="_self", label="Button", icon, classes, isPrimary=true}) {
    if(isPrimary){
        return (
            <a 
                className={`px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-400 transition-colors ${classes}`} 
                href={href}
                target={target}
            >
                {label} <span className='m-icon text-[18px]'>{icon}</span>
            </a>
        )
    }else{
        return (
            <a 
                className={`px-4 py-2 rounded-xl border border-emerald-600 hover:bg-emerald-600 transition-all ${classes}`} 
                href={href}
                target={target}
            >
                {label} <span className='m-icon'>{icon}</span> 
            </a>
        )
    }
}

Button.prototype = {
    label: PropTypes.string.isRequired,
    href: PropTypes.string,
    target: PropTypes.string,
    icon: PropTypes.string,
    classes: PropTypes.string,
    isPrimary: PropTypes.bool.isRequired
}

export {Button}