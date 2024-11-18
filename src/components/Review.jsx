import React from 'react'
import ReviewCard from './ReviewCard';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

import OwlCarousel from 'react-owl-carousel';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const reviews = [

    {
      content: 'Exceptional web development! Delivered a seamless, responsive site with clean code and great UX.',
      userName: 'Sophia Ramirez',
      imgSrc: '/images/people-1.jpg',
      company: 'PixelForge'
    },
    {
      content: 'Impressive work! Fast loading times, intuitive design, and flawless backend integration. Highly recommend.',
      userName: 'Ethan Caldwell',
      imgSrc: '/images/people-2.jpg',
      company: 'NexaWave'
    },
    {
      content: 'Outstanding developer! Built a robust site with perfect functionality. Efficient and detail-oriented.',
      userName: 'Liam Bennett',
      imgSrc: '/images/people-3.jpg',
      company: 'CodeCraft'
    },
    {
      content: 'Creative and skilled! Produced a modern, user-friendly site that exceeded expectations. Great communication.',
      userName: 'Noah Williams',
      imgSrc: '/images/people-4.jpg',
      company: 'BrightWeb'
    },
    {
      content: 'Professional work! Delivered on time, with a polished design and smooth user experience. Top-notch developer.',
      userName: 'Ava Thompson',
      imgSrc: '/images/people-5.jpg',
      company: 'TechMosaic'
    },
    {
      content: 'Excellent project execution! High-quality code, responsive design, and exceptional problem-solving skills.',
      userName: 'Jonathan',
      imgSrc: '/images/people-6.jpg',
      company: 'Skyline Digital'
    }
  ];

const Review = () => {


  // useGSAP(() =>{
  //   gsap.to('.scrub-slide',{
  //     ScrollTrigger: {
  //       trigger: '.scrub-slide',
  //       start: "-200% 80%",
  //       end: "400% 80%",
  //       scrub: true,
  //       markers: true
  //     },
  //     x: '-1000'
  //   })
  // });

  const options = {
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 1,
      },
      600: {
        items: 1,
      },
      700: {
        items: 2,
        dots: true,
        nav: false,
        margin: 50
      },
      800: {
        items: 2,
      },
      1000: {
        items: 2,
      }
    },
    nav: false,
    dots: true
  }

  return (
    <section className="section overflow-hidden" id='reviews'>
        <div className="container">
            <h2 className="headline-2 mb-8 reveal-up">
                What our customers say
            </h2>
            <OwlCarousel className='owl-theme section' loop margin={50} autoplay {...options} >
                {
                    reviews.map(({content, userName, imgSrc, company}, key) => (
                        <ReviewCard className="item" content={content} userName={userName} imgSrc={imgSrc} company={company} key={key}/>
                    ))
                }
            </OwlCarousel>
        </div>
    </section>
  )
}

export default Review