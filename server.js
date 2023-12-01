const eventEnitter = require('events')
const serverEmitter = new eventEnitter

const path      = require('path')
const fs        = require('fs')


const http      = require('http')
const { exit } = require('process')
// const server2    = new http.Server()

const port = process.env.PORT || '3005'

async function serveFile(statusCode ,filePath, contenType, response) {
    try{
        const rawData = await fs.readFileSync(filePath, 
            contenType.includes('image') ? '' : 'utf8');

        const data = contenType === "application/json" ? JSON.parse(rawData) : rawData

        response.writeHead(statusCode, {"contentType": contenType});

        response.end(
            contenType === "application/json" ? JSON.stringify(data) : data)
    }
    catch(err){
        console.log(err)
        serverEmitter.emit('err', `error serving file || ${filePath}\t ${filePath} \t Message: ${err}`)
        response.statusCode = 500
        response.end()
        throw err
    }
}

const server    = http.createServer((req,res)=>{

    serverEmitter.emit('log', `${req.url}\t${req.method}`)

    let extension = path.extname(req.url);
    
    let contenType;
    switch (extension) {
        case '.css':
            contenType = 'text/css'
            break;
        case '.js':
            contenType = 'text/javascript'
            break;
        case '.json':
            contenType = 'application/json'
            break;
        case '.jpg':
            contenType = 'image/jpeg'
            break;
        case '.txt':
            contenType = 'text/plain'
            break;
            
            default:
            contenType = 'text/html'
            break;
    }

    let filePath = 
        contenType === 'text/html' && req.url === "/" 
        ? path.join(__dirname, 'views', 'index.html') 
        : contenType === 'text/html' && req.url.slice(-1) === '/'
            ? path.join(__dirname, 'views', req.url, 'index.html')
                : contenType === 'tex/html'
                    ? path.join(__dirname, 'views', req.url)
                    : path.join(__dirname, req.url)

    // makes the file extention not required in the browser !! 
    if(!extension && req.url.slice(-1) !=='/'){filePath += '.html'}

    const fileExists = fs.existsSync(filePath);

    if(fileExists){
        //serve the file

        serveFile(200, filePath,contenType,res)
    }
    else{

        switch (path.parse(filePath).base) {
            case "old-page.html":
                res.writeHead(301,{"location": "/views/new-page.html"})
                res.end()
                break;
        
                case "www.page.html":
                res.writeHead(301,{"location": "/"})
                res.end()
                break;

            default:
                serveFile(404, path.join(__dirname, "views", "404.html"), "text/html" ,res)

                break;
            
        }

        // console.log(path.parse(filePath))
    }
})


server.listen(port,(req, res)=>{
    console.table({message: 'Server listening', Port: port})
})

serverEmitter.on('log', (msg=>{
    try {
        fs.appendFileSync(path.join(__dirname, "logs", "servetlogs.txt"), `\n ${new Date} || ${msg}`)
    } catch (error) {
        serverEmitter.emit('err', "error saving server log")
        console.log(err)
    }
}))

serverEmitter.on('err', msg=>{
    fs.appendFileSync(path.join(__dirname, "logs", "errors.txt"), `\n ${new Date} || ${msg}`)
})


process.on('uncaughtException',(err)=>{console.log(err); process.exit(0)})

// emitter.on('oops',function (a,s,d,f) {
//     console.log(a); console.log(s); console.log(d); console.log(f);
// })

// emitter.emit('oops',"first arg", 'second arg','third arg','fourth arg')
