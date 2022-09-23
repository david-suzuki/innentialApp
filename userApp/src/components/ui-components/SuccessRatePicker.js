import React from 'react'
import { BodyPortal } from './'
import { Button, Dialog } from 'element-react'
import Slider from 'react-slider'

export default ({
  sliderValue,
  setSliderValue,
  dialogVisible,
  setDialogVisible,
  setMeasureSuccessLevel
}) => {
  return (
    <BodyPortal>
      <Dialog
        onCancel={() => setDialogVisible(false)}
        closeOnClickModal={false}
        visible={dialogVisible}
        className='el-dialog--success-rate'
      >
        <Dialog.Body className='el-dialog__body--success-rate'>
          <p>Set measure success level</p>
          <Slider
            value={sliderValue}
            onAfterChange={value => setSliderValue(value)}
            // renderTrack={(props, state) => <div {...props} index={state.index} />}
            renderThumb={(props, state) => (
              <div {...props}>{state.valueNow}%</div>
            )}
          />
        </Dialog.Body>
        <Dialog.Footer className='el-dialog__footer--success-rate'>
          <Button
            type='primary'
            onClick={() => {
              setMeasureSuccessLevel(sliderValue)
              setDialogVisible(false)
            }}
          >
            Save
          </Button>
        </Dialog.Footer>
      </Dialog>
    </BodyPortal>
  )
}
