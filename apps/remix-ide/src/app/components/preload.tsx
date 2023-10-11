import { RemixApp } from '@remix-ui/app'
import React, { useEffect, useRef, useState } from 'react'
import { render } from 'react-dom'
import * as packageJson from '../../../../../package.json'
import { fileSystem, fileSystems } from '../files/fileSystem'
import { indexedDBFileSystem } from '../files/filesystems/indexedDB'
import { localStorageFS } from '../files/filesystems/localStorage'
import { fileSystemUtility, migrationTestData } from '../files/filesystems/fileSystemUtility'
import './styles/preload.css'
const _paq = (window._paq = window._paq || [])

export const Preload = () => {
  const [supported, setSupported] = useState<boolean>(true)
  const [error, setError] = useState<boolean>(false)
  const [showDownloader, setShowDownloader] = useState<boolean>(false)
  const remixFileSystems = useRef<fileSystems>(new fileSystems())
  const remixIndexedDB = useRef<fileSystem>(new indexedDBFileSystem())
  const localStorageFileSystem = useRef<fileSystem>(new localStorageFS())
  // url parameters to e2e test the fallbacks and error warnings
  const testmigrationFallback = useRef<boolean>(
    window.location.hash.includes('e2e_testmigration_fallback=true') && window.location.host === '127.0.0.1:8080' && window.location.protocol === 'http:'
  )
  const testmigrationResult = useRef<boolean>(
    window.location.hash.includes('e2e_testmigration=true') && window.location.host === '127.0.0.1:8080' && window.location.protocol === 'http:'
  )
  const testBlockStorage = useRef<boolean>(
    window.location.hash.includes('e2e_testblock_storage=true') && window.location.host === '127.0.0.1:8080' && window.location.protocol === 'http:'
  )

  function loadAppComponent() {
    import('../../app')
      .then((AppComponent) => {
        const appComponent = new AppComponent.default()
        appComponent.run().then(() => {
          render(
            <>
              <RemixApp app={appComponent} />
            </>,
            document.getElementById('root')
          )
        })
      })
      .catch((err) => {
        _paq.push(['trackEvent', 'Preload', 'error', err && err.message])
        console.error('Error loading IDE:', err)
        setError(true)
      })
  }

  const downloadBackup = async () => {
    setShowDownloader(false)
    const fsUtility = new fileSystemUtility()
    await fsUtility.downloadBackup(remixFileSystems.current.fileSystems['localstorage'])
    await migrateAndLoad()
  }

  const migrateAndLoad = async () => {
    setShowDownloader(false)
    const fsUtility = new fileSystemUtility()
    const migrationResult = await fsUtility.migrate(localStorageFileSystem.current, remixIndexedDB.current)
    _paq.push(['trackEvent', 'Migrate', 'result', migrationResult ? 'success' : 'fail'])
    await setFileSystems()
  }

  const setFileSystems = async () => {
    const fsLoaded = await remixFileSystems.current.setFileSystem([
      testmigrationFallback.current || testBlockStorage.current ? null : remixIndexedDB.current,
      testBlockStorage.current ? null : localStorageFileSystem.current,
    ])
    if (fsLoaded) {
      console.log(fsLoaded.name + ' activated')
      _paq.push(['trackEvent', 'Storage', 'activate', fsLoaded.name])
      loadAppComponent()
    } else {
      _paq.push(['trackEvent', 'Storage', 'error', 'no supported storage'])
      setSupported(false)
    }
  }

  const testmigration = async () => {
    if (testmigrationResult.current) {
      const fsUtility = new fileSystemUtility()
      fsUtility.populateWorkspace(migrationTestData, remixFileSystems.current.fileSystems['localstorage'].fs)
    }
  }

  useEffect(() => {
    async function loadStorage() {
      ;(await remixFileSystems.current.addFileSystem(remixIndexedDB.current)) || _paq.push(['trackEvent', 'Storage', 'error', 'indexedDB not supported'])
      ;(await remixFileSystems.current.addFileSystem(localStorageFileSystem.current)) || _paq.push(['trackEvent', 'Storage', 'error', 'localstorage not supported'])
      await testmigration()
      remixIndexedDB.current.loaded && (await remixIndexedDB.current.checkWorkspaces())
      localStorageFileSystem.current.loaded && (await localStorageFileSystem.current.checkWorkspaces())
      remixIndexedDB.current.loaded && (remixIndexedDB.current.hasWorkSpaces || !localStorageFileSystem.current.hasWorkSpaces ? await setFileSystems() : setShowDownloader(true))
      !remixIndexedDB.current.loaded && (await setFileSystems())
    }
    loadStorage()
  }, [])

  return (
    <>
      <div className="preload-container">
        <div className="preload-logo pb-4">
          {/* <div style={{ paddingBottom: '20px' }}>{logo}</div>
          <div className="info-secondary splash">
            HackQuest IDE
            <br />
            <span className="version"> v{packageJson.version}</span>
          </div> */}
          <div className="preload-logo-wrap">
            <div className="preload-loading">
              <img src="/assets/img/loading.png" alt="" />
            </div>
            <div className="preload-logo-img">{logo}</div>
          </div>
          <div className="preload-text-logo-container">
            <div>{textLogo}</div>
            <div>WEB 3.0 PROGRAMMING FOR EVERYONE</div>
          </div>
        </div>

        {!supported ? (
          <div className="preload-info-container alert alert-warning">
            Your browser does not support any of the filesystems required by HackQuest. Either change the settings in your browser or use a supported browser.
          </div>
        ) : null}
        {error ? (
          <div className="preload-info-container alert alert-danger text-left">
            An unknown error has occurred while loading the application.
            <br></br>
            Doing a hard refresh might fix this issue:<br></br>
            <div className="pt-2">
              Windows:<br></br>- Chrome: CTRL + F5 or CTRL + Reload Button
              <br></br>- Firefox: CTRL + SHIFT + R or CTRL + F5<br></br>
            </div>
            <div className="pt-2">
              MacOS:<br></br>- Chrome & FireFox: CMD + SHIFT + R or SHIFT + Reload Button<br></br>
            </div>
            <div className="pt-2">
              Linux:<br></br>- Chrome & FireFox: CTRL + SHIFT + R<br></br>
            </div>
          </div>
        ) : null}
        {showDownloader ? (
          <div className="preload-info-container alert alert-info">
            This app will be updated now. Please download a backup of your files now to make sure you don't lose your work.
            <br></br>
            You don't need to do anything else, your files will be available when the app loads.
            <div
              onClick={async () => {
                await downloadBackup()
              }}
              data-id="downloadbackup-btn"
              className="btn btn-primary mt-1"
            >
              download backup
            </div>
            <div
              onClick={async () => {
                await migrateAndLoad()
              }}
              data-id="skipbackup-btn"
              className="btn btn-primary mt-1"
            >
              skip backup
            </div>
          </div>
        ) : null}
        {/* {supported && !error && !showDownloader ? (
          <div>
            <i className="fas fa-spinner fa-spin fa-2x"></i>
          </div>
        ) : null} */}
      </div>
    </>
  )
}

