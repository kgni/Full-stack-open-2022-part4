const dummy = (blogs) => {
	return 1;
};

const totalLikes = (blogs) => {
	return blogs.reduce((acc, blog) => acc + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
	// get array of all the number of likes

	const likes = blogs.map((blog) => blog.likes);
	// get the highest like count.
	const higestLikeCount = Math.max(...likes);

	// filter through the blogs and return the blogs that has the likes of the higestLikeCount

	const favoriteBlogs = blogs.filter((blog) => blog.likes === higestLikeCount);

	return favoriteBlogs.length === 0 ? 0 : favoriteBlogs;
};

const mostBlogs = (blogs) => {
	// get array of all the number of blogs

	const numberOfBlogs = blogs.map((blog) => blog.blogs);
	// get the highest like count.
	const highestNumberOfBlogs = Math.max(...numberOfBlogs);
	console.log(highestNumberOfBlogs);

	// filter through the blogs and return the blogs that has the blogs of the highestNmberOfBlogs

	const mostBlogs = blogs.filter((blog) => blog.blogs === highestNumberOfBlogs);

	return mostBlogs.length === 0 ? 0 : mostBlogs;
};
module.exports = {
	dummy,
	totalLikes,
	favoriteBlog,
	mostBlogs,
};
