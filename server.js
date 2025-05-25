const express = require('express')
const cors = require('cors')
const fs = require('fs')

const app = express()
const port = 3000

let cors_options = {
    origin: ['http://localhost:5173']
}

let file_path


app.use(cors(cors_options))
app.use(express.json());

app.get('/', function(req, res) {
    res.set('Content-Type', 'text/plain')
    res.send('Hello, world!')
})

app.get('/all-entries/:year', function(req, res) {
    res.set('Content-Type', 'text/json')
    res.send(datesWithEntries(req.params.year))
})

app.get('/entries/:year/:day_id', function(req, res) {
    // console.log('params', req.params)
    res.send(getEntryContents(req.params.year, req.params.day_id))
})

app.post('/entry', function(req, res) {
    upsertEntry(req.body.year, req.body.id, req.body.entry)
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
function getEntryContents(year, day_id) {
    console.log('getting file contents', year, day_id)
    let content = ''
    try {
        content = fs.readFileSync(`C:\\Users\\mason\\OneDrive\\Desktop\\New folder\\${year}\\${day_id}.md`, 'utf8')
    } catch(err) {
        content = 'No entry for this date'
    }
    return content
}

function upsertEntry(year, day_id, entry_text) {    
    const filePath = `C:\\Users\\mason\\OneDrive\\Desktop\\New folder\\${year}\\${padLeft(day_id)}.md`
    fs.writeFileSync(filePath, entry_text, {encoding:'utf8',flag:'w'})
}


function padLeft(wee) {
    let number = wee.toString()
    for (let i = number.length; i < 3; ++i) {
      number = '0' + number;
    }
    console.log(number)
    return number;
};