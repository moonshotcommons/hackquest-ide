import React, { FC, ReactNode } from 'react'
import './header.style.css'

const logo = (
  <svg width="136" height="14" viewBox="0 0 136 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.2748 0.416016V13.5839H11.7803V8.73011H6.38272V13.5839H1.88818V0.416016H6.38272V5.25082H11.7803V0.416016H16.2748Z" fill="white" />
    <path
      d="M26.5647 12.2485H24.5477C23.7154 12.2485 22.9857 12.7967 22.7714 13.5839H18.1035L22.0223 0.416016H29.0901L33.0089 13.5839H28.3411C28.1256 12.7956 27.397 12.2485 26.5647 12.2485ZM27.0162 8.73123L25.7107 3.89641H25.4029L24.0974 8.73123H27.0162Z"
      fill="white"
    />
    <path
      d="M33.3086 6.99015C33.3086 3.12568 36.5203 0 40.4664 0C42.5083 0 44.3324 0.83444 45.6411 2.15525L42.4094 5.35931C41.9339 4.81532 41.2396 4.48569 40.4664 4.48569C39.0588 4.48569 37.909 5.61171 37.909 6.99015C37.909 8.36858 39.0588 9.51421 40.4664 9.51421C41.2196 9.51421 41.9139 9.18459 42.3694 8.66019L45.6411 11.8446C44.3324 13.1655 42.4882 13.9999 40.4664 13.9999C36.5215 13.9999 33.3086 10.8742 33.3086 6.99015Z"
      fill="white"
    />
    <path
      d="M53.0982 9.7642L52.3294 10.687V13.5849H47.8325V0.410156H52.3294V4.70119H52.464L55.7311 0.410156H60.7858L55.9809 6.26299L61.0927 13.5838H55.7882L53.1941 9.76308H53.0982V9.7642Z"
      fill="white"
    />
    <g clipPath="url(#clip0_4562_5154)">
      <path
        d="M74.137 2.05251L74.1347 2.05482C75.4015 3.3231 76.1851 5.07324 76.1851 7.00005L75.877 13.6928L69.1851 14C67.7337 14 66.3854 13.5583 65.2674 12.8019C64.9032 12.5555 64.5635 12.2757 64.2526 11.9669L64.2549 11.9646C62.9765 10.6949 62.1849 8.93669 62.1849 7.00005L62.4929 0.30729L69.1851 0.000107682C70.4214 0.000107696 71.5827 0.320538 72.5907 0.882933C73.1598 1.20046 73.68 1.59513 74.1373 2.0528L74.137 2.05251Z"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M72.8674 6.98449C72.8674 9.15891 71.298 10.6741 69.2189 10.6741C67.1397 10.6741 65.5703 9.15891 65.5703 6.98449C65.5703 4.81008 67.1397 3.29492 69.2189 3.29492C71.298 3.29492 72.8674 4.81008 72.8674 6.98449Z"
        fill="#0B0B0B"
      />
    </g>
    <path
      d="M78.0514 7.98025V0.417969H82.4765V7.90659C82.4765 9.53689 83.3464 10.3889 84.689 10.3889C86.0316 10.3889 86.8443 9.53689 86.8443 7.90659V0.417969H91.2694V7.98025C91.2694 12.3512 88.1307 13.9991 84.5936 13.9991C81.0565 13.9991 78.0503 12.3512 78.0503 7.98025H78.0514Z"
      fill="white"
    />
    <path d="M98.094 3.87355V5.24541H105.461V8.72079H98.094V10.1116H105.461V13.5691H93.6045V0.416016H105.461V3.87355H98.094Z" fill="white" />
    <path
      d="M107.874 10.1237H114.898C115.495 10.1237 115.784 9.85969 115.784 9.4256C115.784 8.99151 115.496 8.74651 114.879 8.74651H111.684C109.432 8.74651 107.604 7.23838 107.604 4.58127C107.604 1.5281 109.74 0.416016 111.896 0.416016H119.864V3.90328H112.994C112.474 3.90328 112.109 4.09123 112.109 4.56224C112.109 5.03325 112.474 5.26037 112.994 5.26037H115.996C118.576 5.26037 120.288 6.74948 120.288 9.40659C120.288 11.9138 118.364 13.6099 115.861 13.6099H107.817L107.875 10.1237H107.874Z"
      fill="white"
    />
    <path d="M125.567 3.8965H121.571V0.416016H134.056V3.8965H130.061V13.5842H125.567V3.8965Z" fill="white" />
    <defs>
      <clipPath id="clip0_4562_5154">
        <rect width="13.9999" height="14.0002" fill="white" transform="matrix(1.19249e-08 -1 -1 -1.19249e-08 76.1851 14)" />
      </clipPath>
    </defs>
  </svg>
)

const HackquestHeader: FC = () => {
  const getBaseLink = () => {
    console.log(process.env.NODE_ENV)
    switch (process.env.NODE_ENV) {
      case 'staging':
        return 'https://staging.hackquest.io/'
      case 'production':
        return 'https://hackquest.io/'
      case 'development':
        return 'https://dev.hackquest.io/'
      default:
        return 'http://localhost:3000'
    }
  }

  const navList = [
    {
      name: 'Home',
      link: `${getBaseLink()}/home`,
    },
    {
      name: 'Learning Track',
      link: `${getBaseLink()}/learning-track`,
    },
    {
      name: 'Electives',
      link: `${getBaseLink()}/electives`,
    },
    // {
    //   name: 'Community Center',
    //   link: '',
    // },
    // {
    //   name: 'Mission Center',
    //   link: '',
    // },
  ]
  return (
    <div className="hackquest-header">
      <div className="hackquest-header-logo">{logo}</div>
      <ul className="hackquest-header-nav">
        {navList.map((nav) => {
          return (
            <a href={nav.link} className="hackquest-header-nav-item">
              <li className="" key={nav.name}>
                {nav.name}
              </li>
            </a>
          )
        })}
      </ul>
      {/* <div className="hackquest-header-avatar">
        <img src="assets/img/avatar.png" alt="avatar"></img>
      </div> */}
    </div>
  )
}

export default HackquestHeader
