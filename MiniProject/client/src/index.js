// @flow
/* eslint eqeqeq: "off" */

import ReactDOM from 'react-dom';
import * as React from 'react';
import {HashRouter, Route} from 'react-router-dom';
import {Component, sharedComponentData} from 'react-simplified';
import {Carousel, Form, FormControl, Nav, Navbar, NavDropdown, Spinner} from "react-bootstrap";
import {createHashHistory} from 'history';

import {Button, CommentView, EmptyResult, FrontArticle, InputField, LivefeedArticle, Row} from './widgets';
import {Article, articleService, Category, Comment} from './service';


const history = createHashHistory();
let shared = new sharedComponentData({categories: []});


/*
sets a function to be done at a given interval for a given amount of time,
i use for rezizing the articles on the frontpage etc. while images and so on are still loading
 */

function setIntervalForDuration(callback)
{
	const delay = 50;                      //will run every 100ms (0,1s)
	const duration = 1000;                  //and stop after 2000ms (2 seconds)
	let repetitions = duration / delay;     //this means 20 repetitions
	let x = 0;
	let intervalID = window.setInterval(function ()
	{
		callback();
		if (++x === repetitions)
		{
			window.clearInterval(intervalID);
		}
	}, delay);
}

/*
Functions that asigns rows for articles based on the size of their content
 */

function resizeGridItem(item)
{
	let grid = document.getElementsByClassName("article_grid")[0];
	let rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
	let rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap'));
	let content = item.querySelector('.content');
	let rowSpan = Math.ceil((content ? (content.getBoundingClientRect().height + rowGap) : 100) / (rowHeight + rowGap));
	item.style.gridRowEnd = "span " + rowSpan;
}
function resizeAllGridItems()
{
	let allItems = document.getElementsByClassName('article_front');
	for (let x = 0; x < allItems.length; x++)
	{
		resizeGridItem(allItems[x]);
	}
}
let allItems = document.getElementsByClassName("item");
for (let x = 0; x < allItems.length; x++)
{
	// $FlowFixMe
	imagesLoaded(allItems[x], resizeInstance);
}
function resizeInstance(instance)
{
	let item = instance.elements[0];
	resizeGridItem(item);
}
/*
when the window is resized the size (nr of rows) of the articles are adjusted acoordingly
 */
window.addEventListener("resize", resizeAllGridItems);



class Menu extends Component
{
	searchString: string = '';



	mounted()
	{
		articleService.getCategories()
		              .then(categories => (shared.categories = Array.from(categories)))
		              .catch((error: Error) => console.log(error.message));
	}



	render()
	{
		return (
			<Navbar className = 'custom_navbar'
			        bg = "dark"
			        variant = 'dark'
			        expand = "lg"
			        sticky = 'top'>
				<Navbar.Brand className = "navbar_brand"
				              href = '/#/'>Home</Navbar.Brand>
				<Navbar.Toggle aria-controls = "basic-navbar-nav"/>
				<Navbar.Collapse id = "basic-navbar-nav">
					<Nav className = "mr-auto">
						<Nav.Link href = "/#/articles">Browse</Nav.Link>
						<NavDropdown title = "Categories"
						             id = "basic-nav-dropdown">
							{shared.categories.filter(cat => cat.id !== 1).map(cat =>
								(
									<NavDropdown.Item key = {cat.id}
									                  href = {"/#/articles/category/" + cat.id}>{cat.name}</NavDropdown.Item>
								)
							)}
							<NavDropdown.Divider/>
							<NavDropdown.Item href = {"/#/articles/category/1"}>{'Annet'}</NavDropdown.Item>
						</NavDropdown>
					</Nav>
					<button className = 'btn btn-outline-success my-2 my-sm-0'
					        onClick = {() => history.push('/submit')}>
						<span className = "glyphicon glyphicon-plus"
						      aria-hidden = "true"
						      aria-label = "Like"/>
					</button>
					<Form inline>
						<FormControl type = "search"
						             placeholder = "Search"
						             className = "mr-sm-2"
						             onChange = {(event: SyntheticInputEvent<HTMLInputElement>) =>
						             {
							             if (event.target.value)
							             {
								             history.push('/search/' + event.target.value);
							             }
							             else
							             {
								             history.push('/articles');
							             }
						             }}/>
					</Form>
				</Navbar.Collapse>
			</Navbar>
		);
	}
}



