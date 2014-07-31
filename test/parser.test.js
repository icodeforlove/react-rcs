var Parser = require('../parser');

describe('The Parser', function() {
  it('can parse an empty string', function() {
    var result = Parser.parseRCS('');
    expect(typeof result === 'object').toBe(true);
  });

  it('can parse an empty view', function() {
    var result = Parser.parseRCS('\
      view {\n\
      }', this.description);
    
    expect(!!result.view).toBe(true);
  });

  it('can parse a view with properties (no space)', function() {
    var result = Parser.parseRCS('\
      view{\n\
        width:1px;\n\
      }', this.description);
    
    expect(!!result.view).toBe(true);
    expect(result.view.width).toBe('1px');
  });

  it('can parse a view with properties (space)', function() {
    var result = Parser.parseRCS('\
      view {\n\
        width: 1px;\n\
      }', this.description);
    
    expect(!!result.view).toBe(true);
    expect(result.view.width).toBe('1px');
  });

  it('can parse a standard selector', function() {
    var result = Parser.parseRCS('\
      .box {\n\
        width: 1px;\n\
      }', this.description);
    
    expect(!!result['.box']).toBe(true);
    expect(result['.box'].width).toBe('1px');
  });

  it('can parse a standard selector with a pseudo-class', function() {
    var result = Parser.parseRCS('\
      .box:hover {\n\
        width: 1px;\n\
      }', this.description);
    
    expect(!!result['.box:hover']).toBe(true);
    expect(result['.box:hover'].width).toBe('1px');
  });

  it('can parse a standard selector with multiple pseudo-classes', function() {
    var result = Parser.parseRCS('\
      .box:hover::before {\n\
        width: 1px;\n\
      }', this.description);
    
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
      }', this.description);
    
    expect(!!result.view).toBe(true);
    expect(result.view.width).toBe('1px');
    expect(!!result.view['.box']).toBe(true);
    expect(result.view['.box'].width).toBe('1px');
  });

  it('can parse media queries', function() {
    var result = Parser.parseRCS('\
      @media (min-width: 700px) and (orientation: landscape) {\n\
        \n\
      }', this.description);
    
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
      }', this.description);
    
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
      }', this.description);
    
    var root = result['@keyframes name'];
    expect(!!root).toBe(true);
    expect(!!root['0%']).toBe(true);
    expect(root['0%'].opacity).toBe('1');
    expect(!!root['50%']).toBe(true);
    expect(root['50%'].opacity).toBe('.5');
    expect(!!root['100%']).toBe(true);
    expect(root['100%'].opacity).toBe('0');
  });

  it('can parse escaped unicode characters', function() {
    var result = Parser.parseRCS('\
      view{\n\
        content: "\\f081";\n\
      }', this.description);
    
    var root = result.view;
    
    expect(!!root).toBe(true);
    expect(root.content).toBe('"\\f081"');
  });

  it('can parse escaped unicode characters', function() {
    var result = Parser.parseRCS('\
      view{\n\
        content: "❥";\n\
      }', this.description);
    
    var root = result.view;
    
    expect(!!root).toBe(true);
    expect(root.content).toBe('"❥"');
  });

  it('can parse unicode in selector', function() {
    var result = Parser.parseRCS('\
      @media screen and min-width 0 \\0{\n\
        view{\n\
          opacity: 1;\n\
        }\n\
      }', this.description);
    
    var root = result['@media screen and min-width 0 \\0'];
    expect(!!root).toBe(true);
    expect(!!root.view).toBe(true);
    expect(root.view.opacity).toBe('1');
  });

  it('can parse variables', function() {
    var result = Parser.parseRCS('\
      $color: #ffffff;\n\
      \
      view{\n\
        color: $color;\n\
      }\
      ', this.description);

    var root = result.view;
    expect(!!root).toBe(true);
    expect(root.color).toBe('#ffffff');
  });

  it('can parse variables refrencing variables', function() {
    var result = Parser.parseRCS('\
      $red: #ff0000;\n\
      $viewColor: $red;\n\
      \
      view{\n\
        color: $viewColor;\n\
      }\
      ', this.description);

    var root = result.view;
    expect(!!root).toBe(true);
    expect(root.color).toBe('#ff0000');
  });

  it('can error on duplicate variable definition', function() {
   var errorMessage;

    try {
      Parser.parseRCS('\
      $color: #ffffff;\n\
      ', this.description);
    } catch (error) {
      errorMessage = error.message;
    }

    expect(errorMessage).toBe('RCS DuplicateVariableDefinition: "$color" has already been defined');
  });

  it('can use previously defined variables', function() {
    var result = Parser.parseRCS('\
      view{\n\
        color: $viewColor;\n\
      }\
      ', this.description);

    var root = result.view;
    expect(!!root).toBe(true);
    expect(root.color).toBe('#ff0000');
  });

  it('can error on reference to undefined variable', function() {
   var errorMessage;

    try {
      Parser.parseRCS('\
      view{\n\
        color: $viewColor2;\n\
      }\
      ', this.description);
    } catch (error) {
      errorMessage = error.message;
    }

    expect(errorMessage).toBe('RCS ReferenceError: "$viewColor2" is not defined');
  });

  it('can process inline javascirpt', function() {
    var result = Parser.parseRCS('\
      view{\n\
        \
        ${{\n\
          var string = "";\n\
          for (var i = 0; i<2; i++) {\n\
            string+= ".box" + i + " {width: " + i + "px;\\ncolor: $red;}\\n";\n\
          }\n\
          return string;\n\
        }}$\n\
      }\
      ', this.description);

    expect(!!result.view['.box0']).toBe(true);
    expect(result.view['.box0'].width).toBe('0px');
    expect(result.view['.box0'].color).toBe('#ff0000');
    expect(!!result.view['.box1']).toBe(true);
    expect(result.view['.box1'].width).toBe('1px');
    expect(result.view['.box1'].color).toBe('#ff0000');
  });

  it('can process function definitions', function() {
    var result = Parser.parseRCS('\
      @define add (a, b) ${{\n\
        return parseInt(a, 10) + parseInt(b, 10);\n\
      }}$\n\
      ', this.description);

    expect(JSON.stringify(result)).toBe('{}');
  });

  it('can error on duplicate function definitions', function() {
    var errorMessage;

    try {
      Parser.parseRCS('\
        @define add (a, b) ${{\n\
          return a + b;\n\
        }}$\n\
        ', this.description);
    } catch (error) {
      errorMessage = error.message;
    }

    expect(errorMessage).toBe('RCS DuplicateFunctionDefinition: "add" has already been defined');
  });

  it('can process function definition calls', function() {
    var result = Parser.parseRCS('\
      view{\n\
        width: @add(1,2);\n\
      }', this.description);

    expect(result.view.width).toBe('3');
  });

  it('can process inline function calls with variable references', function() {
    var result = Parser.parseRCS('\
      $width: 500;\n\
      view{\n\
        width: ${this.functions.add(this.variables.width,2)}$;\n\
      }', this.description);

    expect(result.view.width).toBe('502');
  });
});