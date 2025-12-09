const http = require("http");

const server = http.createServer((req, res) => {
  if (req.method === "GET") {
    if (req.url === "/") {
      res.statusCode = 200;
      res.end("Welcome to the Home Page");
    } else if (req.url === "/info") {
      res.statusCode = 200;
      res.end("This is the information page");
    } else {
      res.statusCode = 404;
      res.end("Page not found");
    }
  } else if (req.method === "POST" && req.url === "/submit") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        const jsonData = JSON.parse(body);

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(jsonData));
      } catch (error) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid JSON" }));
      }
    });
  }
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
