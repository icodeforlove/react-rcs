var Properties = require('../properties');

describe('The Properties', function() {
	Properties.setBaseUrl('http://example.com/');

	it('can handle properties with `url` references', function () {
		var properties = Properties.transform('background', 'url(test.png)');
		
		expect(properties[0].name).toBe('background');
		expect(properties[0].value).toBe('url(http://example.com/test.png)');

		properties = Properties.transform('background-image', 'url(test.png)');
		
		expect(properties[0].name).toBe('background-image');
		expect(properties[0].value).toBe('url(http://example.com/test.png)');

		properties = Properties.transform('src', 'url(test.png)');
		
		expect(properties[0].name).toBe('src');
		expect(properties[0].value).toBe('url(http://example.com/test.png)');
	});

	it('can handle properties with `url` references with single quotes', function () {
		var properties = Properties.transform('background', 'url(\'test.png\')');
		
		expect(properties[0].name).toBe('background');
		expect(properties[0].value).toBe('url(\'http://example.com/test.png\')');

		properties = Properties.transform('background-image', 'url(\'test.png\')');
		
		expect(properties[0].name).toBe('background-image');
		expect(properties[0].value).toBe('url(\'http://example.com/test.png\')');

		properties = Properties.transform('src', 'url(\'test.png\')');
		
		expect(properties[0].name).toBe('src');
		expect(properties[0].value).toBe('url(\'http://example.com/test.png\')');
	});

	it('can handle properties with `url` references with double quotes', function () {
		var properties = Properties.transform('background', 'url("test.png")');
		
		expect(properties[0].name).toBe('background');
		expect(properties[0].value).toBe('url("http://example.com/test.png")');

		properties = Properties.transform('background-image', 'url("test.png")');
		
		expect(properties[0].name).toBe('background-image');
		expect(properties[0].value).toBe('url("http://example.com/test.png")');

		properties = Properties.transform('src', 'url("test.png")');
		
		expect(properties[0].name).toBe('src');
		expect(properties[0].value).toBe('url("http://example.com/test.png")');
	});
});