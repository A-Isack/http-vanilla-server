const eventEnitter = require('events')
const emitter = new eventEnitter

const path      = require('path')
const fs        = require('fs')


const http      = require('http')
// const server2    = new http.Server()
const server    = http.createServer((req,res)=>{
    console.log(req.url, req.method);

    let extension = path.extname(req.url);
    
    let contenType;
    switch (extension) {
        case '.css':
            contenType === 'text/css'
            break;
        case '.js':
            contenType === 'text/javascript'
            break;
        case '.json':
            contenType === 'text/json'
            break;
        case '.jpg':
            contenType === 'image/jpeg'
            break;
        case '.txt':
            contenType === 'text/plain'
            break;
            
            default:
            contenType === 'text/html'
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
    }
    else{
        // 404
        // 403

        console.log(path.parse(filePath))
    }
})

const port = process.env.PORT || '3005'

server.listen(port,(req, res)=>{
    console.table({message: 'Server listening', Port: port})
})



// emitter.on('oops',function (a,s,d,f) {
//     console.log(a); console.log(s); console.log(d); console.log(f);
// })

// emitter.emit('oops',"first arg", 'second arg','third arg','fourth arg')

// process.on('uncaughtException',(err)=>{console.log(err)})