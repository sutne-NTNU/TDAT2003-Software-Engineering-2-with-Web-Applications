
import express from 'express';
import path from 'path';
import reload from 'reload';
import fs from 'fs';
import {type Article, ArticleModel, syncModels} from './models.js';
import {CategoryModel, CommentModel} from "./models";

const public_path = path.join(__dirname, '/../../client/public');

let app = express();

app.use(express.static(public_path));
app.use(express.json()); // For parsing application/json



//get all registered categories
app.get('/articles/categories', (req: express$Request, res: express$Response) =>
{
	return CategoryModel.findAll({order: [['id', 'DESC']], limit: 20})
	                    .then(categories => res.send(categories));
});



//get the latest articles
app.get('/articles/#/live', (req: express$Request, res: express$Response) =>
{
	return ArticleModel.findAll({order: [['id', 'DESC']], limit: 5})
	                   .then(response => res.send(response));
});



//Frontpage, only features important articles
app.get('/articles/#/front', (req: express$Request, res: express$Response) =>
{
	return ArticleModel.findAll({order: [['id', 'DESC']], limit: 10})
	                   .then(articles => res.send(articles));
});



//get all articles
app.get('/articles', (req: express$Request, res: express$Response) =>
{
	return ArticleModel.findAll({order: [['id', 'DESC']]})
	                   .then(students => res.send(students));
});



//get specific article
app.get('/articles/:id', (req: express$Request, res: express$Response) =>
{
	return ArticleModel.findOne({where: {id: Number(req.params.id)}})
	                   .then(student => student ? res.send(student) : res.sendStatus(404));
});



//get a specific articles comments
app.get('/articles/:id/comments', (req: express$Request, res: express$Response) =>
{
	return CommentModel.findAll({where: {article_id: Number(req.params.id)}})
	                   .then(comments => res.send(comments));
});



//get all articles from a specific category
app.get('/articles/categories/:category_id', (req: express$Request, res: express$Response) =>
{
	return ArticleModel.findAll({where: {category_id: Number(req.params.category_id)}})
	                   .then(articles => res.send(articles));
});



//change a article
app.put('/articles/:id', (req: { body: Article }, res: express$Response) =>
{
	return ArticleModel.update(
		{
			title: req.body.title,
			content: req.body.content,
			image_link: req.body.image_link,
			category_id: req.body.category_id
		},
		{where: {id: req.body.id}}
	).then(updated => (updated[0] /* affected rows */ > 0 ? res.sendStatus(200) : res.sendStatus(404)));
});



//change a comment
app.put('/articles/:id/comments/:c_id', (req: { body: Comment }, res: express$Response) =>
{
	return CommentModel.update(
		{
			comment: req.body.comment
		},
		{where: {id: req.params.c_id}})
	                   .then(updated => (updated[0] /* affected rows */ > 0 ? res.sendStatus(200) : res.sendStatus(404)));
});



//post a new article
app.post('/articles', (req: { body: Article }, res: express$Response) =>
{
	return ArticleModel.create(
		{
			category_id: req.body.category_id,
			title: req.body.title,
			content: req.body.content,
			image_link: req.body.image_link
		}
	).then(updated => res.status(200).send({insertId: (updated.id)}));
});



//post a new comment
app.post('/articles/:id/comments', (req: { body: Comment }, res: express$Response) =>
{
	return ArticleModel.create(
		{
			article_id: req.params.id,
			nickname: req.body.nickname,
			comment: req.body.comment
		}
	).then(res.sendStatus(200));
});



//delete an article
app.delete('/articles/:id', (req: express$Request, res: express$Response) =>
{
	return ArticleModel.destroy({where: {id: Number(req.params.id)}})
	                   .then(response => {response === 1 ? res.sendStatus(200) : res.sendStatus(404);});
});



//delete a comment
app.delete('/articles/:id/comments/:c_id', (req: express$Request, res: express$Response) =>
{
	return CommentModel.destroy({where: {id: Number(req.params.c_id)}})
	                   .then(response => {response === 1 ? res.sendStatus(200) : res.sendStatus(404);});
});



// The listen promise can be used to wait for the database connection and web server to start (for instance in your tests)
export let listen = new Promise<void>((resolve, reject) =>
{
	// Wait for Sequalize to connect to and initialize the database
	syncModels.then(() =>
	{
		let call_listen = reloader =>
		{
			app.listen(8888, (error: ?Error) =>
			{
				if (error)
				{
					reject(error.message);
				}
				console.log('Server running');
				// Start hot reload (refresh web page on client changes) when not in production environment
				if (reloader)
				{
					reloader.reload(); // Reload application on server restart
					fs.watch(public_path, () => reloader.reload());
				}
				resolve();
			});
		};
		reload(app).then(reloader => call_listen(reloader));
	});
});
