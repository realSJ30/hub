import { Button } from '@/components/ui/button'
import React from 'react'

const Hero = () => {
  return (
    <div className='flex items-center justify-start h-screen w-full gap-4'>
        <div className='flex flex-col items-start justify-center gap-4 text-left pb-28'>
            <h1 className='text-6xl font-bold'>Maximize Your <br /> <span className='bg-linear-to-r from-primary to-violet-600 bg-clip-text text-transparent'>Productivity</span></h1>
            <p className='text-lg text-muted-foreground'>Conquer your tasks and take control with our platform.</p>
            <div className='flex items-center justify-center'>
                <Button>Learn more</Button>
            </div>
        </div>
        <div className='flex items-center justify-center w-full'>
            <div className='border rounded-lg h-96 w-96'>
                some app widget here...
            </div>
        </div>
    </div>
  )
}

export default Hero