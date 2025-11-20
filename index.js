
import express from 'express';
import Hello from './Hello.js';
import Lab5 from './Lab5/index.js';
import cors from "cors";

import db from "./Kambaz/Database/index.js";
import UserRoutes from "./Kambaz/Users/routes.js";

// const express = require('express');
const app = express(); //creates instance
UserRoutes(app, db);

const port = 4000;

app.use(cors());
app.use(express.json());
Lab5(app);
Hello(app);

app.listen(process.env.PORT || port);

