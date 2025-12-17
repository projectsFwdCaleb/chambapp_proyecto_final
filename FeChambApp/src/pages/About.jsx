import React from 'react'
import AboutContent from '../components/AboutContent/AboutContent'
import Footer from '../components/Footer/Footer'

function About() {
  return (
  <div>
    <div className='d-flex'>
      <div className='align-items-center'>
        <AboutContent />
      </div>
        

    </div>
      <Footer/>
  </div>
  )
}

export default About