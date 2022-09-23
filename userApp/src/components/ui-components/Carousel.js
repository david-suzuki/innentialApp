import React from 'react'
import NukaCarousel from 'nuka-carousel'
import carouselStyle from '../../styles/carouselStyle'

const Carousel = ({
  children,
  rightArrow,
  leftArrow,
  renderBottomControls,
  animation
}) => (
  <>
    <NukaCarousel
      cellSpacing={20}
      slideWidth={0.45}
      renderTopRightControls={rightArrow}
      renderTopLeftControls={leftArrow}
      renderBottomCenterControls={renderBottomControls}
      animation={animation}
      cellAlign='center'
    >
      {children}
    </NukaCarousel>
    <style jsx>{carouselStyle}</style>
  </>
)

export default Carousel
