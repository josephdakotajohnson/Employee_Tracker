const inquirer = require('inquirer');
const mysql = require('mysql2');
require('.env').config();
const db = mysql.createConnection;