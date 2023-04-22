// @flow
import { Article, Comment } from './objects.js';

const Dao = require('./dao.js');

let date_format = "'%d %M %H:%i'";
let date_format_comment = "'%H:%i'";

module.exports = class Queries extends Dao {
  getCategories(response_database: JSON) {
    super.query('SELECT * FROM category', [], response_database);
  }

  getMostRecent(response_database: JSON) {
    super.query(
      'SELECT id, category_id, title, content, image_link, likes, DATE_FORMAT(createdAt, ' +
        date_format +
        ') AS createdAt, DATE_FORMAT(changedAt, ' +
        date_format +
        ') AS changedAt FROM article ORDER BY id DESC LIMIT 10',
      [],
      response_database
    );
  }

  getSearchArticles(search: string, response_database: JSON) {
    search.replace("'", '');
    search.replace('--', '');
    search = '%' + search + '%';
    super.query(
      'SELECT id, category_id, title, content, image_link, likes, DATE_FORMAT(createdAt, ' +
        date_format +
        ') AS createdAt, DATE_FORMAT(changedAt, ' +
        date_format +
        ') AS changedAt FROM article ' +
        'WHERE title LIKE ? ' +
        'UNION ' +
        'SELECT id, category_id, title, content, image_link, likes, DATE_FORMAT(createdAt, ' +
        date_format +
        ') AS createdAt, DATE_FORMAT(changedAt, ' +
        date_format +
        ') AS changedAt FROM article ' +
        'WHERE content LIKE ?' +
        'UNION ' +
        'SELECT article.id, category_id, title, content, image_link, article.likes, DATE_FORMAT(article.createdAt, ' +
        date_format +
        ') AS createdAt, DATE_FORMAT(changedAt, ' +
        date_format +
        ') AS changedAt FROM article JOIN comment ON comment.article_id = article.id ' +
        'WHERE comment.comment LIKE ?',
      [search, search, search],
      response_database
    );
  }

  getFrontpage(response_database: JSON) {
    super.query(
      'SELECT id, category_id, title, content, image_link, likes, DATE_FORMAT(createdAt, ' +
        date_format +
        ') AS createdAt, DATE_FORMAT(changedAt, ' +
        date_format +
        ') AS changedAt FROM article ORDER BY likes DESC Limit 10',
      [],
      response_database
    );
  }

  getAll(response_database: JSON) {
    super.query(
      'SELECT id, category_id, title, content, image_link, likes, DATE_FORMAT(createdAt, ' +
        date_format +
        ') AS createdAt, DATE_FORMAT(changedAt, ' +
        date_format +
        ') AS changedAt FROM article ORDER BY id DESC',
      [],
      response_database
    );
  }

  getArticlesFromCategory(category_id: number, response_database: JSON) {
    super.query(
      'SELECT id, category_id, title, content, image_link, likes, DATE_FORMAT(createdAt, ' +
        date_format +
        ') AS createdAt, DATE_FORMAT(changedAt, ' +
        date_format +
        ') AS changedAt FROM article WHERE category_id = ? ORDER BY id DESC',
      [category_id],
      response_database
    );
  }

  getArticle(id: number, response_database: JSON) {
    super.query(
      'SELECT id, category_id, title, content, image_link, likes, DATE_FORMAT(createdAt, ' +
        date_format +
        ') AS createdAt, DATE_FORMAT(changedAt, ' +
        date_format +
        ') AS changedAt FROM article WHERE id = ?',
      [id],
      response_database
    );
  }

  addArticle(article: Article, response_database: JSON) {
    let info = [article.category_id, article.title, article.content, article.image_link];
    super.query(
      'INSERT INTO article (category_id, title , content, image_link) values (?,?,?,?)',
      info,
      response_database
    );
  }

  updateArticle(article: Article, response_database: JSON) {
    let info = [article.category_id, article.title, article.content, article.image_link, article.likes, article.id];
    super.query(
      'UPDATE article set category_id = ?, title = ?, content = ? , image_link = ? , likes = ?,  changedAt = DEFAULT  where id = ?',
      info,
      response_database
    );
  }

  deleteArticle(article_id: number, response_database: JSON) {
    super.query('DELETE FROM comment WHERE article_id = ?', [article_id], function () {});
    super.query('DELETE FROM article WHERE id = ?', [article_id], response_database);
  }

  getComments(article_id: number, response_database: JSON) {
    super.query(
      'SELECT id, article_id, nickname, comment, likes, DATE_FORMAT(createdAt, ' +
        date_format_comment +
        ') AS createdAt FROM comment WHERE article_id = ? ORDER BY id ASC',
      [article_id],
      response_database
    );
  }

  addComment(comment: Comment, response_database: JSON) {
    let info = [comment.article_id, comment.nickname, comment.comment];
    super.query('INSERT INTO comment (article_id, nickname , comment) values (?,?,?)', info, response_database);
  }

  likeComment(comment: Comment, response_database: JSON) {
    let info = [comment.likes, comment.id];
    super.query('UPDATE comment set likes = ? where id = ?', info, response_database);
  }

  deleteComment(comment_id: number, response_database: JSON) {
    super.query('DELETE from comment where id = ?', [comment_id], response_database);
  }
};
