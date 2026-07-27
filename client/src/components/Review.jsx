import React from 'react'
import ReviewCard from './ReviewCard';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import required modules
import { Pagination, Navigation } from 'swiper/modules';

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


  return (
    <section className="section overflow-hidden" id='reviews'>
        <div className="container">
            <h2 className="headline-2 mb-8 reveal-up">
                What our customers say
            </h2>
            <Swiper
              spaceBetween={30}
              loop={true}
              pagination={{
                clickable: true,
              }}
              breakpoints={{
                640: {
                  slidesPerView: 1,
                  spaceBetween: 20,
                },
                768:{
                  slidesPerView: 2,
                  spaceBetween: 30,
                }
              }}
              navigation={false}
            >
                {
                    reviews.map(({content, userName, imgSrc, company}, key) => (
                      <SwiperSlide className='min-h-[200px]'>
                          <ReviewCard 
                            className="item" 
                            content={content} 
                            userName={userName} 
                            imgSrc={imgSrc} 
                            company={company} 
                            key={key}
                          />
                      </SwiperSlide>
                    ))
                }
            </Swiper>
        </div>
    </section>
  )
}

export default Review