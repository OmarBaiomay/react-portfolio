import React from 'react'
import ProjectCard from './ProjectCard';

const works = [
    {
      imgSrc: '/images/project-1.jpg',
      title: 'Weather App',
      tags: ['API', 'MVC', 'Development'],
      projectLink: 'https://weathergo.b-code.tech/'
    },
    {
      imgSrc: '/images/project-2.jpg',
      title: 'Aisha Academy Website',
      tags: ['Odoo', 'Design','Development'],
      projectLink: 'https://www.aishaquran.com'
    },
    {
      imgSrc: '/images/project-3.jpg',
      title: 'Global Solutions',
      tags: ['Odoo','Development'],
      projectLink: 'https://globalsolutions.sa/'
    },
    {
      imgSrc: '/images/project-4.jpg',
      title: 'Najd Digital',
      tags: ['Wordpress', 'Development'],
      projectLink: 'https://www.najddigital.com'
    },
  ];

const Work = () => {
  return (
    <section className='section' id='work'>
        <div className='container'>
            <h2 className='headline-2 mb-10 reveal-up'>
                My portfolio highlights
            </h2>
            <div className='grid gap-x-4 gap-y-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3'>
                {
                    works.map(({imgSrc, title, tags, projectLink}, key) => (
                        <ProjectCard key={key} imgSrc={imgSrc} title={title} tags={tags} projectLink={projectLink} classes="reveal-up"/>
                    ))}
            </div>
        </div>
    </section>
  )
}

export default Work