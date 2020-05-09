const Language = {

  puncmap : {
    NUM_BLOCK: ";" ,
    DEC_LEFT: "..." ,
    DEC_RIGHT: "," ,
    VEC2: "." ,
    VEC3: "-" ,
    COMMENT: "!" ,
  },

  types : {
    OP: "OP",
    NUM: "NUM",
    LOOP: "LOOP",
  },

  words: {
    "x" : {type: "VAR", operands: 0},
    "y" : {type: "VAR", operands: 0},
    "t" : {type: "VAR", operands: 0},

    "+" : {type: "BOP", operands: 2},
    "*" : {type: "BOP", operands: 2},
    "/" : {type: "BOP", operands: 2},
    "-" : {type: "BOP", operands: 2},

    "radians" : {type: "FN", operands: 1},
    "degrees" : {type: "FN", operands: 1},
    "sin" : {type: "FN", operands: 1},
    "cos" : {type: "FN", operands: 1},
    "tan" : {type: "FN", operands: 1},
    "asin" : {type: "FN", operands: 1},
    "acos" : {type: "FN", operands: 1},
    "atan" : {type: "FN", operands: 1},
    "abs" : {type: "FN", operands: 1},
    "sqrt" : {type: "FN", operands: 1},
    "sign" : {type: "FN", operands: 1},
    "floor" : {type: "FN", operands: 1},
    "ceil" : {type: "FN", operands: 1},
    "fract" : {type: "FN", operands: 1},

    "pow" : {type: "FN", operands: 2},
    "mod" : {type: "FN", operands: 2},
    "min" : {type: "FN", operands: 2},
    "max" : {type: "FN", operands: 2},
    "step" : {type: "FN", operands: 2},

    "smoothstep" : {type: "FN", operands: 3},
    "mix" : {type: "FN", operands: 3},
    "clamp" : {type: "FN", operands: 3},

    "length" : {type: "RDC", operands: 1},
    "distance" : {type: "RDC", operands: 2},
    "noise" : {type: "RDC", operands: 1},
    "fbm" : {type: "RDC", operands: 1},

    "swap" : {type: "STK", operands: 2},
    "rotate" : {type: "STK", operands: 1},
    "dup" : {type: "STK", operands: 1},
    "drop" : {type: "STK", operands: 1},
  },

  opBuckets: [  ]
}

for(const k in Language.words) {
  let i = Language.words[k].operands;
  if(!Language.opBuckets[i]) { Language.opBuckets[i] = [k] }
  else { Language.opBuckets[i].push(k) };
}


module.exports = Language;
