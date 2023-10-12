import React, { useEffect, useRef, useState } from 'react' // eslint-disable-line
import { FormattedMessage } from 'react-intl'
import { PluginRecord } from '../types'
import './panel.css'
import './panel-header.css'
import { CustomTooltip } from '@remix-ui/helper'
import { Plugin } from '@remixproject/engine'
// import { SidePanel } from 'apps/remix-ide/src/app'

// SidePanel

export interface RemixPanelProps {
  plugins: Record<string, PluginRecord>
  sidePlugin: any
}
const RemixUIPanelHeader = (props: RemixPanelProps) => {
  const [plugin, setPlugin] = useState<PluginRecord>()
  const [toggleExpander, setToggleExpander] = useState<boolean>(false)

  useEffect(() => {
    setToggleExpander(false)
    if (props.plugins) {
      const p = Object.values(props.plugins).find((pluginRecord) => {
        return pluginRecord.active === true
      })
      setPlugin(p)
    }
  }, [props])

  const toggleClass = () => {
    setToggleExpander(!toggleExpander)
  }

  const tooltipChild = <i className={`px-1 ml-2 pt-1 pb-2 ${!toggleExpander ? 'fas fa-angle-right' : 'fas fa-angle-down bg-light'}`} aria-hidden="true"></i>

  return (
    <header className="d-flex flex-column">
      <div className="swapitHeader d-flex flex-row items-center hack-side-header">
        <h6 className="pt-0 mb-1" data-id="sidePanelSwapitTitle">
          {plugin?.profile?.name && <FormattedMessage id={`${plugin.profile.name}.displayName`} defaultMessage={plugin?.profile?.displayName || plugin?.profile?.name} />}
        </h6>
        <div className="d-flex flex-row">
          <div className="d-flex flex-row">
            {/* {plugin?.profile?.maintainedBy?.toLowerCase() === 'remix' && (
              <CustomTooltip placement="right-end" tooltipId="maintainedByTooltip" tooltipClasses="text-nowrap" tooltipText={<FormattedMessage id="panel.maintainedByRemix" />}>
                <i aria-hidden="true" className="text-success mt-1 px-1 fas fa-check"></i>
              </CustomTooltip>
            )} */}
            <svg
              width="12"
              height="10"
              viewBox="0 0 12 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                // const p = Object.values(props.plugins).find((pluginRecord) => {
                //   return pluginRecord.active === false
                // })
                // setPlugin(p)
                props.sidePlugin.events.emit('toggle')
              }}
            >
              <path d="M5 1L1 5L5 9" stroke="black" strokeLinecap="round" />
              <path d="M11 1L7 5L11 9" stroke="black" strokeLinecap="round" />
            </svg>
          </div>
          {/* <div className="swapitHeaderInfoSection d-flex justify-content-between" data-id="swapitHeaderInfoSectionId" onClick={toggleClass}>
            <CustomTooltip placement="right-end" tooltipText={<FormattedMessage id="panel.pluginInfo" />} tooltipId="pluginInfoTooltip" tooltipClasses="text-nowrap">
              {tooltipChild}
            </CustomTooltip>
          </div> */}
          {/* <div
            className="swapitHeaderInfoSection d-flex justify-content-between"
            data-id="swapitHeaderInfoSectionId"
            onClick={() => {
              props.sidePlugin.call('layout', 'minimize', plugin.profile.name, !plugin.minimized)
            }}
          >
            <CustomTooltip placement="right-end" tooltipText={<FormattedMessage id="panel.pluginInfo" />} tooltipId="pluginInfoTooltip" tooltipClasses="text-nowrap">
              {tooltipChild}
            </CustomTooltip>
          </div> */}
        </div>
      </div>
      {/* <div className={`bg-light mx-3 mb-2 p-3 pt-1 border-bottom flex-column ${toggleExpander ? 'd-flex' : 'd-none'}`}>
        {plugin?.profile?.author && (
          <span className="d-flex flex-row align-items-center">
            <label className="mb-0 pr-2">
              <FormattedMessage id="panel.author" />:
            </label>
            <span> {plugin?.profile.author} </span>
          </span>
        )}
        {plugin?.profile?.maintainedBy && (
          <span className="d-flex flex-row align-items-center">
            <label className="mb-0 pr-2">
              <FormattedMessage id="panel.maintainedBy" />:
            </label>
            <span> {plugin?.profile.maintainedBy} </span>
          </span>
        )}
        {plugin?.profile?.documentation && (
          <span className="d-flex flex-row align-items-center">
            <label className="mb-0 pr-2">
              <FormattedMessage id="panel.documentation" />:
            </label>
            <span>
              <CustomTooltip placement="right-end" tooltipId="linkToDocsTooltip" tooltipClasses=" text-nowrap " tooltipText={<FormattedMessage id="panel.linkToDoc" />}>
                <a href={plugin?.profile?.documentation} className="titleInfo p-0 mb-2" target="_blank" rel="noreferrer">
                  <i aria-hidden="true" className="fas fa-book"></i>
                </a>
              </CustomTooltip>
            </span>
          </span>
        )}
        {plugin?.profile?.description && (
          <span className="d-flex flex-row align-items-baseline">
            <label className="mb-0 pr-2">
              <FormattedMessage id="panel.description" />:
            </label>
            <span> {plugin?.profile.description} </span>
          </span>
        )}
        {plugin?.profile?.repo && (
          <span className="d-flex flex-row align-items-center">
            <a href={plugin?.profile?.repo} target="_blank" rel="noreferrer">
              <FormattedMessage id="panel.makeAnissue" />
            </a>
          </span>
        )}
      </div> */}
    </header>
  )
}

export default RemixUIPanelHeader
