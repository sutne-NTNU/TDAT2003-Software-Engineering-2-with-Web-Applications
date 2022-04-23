//@flow
import axios from 'axios';



export class Article
{
	id: number;

	title: string;
	content: string;
	image_link: string;
	category_id: number;

	likes: number;
	createdAt: string;
	changedAt: string;
}



export class Category
{
	id: number;
	name: string;
}



export class Comment
{
	id: number;

	article_id: number;
	nickname: string;
	comment: string;

	likes: number;
	createdAt: string;
}



class ArticleService
{
	getCategories()
	{
		return axios.get<Category[]>('/articles/categories').then(response => response.data);
	}



	getMostRecentArticles()
	{
		return axios.get<Article[]>('/articles/livefeed').then(response => response.data);
	}



	getSearchArticles(search: string)
	{
		return axios.get<Article[]>('/articles/search/' + search).then(response => response.data);
	}



	getFrontpageArticles()
	{
		return axios.get<Article[]>('/articles/frontpage').then(response => response.data);
	}



	getAllArticles()
	{
		return axios.get<Article[]>('/articles').then(response => response.data);
	}



	getArticlesFromCategory(category_id: number)
	{
		return axios.get<Article[]>('/articles/categories/' + category_id).then(response => response.data);
	}



	getArticle(id: number)
	{
		return axios.get<Article>('/articles/' + id).then(response => response.data);
	}



	getArticleComments(id: number)
	{
		return axios.get<Comment[]>('/articles/' + id + '/comments').then(response => response.data);
	}



	postArticle(article: Article)
	{
		return axios.post<Article, Article>('/articles', article).then(response => response.data);
	}



	updateArticle(article: Article)
	{
		return axios.put<Article, void>('/articles/' + article.id, article).then(response => response.data);
	}



	deleteArticle(id: number)
	{
		return axios.delete<number, void>('/articles/' + id).then(response => response.data);
	}



	postComment(comment: Comment)
	{
		return axios.post<Comment, void>('/articles/' + comment.article_id + '/comments', comment).then(response => response.data);
	}



	likeComment(comment: Comment)
	{
		return axios.put<Comment, void>('/articles/' + comment.article_id + '/comments/' + comment.id, comment).then(response => response.data);
	}



	deleteComment(comment: Comment)
	{
		return axios.delete<Comment, void>('/articles/' + comment.article_id + '/comments/' + comment.id).then(response => response.data);
	}
}



export let articleService = new ArticleService();