// const logo = (
//   <svg id="Ebene_2" data-name="Ebene 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 105 100">
//     <path d="M91.84,35a.09.09,0,0,1-.1-.07,41,41,0,0,0-79.48,0,.09.09,0,0,1-.1.07C9.45,35,1,35.35,1,42.53c0,8.56,1,16,6,20.32,2.16,1.85,5.81,2.3,9.27,2.22a44.4,44.4,0,0,0,6.45-.68.09.09,0,0,0,.06-.15A34.81,34.81,0,0,1,17,45c0-.1,0-.21,0-.31a35,35,0,0,1,70,0c0,.1,0,.21,0,.31a34.81,34.81,0,0,1-5.78,19.24.09.09,0,0,0,.06.15,44.4,44.4,0,0,0,6.45.68c3.46.08,7.11-.37,9.27-2.22,5-4.27,6-11.76,6-20.32C103,35.35,94.55,35,91.84,35Z" />
//     <path d="M52,74,25.4,65.13a.1.1,0,0,0-.1.17L51.93,91.93a.1.1,0,0,0,.14,0L78.7,65.3a.1.1,0,0,0-.1-.17L52,74A.06.06,0,0,1,52,74Z" />
//     <path d="M75.68,46.9,82,45a.09.09,0,0,0,.08-.09,29.91,29.91,0,0,0-.87-6.94.11.11,0,0,0-.09-.08l-6.43-.58a.1.1,0,0,1-.06-.18l4.78-4.18a.13.13,0,0,0,0-.12,30.19,30.19,0,0,0-3.65-6.07.09.09,0,0,0-.11,0l-5.91,2a.1.1,0,0,1-.12-.14L72.19,23a.11.11,0,0,0,0-.12,29.86,29.86,0,0,0-5.84-4.13.09.09,0,0,0-.11,0l-4.47,4.13a.1.1,0,0,1-.17-.07l.09-6a.1.1,0,0,0-.07-.1,30.54,30.54,0,0,0-7-1.47.1.1,0,0,0-.1.07l-2.38,5.54a.1.1,0,0,1-.18,0l-2.37-5.54a.11.11,0,0,0-.11-.06,30,30,0,0,0-7,1.48.12.12,0,0,0-.07.1l.08,6.05a.09.09,0,0,1-.16.07L37.8,18.76a.11.11,0,0,0-.12,0,29.75,29.75,0,0,0-5.83,4.13.11.11,0,0,0,0,.12l2.59,5.6a.11.11,0,0,1-.13.14l-5.9-2a.11.11,0,0,0-.12,0,30.23,30.23,0,0,0-3.62,6.08.11.11,0,0,0,0,.12l4.79,4.19a.1.1,0,0,1-.06.17L23,37.91a.1.1,0,0,0-.09.07A29.9,29.9,0,0,0,22,44.92a.1.1,0,0,0,.07.1L28.4,47a.1.1,0,0,1,0,.18l-5.84,3.26a.16.16,0,0,0,0,.11,30.17,30.17,0,0,0,2.1,6.76c.32.71.67,1.4,1,2.08a.1.1,0,0,0,.06,0L52,68.16H52l26.34-8.78a.1.1,0,0,0,.06-.05,30.48,30.48,0,0,0,3.11-8.88.1.1,0,0,0-.05-.11l-5.83-3.26A.1.1,0,0,1,75.68,46.9Z" />
//   </svg>
// )

