import React from 'react'
import NukaCarousel from 'nuka-carousel'
import carouselSecondaryStyle from '../../styles/carouselSecondaryStyle'

const CarouselSecondary = ({
  children,
  rightArrow,
  leftArrow,
  renderBottomControls,
  animation
}) => (
  <>
    <NukaCarousel
      style={{ height: `440px` }}
      cellSpacing={20}
      renderTopRightControls={rightArrow}
      renderBottomRightControls={leftArrow}
      renderBottomCenterControls={renderBottomControls}
      animation={animation}
      cellAlign='left'
      slidesToShow={3}
      dragging={false}
      initialSlideHeight={20}
    >
      {children}
    </NukaCarousel>
    <style jsx>{carouselSecondaryStyle}</style>
  </>
)

export default CarouselSecondary
