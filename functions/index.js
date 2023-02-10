"use strict";
const express = require("express");

const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const firebaseAuth = require("./Middlewares/Autentication");
const bodyParser = require("body-parser");
const cors = require("cors")({origin: true});

const isDebug = process.env.NODE_ENV === 'development';

// App
const app = express();

// Middlewares
app.use(cors);
app.use(bodyParser.json());
if (!isDebug) {
    app.use(firebaseAuth);
}

// Routes
app.post("/chat", require("./Routes/Chat/Chat"));

// App Configuration
const v1 = functions.https.onRequest(app)

module.exports = {
    v1
}