class LiveFeedList extends Component
{
	articles: Article[] = [];



	/*
	refreshes the latest articles every 30 seconds
	*/
	startRefreshingArticles()
	{
		setInterval(() =>
			{
				articleService.getMostRecentArticles()
				              .then(articles => (this.articles = Array.from(articles)))
				              .catch((error: Error) => console.log(error.message));
			}
			, 10 * 1000);
	}



	mounted()
	{
		articleService.getMostRecentArticles()
		              .then(articles => (this.articles = Array.from(articles)))
		              .catch((error: Error) => console.log(error.message));
		this.startRefreshingArticles();
	}



	render()
	{
		if (this.articles.length === 0)
		{
			return <p>No Results</p>;
		}
		return (
			<Carousel className = "livefeed"
			          pauseOnHover = 'true'>
				<Carousel.Item>
					<Row className = 'livefeed-row'>
						{this.articles.slice(0, 5).map(article => (

							<LivefeedArticle key = {article.id}
							                 article_id = {article.id}
							                 title = {article.title}
							                 createdAt = {article.createdAt}/>
						))}
					</Row>
				</Carousel.Item>
				<Carousel.Item>
					<Row className = 'livefeed-row'>
						{this.articles.slice(5, 10).map(article => (
							<LivefeedArticle key = {article.id}
							                 article_id = {article.id}
							                 title = {article.title}
							                 createdAt = {article.createdAt}/>

						))}
					</Row>
				</Carousel.Item>
			</Carousel>
		);
	}
}



class Home extends Component
{
	articles: Article[] = [];



	mounted()
	{
		articleService.getFrontpageArticles()
		              .then(articles => this.articles = articles)
		              .catch((error: Error) => console.log(error.message));
		setIntervalForDuration(function ()
		{
			resizeAllGridItems();
		});

	}



	render()
	{
		if (this.articles.length === 0)
		{
			return (
				<div>
					<Spinner animation = "border"
					         role = "status">
						<span className = "sr-only">Loading...</span>
					</Spinner>
				</div>

			);
		}
		return (
			<div className = 'article_grid'>
				{this.articles.map(article => (
					<FrontArticle key = {article.id}
					              article_id = {article.id}
					              title = {article.title}
					              image_link = {article.image_link}
					              likes = {article.likes}
					              createdAt = {article.createdAt}>{article.content}
					</FrontArticle>
				))}
			</div>
		);
	}
}



class SearchArticles extends Component
	<{ match: { params: { search: string } } }>
{
	articles: Article[] = [];



	mounted()
	{
		articleService.getSearchArticles(this.props.match.params.search)
		              .then(articles => (this.articles = articles))
		              .catch(error =>
		              {
			              this.articles = [];
			              console.log(error);
		              });
		setIntervalForDuration(function ()
		{
			resizeAllGridItems();
		});
	}



	render()
	{
		if (this.articles.length === 0)
		{
			return (
				<EmptyResult message = {'No articles matching\n\"' + this.props.match.params.search + '\"\nMaybe you could add one?'}/>
			);
		}
		return (
			<div className = 'article_grid'>
				{this.articles.map(article => (
					<FrontArticle key = {article.id}
					              article_id = {article.id}
					              title = {article.title}
					              image_link = {article.image_link}
					              likes = {article.likes}
					              createdAt = {article.createdAt}>{article.content}
					</FrontArticle>
				))}
			</div>
		);
	}
}



