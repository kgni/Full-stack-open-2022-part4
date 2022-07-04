const listHelper = require('../utils/list_helper');

const listWithOneBlog = [
	{
		_id: '5a422aa71b54a676234d17f8',
		title: 'Go To Statement Considered Harmful',
		author: 'Edsger W. Dijkstra',
		url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
		likes: 5,
		blogs: 3,
		__v: 0,
	},
];

const listWithManyBlogs = [
	{
		_id: '5a422a851b54a676234d17f7',
		title: 'React patterns',
		author: 'Michael Chan',
		url: 'https://reactpatterns.com/',
		likes: 7,
		blogs: 3,
		__v: 0,
	},
	{
		_id: '5a422aa71b54a676234d17f8',
		title: 'Go To Statement Considered Harmful',
		author: 'Edsger W. Dijkstra',
		url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
		likes: 5,
		blogs: 2,
		__v: 0,
	},
	{
		_id: '5a422b3a1b54a676234d17f9',
		title: 'Canonical string reduction',
		author: 'Edsger W. Dijkstra',
		url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
		likes: 12,
		blogs: 4,
		__v: 0,
	},
	{
		_id: '5a422b891b54a676234d17fa',
		title: 'First class tests',
		author: 'Robert C. Martin',
		url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
		likes: 10,
		blogs: 3,
		__v: 0,
	},
	{
		_id: '5a422ba71b54a676234d17fb',
		title: 'TDD harms architecture',
		author: 'Robert C. Martin',
		url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
		likes: 0,
		blogs: 4,
		__v: 0,
	},
	{
		_id: '5a422bc61b54a676234d17fc',
		title: 'Type wars',
		author: 'Robert C. Martin',
		url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
		likes: 12,
		blogs: 1,
		__v: 0,
	},
];

describe('total likes', () => {
	test('when list has no blogs, equals to 0', () => {
		const result = listHelper.totalLikes([]);
		expect(result).toBe(0);
	});

	test('when list has only one blog, equals the likes of that', () => {
		const result = listHelper.totalLikes(listWithOneBlog);
		expect(result).toBe(5);
	});

	test('when list has many blogs, equals the sum of likes of all blogs', () => {
		const result = listHelper.totalLikes(listWithManyBlogs);
		expect(result).toBe(46);
	});
});

describe('favorite blog (most likes)', () => {
	test('when list has no blogs, equals to 0', () => {
		const result = listHelper.favoriteBlog([]);
		expect(result).toBe(0);
	});
	test('when list has 1 blog, equals to that blog', () => {
		const result = listHelper.favoriteBlog(listWithOneBlog);
		expect(result).toEqual(listWithOneBlog);
	});

	test('when list has many blogs, equals to array of the most popular blogs', () => {
		const result = listHelper.favoriteBlog(listWithManyBlogs);
		expect(result).toEqual([
			{
				_id: '5a422b3a1b54a676234d17f9',
				title: 'Canonical string reduction',
				author: 'Edsger W. Dijkstra',
				url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
				blogs: 4,
				likes: 12,
				__v: 0,
			},
			{
				_id: '5a422bc61b54a676234d17fc',
				title: 'Type wars',
				author: 'Robert C. Martin',
				url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
				blogs: 1,
				likes: 12,
				__v: 0,
			},
		]);
	});
});

describe('most blogs', () => {
	test('when list has no blogs, equals to 0', () => {
		const result = listHelper.mostBlogs([]);
		expect(result).toBe(0);
	});
	test('when list has 1 blog, equals to that blog', () => {
		const result = listHelper.mostBlogs(listWithOneBlog);
		expect(result).toEqual(listWithOneBlog);
	});

	test('when list has many blogs, equals to array of objects containing the authors name and blogs', () => {
		const result = listHelper.mostBlogs(listWithManyBlogs);
		expect(result).toEqual([
			{
				_id: '5a422b3a1b54a676234d17f9',
				title: 'Canonical string reduction',
				author: 'Edsger W. Dijkstra',
				url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
				likes: 12,
				blogs: 4,
				__v: 0,
			},
			{
				_id: '5a422ba71b54a676234d17fb',
				title: 'TDD harms architecture',
				author: 'Robert C. Martin',
				url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
				likes: 0,
				blogs: 4,
				__v: 0,
			},
		]);
	});
});
