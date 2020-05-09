var pos = require('pos');
const fs = require('fs');

/* requires word2vec -- currenlty only runs on node 10... to fix */

/* List from : https://github.com/moos/wordpos/blob/master/lib/natural/util/stopwords.js */
const stopwords = [
    'about', 'after', 'all', 'also', 'am', 'an', 'and', 'another', 'any', 'are', 'as', 'at', 'be',
    'because', 'been', 'before', 'being', 'between', 'both', 'but', 'by', 'came', 'can',
    'come', 'could', 'did', 'do', 'each', 'for', 'from', 'get', 'got', 'has', 'had',
    'he', 'have', 'her', 'here', 'him', 'himself', 'his', 'how', 'if', 'in', 'into',
    'is', 'it', 'like', 'make', 'many', 'me', 'might', 'more', 'most', 'much', 'must',
    'my', 'never', 'now', 'of', 'on', 'only', 'or', 'other', 'our', 'out', 'over',
    'said', 'same', 'see', 'should', 'since', 'some', 'still', 'such', 'take', 'than',
    'that', 'the', 'their', 'them', 'then', 'there', 'these', 'they', 'this', 'those',
    'through', 'to', 'too', 'under', 'up', 'very', 'was', 'way', 'we', 'well', 'were',
    'what', 'where', 'which', 'while', 'who', 'with', 'would', 'you', 'your',
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
    'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '$', '1',
    '2', '3', '4', '5', '6', '7', '8', '9', '0', '_',
    "min", "max", "limit", "signs", "next" ];

const poslist = ['NN', 'NNS', 'JJ', 'JJR', 'JJS', 'RB', 'RBR', 'RBS', 'VB', 'VBN', 'VBD', 'VBG', 'VBP', 'VBZ'];



function getMapping(similarities, sortFn, maxTries=10) {
  let list = new Map();

  let setNext = (word) => {
    let idx = list.has(word) ? list.get(word) : -1;
    list.set(word, idx+1);
  }

  let getMap = () => {
    let m = new Map();
    list.forEach( (i,word) => m.set(word, similarities.get(word)[i]) );
    return m;
  }

  let resolveDups = () => {
    let dups = new Map();

    list.forEach( (idx, term) => {
      let entry = similarities.get(term)[idx];
      if( !dups.has(entry.word) ) {
        dups.set(entry.word, [ {word: term, sim: entry.sim} ])
      } else {
        dups.get(entry.word).push( {word: term, sim: entry.sim} );
      }
    });

    dups.forEach( (terms, word) => {
      if(terms.length > 1) {
        let max = Math.max( ...(terms.map(x => x.sim)) );
        terms.forEach( t => {
          if(t.sim < max) setNext(t.word)
        })
      } else {
        dups.delete(word);
      }
    })
    return dups;
  }

  similarities.forEach( (words, term) => {
    words.sort( sortFn );
    setNext(term);
  });

  let dups = resolveDups();
  let i = 0;

  while(dups.size > 0 && i<maxTries) {
    dups = resolveDups();
    i++;
  }

  if(dups.size === 0) {
    return getMap();
  } else {
    return false;
  }
}


function getSimilarities(text, terms, w2v) {

  let allwords = new Set();
  let termvecs = new Map();
  let wordvecs = new Map();
  let similarities = new Map();
  var tagger = new pos.Tagger();
  var taggedWords = tagger.tag( (new pos.Lexer()).lex(text) );

  taggedWords.forEach( ([w,t]) => {
    if( poslist.includes(t)
        && !terms.includes(w)
        && !stopwords.includes(w)
        && !w.includes('\'')
        && w.length >= 3
      )
    {
    allwords.add(w.toLowerCase());
    }
  });

  terms.forEach( (w) => {
    let vec = w2v.getVector(w);
    if(vec !== null) { termvecs.set(w,vec); similarities.set(w,[]); }
    else { console.log(`no vector for word ${w}`) }
  })

  allwords.forEach( (w) => {
    let vec = w2v.getVector(w);
    if(vec !== null) { wordvecs.set(w,vec); }
    else { console.log(`no vector for word ${w}`) }
  })

  termvecs.forEach( (vec1, t) => {
    wordvecs.forEach( (vec2, w) => {
      let s = w2v.similarity(vec1,vec2);
      similarities.get(t).push( {word: w, sim: s} );
    })
  });

  return similarities;
}

module.exports = { getSimilarities, getMapping };
