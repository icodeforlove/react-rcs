var Parser = require('../parser');

describe('The Parser', function() {
  it('can parse an empty string', function() {
    var result = Parser.parseRCS('');
    expect(typeof result === 'object').toBe(true);
  });

  it('can parse an empty view', function() {
    var result = Parser.parseRCS('\
      view {\n\
      }'
    );
    expect(!!result.view).toBe(true);
  });

  it('can parse a view with properties (no space)', function() {
    var result = Parser.parseRCS('\
      view{\n\
        width:1px;\n\
      }'
    );
    expect(!!result.view).toBe(true);
    expect(result.view.width).toBe('1px');
  });

  it('can parse a view with properties (space)', function() {
    var result = Parser.parseRCS('\
      view {\n\
        width: 1px;\n\
      }'
    );
    expect(!!result.view).toBe(true);
    expect(result.view.width).toBe('1px');
  });

  it('can parse a standard selector', function() {
    var result = Parser.parseRCS('\
      .box {\n\
        width: 1px;\n\
      }'
    );
    expect(!!result['.box']).toBe(true);
    expect(result['.box'].width).toBe('1px');
  });

  it('can parse a standard selector with a pseudo-class', function() {
    var result = Parser.parseRCS('\
      .box:hover {\n\
        width: 1px;\n\
      }'
    );
    expect(!!result['.box:hover']).toBe(true);
    expect(result['.box:hover'].width).toBe('1px');
  });

  it('can parse a standard selector with multiple pseudo-classes', function() {
    var result = Parser.parseRCS('\
      .box:hover::before {\n\
        width: 1px;\n\
      }'
    );
    expect(!!result['.box:hover::before']).toBe(true);
    expect(result['.box:hover::before'].width).toBe('1px');
  });

  it('can parse nested selectors', function() {
    var result = Parser.parseRCS('\
      view {\n\
        width: 1px;\n\
        .box {\n\
          width: 1px;\n\
        }\n\
      }'
    );
    expect(!!result.view).toBe(true);
    expect(result.view.width).toBe('1px');
    expect(!!result.view['.box']).toBe(true);
    expect(result.view['.box'].width).toBe('1px');
  });

  it('can parse media queries', function() {
    var result = Parser.parseRCS('\
      @media (min-width: 700px) and (orientation: landscape) {\n\
        \n\
      }'
    );
    expect(!!result['@media (min-width: 700px) and (orientation: landscape)']).toBe(true);
  });

  it('can parse media queries with nested selectors', function() {
    var result = Parser.parseRCS('\
      @media (min-width: 700px) and (orientation: landscape) {\n\
        view {\n\
          width: 1px;\n\
          .box {\n\
            width: 1px;\n\
          }\n\
        }\n\
      }'
    );
    var root = result['@media (min-width: 700px) and (orientation: landscape)'];

    expect(!!root).toBe(true);
    expect(!!root.view).toBe(true);
    expect(root.view.width).toBe('1px');
    expect(!!root.view['.box']).toBe(true);
    expect(root.view['.box'].width).toBe('1px');
  });

  it('can parse keyframe animations', function() {
    var result = Parser.parseRCS('\
      @keyframes name {\n\
        0% {\n\
          opacity: 1;\n\
        }\n\
        50% {\n\
          opacity: .5;\n\
        }\n\
        100% {\n\
          opacity: 0;\n\
        }\n\
      }'
    );
    var root = result['@keyframes name'];
    
    expect(!!root).toBe(true);
    expect(!!root['0%']).toBe(true);
    expect(root['0%'].opacity).toBe('1');
    expect(!!root['50%']).toBe(true);
    expect(root['50%'].opacity).toBe('.5');
    expect(!!root['100%']).toBe(true);
    expect(root['100%'].opacity).toBe('0');
  });
});
