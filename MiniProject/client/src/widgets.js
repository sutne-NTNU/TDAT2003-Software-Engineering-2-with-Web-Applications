// @flow
/* eslint eqeqeq: "off" */

import * as React from 'react';
import {Component} from 'react-simplified';



/**
 * Renders a row using Bootstrap classes
 */
export class Row extends Component<{ children?: React.Node }>
{
	render()
	{
		return <div className = "row">{this.props.children}</div>;
	}
}



export class Alert extends Component
{
	alerts: { id: number, text: React.Node, type: string }[] = [];
	static nextId = 0;



	render()
	{
		return (
			<>
				{this.alerts.map((alert, i) => (
					<div key = {alert.id}
					     className = {'alert alert-' + alert.type}
					     role = "alert">
						{alert.text}
						<button
							type = "button"
							className = "close"
							onClick = {() =>
							{
								this.alerts.splice(i, 1);
							}}
						>
							&times;
						</button>
					</div>
				))}
			</>
		);
	}



	static danger(text: React.Node)
	{
		// To avoid 'Cannot update during an existing state transition' errors, run after current event through setTimeout
		setTimeout(() =>
		{
			for (let instance of Alert.instances())
			{
				instance.alerts.push({
					id: Alert.nextId++,
					text: text,
					type: 'danger'
				});
			}
		});
	}
}



class ButtonLike extends Component<{
	onClick: () => mixed, // Any function
	nr: number,
	children?: string
}>
{
	render()
	{
		let text = (this.props.children ? (' ' + this.props.children + ' ') : '   ');
		return (
			<button type = "button"
			        className = 'button-like'
			        onClick = {this.props.onClick}>
				<span className = "glyphicon glyphicon-heart"
				      aria-hidden = "true"
				      aria-label = "Like"/>{text + this.props.nr}
			</button>
		);
	}
}



class ButtonDelete extends Component<{
	onClick: () => mixed, // Any function
}>
{
	render()
	{
		return (
			<button type = "button"
			        className = 'button-delete'
			        onClick = {this.props.onClick}>
				<span className = "glyphicon glyphicon-trash"
				      aria-hidden = "true"
				      aria-label = "Delete"/>
			</button>
		);
	}
}



class ButtonEdit extends Component<{
	onClick: () => mixed, // Any function
}>
{
	render()
	{
		return (
			<button type = "button"
			        className = 'button-edit'
			        onClick = {this.props.onClick}>
				<span className = "glyphicon glyphicon-edit"
				      aria-hidden = "true"
				      aria-label = "Delete"/> Edit
			</button>
		);
	}
}



class ButtonSave extends Component<{
	onClick: () => mixed, // Any function
}>
{
	render()
	{
		return (
			<button type = "button"
			        className = 'button-edit'
			        onClick = {this.props.onClick}>
				<span className = "glyphicon glyphicon-floppy-disk"
				      aria-hidden = "true"
				      aria-label = "Delete"/> Save
			</button>
		);
	}
}



class ButtonSend extends Component<{
	onClick: () => mixed, // Any function
	children?: React.Node
}>
{
	render()
	{
		return (
			<button type = "button"
			        className = 'button-edit'
			        onClick = {this.props.onClick}>
				<span className = "glyphicon glyphicon-send"
				      aria-hidden = "true"
				      aria-label = "Send"/> {this.props.children}
			</button>
		);
	}
}



/**
 * Renders a button using Bootstrap classes
 */
export class Button
{
	static Like = ButtonLike;
	static Delete = ButtonDelete;
	static Edit = ButtonEdit;
	static Save = ButtonSave;
	static Send = ButtonSend;
}



class InputFieldText extends Component<{
	onChange: (event: SyntheticInputEvent<HTMLInputElement>) => mixed,
	required?: boolean,
	fieldName: React.Node,
	field: React.Node,
}>
{
	render()
	{
		return (
			<div className = 'input'>
				<input required = {this.props.required ? this.props.required : false}
				       className = 'input-text'
				       type = "text"
				       value = {this.props.field ? this.props.field : ''}
				       placeholder = {this.props.fieldName}
				       onChange = {this.props.onChange}/>
			</div>
		);
	}
}



