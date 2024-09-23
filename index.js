const http = require("http");
const fs = require('node:fs/promises');
const port = 7000;
const File_Path = './webcontent.txt';


const handleGetRequest = async (res) => {
  try {
   
    const content = await fs.readFile(File_Path, 'utf8');
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(content);
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Error reading the file');
  }
};

const handlePostRequest = async (req, res) => {
  let body = '';
  // let data = 'Hello World!'
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on("end", async () => {
    try {
      const fileHandle = await fs.open(File_Path, "a+");
      const stats = await fileHandle.stat();

      const isFileEmpty = stats.size === 0;

      if (isFileEmpty) {
        await fileHandle.writeFile(body, "utf8");
      } else {
        await fileHandle.writeFile(`\n${body}`, "utf8");
      }

      await fileHandle.close();
      
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("This file has been written successfully");
    } catch (error) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Error writing to the file");
    }
  });

  req.on("error", (error) => {
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Error receiving data");
  });
};

const server = http.createServer(async (req, res) => {
  if (req.method === "GET" && req.url === "/") {
    await handleGetRequest(res);
  } else if (
    req.method === "POST" &&
    req.url === "/"
  ) {
    await handlePostRequest(req, res);
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found");
  }
});

server.listen(port, () => {
  console.log(`Server is working on port ${port}`);
});





