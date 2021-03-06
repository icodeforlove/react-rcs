# React Component Styles (RCS)

Component specific styles for react!

React solved the issue with organizing DOM components, but it was still missing a clean way to manage component specific styling.

# Demo / Example

- [live demo](http://jsfiddle.net/icodeforlove/pn2g6/embedded/result%2Ccss%2Cjs/)
- [example project](https://github.com/icodeforlove/react-rcs-example)

# How?

With RCS your CSS rules are scoped specificly to the component you're working on.

So heres your react component

```html
var Header = React.createClass({
	render: function () {
		return <div><a class="link"></a></div>;
	}
});
```

and heres some RCS

```css
view {
	height: 50px;
	background: blue;
}

.link {
	color: red;

	:hover {
		color: blue;
	}
}
```

we will render this component like this

<div class="react-view react-header"><a class="react-header_link"></a></div>

and we will transform the RCS into this

```css
.react-view.react-header {
	height: 50px;
	background: blue;
}

.react-view.react-header .react-header_link:hover {
	color: blue;
}

.react-view.react-header .react-header_link {
	color: red;
}
```

## Best Practices

We recommand that you seperate your RCS from your components so you can compile to css with `grunt-react-rcs`, just like you do with `jsx`.

## In browser transformations

You can take use in browser transformations like this just make sure use `rcs-with-transformer.js` instead of `rcs.js`

```sass
<style type="text/rcs">
	@component Header {
		view {
			height: 50px;
			background: blue;
		}

		.link {
			color: red;

			:hover {
				color: blue;
			}
		}
	}
</style>
```

or 

```sass
<style type="text/rcs" component="Header">
	view {
		height: 50px;
		background: blue;
	}

	.link {
		color: red;

		:hover {
			color: blue;
		}
	}
</style>
```

or

```
<link rel="stylesheet/rcs" type="text/css" href="style.rcs">
```

or

```
<link rel="stylesheet/rcs" type="text/css" href="style.rcs" component="Header">
```

or

```javascript
var Header = React.createClass({
	render: function () {
		return <div><a class="link"></a></div>;
	},

	style: {
		view: {
			height: '50px',
			background: 'blue'
		},

		'.link': {
			color: 'red',

			':hover': {
				color: 'blue'
			}
		}
	}
});

```

or if you are using JSX with harmony

```javascript
var Header = React.createClass({
	render: function () {
		return <div><a class="link"></a></div>;
	},

	style: `
		view {
			height: 50px;
			background: blue;
		}

		.link {
			color: red;

			:hover {
				color: blue;
			}
		}
	`
});

```