const textLogo = (
  <svg width="181" height="22" viewBox="0 0 181 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M154.266 17H151.332V4.22H154.266V17ZM162.16 17H157.282V4.22H162.16C166.03 4.22 168.964 6.812 168.964 10.61C168.964 14.408 166.03 17 162.16 17ZM162.16 6.92H160.216V14.3H162.16C164.32 14.3 165.994 12.806 165.994 10.61C165.994 8.414 164.32 6.92 162.16 6.92ZM179.49 17H171.3V4.22H179.4V6.74H174.234V9.26H178.986V11.78H174.234V14.48H179.49V17Z"
      fill="black"
    />
    <path d="M16.2748 4.41602V17.5839H11.7803V12.7301H6.38272V17.5839H1.88818V4.41602H6.38272V9.25082H11.7803V4.41602H16.2748Z" fill="#0B0B0B" />
    <path
      d="M26.5647 16.2485H24.5477C23.7154 16.2485 22.9857 16.7967 22.7714 17.5839H18.1035L22.0223 4.41602H29.0901L33.0089 17.5839H28.3411C28.1256 16.7956 27.397 16.2485 26.5647 16.2485ZM27.0162 12.7312L25.7107 7.89641H25.4029L24.0974 12.7312H27.0162Z"
      fill="#0B0B0B"
    />
    <path
      d="M33.3086 10.9901C33.3086 7.12568 36.5203 4 40.4664 4C42.5083 4 44.3324 4.83444 45.6411 6.15525L42.4094 9.35931C41.9339 8.81532 41.2396 8.48569 40.4664 8.48569C39.0588 8.48569 37.909 9.61171 37.909 10.9901C37.909 12.3686 39.0588 13.5142 40.4664 13.5142C41.2196 13.5142 41.9139 13.1846 42.3694 12.6602L45.6411 15.8446C44.3324 17.1655 42.4882 17.9999 40.4664 17.9999C36.5215 17.9999 33.3086 14.8742 33.3086 10.9901Z"
      fill="#0B0B0B"
    />
    <path
      d="M53.0983 13.7642L52.3294 14.687V17.5849H47.8325V4.41016H52.3294V8.70119H52.464L55.7311 4.41016H60.7858L55.9809 10.263L61.0927 17.5838H55.7882L53.1941 13.7631H53.0983V13.7642Z"
      fill="#0B0B0B"
    />
    <g clipPath="url(#clip0_5244_28020)">
      <path
        d="M74.137 6.05251L74.1347 6.05482C75.4015 7.3231 76.1851 9.07324 76.1851 11.0001L75.877 17.6928L69.1851 18C67.7337 18 66.3854 17.5583 65.2674 16.8019C64.9032 16.5555 64.5635 16.2757 64.2526 15.9669L64.2549 15.9646C62.9765 14.6949 62.1849 12.9367 62.1849 11.0001L62.4929 4.30729L69.1851 4.00011C70.4214 4.00011 71.5827 4.32054 72.5907 4.88293C73.1598 5.20046 73.68 5.59513 74.1373 6.0528L74.137 6.05251Z"
        fill="#FCC409"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M72.8674 10.9845C72.8674 13.1589 71.298 14.6741 69.2189 14.6741C67.1397 14.6741 65.5703 13.1589 65.5703 10.9845C65.5703 8.81008 67.1397 7.29492 69.2189 7.29492C71.298 7.29492 72.8674 8.81008 72.8674 10.9845Z"
        fill="#FFF4CE"
      />
    </g>
    <path
      d="M78.0514 11.9802V4.41797H82.4765V11.9066C82.4765 13.5369 83.3464 14.3889 84.689 14.3889C86.0316 14.3889 86.8443 13.5369 86.8443 11.9066V4.41797H91.2694V11.9802C91.2694 16.3512 88.1307 17.9991 84.5936 17.9991C81.0565 17.9991 78.0503 16.3512 78.0503 11.9802H78.0514Z"
      fill="#0B0B0B"
    />
    <path d="M98.094 7.87355V9.24541H105.461V12.7208H98.094V14.1116H105.461V17.5691H93.6045V4.41602H105.461V7.87355H98.094Z" fill="#0B0B0B" />
    <path
      d="M107.874 14.1237H114.898C115.495 14.1237 115.784 13.8597 115.784 13.4256C115.784 12.9915 115.496 12.7465 114.879 12.7465H111.684C109.432 12.7465 107.604 11.2384 107.604 8.58127C107.604 5.5281 109.74 4.41602 111.896 4.41602H119.864V7.90328H112.994C112.474 7.90328 112.109 8.09123 112.109 8.56224C112.109 9.03325 112.474 9.26036 112.994 9.26036H115.996C118.576 9.26036 120.288 10.7495 120.288 13.4066C120.288 15.9138 118.364 17.6099 115.861 17.6099H107.817L107.875 14.1237H107.874Z"
      fill="#0B0B0B"
    />
    <path d="M125.567 7.8965H121.571V4.41602H134.056V7.8965H130.061V17.5842H125.567V7.8965Z" fill="#0B0B0B" />
    <circle cx="143" cy="11" r="2" fill="#0B0B0B" />
    <defs>
      <clipPath id="clip0_5244_28020">
        <rect width="13.9999" height="14.0002" fill="white" transform="matrix(1.19249e-08 -1 -1 -1.19249e-08 76.1851 18)" />
      </clipPath>
    </defs>
  </svg>
)

