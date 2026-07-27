import React from 'react'
import PropTypes from 'prop-types'

const ProjectCard = ({imgSrc, title, tags, projectLink, classes}) => {
  return (
    <div className={"relative p-4 rounded-2xl bg-zinc-800 hover:bg-zinc-700/50 active:bg-zinc-700/60 ring-1 ring-zinc-50/5 transition-colors " + classes}>
        <figure className='img-box aspect-square rounded-lg mb-4 '>
            <img src={imgSrc} alt={title} loading='lazy' className='img-cover'/>
        </figure>
        <div className='flex items-center justify-between gap-4'>
            <div>
                <h3 className='title-1 mb-3 '>
                    {title}
                </h3>
                <div className='flex flex-wrap items-center gap-2'>
                    {
                        tags.map((label, key) => (
                            <span className='h-8 text-[0.7rem] text-zinc-400 bg-zinc-50/5 grid items-center px-3 rounded-lg m-0 tag' key={key}>{label}</span>
                        ))
                    }
                </div>
            </div>
            
            <div className='w-11 h-11 rounded-lg grid place-items-center bg-emerald-400 text-zinc-950 shrink-0'>
                <span className='m-icon' aria-hidden="true">arrow_outward</span>
            </div>
        </div>

        <a href={projectLink} className='absolute inset-0' target='_blank'></a>
    </div>
  )
}


ProjectCard.PropTypes={
    imgSrc: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    tags: PropTypes.array.isRequired,
    projectLink: PropTypes.string.isRequired,
    classes: PropTypes.string,
}

export default ProjectCard