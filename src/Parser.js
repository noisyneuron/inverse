let Node = require('./Node');
let Language = require('./Language');

let getWordCount = (str) => {
  return str.split(' ').filter(x=>x.length>0).length;
}

let parseNumber = (str) => {
  if(str.includes(Language.puncmap.DEC_LEFT)) {
    let parts = str.split(Language.puncmap.DEC_LEFT);
    return getWordCount(parts[0]) / 10**(getWordCount(parts[1]));
  }
  else if(str.includes(Language.puncmap.DEC_RIGHT)) {
    let parts = str.split(Language.puncmap.DEC_RIGHT);
    return getWordCount(parts[0]) * 10**(getWordCount(parts[1]));
  }
  else {
    return getWordCount(str);
  }
}


let Parser = function(program, mapping) {
  let numStack = [];
  let stack = [];
  let lines = program.trim().toLowerCase().split('\n');

  for(let i=0; i<lines.length; i++) {
    let line = lines[i];

    if(!line.includes(Language.puncmap.COMMENT)) {
      // NUMBER BLOCK
      if(line.includes(Language.puncmap.NUM_BLOCK)) {
        numStack.push(parseNumber(line));
        if(numStack.length>1) { // if its a closing block
          let num = numStack.reduce( (a,e) => a+e );
          let n = new Node(Language.types.NUM, num, null, numStack.length);
          stack.push(n);
          numStack = [];
        }
      }

      // NORMAL NUMBER
      else if(line.includes(Language.puncmap.DEC_LEFT) || line.includes(Language.puncmap.DEC_RIGHT)) {
        if(numStack.length>0) {
          numStack.push(parseNumber(line));
        } else {
          stack.push(new Node(Language.types.NUM, parseNumber(line), null, 1));
        }
      }

      // OPERATOR, OR FLUFF
      else {
        let words = line.match(mapping.getRegex()) || [];
        let rand = getWordCount(line);
        for(const word of words) {
          let op = mapping.getOp(word);
          let cnt = 1;
          if(Language.words[op].type !== 'VAR') {
            if(line.includes(Language.puncmap.VEC2)) { cnt = 2; }
            else if(line.includes(Language.puncmap.VEC3)) { cnt = 3; }
          }
          let node = new Node(Language.types.OP, op, cnt, rand);
          stack.push(node);
        }
      }
    }
  }
  return stack;
}

module.exports = Parser;
