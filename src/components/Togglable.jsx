import { useState, forwardRef, useImperativeHandle } from 'react'

const Togglable = forwardRef((props, refs) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(refs, () => {
    return {
      toggleVisibility
    }
  })
  const openButtonLabel = props.openButtonLabel
  const openButtonId = openButtonLabel.split(' ').join('-').toLowerCase()

  return (
    <div>
      <div style={hideWhenVisible}>
        <button id={openButtonId} onClick={toggleVisibility}>{props.openButtonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button id={props.openButtonLabel} onClick={toggleVisibility}>{props.closeButtonLabel}</button>
      </div>
    </div>
  )
})

Togglable.displayName = 'Togglable'

export default Togglable