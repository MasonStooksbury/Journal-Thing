const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')

const app = express()
const port = 6786
const file_path = '../journal-files'
const origin = 'localhost'

let cors_options = {
    origin: [`http://${origin}:6785`]
}


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
    const year_directory = path.join(file_path, year.toString())
    if (fs.existsSync(year_directory)) {
        // Return a list of numbers
        const files = fs.readdirSync(year_directory)
        files.forEach(function(file, index) {
            entries.push(file.slice(0,3))
        })
        console.log(entries)
        return {'entries': entries}
    }
}


// Return the contents of a given entry
function getEntryContents(year, day_id) {
    console.log('getting file contents', year, day_id)
    let content = ''
    try {
        // content = fs.readFileSync(`${file_path}/${year}/${day_id}.md`, 'utf8')
        content = fs.readFileSync(`${path.join(file_path, year.toString(), day_id.toString())}.md`, 'utf8')
    } catch(err) {
        content = 'No entry for this date'
    }
    return content
}

function upsertEntry(year, day_id, entry_text) {  
    // const year_directory = `${file_path}/${year}`
    const year_directory = path.join(file_path, year.toString())
    if (!fs.existsSync(year_directory)) {
        fs.mkdirSync(year_directory)
    }

    // const filePath = `${year_directory}/${padLeft(day_id)}.md`
    const filePath = path.join(year_directory, `${padLeft(day_id)}.md`)
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