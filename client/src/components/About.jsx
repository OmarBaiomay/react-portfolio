import { number } from 'prop-types'
import React from 'react'


const aboutItems = [
    {
        label: "Project Done",
        number: 30
    },
    {
        label: "Years of Experience",
        number: 2
    }
]


function About() {
  return (
    <section className='section' id='about'>
        <div className='container'>
            <div className='bg-zinc-800/50 p-7 rounded-2xl md:p-12 reveal-up'>
                <p className='text-zinc-300 mb-4 md:mb-8 md:text-xl'>
                I'm a skilled React Developer with a passion for building dynamic, user-friendly web applications. I specialize in crafting responsive, efficient front-end solutions that deliver exceptional user experiences. From designing clean, intuitive interfaces to implementing cutting-edge features, I thrive on transforming complex challenges into impactful, functional web applications. Let's collaborate to bring your ideas to life and create modern, engaging solutions for your needs!
                </p>

                <div className='flex flex-wrap items-center gap-4 md:gap-7'>
                    {
                        aboutItems.map(({label, number}, key) =>(
                            <div className='' key={key}>
                                <div className='flex items-center md:mb-2'>
                                    <span className='text-2xl font-bold md:text-4xl'>{number}</span>
                                    <span className='text-2xl text-emerald-500 font-semibold'> +</span>
                                </div>
                                <p className='text-sm text-zinc-400'>{label}</p>
                            </div>
                        ))
                    }
                    <img src='../../images/logo.svg' alt='logo' width={30} height={30} className='ml-auto md:w-[40px] md:h-[40px]'/>
                </div>
            </div>
        </div>
    </section>
  )
}

export default About