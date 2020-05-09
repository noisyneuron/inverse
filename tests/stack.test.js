const Stack = require('../src/Stack');


test('pops values', () => {
  let stack = new Stack();
  for(let i=1;i<=12;i++) { stack.push(i); }

  expect( stack.pop() ).toEqual( [ [12] ] );
  expect( stack.pop(1,1) ).toEqual( [ [11] ] );
  expect( stack.pop(2,2) ).toEqual( [ [7,8], [9,10] ] );
  expect( stack.pop(2,3) ).toEqual( [ [1,2,3], [4,5,6] ] );
});

test('returns null instead of underflow', () => {
  let stack = new Stack();
  expect( stack.pop() ).toEqual( null );
});

test('dups values', () => {
  let stack = new Stack();
  for(let i=1;i<=3;i++) { stack.push(i); }

  stack.dup(3);
  stack.dup(2);
  stack.dup(1);
  stack.dup();
  expect( stack.store ).toEqual( [1,2,3,1,2,3,2,3,3,3] );
});

test('swaps values', () => {
  let stack = new Stack();
  for(let i=1;i<=6;i++) { stack.push(i); }

  stack.swap(3);
  stack.swap(2);
  stack.swap(1);
  stack.swap();

  expect( stack.store ).toEqual( [4,5,2,3,6,1] );
});

test('rotates values', () => {
  let stack = new Stack();
  for(let i=1;i<=6;i++) { stack.push(i); }

  stack.rotate(3);
  stack.rotate(2);
  stack.rotate(1);
  stack.rotate();

  expect( stack.store ).toEqual( [2,3,4,5,6,1] );
});

test('drops values', () => {
  let stack = new Stack();
  for(let i=1;i<=10;i++) { stack.push(i); }

  stack.drop(3);
  stack.drop(2);
  stack.drop(1);
  stack.drop();

  expect( stack.store ).toEqual( [1,2,3] );
});
