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
          <div style={{ paddingBottom: '20px' }}>{logo}</div>
          <div className="info-secondary splash">
            HackQuest IDE
            <br />
            <span className="version"> v{packageJson.version}</span>
          </div>
        </div>
        {!supported ? (
          <div className="preload-info-container alert alert-warning">
            Your browser does not support any of the filesystems required by Remix. Either change the settings in your browser or use a supported browser.
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
        {supported && !error && !showDownloader ? (
          <div>
            <i className="fas fa-spinner fa-spin fa-2x"></i>
          </div>
        ) : null}
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

const logo = (
  <svg width="213" height="26" viewBox="0 0 213 26" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_274_2285)">
      <path
        d="M22.1446 3.73781L22.1404 3.74201C24.4478 6.05207 25.875 9.23977 25.875 12.7493L25.3139 24.9395L13.1253 25.499C10.4816 25.499 8.02581 24.6945 5.98948 23.3167C5.32619 22.868 4.7074 22.3584 4.14112 21.796L4.14533 21.7918C1.81687 19.4791 0.374987 16.2767 0.374987 12.7493L0.93607 0.559047L13.1253 -0.000457916C15.3771 -0.000457889 17.4923 0.583177 19.3282 1.60752C20.3647 2.18588 21.3123 2.90472 22.1452 3.73833L22.1446 3.73781Z"
        fill="#0B0B0B"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.7041 12.7198C20.7041 17.1997 17.4707 20.3214 13.187 20.3214C8.90329 20.3214 5.66992 17.1997 5.66992 12.7198C5.66992 8.23984 8.90329 5.11816 13.187 5.11816C17.4707 5.11816 20.7041 8.23984 20.7041 12.7198Z"
        fill="white"
      />
    </g>
    <path d="M54.3356 3.84375V21.6558H48.2559V15.0901H40.9547V21.6558H34.875V3.84375H40.9547V10.3837H48.2559V3.84375H54.3356Z" fill="#0B0B0B" />
    <path
      d="M68.2539 19.8494H65.5256C64.3997 19.8494 63.4127 20.591 63.1227 21.6558H56.8086L62.1094 3.84375H71.6701L76.9709 21.6558H70.6568C70.3653 20.5895 69.3798 19.8494 68.2539 19.8494ZM68.8647 15.0916L67.0987 8.55165H66.6823L64.9164 15.0916H68.8647Z"
      fill="#0B0B0B"
    />
    <path
      d="M77.377 12.7367C77.377 7.50933 81.7214 3.28125 87.0592 3.28125C89.8212 3.28125 92.2887 4.40999 94.059 6.19663L89.6875 10.5307C89.0443 9.79488 88.1051 9.34899 87.0592 9.34899C85.1552 9.34899 83.5999 10.8721 83.5999 12.7367C83.5999 14.6013 85.1552 16.151 87.0592 16.151C88.078 16.151 89.0173 15.7052 89.6334 14.9958L94.059 19.3034C92.2887 21.09 89.7942 22.2188 87.0592 22.2188C81.723 22.2188 77.377 17.9907 77.377 12.7367Z"
      fill="#0B0B0B"
    />
    <path
      d="M104.146 16.4881L103.106 17.7363V21.6563H97.0234V3.83496H103.106V9.6394H103.288L107.708 3.83496H114.545L108.046 11.752L114.96 21.6548H107.785L104.276 16.4866H104.146V16.4881Z"
      fill="#0B0B0B"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M124.327 22.2188C124.692 22.2188 125.052 22.2009 125.404 22.166L133.517 21.8007L133.941 12.7687C133.941 11.1738 133.538 9.672 132.825 8.35468C131.308 5.23271 128.15 3.28125 124.327 3.28125C118.931 3.28125 114.858 7.16968 114.858 12.75C114.858 18.3303 118.931 22.2188 124.327 22.2188ZM124.376 17.5334C127.061 17.5334 129.088 15.5768 129.088 12.7687C129.088 9.96074 127.061 8.00409 124.376 8.00409C121.691 8.00409 119.664 9.96074 119.664 12.7687C119.664 15.5768 121.691 17.5334 124.376 17.5334Z"
      fill="#0B0B0B"
    />
    <path
      d="M136.587 14.0771V3.84766H142.573V13.9774C142.573 16.1827 143.75 17.3352 145.566 17.3352C147.382 17.3352 148.481 16.1827 148.481 13.9774V3.84766H154.467V14.0771C154.467 19.9896 150.222 22.2187 145.437 22.2187C140.652 22.2187 136.586 19.9896 136.586 14.0771H136.587Z"
      fill="#0B0B0B"
    />
    <path d="M163.699 8.52071V10.3764H173.665V15.0775H163.699V16.9589H173.665V21.6358H157.626V3.84375H173.665V8.52071H163.699Z" fill="#0B0B0B" />
    <path
      d="M176.928 16.9753H186.43C187.237 16.9753 187.628 16.6181 187.628 16.0309C187.628 15.4437 187.239 15.1123 186.404 15.1123H182.082C179.036 15.1123 176.563 13.0723 176.563 9.47804C176.563 5.34805 179.453 3.84375 182.369 3.84375H193.148V8.56093H183.854C183.151 8.56093 182.657 8.81518 182.657 9.45231C182.657 10.0894 183.151 10.3966 183.854 10.3966H187.915C191.405 10.3966 193.721 12.411 193.721 16.0052C193.721 19.3967 191.119 21.6909 187.733 21.6909H176.851L176.93 16.9753H176.928Z"
      fill="#0B0B0B"
    />
    <path d="M200.86 8.55176H195.456V3.84375H212.345V8.55176H206.94V21.6563H200.86V8.55176Z" fill="#0B0B0B" />
    <defs>
      <clipPath id="clip0_274_2285">
        <rect width="25.4995" height="25.5" fill="white" transform="matrix(1.19249e-08 -1 -1 -1.19249e-08 25.875 25.499)" />
      </clipPath>
    </defs>
  </svg>
)
