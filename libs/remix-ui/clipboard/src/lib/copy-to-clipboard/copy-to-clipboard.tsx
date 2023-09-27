import React, { useState } from 'react'
import copy from 'copy-to-clipboard'
import { Placement } from 'react-bootstrap/esm/Overlay'

import './copy-to-clipboard.css'
import { CustomTooltip } from '@remix-ui/helper'

interface ICopyToClipboard {
  content?: any
  tip?: string
  icon?: string
  direction?: Placement
  className?: string
  title?: string
  children?: JSX.Element
  getContent?: () => any
}
export const CopyToClipboard = (props: ICopyToClipboard) => {
  const { tip = 'Copy', icon = 'fa-copy', direction = 'right', getContent, children, ...otherProps } = props
  let { content } = props
  const [message, setMessage] = useState(tip)

  const copyData = () => {
    try {
      if (content === '') {
        setMessage('Cannot copy empty content!')
        return
      }
      if (typeof content !== 'string') {
        content = JSON.stringify(content, null, '\t')
      }
      copy(content)
      setMessage('Copied')
    } catch (e) {
      console.error(e)
    }
  }

  const handleClick = (e: any) => {
    if (content) {
      // module `copy` keeps last copied thing in the memory, so don't show tooltip if nothing is copied, because nothing was added to memory
      copyData()
    } else {
      content = getContent && getContent()
      copyData()
    }
    e.preventDefault()
  }

  const reset = () => {
    setTimeout(() => setMessage(tip), 500)
  }

  // const childJSX = children || <i className={`far ${icon} ml-1 p-2`} aria-hidden="true" {...otherProps}></i>
  const childJSX = children || (
    <svg width="13" height="16" viewBox="0 0 13 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={`far ${icon} ml-1 p-2`} aria-hidden="true" {...otherProps}>
      <path
        d="M1.50192 16C1.08889 16 0.735189 15.8432 0.440813 15.5296C0.146438 15.216 -0.000499363 14.8395 0 14.4V4C0 3.77333 0.0720933 3.5832 0.216277 3.4296C0.360461 3.276 0.538688 3.19947 0.750959 3.2C0.96373 3.2 1.14221 3.2768 1.28639 3.4304C1.43058 3.584 1.50242 3.77387 1.50192 4V14.4H9.01149C9.22426 14.4 9.40274 14.4768 9.54693 14.6304C9.69111 14.784 9.76295 14.9739 9.76245 15.2C9.76245 15.4267 9.69036 15.6168 9.54617 15.7704C9.40199 15.924 9.22376 16.0005 9.01149 16H1.50192ZM4.50575 12.8C4.09272 12.8 3.73902 12.6432 3.44464 12.3296C3.15027 12.016 3.00333 11.6395 3.00383 11.2V1.6C3.00383 1.16 3.15102 0.783201 3.44539 0.469601C3.73977 0.156001 4.09322 -0.000531975 4.50575 0H11.2644C11.6774 0 12.0311 0.156801 12.3255 0.470401C12.6198 0.784001 12.7668 1.16053 12.7663 1.6V11.2C12.7663 11.64 12.6191 12.0168 12.3247 12.3304C12.0303 12.644 11.6769 12.8005 11.2644 12.8H4.50575ZM4.50575 11.2H11.2644V1.6H4.50575V11.2Z"
        fill="#8C8C8C"
      />
      <path
        d="M1.50192 16C1.08889 16 0.735189 15.8432 0.440813 15.5296C0.146438 15.216 -0.000499363 14.8395 0 14.4V4C0 3.77333 0.0720933 3.5832 0.216277 3.4296C0.360461 3.276 0.538688 3.19947 0.750959 3.2C0.96373 3.2 1.14221 3.2768 1.28639 3.4304C1.43058 3.584 1.50242 3.77387 1.50192 4V14.4H9.01149C9.22426 14.4 9.40274 14.4768 9.54693 14.6304C9.69111 14.784 9.76295 14.9739 9.76245 15.2C9.76245 15.4267 9.69036 15.6168 9.54617 15.7704C9.40199 15.924 9.22376 16.0005 9.01149 16H1.50192ZM4.50575 12.8C4.09272 12.8 3.73902 12.6432 3.44464 12.3296C3.15027 12.016 3.00333 11.6395 3.00383 11.2V1.6C3.00383 1.16 3.15102 0.783201 3.44539 0.469601C3.73977 0.156001 4.09322 -0.000531975 4.50575 0H11.2644C11.6774 0 12.0311 0.156801 12.3255 0.470401C12.6198 0.784001 12.7668 1.16053 12.7663 1.6V11.2C12.7663 11.64 12.6191 12.0168 12.3247 12.3304C12.0303 12.644 11.6769 12.8005 11.2644 12.8H4.50575ZM4.50575 11.2H11.2644V1.6H4.50575V11.2Z"
        stroke="#E3E3E3"
      />
    </svg>
  )

  return (
    <a href="#" onClick={handleClick} onMouseLeave={reset}>
      <CustomTooltip tooltipText={message} tooltipId="overlay-tooltip" placement={direction}>
        {childJSX}
      </CustomTooltip>
    </a>
  )
}

export default CopyToClipboard
