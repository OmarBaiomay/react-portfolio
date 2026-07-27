/**
 * @copyright 2024 Omar Elbayoumi
 */

/**
 * Libraries
 */

import { ReactLenis, useLenis } from 'lenis/react'
import * as $ from "jquery" 
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Components
 */
import 'lenis/dist/lenis.css'
import About from "./components/About"
import Contact from "./components/Contact"
import Footer from "./components/Footer"
import Header from "./components/Header"
import Hero from "./components/Hero"
import Review from "./components/Review"
import Skill from "./components/Skill"
import Work from "./components/Work"

const App = () => {

  useGSAP(() =>{
    const elements = gsap.utils.toArray(".reveal-up")
    elements.forEach((element) =>{
      gsap.to(element, {
        scrollTrigger: {
          trigger: element, 
          scrub: true,
          start: "-200 bottom",
          end: "bottom 80%"
        },
        y:'0',
        opacity: 1,
        duration:1,
        yoyo: true,
        ease: 'power2.out',
      })
    })
  })

  return (
    <ReactLenis root>
    <Header />
    <main>
      <Hero />
      <About />
      <Skill />
      <Work />
      <Review />
      <Contact />
      <Footer />
    </main>
    </ReactLenis>
  )
}

export default App