class InputFieldLongText extends Component<{
	onChange: (event: SyntheticInputEvent<HTMLInputElement>) => mixed,
	fieldName: React.Node,
	field: React.Node,
	required?: React.Node;
}>
{
	render()
	{
		return (
			<div className = 'input'>
				<textarea
					className = 'input-textarea'
					rows = '10'
					value = {this.props.field ? this.props.field : ''}
					placeholder = {this.props.fieldName}
					onChange = {this.props.onChange}/>
			</div>
		);
	}
}



class InputFieldImage extends Component<{
	onChange: (event: SyntheticInputEvent<HTMLInputElement>) => mixed,
	fieldName: string,
	field: React.Node
}>
{
	render()
	{
		return (
			<div className = 'input'>
				<div className = 'input-image'>
					<input className = 'input-image-link'
					       type = "text"
					       value = {this.props.field ? this.props.field : ''}
					       placeholder = {this.props.fieldName}
					       onChange = {this.props.onChange}/>
					<div className = 'input-image-preview'>
						<img
							src = {this.props.field}
							alt = {'Invalid URL'}/>
					</div>
				</div>
			</div>
		);
	}
}



export class InputField
{
	static Text = InputFieldText;
	static LongText = InputFieldLongText;
	static Image = InputFieldImage;
}



export class EmptyResult extends Component<{ message?: string, children?: React.Node }>
{
	render()
	{
		return (
			<div className = 'empty_result'>
				<h3>
					{this.props.message ? this.props.message : 'No articles found\nMaybe you could add one?'}
					<a href = 'http://localhost:8888/#/submit'>{'\nOfcourse :)'}</a>
					<a href = 'http://localhost:8888/#/'>{'\nNot right now :('}</a>
				</h3>
				<img src = 'https://i.imgur.com/s6b2jKz.png'
				     alt = 'Sorry'/>
			</div>
		);
	}
}



export class LivefeedArticle extends Component<{ article_id: number, title: string, createdAt: string }>
{
	render()
	{
		return (
			<a className = 'livefeed-article'
			   href = {'/#/articles/' + this.props.article_id}>
				<div className = 'livefeed-container'>
					<div className = 'livefeed-article-title'>
						{this.props.title}
					</div>
					<div className = 'livefeed-article-time'>
						{this.props.createdAt}
					</div>
				</div>
			</a>
		);
	}
}



export class FrontArticle extends Component<{ article_id: number, title: string, createdAt?: string, image_link?: string, likes: number, children: React.Node }>
{
	render()
	{
		return (
			<a className = 'article_front'
			   href = {'http://localhost:8888/#/articles/' + this.props.article_id}>
				<div className = "content">
					{this.props.image_link ?
						<img src = {this.props.image_link}
						     alt = {this.props.title}/>
						:
						null
					}
					<Row>
						<div className = 'article_front-likes'>
							<span className = "glyphicon glyphicon-heart"
							      aria-hidden = "true"
							      aria-label = "Like"/>{' ' + this.props.likes}
						</div>
						<div className = 'article_front-time'>{this.props.createdAt}</div>
					</Row>
					<h1>{this.props.title}</h1>
				</div>
			</a>
		);
	}
}



export class CommentView extends Component<{ nickname: string, createdAt: string, comment: string, children: React.Node }>
{
	render()
	{
		return (
			<div className = "article-comment">
				<Row>
					{this.props.children}
					<div className = 'article-comment-time'>{this.props.createdAt}</div>
					<div className = 'article-comment-nickname'>{this.props.nickname + ':\t'}</div>
					<div className = 'article-comment-text'>{this.props.comment}</div>
				</Row>
			</div>
		);
	}
}

