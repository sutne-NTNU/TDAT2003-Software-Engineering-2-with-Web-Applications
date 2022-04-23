
export class Category
{
	id: number;
	name: string;
}



export class Article
{
	id: number;

	category_id: number;
	title: string;
	content: string;
	image_link: string;

	likes: number;
	createdAt: string;
	changedAt: string;
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