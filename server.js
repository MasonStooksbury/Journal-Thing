const cors = require('cors')
const app = require('express')()
const fs = require('fs')

const port = 3000

let corsOptions = {
    origin: ['http://localhost:5173']
}


app.use(cors(corsOptions))

app.get('/', function(req, res) {
    res.set('Content-Type', 'text/plain')
    res.send('Hello, world!')
})

app.get('/all-entries/:year', function(req, res) {
    res.set('Content-Type', 'text/json')
    res.send(datesWithEntries(req.params.year))
})

app.get('/entries/:year/:dayId', function(req, res) {
    // console.log('params', req.params)
    res.send(getEntryContents(req.params.year, req.params.dayId))
})

app.post('/entry', function(req, res) {
    res.send('Thanks!')
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})






// Find all the dates with entries so we can highlight the Progress Tracker in the UI
function datesWithEntries(year) {
    const entries = []
    // Return a list of numbers
    const files = fs.readdirSync(`C:\\Users\\mason\\OneDrive\\Desktop\\New folder\\${year}`)
    files.forEach(function(file, index) {
        entries.push(file.slice(0,3))
    })
    return {'entries': entries}
}

// Return the contents of a given entry
function getEntryContents(year, dayId) {
    console.log('getting file contents', year, dayId)
    let content = ''
    try {
        content = fs.readFileSync(`C:\\Users\\mason\\OneDrive\\Desktop\\New folder\\${year}\\${dayId}.md`, 'utf8')
    } catch(err) {
        console.error(err)
        content = 'No entry for this date'
    }
    return content
}