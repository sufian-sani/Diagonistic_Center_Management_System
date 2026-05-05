import React from 'react'
import { motion } from 'framer-motion'

const SkeletonLoader = ({ type = 'table', rows = 5 }) => {
    
    const pulse = {
        initial: { opacity: 0.5 },
        animate: { opacity: [0.5, 1, 0.5] },
        transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
    }

    if (type === 'table') {
        return (
            <div className='w-full overflow-hidden'>
                <div className='flex gap-4 mb-4 border-b pb-2'>
                    {[1, 2, 3, 4, 5].map(i => (
                        <motion.div key={i} {...pulse} className='h-4 w-24 bg-gray-200 rounded'></motion.div>
                    ))}
                </div>
                {[...Array(rows)].map((_, i) => (
                    <div key={i} className='flex gap-4 mb-4'>
                        {[1, 2, 3, 4, 5].map(j => (
                            <motion.div key={j} {...pulse} className='h-8 flex-1 bg-gray-100 rounded'></motion.div>
                        ))}
                    </div>
                ))}
            </div>
        )
    }

    if (type === 'card') {
        return (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                {[...Array(rows)].map((_, i) => (
                    <motion.div key={i} {...pulse} className='h-32 bg-gray-100 rounded-2xl p-4 shadow-sm border border-gray-50 flex flex-col gap-3'>
                        <div className='h-4 w-1/2 bg-gray-200 rounded'></div>
                        <div className='h-8 w-1/4 bg-gray-200 rounded mt-auto'></div>
                    </motion.div>
                ))}
            </div>
        )
    }

    return null
}

export default SkeletonLoader
