import React from 'react'
import PropTypes from 'prop-types'

const ratings = new Array(5)

ratings.fill({
    icon: 'star',
    style: { fontVariationSettings: '"FILL" 1' }
})

console.log(ratings)

const ReviewCard = ({content, userName, imgSrc, company}) => {
  return (
    <div className="flex justify-center items-start bg-zinc-800 p-5 rounded-xl min-w-[320px] flex-col lg:min-w-[420px]">
        <div className="flex items-center gap-1 mb-3">
            {
                ratings.map(({icon, style}, key) => (
                    <span className='m-icon inline-block text-yellow-400 text-[18px]' style={style} key={key}>
                        {icon}
                    </span>
                ))
            }
        </div>

        <div className="text-zinc-400 mb-8">
            {content}
        </div>
        <div className="flex items-center gap-2 mt-auto">
            <figure className='img-box rounded-lg overflow-hidden'>
                <img src={imgSrc} alt={userName} width={44} height={44} loading='lazy' className='img-cover'/>
            </figure>

            <div className="">
                <p>{userName}</p>
                <p className='text-xl text-zinc-400 tracking-wider text-[16px]'>
                    {company}
                </p>
            </div>
        </div>
    </div>
  )
}

ReviewCard.PropTypes={
    content: PropTypes.string.isRequired,
    userName: PropTypes.string.isRequired,
    imgSrc: PropTypes.string.isRequired,
    company: PropTypes.string.isRequired,
}


export default ReviewCard