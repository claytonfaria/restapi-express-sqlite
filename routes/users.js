const express = require('express');
const router = express.Router();
const db = require('../database/database');
const md5 = require('md5');

router.get('/', (req, res) => {
  const sql = 'select * from user';
  const params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ message: err.message });
      return;
    }
    res.json({
      message: 'sucess',
      data: rows
    });
  });
});

router.get('/:id', (req, res) => {
  const sql = 'SELECT * FROM user WHERE id = ?';
  const params = [req.params.id];
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ message: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: row
    });
  });
});

router.post('/', (req, res) => {
  const errors = [];
  if (!req.body.password) {
    errors.push('No Password specified');
  }
  if (!req.body.email) {
    res.status(400).json({ error: errors.join(',') });
    return;
  }
  const data = {
    name: req.body.name,
    email: req.body.email,
    password: md5(req.body.password)
  };
  const sql = 'INSERT INTO user (name, email, password) VALUES (?,?,?)';
  const params = [data.name, data.email, data.password];
  db.run(sql, params, function(err, result) {
    if (err) {
      res.status(400).json({ message: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: data,
      id: this.lastID
    });
  });
});

router.patch('/:id', (req, res) => {
  const data = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password ? md5(req.body.password) : null
  };
  db.run(
    `UPDATE user set
      name = COALESCE(?, name),
      email = COALESCE(?,email),
      password = COALESCE(?,password)
      WHERE id = ?`,
    [data.name, data.email, data.password, req.params.id],
    function(err, result) {
      if (err) {
        res.status(400).json({ message: res.message });
      }
      res.json({
        message: 'success',
        data: data,
        changes: this.changes
      });
    });
});

router.delete('/:id', (req, res) => {
  db.run(
    'DELETE FROM user WHERE id = ?',
    req.params.id,
    function(err, result) {
      if (err) {
        res.status(400).json({ error: res.message });
      }
      res.json({ message: 'deleted', changes: this.changes });
    });
});

module.exports = router;