class ArticleList extends Component
{
	articles: Article[] = [];



	mounted()
	{
		articleService.getAllArticles()
		              .then(articles => (this.articles = Array.from(articles)))
		              .catch(error => console.log(error));
		setIntervalForDuration(function ()
		{
			resizeAllGridItems();
		});
	}



	render()
	{
		if (!this.articles)
		{
			return (
				<div>
					<Spinner animation = "border"
					         role = "status">
						<span className = "sr-only">Loading...</span>
					</Spinner>
				</div>

			);
		}
		if (this.articles.length === 0)
		{
			return (
				<EmptyResult message = {'No articles found\n Maybe you could add one?'}/>
			);
		}
		return (
			<div className = 'article_grid'>
				{this.articles.map(article => (
					<FrontArticle key = {article.id}
					              article_id = {article.id}
					              title = {article.title}
					              image_link = {article.image_link}
					              likes = {article.likes}
					              createdAt = {article.createdAt}>{article.content}
					</FrontArticle>
				))}
			</div>
		);
	}
}



class ArticlePage extends Component
	<{ match: { params: { id: number } } }>
{
	article: Article = new Article();
	comments: Comment[] = [];
	newComment: Comment = new Comment();
	feedback: string = '';



	mounted()
	{
		articleService.getArticle(this.props.match.params.id)
		              .then(article => (this.article = article))
		              .catch((error: Error) => console.log(error));

		this.refreshComments();
	}



	render()
	{
		if (!this.article.id)
		{
			return (<EmptyResult message = {'Oops!\nThis article no longer exists'}/>);
		}
		return (
			<div className = 'article_page'>
				<div className = 'article_page-article'>
					<div className = 'image'>
						{this.article.image_link ?
							<img src = {this.article.image_link}
							     alt = {this.article.title}/>
							:
							null
						}
					</div>
					<Row>
						<Button.Delete onClick = {this.delete}/>
						<Button.Edit onClick = {() => history.push('/articles/' + this.article.id + '/edit')}>Edit article</Button.Edit>
						<Button.Like onClick = {this.like}
						             nr = {this.article.likes}> Like </Button.Like>
						<div className = 'article-time'>{'Submitted\n' + this.article.createdAt}</div>
						<div className = 'article-time'>{'Last Updated\n' + this.article.changedAt}</div>

					</Row>
					<div className = 'text'>
						<h1>{this.article.title}</h1>
						<div className = "content">{this.article.content}</div>
					</div>
				</div>

				<div className = 'article-comments'>
					<Row>
						<Button.Send onClick = {this.postComment}> Legg til kommentar</Button.Send>
						<div className = 'article-comment-input-nickname'>
							<InputField.Text onChange = {(event) => this.newComment.nickname = event.target.value}
							                 fieldName = 'Nickname'
							                 field = {this.newComment.nickname}/>
						</div>
						<div className = 'article-comment-input-text'>
							<InputField.Text onChange = {(event) => this.newComment.comment = event.target.value}
							                 fieldName = 'Comment'
							                 field = {this.newComment.comment}/>
						</div>
						<div className = 'feedback'>{this.feedback}</div>
					</Row>
					{this.comments.length > 0 ? this.comments.map(comment =>
						(
							<CommentView key = {comment.id}
							             nickname = {comment.nickname}
							             createdAt = {comment.createdAt}
							             comment = {comment.comment}>
								<Button.Delete onClick = {() => this.deleteComment(comment)}/>
								<Button.Like nr = {comment.likes}
								             onClick = {() => this.likeComment(comment)}/>
							</CommentView>
						)) : null}
				</div>
			</div>
		);
	}



	refreshComments()
	{
		articleService.getArticleComments(this.props.match.params.id)
		              .then(comments => comments ? (this.comments = comments) : this.comments = [])
		              .catch((error: Error) => console.log(error));
	}



	like()
	{
		this.article.likes++;
		articleService.updateArticle(this.article)
		              .catch((error: Error) => console.log(error.message));
	}



	postComment()
	{
		if (!this.newComment.nickname || !this.newComment.nickname || !this.newComment.nickname.trim() || !this.newComment.comment.trim())
		{
			this.feedback = 'Vennligst fyll feltene før du sender';
			return;
		}
		this.feedback = '';
		this.newComment.article_id = this.article.id;
		articleService.postComment(this.newComment)
		              .then(() =>
		              {
			              this.newComment = new Comment();
			              this.refreshComments();
		              })
		              .catch((error: Error) => console.log(error.message));
	}



	deleteComment(comment: Comment)
	{
		articleService.deleteComment(comment)
		              .then(res => this.refreshComments())
		              .catch((error: Error) => console.log(error.message));
	}



	likeComment(comment: Comment)
	{
		comment.likes++;
		articleService.likeComment(comment)
		              .then(() => this.refreshComments())
		              .catch((error: Error) => console.log(error.message));
	}



	delete()
	{
		articleService.deleteArticle(this.props.match.params.id)
		              .then(() =>
		              {
			              history.push('/');
			              console.log(this.article.title + ' was deleted');
		              })
		              .catch((error: Error) => console.log(error.message));
	}
}



