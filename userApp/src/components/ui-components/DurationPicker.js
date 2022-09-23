import React, { useState } from 'react'
import { BodyPortal } from './'
import { Button, Dialog } from 'element-react'
import Slider from 'react-slider'

const DurationPicker = ({
  initialValue,
  dialogVisible,
  setDialogVisible,
  setDuration
}) => {
  const [sliderValue, setSliderValue] = useState(initialValue)

  return (
    <BodyPortal>
      <Dialog
        onCancel={() => setDialogVisible(false)}
        closeOnClickModal={false}
        visible={dialogVisible}
        size='tiny'
        className='el-dialog--success-rate'
      >
        <Dialog.Body className='el-dialog__body--success-rate'>
          <h3>How many hours per week do you want to learn?</h3>
          <br />
          <Slider
            show-tooltip
            className='slider--duration'
            value={sliderValue}
            min={1}
            max={10}
            step={1}
            onAfterChange={value => setSliderValue(value)}
            renderThumb={(props, state) => (
              <div {...props}>
                <div className='thumb-tooltip'>{`${state.valueNow}h`}</div>
              </div>
            )}
          />
          <div
            style={{
              padding: '10px',
              textAlign: 'center'
            }}
          >
            <Button
              type='primary'
              onClick={() => {
                setDuration(sliderValue)
                setDialogVisible(false)
              }}
            >
              Save
            </Button>
          </div>
        </Dialog.Body>
      </Dialog>
    </BodyPortal>
  )
}

export default DurationPicker
