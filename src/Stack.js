function Stack() {
  this.store = []
}


Stack.prototype.size = function() {
  return this.store.length;
}

Stack.prototype.clear = function() {
  this.store = [];
}

Stack.prototype.push = function(v) {
  if(Array.isArray(v)) {
    this.store.push(...v);
  } else {
    this.store.push(v);
  }
};

Stack.prototype.pop = function(count=1, size=1) {
  let res = [];
  for(let i=0; i<count; i++) {
    let val = [];
    for(let j=0;j<size;j++) {
      val.push(this.store.pop() || null);
    }
    val.reverse();
    res.push(val);
  }
  return res.reverse();
}

Stack.prototype.dup = function(size=1) {
  let top = this.pop(1, size);
  top.forEach( t => this.push(t) );
  top.forEach( t => this.push(t) );
}

Stack.prototype.swap = function(size=1) {
  let top = this.pop(2, size);
  this.push(top[1]);
  this.push(top[0]);
}

Stack.prototype.rotate = function(size=1) {
  let end = this.store.splice(size);
  let start = this.store;
  this.store = end;
  this.push(start);
}

Stack.prototype.drop = function(size=1) {
  this.pop(1,size);
}

Stack.prototype.toString = function() {
  return this.store.join(' | ');
}


module.exports = Stack;