class ArticleEdit extends Component
	<{ match: { params: { id: number } } }>
{
	article: Article = new Article();
	feedback: string = '';



	mounted()
	{
		articleService.getArticle(this.props.match.params.id)
		              .then(db_article => (this.article = db_article))
		              .catch((error: Error) =>
		              {
			              history.push('/');
			              console.log(error.message);
		              });
	}



	render()
	{
		if (!this.article.id)
		{
			return (<EmptyResult message = {'Oops!\nThis article no longer exists'}/>);
		}
		return (
			<form className = 'input_form'>
				<div className = 'time'>{'Submitted:\t' + this.article.createdAt}</div>
				<div className = 'time'>{'Last updated:\t' + this.article.changedAt}</div>
				<label>{'Category'}</label>
				<select required
				        value = {(this.article.category_id: number)}
				        onChange = {(event: SyntheticInputEvent<HTMLInputElement>) => this.article.category_id = Number(event.target.value)}>
					{shared.categories.map(cat =>
						(<option key = {cat.id}
						         value = {cat.id}>{cat.name}</option>)
					)}
				</select>
				<InputField.Text required
				                 fieldName = 'title'
				                 field = {this.article.title}
				                 onChange = {(event: SyntheticInputEvent<HTMLInputElement>) => (this.article.title = (event.target.value: string))}
				/>
				<InputField.LongText required
				                     fieldName = 'Content'
				                     field = {this.article.content}
				                     onChange = {(event: SyntheticInputEvent<HTMLInputElement>) => (this.article.content = (event.target.value: string))}
				/>

				<InputField.Image fieldName = 'Image_link'
				                  field = {this.article.image_link}
				                  onChange = {(event: SyntheticInputEvent<HTMLInputElement>) => (this.article.image_link = (event.target.value: string))}
				/>
				<div className = 'feedback'>{this.feedback}</div>
				<Button.Save onClick = {this.save}/>
			</form>
		);
	}



	save()
	{
		if (!this.article.title || !this.article.content || !this.article.title.trim() || !this.article.content.trim())
		{
			this.feedback = 'Vennligst fyll ut feltene før du sender';
			return;
		}
		this.feedback = '';
		this.article.content = this.article.content.replace(/\r\n|\r|\n/g, '\n');
		articleService.updateArticle(this.article)
		              .then(() => history.push('/articles/' + this.article.id))
		              .catch((error: Error) => console.log(error.message));
	}
}



class Submit extends Component
{
	article: Article = new Article();
	feedback: string = '';



	mounted()
	{
		this.article.title = '';
		this.article.content = '';
		this.article.image_link = '';
		this.article.category_id = 1;
	}



