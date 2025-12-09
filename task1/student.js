const http = require("http");
const url = require("url");

let students = [];
let nextId = 1;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;

  res.setHeader("Content-Type", "application/json");

  if (req.method === "GET" && path === "/students") {
    res.writeHead(200);
    return res.end(JSON.stringify(students));
  }

  if (req.method === "POST" && path === "/students") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        const data = JSON.parse(body);

        if (!data.name) {
          res.writeHead(400);
          return res.end(JSON.stringify({ error: "Name is required" }));
        }

        const newStudent = {
          id: nextId++,
          name: data.name,
        };

        students.push(newStudent);

        res.writeHead(201);
        res.end(JSON.stringify(newStudent));
      } catch (error) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: "Invalid JSON" }));
      }
    });

    return;
  }

  if (req.method === "PUT" && path.startsWith("/students/")) {
    const id = parseInt(path.split("/")[2]);

    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        const data = JSON.parse(body);

        const student = students.find((s) => s.id === id);

        if (!student) {
          res.writeHead(404);
          return res.end(JSON.stringify({ error: "Student not found" }));
        }

        student.name = data.name || student.name;

        res.writeHead(200);
        res.end(JSON.stringify(student));
      } catch (error) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: "Invalid JSON" }));
      }
    });

    return;
  }

  if (req.method === "DELETE" && path.startsWith("/students/")) {
    const id = parseInt(path.split("/")[2]);

    const index = students.findIndex((s) => s.id === id);

    if (index === -1) {
      res.writeHead(404);
      return res.end(JSON.stringify({ error: "Student not found" }));
    }

    students.splice(index, 1);

    res.writeHead(200);
    return res.end(JSON.stringify({ message: "Student deleted successfully" }));
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: "Route not found" }));
});

server.listen(4000, () => {
  console.log("Student API server running on port 4000");
});
