const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
        if (!isValid(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registred. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user." });
});

public_users.get('/', function (req, res) {
    res.send(JSON.stringify(books, null, 4));
});

public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn]);
});

public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    getFromAuthor(author)
        .then(
            result => res.json(result)
        );
});

function getFromTitle(title) {
    let output = [];
    return new Promise((resolve, reject) => {
        for (var isbn in books) {
            let book_ = books[isbn];
            if (book_.title === title) {
                output.push({ ...book_, isbn: isbn });
            }
        }
        resolve(output);
    })
}
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    getFromTitle(title)
        .then(
            result => res.json({ booksByTitle: result })
        );
});


public_users.get('/review/:isbn', function (req, res) {
    const ISBN = req.params.isbn;
    res.send(books[ISBN].reviews);
});

function getBookList() {
    return new Promise((resolve, reject) => {
        resolve(books);
    })
}

public_users.get('/', function (req, res) {
    getBookList().then(
        (bk) => res.send(JSON.stringify(bk, null, 4)),
        (error) => res.send("denied")
    );
});

function getFromISBN(isbn) {
    let book_ = books[isbn];
    return new Promise((resolve, reject) => {
        if (book_) {
            resolve(book_);
        } else {
            reject("Unable to find book!");
        }
    })
}

public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    getFromISBN(isbn).then(
        (bk) => res.send(JSON.stringify(bk, null, 4)),
        (error) => res.send(error)
    )
});

function getFromAuthor(author) {
    let output = [];
    return new Promise((resolve, reject) => {
        for (var isbn in books) {
            let book_ = books[isbn];
            if (book_.author === author) {
                output.push({ ...book_, isbn: isbn });
            }
        }
        resolve(output);
    })
}

public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    getFromAuthor(author)
        .then(
            result => res.send(JSON.stringify(result, null, 4))
        );
});

public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    getFromTitle(title)
        .then(
            result => res.send(JSON.stringify(result, null, 4))
        );
});

module.exports.general = public_users;