	render()
	{
		return (
			<form className = 'input_form'>
				<label>{'Category'}</label>
				<select required
				        value = {this.article.category_id}
				        onChange = {(event: SyntheticInputEvent<HTMLInputElement>) => this.article.category_id = Number(event.target.value)}>
					{shared.categories.map(cat =>
						(<option key = {cat.id}
						         value = {cat.id}>{cat.name}</option>)
					)}
				</select>
				<InputField.Text required
				                 fieldName = 'Title'
				                 field = {this.article.title}
				                 onChange = {(event: SyntheticInputEvent<HTMLInputElement>) => (this.article.title = String(event.target.value))}
				/>
				<InputField.LongText required
				                     fieldName = 'Content'
				                     field = {this.article.content}
				                     onChange = {(event: SyntheticInputEvent<HTMLInputElement>) => (this.article.content = String(event.target.value))}
				/>
				<InputField.Image fieldName = 'Image URL'
				                  field = {this.article.image_link}
				                  onChange = {(event: SyntheticInputEvent<HTMLInputElement>) => (this.article.image_link = String(event.target.value))}
				/>
				<div className = 'feedback'>{this.feedback}</div>
				<Button.Save onClick = {this.save}/>
			</form>
		);
	}



	save()
	{
		if (!this.article.title || !this.article.content || !this.article.title.trim() || !this.article.content.trim())
		{
			this.feedback = 'vennligst fyll ut tittel og innhold';
			return;
		}
		this.feedback = '';
		this.article.content = this.article.content.replace(/\r\n|\r|\n/g, '\n');
		articleService.postArticle(this.article)
		              .then(response =>
		              {
			              response.id ? history.push('/articles/' + response.id) : this.feedback = 'oops Something went wrong';
		              })
		              .catch((error: Error) => console.log(error));
	}
}



class CategoryArticles extends Component
	<{ match: { params: { category_id: number } } }>
{
	articles: Article[] = [];



	mounted()
	{
		articleService.getArticlesFromCategory(this.props.match.params.category_id)
		              .then(articles => (this.articles = Array.from(articles)))
		              .catch(error =>
		              {
			              this.articles = [];
			              console.error(error);
		              });
		setIntervalForDuration(function ()
		{
			resizeAllGridItems();
		});
	}



	render()
	{
		//hasnt gotten the result from the database yet, (loading)
		if (!this.articles)
		{
			return (
				<div>
					<Spinner animation = "border"
					         role = "status">
						<span className = "sr-only">Loading...</span>
					</Spinner>
				</div>

			);
		}
		//no results were found for this category
		if (this.articles.length === 0)
		{
			return (
				<EmptyResult/>
			);
		}
		return (
			<div className = 'article_grid'>
				{this.articles.map(article => (
					<FrontArticle key = {article.id}
					              article_id = {article.id}
					              title = {article.title}
					              image_link = {article.image_link}
					              likes = {article.likes}
					              createdAt = {article.createdAt}>{article.content}
					</FrontArticle>
				))}
			</div>
		);
	}
}



const root = document.getElementById('root');
if (root)
{
	ReactDOM.render(
		<HashRouter>
			<div>
				<Menu/>
				<Route path = "/"
				       component = {LiveFeedList}/>
				<Route exact
				       path = "/"
				       component = {Home}/>
				<Route exact
				       path = "/search/:search"
				       component = {SearchArticles}/>
				<Route exact
				       path = "/articles"
				       component = {ArticleList}/>
				<Route exact
				       path = "/articles/:id"
				       component = {ArticlePage}/>
				<Route exact
				       path = "/articles/:id/edit"
				       component = {ArticleEdit}/>
				<Route exact
				       path = "/articles/category/:category_id"
				       component = {CategoryArticles}/>
				<Route exact
				       path = "/submit"
				       component = {Submit}/>
			</div>
		</HashRouter>,
		root
	);
}
