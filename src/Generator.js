let Language = require('./Language');
let Stack = require('./Stack');
let seedrandom = require('./SeedRandom.js');

let prng;

let transpose = (a) => {
  return a[0].map( (_,i) => a.map( x=> x[i]))
}

let replaceNull = (a) => {
  for(let i=0; i<a.length; i++) {
    let e = a[i];
    for(let j=0; j<e.length; j++) {
      if(e[j] === null) e[j] = prng.quick();
    }
  }
}

let Generator = function(ast) {
  let stack = new Stack();
  prng = seedrandom('random_is_never_truly_random');

  for(const node of ast) {
    for(let i=0;i<node.entropy;i++) prng.quick();

    switch(node.type) {

      case Language.types.NUM:
        let n = Number.isInteger(node.val) ? node.val.toFixed(1) : node.val;
        stack.push( n );
      break;

      case Language.types.OP:
        let sig = Language.words[node.val];

        if(sig.type === "STK") {
          stack[node.val](node.vsize);
        }
        else if (sig.type === "VAR") {
          stack.push( node.val );
        }
        else {
          let operands = stack.pop(sig.operands, node.vsize);
          replaceNull(operands);

          if(sig.type === "RDC") {
            let args;
            if(node.vsize === 2 || node.vsize === 3) {
              args = operands.map( v => `vec${node.vsize}(${v.join(',')})` );
            } else {
              args = operands.map( v => `${v.join(',')}` );
            }
            stack.push( `${node.val}(${args})` );
          }

          else if(sig.type === "BOP") {
            operands = transpose(operands);
            stack.push( operands.map( a => `(${a[0]} ${node.val} ${a[1]})`) );
          }

          else if(sig.type === "FN") {
            operands = transpose(operands);
            stack.push( operands.map( a => `${node.val}(${a.join(',')})` ) );
          }
        }

      break;
    }
  }

  let r = stack.pop(3,1);
  replaceNull(r);
  return `vec3(${r.join(',')})`;
}

module.exports = Generator;
