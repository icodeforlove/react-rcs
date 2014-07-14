var Style = require('../style');

describe('The Style', function() {
	it('can transform an empty view selector', function () {
		var style = new Style('Test', {
			view: {

			}
		});

		expect(style.toString()).toBe('');
	});

	it('can transform a view selector', function () {
		var style = new Style('Test', {
			view: {
				opacity: 1
			}
		});

		expect(style.toString()).toBe('.react-view.react-test {opacity:1;}');
	});

	it('can transform a basic selector', function () {
		var style = new Style('Test', {
			'.item': {
				opacity: 1
			}
		});

		expect(style.toString()).toBe('.react-view.react-test .react-test_item {opacity:1;}');
	});

	it('can transform multiple selectors', function () {
		var style = new Style('Test', {
			'.item1, .item2, .item3': {
				opacity: 1
			}
		});

		expect(style.toString()).toBe(
			'.react-view.react-test .react-test_item1 {opacity:1;}\n' +
			'.react-view.react-test .react-test_item2 {opacity:1;}\n' +
			'.react-view.react-test .react-test_item3 {opacity:1;}'
		);
	});

	it('can transform multiple selectors with multiple children', function () {
		var style = new Style('Test', {
			'.item1, .item2, .item3': {
				opacity: 1,

				'.first-child': {
					opacity: 1,

					'.second-child': {
						opacity: 1
					}
				}
			}
		});

		expect(style.toString()).toBe(
			'.react-view.react-test .react-test_item1 {opacity:1;}\n' +
			'.react-view.react-test .react-test_item1 .react-test_first-child {opacity:1;}\n' +
			'.react-view.react-test .react-test_item1 .react-test_first-child .react-test_second-child {opacity:1;}\n' +
			'.react-view.react-test .react-test_item2 {opacity:1;}\n' +
			'.react-view.react-test .react-test_item2 .react-test_first-child {opacity:1;}\n' +
			'.react-view.react-test .react-test_item2 .react-test_first-child .react-test_second-child {opacity:1;}\n' +
			'.react-view.react-test .react-test_item3 {opacity:1;}\n' +
			'.react-view.react-test .react-test_item3 .react-test_first-child {opacity:1;}\n' +
			'.react-view.react-test .react-test_item3 .react-test_first-child .react-test_second-child {opacity:1;}'
		);
	});

	it('can transform nested selectors', function () {
		var style = new Style('Test', {
			'.item': {
				opacity: 1,

				'.item1': {
					opacity: 1,

					'.item2': {
						opacity: 1
					}
				}
			}
		});

		expect(style.toString()).toBe(
			'.react-view.react-test .react-test_item {opacity:1;}\n' +
			'.react-view.react-test .react-test_item .react-test_item1 {opacity:1;}\n' +
			'.react-view.react-test .react-test_item .react-test_item1 .react-test_item2 {opacity:1;}'
		);
	});

	it('can transform psuedo selectors', function () {
		var style = new Style('Test', {
			'view': {
				':hover': {
					opacity: 1
				}
			},

			'.item': {
				':hover': {
					opacity: 1
				}
			}
		});

		expect(style.toString()).toBe(
			'.react-view.react-test:hover {opacity:1;}\n'+
			'.react-view.react-test .react-test_item:hover {opacity:1;}'
		);
	});

	it('can transform multiple selectors with psuedo selectors', function () {
		var style = new Style('Test', {
			'view, .item': {
				':hover': {
					opacity: 1
				}
			}
		});

		expect(style.toString()).toBe(
			'.react-view.react-test .react-test_item:hover {opacity:1;}\n' +
			'.react-view.react-test:hover {opacity:1;}'
		);
	});

	it('can transform multiple selectors with multiple psuedo selectors', function () {
		var style = new Style('Test', {
			'view, .item': {
				':hover:active': {
					opacity: 1
				}
			}
		});

		expect(style.toString()).toBe(
			'.react-view.react-test .react-test_item:hover:active {opacity:1;}\n' +
			'.react-view.react-test:hover:active {opacity:1;}'
		);
	});	

	it('can transform a state selector on the view', function () {
		var style = new Style('Test', {
			'view': {
				':::active': {
					opacity: 1
				}
			}
		});

		expect(style.toString()).toBe(
			'.react-view.react-test.react-test_state-active {opacity:1;}'
		);
	});	

	it('can transform a state selector on the root', function () {
		var style = new Style('Test', {
			':::active': {
				opacity: 1
			}
		});

		expect(style.toString()).toBe(
			'.react-view.react-test.react-test_state-active {opacity:1;}'
		);
	});

	it('can transform a nested state selector', function () {
		var style = new Style('Test', {
			'.level-one': {
				opacity: 0,

				'.level-two': {
					opacity: 0,

					':::active': {
						opacity: 1
					}
				}
			}
		});

		expect(style.toString()).toBe(
			'.react-view.react-test .react-test_level-one {opacity:0;}\n' +
			'.react-view.react-test .react-test_level-one .react-test_level-two {opacity:0;}\n' +
			'.react-view.react-test.react-test_state-active .react-test_level-one .react-test_level-two {opacity:1;}'
		);
	});	

	it('can transform multiple nested state selectors on the root', function () {
		var style = new Style('Test', {
			':::visible': {
				'.level-one': {
					opacity: 0,

					'.level-two': {
						opacity: 0,

						':::active': {
							opacity: 1
						}
					}
				}
			}
		});

		expect(style.toString()).toBe(
			'.react-view.react-test.react-test_state-active.react-test_state-visible .react-test_level-one .react-test_level-two {opacity:1;}\n' +
			'.react-view.react-test.react-test_state-visible .react-test_level-one {opacity:0;}\n' +
			'.react-view.react-test.react-test_state-visible .react-test_level-one .react-test_level-two {opacity:0;}'
		);
	});	

	it('can transform multiple nested state selectors on the view', function () {
		var style = new Style('Test', {
			'view': {
				':::visible': {
					'.level-one': {
						opacity: 0,

						'.level-two': {
							opacity: 0,

							':::active': {
								opacity: 1
							}
						}
					}
				}
			}
		});

		expect(style.toString()).toBe(
			'.react-view.react-test.react-test_state-active.react-test_state-visible .react-test_level-one .react-test_level-two {opacity:1;}\n' +
			'.react-view.react-test.react-test_state-visible .react-test_level-one {opacity:0;}\n' +
			'.react-view.react-test.react-test_state-visible .react-test_level-one .react-test_level-two {opacity:0;}'
		);
	});	

	it('can transform a multiple single selector', function () {
		var style = new Style('Test', {
			'.item1.item2.item3': {
				opacity: 0
			}
		});

		expect(style.toString()).toBe(
			'.react-view.react-test .react-test_item1.react-test_item2.react-test_item3 {opacity:0;}'
		);
	});	

	it('can transform a multiple single selector with nested selectors', function () {
		var style = new Style('Test', {
			'.item1.item2.item3': {
				opacity: 0,

				'.level-one': {
					opacity: 0,

					'.level-two': {
						opacity: 0,

						':hover': {
							opacity: 1
						}
					}
				}
			}
		});

		expect(style.toString()).toBe(
			'.react-view.react-test .react-test_item1.react-test_item2.react-test_item3 {opacity:0;}\n' +
			'.react-view.react-test .react-test_item1.react-test_item2.react-test_item3 .react-test_level-one {opacity:0;}\n' +
			'.react-view.react-test .react-test_item1.react-test_item2.react-test_item3 .react-test_level-one .react-test_level-two {opacity:0;}\n' +
			'.react-view.react-test .react-test_item1.react-test_item2.react-test_item3 .react-test_level-one .react-test_level-two:hover {opacity:1;}'
		);
	});	

	it('can transform "parent > child" selectors', function() {
		var style = new Style('Test', {
			'.level-one > .level-two': {
				opacity: 1
			}
		});

		expect(style.toString()).toBe(
			'.react-view.react-test .react-test_level-one > .react-test_level-two {opacity:1;}'
		);
	});

	it('can transform nested "parent > child" selectors', function() {
		var style = new Style('Test', {
			'.level-one': {
				opacity: 1,

				'> .level-two': {
					opacity: 1,

					'> .level-three': {
						opacity: 1
					}
				}
			}
		});

		expect(style.toString()).toBe(
			'.react-view.react-test .react-test_level-one {opacity:1;}\n' +
			'.react-view.react-test .react-test_level-one > .react-test_level-two {opacity:1;}\n' +
			'.react-view.react-test .react-test_level-one > .react-test_level-two > .react-test_level-three {opacity:1;}'
		);
	});

	it('can transform ~ selectors', function () {
		var style = new Style('Test', {
			'.item-one': {
				opacity: 1,

				'~ .item-two': {
					opacity: 1
				}
			}
		});

		expect(style.toString()).toBe(
			'.react-view.react-test .react-test_item-one {opacity:1;}\n' +
			'.react-view.react-test .react-test_item-one ~ .react-test_item-two {opacity:1;}'
		);
	});

	it('can transform [attribute=value] selectors', function () {
		var style = new Style('Test', {
			'.child-one[name="test"]': {
				opacity: 1,

				'.child-two[name]': {
					opacity: 1
				}
			}
		});

		expect(style.toString()).toBe(
			'.react-view.react-test .react-test_child-one[name="test"] {opacity:1;}\n' +
			'.react-view.react-test .react-test_child-one[name="test"] .react-test_child-two[name] {opacity:1;}'
		);
	});

	it('can resolve multiple references to the same selector', function () {
		var style = new Style('Test', {
			'.one': {
				width: '100px'
			},

			'.one, .two': {
				opacity: 1
			}
		});

		expect(style.toString()).toBe(
			'.react-view.react-test .react-test_one {opacity:1;width:100px;}\n' +
			'.react-view.react-test .react-test_two {opacity:1;}'
		);
	});

	it('can resolve multiple references to the same selector (nested)', function () {
		var style = new Style('Test', {
			'view': {
				':hover': {
					width: '100px'
				}
			},

			'view:hover': {
				opacity: 1
			}
		});

		expect(style.toString()).toBe(
			'.react-view.react-test:hover {opacity:1;width:100px;}'
		);
	});
});