const logo = (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_5230_27962)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M34.1418 5.87066L34.1484 5.86406L34.1493 5.86488C32.8428 4.55723 31.3565 3.42961 29.7305 2.52237C26.8506 0.915523 23.5327 -1.96371e-07 20.0004 -2.38493e-07L0.880127 0.87767L2.38497e-07 20C1.72514e-07 25.5333 2.26177 30.5568 5.91425 34.1846L5.90766 34.1912C6.79594 35.0734 7.76658 35.8728 8.80704 36.5768C12.0013 38.738 15.8535 40 20.0004 40L39.1199 39.1223L40 20C40 14.4948 37.7613 9.49435 34.1418 5.87066ZM20.0979 31.8781C26.8174 31.8781 31.8894 26.9812 31.8894 19.9537C31.8894 12.9262 26.8174 8.02938 20.0979 8.02938C13.3783 8.02938 8.30634 12.9262 8.30634 19.9537C8.30634 26.9812 13.3783 31.8781 20.0979 31.8781Z"
        fill="#FCC409"
      />
    </g>
    <defs>
      <clipPath id="clip0_5230_27962">
        <rect width="40" height="40" fill="white" transform="matrix(1.19249e-08 -1 -1 -1.19249e-08 40 40)" />
      </clipPath>
    </defs>
  </svg>
)
