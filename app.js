const express = require("express")
const morgan = require("morgan")
const mongoose = require("mongoose")
const Blog = require("./models/blog")
require("dotenv").config()

const app = express()

// Connect to MongoDB
const dbURI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/${process.env.DB_NAME}?appName=${process.env.DB_APP_NAME}`
mongoose.connect(dbURI)
    .then((result) => app.listen(process.env.PORT || 3000, "localhost", () => {
        console.log(`Server is running on http://localhost:${process.env.PORT || 3000}`)
    }))
    .catch((err) => console.log(err))

app.set("view engine", "ejs")


// middleware
// log the request
app.use(morgan("dev"))

// serve static files
app.use(express.static("public"))

app.get("/", (req, res) => {
    res.redirect("/blogs")
})

app.get("/about", (req, res) => {
    res.render("about", {title: "About"})
})

app.get("/blogs", (req, res) => {
    const blogs = Blog.find().sort({ createdAt: -1 })
    .then((result) => {
        res.render("index", {title: "All Blogs", blogs: result})
    })
    .catch((err) => {
        console.log("Error finding blogs:", err)
        res.status(500).send("Error finding blogs: " + err.message)
    })
})

app.get("/blogs/create", (req, res) => {
    res.render("create", {title: "Create a new blog"})
})

app.get("/about-me", (req, res) => {
    res.redirect("/about")
})

app.use((req, res) => {
    res.status(404).render("404", {title: "404"})
})
