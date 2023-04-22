//@flow

import express from 'express';
import path from 'path';
import reload from 'reload';
import fs from 'fs';
import mysql from 'mysql';

import { Article, Comment } from './objects';

const public_path = path.join(__dirname, '/../../client/public');
let nettside = express();
nettside.use(express.static(public_path));
nettside.use(express.json());

let pool = mysql.createPool({
  host: 'mysql.stud.idi.ntnu.no',
  user: 'sivertut',
  database: 'sivertut',
  password: '0nDGMHSd',
  dateStrings: true,
  debug: false,
});

const queries_from_file = require('./queries.js');
let queries = new queries_from_file(pool);

//get all registered categories
nettside.get('/articles/categories', (req: express$Request, res: express$Response) => {
  function result_from_database(status, rows) {
    res.status(status).send(rows);
  }
  queries.getCategories(result_from_database);
});

//get articles for the live feed
nettside.get('/articles/livefeed', (req: express$Request, res: express$Response) => {
  function result_from_database(status, rows) {
    res.status(status).send(rows);
  }
  queries.getMostRecent(result_from_database);
});

//get search articles
nettside.get('/articles/search/:search', (req: express$Request, res: express$Response) => {
  function result_from_database(status, rows) {
    res.status(status).send(rows);
  }
  queries.getSearchArticles(req.params.search, result_from_database);
});

//Frontpage
nettside.get('/articles/frontpage', (req: express$Request, res: express$Response) => {
  function result_from_database(status, rows) {
    res.status(status).send(rows);
  }
  queries.getFrontpage(result_from_database);
});

//get all Articles
nettside.get('/articles', (req: express$Request, res: express$Response) => {
  function result_from_database(status, rows) {
    res.status(status).send(rows);
  }
  queries.getAll(result_from_database);
});

//get all articles from a specific category
nettside.get('/articles/categories/:category_id', (req: express$Request, res: express$Response) => {
  function result_from_database(status, rows) {
    res.status(status).send(rows);
  }
  queries.getArticlesFromCategory(req.params.category_id, result_from_database);
});

//get a specific article
nettside.get('/articles/:id', (req: express$Request, res: express$Response) => {
  function result_from_database(status, rows) {
    res.status(status).send(rows[0]);
  }
  queries.getArticle(req.params.id, result_from_database);
});

//post a new article
nettside.post('/articles', (req: { body: Article }, res: express$Response) => {
  function result_from_database(status, data) {
    res.status(status).send({ id: data.insertId });
  }
  queries.addArticle(req.body, result_from_database);
});

//update/change an article
nettside.put('/articles/:id', (req: { body: Article }, res: express$Response) => {
  function result_from_database(status, data) {
    res.status(status).send(data);
  }
  queries.updateArticle(req.body, result_from_database);
});

//delete an article
nettside.delete('/articles/:id', (req: express$Request, res: express$Response) => {
  function result_from_database(status, data) {
    res.status(status).send(data);
  }
  queries.deleteArticle(req.params.id, result_from_database);
});

//get comments to an article
nettside.get('/articles/:id/comments', (req: express$Request, res: express$Response) => {
  function result_from_database(status, rows) {
    res.status(200).send(rows);
  }
  queries.getComments(req.params.id, result_from_database);
});

//post a new comment
nettside.post('/articles/:id/comments', (req: { body: Comment }, res: express$Response) => {
  function result_from_database(status, data) {
    res.status(status).send(data);
  }
  queries.addComment(req.body, result_from_database);
});

//update/change a comment
nettside.put('/articles/:id/comments/:comment_id', (req: { body: Comment }, res: express$Response) => {
  function result_from_database(status, data) {
    res.status(status).send(data);
  }
  queries.likeComment(req.body, result_from_database);
});

//delete a comment
nettside.delete('/articles/:id/comments/:comment_id', (req: express$Request, res: express$Response) => {
  function result_from_database(status, data) {
    res.status(status).send(data);
  }
  queries.deleteComment(req.params.comment_id, result_from_database);
});

export let listen = new Promise<void>((resolve, reject) => {
  // Setup hot reload (refresh web page on client changes)
  reload(nettside).then((reloader) => {
    nettside.listen(8888, (error: ?Error) => {
      if (error) {
        reject(error.message);
      }
      console.log('Server started');
      reloader.reload();
      fs.watch(public_path, () => reloader.reload());
      resolve();
    });
  });
});
