// eslint-disable-next-line no-use-before-define
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { EnvironmentProps } from '../types'
import { Dropdown } from 'react-bootstrap'
import { CustomMenu, CustomToggle, CustomTooltip } from '@remix-ui/helper'

export function EnvironmentUI(props: EnvironmentProps) {
  const handleChangeExEnv = (env: string) => {
    const provider = props.providers.providerList.find((exEnv) => exEnv.value === env)
    const context = provider.value
    props.setExecutionContext({ context })
  }

  const currentProvider = props.providers.providerList.find((exEnv) => exEnv.value === props.selectedEnv)
  const bridges = {
    'injected-optimism-provider': 'https://www.optimism.io/apps/bridges',
    'injected-arbitrum-one-provider': 'https://bridge.arbitrum.io/',
  }

  const isL2 = (provider) => provider && (provider.value === 'Optimism Provider' || provider.value === 'Arbitrum One Provider')
  return (
    <div className="udapp_crow">
      <label id="selectExEnv" className="udapp_settingsLabel">
        <FormattedMessage id="udapp.environment" />

        <CustomTooltip placement={'right'} tooltipClasses="text-nowrap" tooltipId="info-recorder" tooltipText={<FormattedMessage id="udapp.tooltipText2" />}>
          <a href="https://chainlist.org/" target="_blank">
            {/* <i style={{ fontSize: 'medium' }} className={'ml-2 fad fa-plug'} aria-hidden="true"></i> */}
            <img src="/assets/img/link.svg" style={{ mixBlendMode: 'multiply', display: 'inline-block', width: '22px', height: '22px', flexShrink: 0 }}></img>
          </a>
        </CustomTooltip>
      </label>
      <div className="udapp_environment">
        <Dropdown id="selectExEnvOptions" data-id="settingsSelectEnvOptions" className="udapp_selectExEnvOptions">
          <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components" className="btn btn-light btn-block w-100 d-inline-block border border-dark form-control" icon={null}>
            {isL2(currentProvider) && 'L2 - '}
            {currentProvider && currentProvider.content}
            {currentProvider && bridges[currentProvider.value] && (
              <CustomTooltip placement={'right'} tooltipClasses="text-nowrap" tooltipId="info-recorder" tooltipText={<FormattedMessage id="udapp.tooltipText3" />}>
                <i
                  style={{ fontSize: 'medium' }}
                  className={'ml-2 fa fa-rocket-launch'}
                  aria-hidden="true"
                  onClick={() => {
                    window.open(bridges[currentProvider.value], '_blank')
                  }}
                ></i>
              </CustomTooltip>
            )}
          </Dropdown.Toggle>
          <Dropdown.Menu as={CustomMenu} className="w-100 custom-dropdown-items" data-id="custom-dropdown-items">
            {props.providers.providerList.map(({ content, value }, index) => (
              <Dropdown.Item
                key={index}
                onClick={() => {
                  handleChangeExEnv(value)
                }}
                data-id={`dropdown-item-${value}`}
              >
                <span className="">
                  {isL2({ value }) && 'L2 - '}
                  {content}
                </span>
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>

        <CustomTooltip placement={'right-start'} tooltipClasses="text-wrap" tooltipId="runAndDeployAddresstooltip" tooltipText={<FormattedMessage id="udapp.environmentDocs" />}>
          <a href="https://remix-ide.readthedocs.io/en/latest/run.html#environment" target="_blank" rel="noreferrer">
            {/* <i className="udapp_infoDeployAction ml-2 fas fa-info"></i> */}
            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8.5" cy="8.5" r="8.5" fill="#8C8C8C" />
              <circle cx="8.50039" cy="4.25039" r="0.85" fill="white" />
              <rect x="7.65039" y="5.94922" width="1.7" height="7.65" rx="0.85" fill="white" />
            </svg>
          </a>
        </CustomTooltip>
      </div>
    </div>
  )
}
