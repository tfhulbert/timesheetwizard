const { ipcRenderer } = require('electron')

// listen for form submition
const submitListener = document
    .querySelector('form')
    .addEventListener('submit', (event) => {
        // prevent default behaviour which causes page refresh
        event.preventDefault()

        // an array of files with some metadata
        const files = [...document.getElementById('filePicker').files]

        // format the file data to only path and name
        const fileFormatted = files.map(({
            name,
            path: pathName
        }) => ({
            name,
            pathName
        }))

        ipcRenderer.send('files', fileFormatted)
    })

// metadata from the main process    
ipcRenderer.on('metadata', (event, metadata) => {
    const pre = document.getElementById('data')

    pre.innerText = JSON.stringify(metadata, null, 2)
})

ipcRenderer.on('metadata:error', (event, error) => {
    console.error(error)
})