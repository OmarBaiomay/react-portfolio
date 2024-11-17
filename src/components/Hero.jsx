import React from "react"
import { Button } from "./Button"

const Hero = () => {
    return (
        <section id="home" className="pt-28 lg:pt-36">

            <div className="container lg:grid lg:grid-cols-2 items-center lg:gap-10">
                <div>
                    <div className="reveal-up flex items-start gap-3 flex-col">
                        {/* <figure className="">
                        <img src="" width={40} height={40} alt="Omar Elbayoumi Portrait" className="img-cover"/>
                    </figure> */}

                        <div className="flex items-center gap-1.5 text-zinc-400 text-sm tracking-wide">
                            <span className="relative w-2 h-2 rounded-full bg-emerald-400">
                                <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping"></span>
                            </span>
                            Available for work
                        </div>

                        <h2 className="headline-1 mt-5 mb-8 lg:mb-10 ">
                            Building Scalable Modern Websites for the Future
                        </h2>

                        <div className="flex justify-center items-center gap-3">
                            <Button href="/files/Omar_Bayoumi_CV.pdf" label="Download CV" icon="download" download={true}/>

                            <Button label="Hire Me" icon="" isPrimary={false} href="#contact"/>
                        </div>
                    </div>
                </div>

                <div className="reveal-up lg:block">
                    <figure className="w-full max-w-[480px] ml-auto bg-gradient-to-t from-sky-400 via-40% via-emerald-500 to-85% rounded-full overflow-hidden">
                        <img className="w-full" src="/images/omar-bayoumi.png" width={656} height={800} alt="Omar Elbayoumi" />
                    </figure>
                </div>
            </div>
        </section>
    )
}

export default Hero