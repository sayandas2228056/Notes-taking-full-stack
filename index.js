const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 8088;
const TASKS_DIR = "./files";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

// Ensure the 'files' directory exists
if (!fs.existsSync(TASKS_DIR)) {
    fs.mkdirSync(TASKS_DIR);
}

// Get all tasks
app.get("/", (req, res) => {
    fs.readdir(TASKS_DIR, (err, files) => {
        let tasks = files.map(file => {
            let content = fs.readFileSync(path.join(TASKS_DIR, file), "utf8");
            return {
                title: file.replace(".txt", ""),
                details: content
            };
        });
        res.render("index", { tasks: tasks });
    });
});

// Create a new task
app.post("/create", (req, res) => {
    const { title, details } = req.body;
    if (!title || !details) {
        return res.status(400).send("Title and details are required");
    }

    const filename = title.split(" ").join("") + ".txt";
    fs.writeFileSync(path.join(TASKS_DIR, filename), details);
    res.redirect("/");
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
