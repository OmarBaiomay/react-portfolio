import React from 'react'
import PropTypes from 'prop-types'

const SkillCard = ({imgSrc, label, desc, classes}) => {
  return (
    <div className={'flex items-center gap-3 ring-2 ring-inset ring-zinc-50/10 rounded-xl p-3 hover:bg-zinc-800 transition-all group' + classes}>
        <figure className='bg-zinc--700/50 rounded-lg overflow-hidden w-12 h-12 p-2 group-hover:bg-zinc-900 transition-all'>
            <img src={imgSrc} width={32} height={32} alt={label} />
        </figure>
        <div className=''>
            <h3 className=''>{label}</h3>
            <p className='text-zinc-400 text-sm'>{desc}</p>
        </div>
    </div>
  )
}

SkillCard.PropTypes={
    imgSrc: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
    classes: PropTypes.string,
}

export default SkillCard