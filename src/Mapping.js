let Language = require('./Language');

function Mapping(name, wordtable) {

  this.name = name;
  this.baseWordtable = {};
  this.wordtable = {};

  Object.keys(wordtable).forEach( k => {
    if(Language.words[k] !== undefined) {
      this.baseWordtable[k] = wordtable[k];
      this.wordtable[k] = wordtable[k];
    }
  })
  this.modified = false;
}

Mapping.prototype.getRegex = function() {
  return new RegExp(`\\b(${Object.values(this.wordtable).join('|')})\\b`, "gi");
}

Mapping.prototype.shuffle = function() {
  Language.opBuckets.forEach( bucket => {
    let vals = [];
    bucket.forEach( b => {
      let w = this.getWord(b);
      if(w !== undefined) vals.push(w);
    });
    vals.sort((a,b)=>Math.random()*2-1);
    bucket.forEach( (b) => {
      if(this.getWord(b) !== undefined) this.wordtable[b] = vals.pop();
    });
  })
  this.modified = true;
}

Mapping.prototype.getOp = function(word) {
  for(const k in this.wordtable) {
    if(this.wordtable[k] == word) return k;
  }
}

Mapping.prototype.getWord = function(op) {
  return this.wordtable[op];
}

Mapping.prototype.getMapping = function() {
  return this.wordtable;
}

Mapping.prototype.restore = function() {
  this.wordtable = Object.assign(this.wordtable, this.baseWordtable);
  this.modified = false;
}

Mapping.getAllOperators = function() {
  return Object.keys(Language.words);
}

module.exports = Mapping;
