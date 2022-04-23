
import {Article, Comment} from "../src/queries";

const Dao = require("../src/dao.js");

let date_format = '\'%d %M %H:%i\'';
let date_format_comment = '\'%H:%i\'';

module.exports = class testQueries extends Dao
{
	getCategories(response_database: JSON)
	{
		super.query("SELECT * FROM test_category", [], response_database);
	}



	getMostRecent(response_database: JSON)
	{
		super.query("SELECT id, category_id, title, content, image_link, likes, DATE_FORMAT(createdAt, " + date_format + ") AS createdAt, DATE_FORMAT(changedAt, '%d %M %H:%i') AS changedAt FROM test_article ORDER BY id DESC LIMIT 2", [], response_database);
	}



	getSearchArticles(search: string, response_database: JSON)
	{
		search = '%' + search + '%';
		super.query(
			"SELECT id, category_id, title, content, image_link, likes, DATE_FORMAT(createdAt, " + date_format + ") AS createdAt, DATE_FORMAT(changedAt, " + date_format + ") AS changedAt FROM test_article " +
			"WHERE title LIKE ? " +
			"UNION " +
			"SELECT id, category_id, title, content, image_link, likes, DATE_FORMAT(createdAt, " + date_format + ") AS createdAt, DATE_FORMAT(changedAt, " + date_format + ") AS changedAt FROM test_article " +
			"WHERE content LIKE ?", [search, search], response_database);
	}



	getFrontpage(response_database: JSON)
	{
		super.query("SELECT id, category_id, title, content, image_link, likes, DATE_FORMAT(createdAt, " + date_format + ") AS createdAt, DATE_FORMAT(changedAt, " + date_format + ") AS changedAt FROM test_article ORDER BY likes DESC Limit 10", [], response_database);
	}



	getAll(response_database: JSON)
	{
		super.query("SELECT id, category_id, title, content, image_link, likes, DATE_FORMAT(createdAt, " + date_format + ") AS createdAt, DATE_FORMAT(changedAt, " + date_format + ") AS changedAt FROM test_article ORDER BY id DESC", [], response_database);
	}



	getArticlesFromCategory(category_id: number, response_database: JSON)
	{
		super.query("SELECT id, category_id, title, content, image_link, likes, DATE_FORMAT(createdAt, " + date_format + ") AS createdAt, DATE_FORMAT(changedAt, " + date_format + ") AS changedAt FROM test_article WHERE category_id = ? ORDER BY id DESC", [category_id], response_database);
	}



	getArticle(id: number, response_database: JSON)
	{
		super.query("SELECT id, category_id, title, content, image_link, likes, DATE_FORMAT(createdAt, " + date_format + ") AS createdAt, DATE_FORMAT(changedAt, " + date_format + ") AS changedAt FROM test_article WHERE id = ?", [id], response_database);
	}



	addArticle(article: Article, response_database: JSON)
	{
		let info = [article.category_id, article.title, article.content, article.image_link];
		super.query("INSERT INTO test_article (category_id, title , content, image_link) values (?,?,?,?)", info, response_database);
	}



	updateArticle(article: Article, response_database: JSON)
	{
		let info = [article.category_id, article.title, article.content, article.image_link, article.likes, article.id];
		super.query("UPDATE test_article set category_id = ?, title = ?, content = ? , image_link = ? , likes = ?,  changedAt = DEFAULT  where id = ?", info, response_database);
	}



	deleteArticle(article_id: number, response_database: JSON)
	{
		super.query("DELETE FROM test_comment WHERE article_id = ?", [article_id], function(){});
		super.query("DELETE FROM test_article WHERE id = ?", [article_id], response_database);
	}



	getComments(article_id: number, response_database: JSON)
	{
		super.query("SELECT id, article_id, nickname, comment, likes, DATE_FORMAT(createdAt, " + date_format_comment + ") AS createdAt FROM test_comment WHERE article_id = ? ORDER BY id ASC", [article_id], response_database);
	}



	addComment(comment: Comment, response_database: JSON)
	{
		let info = [comment.article_id, comment.nickname, comment.comment];
		super.query("INSERT INTO test_comment (article_id, nickname , comment) values (?,?,?)", info, response_database);
	}



	updateComment(comment: Comment, response_database: JSON)
	{
		let info = [comment.likes, comment.id];
		super.query("UPDATE test_comment set likes = ? where id = ?", info, response_database);
	}



	deleteComment(comment_id: number, response_database: JSON)
	{
		super.query("DELETE from test_comment where id = ?", [comment_id], response_database);
	}
};
