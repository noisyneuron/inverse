

/***********************************
  * this is messy code that has been thrown together.
  * much clean up is due.
*************************************/


let canvas = require('./webgl.js');
let Parse = require('../src/Parser');
let Generate = require('../src/Generator');
let Maps = require('./maps.js');
let Mapping = require('../src/Mapping');


let $container = document.querySelector(".container");
let $editor = document.querySelector(".editor__textarea");
let $ops = document.querySelector(".stack .stack__elements");
let $wordTable = document.querySelector(".wordtable__map");
let $sidebar = document.querySelector(".sidebar");
let $examplesHolder = document.querySelector(".sidebar__examples");
let $examples;// = document.querySelectorAll(".sidebar__example");

let $overlay = document.querySelector(".overlay");
let $overlayWrapper = document.querySelector(".overlay__wrapper");
let $mapForm = document.querySelector(".map__form");
let $mapTitle = document.querySelector("#map__title");

let $file = document.querySelector("#file");
let $saveTitle = document.querySelector("#save__title");
let $saveAuthor = document.querySelector("#save__author");
let $publishTitle = document.querySelector("#publish__title");
let $publishAuthor = document.querySelector("#publish__author");
let $publishTwitter = document.querySelector("#publish__twitter");
let $pubUrl = document.querySelector("#published__url");
let $publishForm = document.querySelector("#publish__form");

let $mapSelect = document.querySelector(".dropdown");
let $showExamples = document.querySelector(".button-examples");
let $shuffle = document.querySelector(".button-shuffle");
let $restore = document.querySelector(".button-restore");
let $save = document.querySelector(".button-save");
let $load = document.querySelector(".button-load");
let $publish = document.querySelector(".button-publish");
let $download = document.querySelector(".button-download");
let $close = document.querySelector(".button-close");
let $createmap = document.querySelector(".button-createmap");
let $makemap = document.querySelector(".button-makemap");
let $nextEg = document.querySelector(".button-next");
let $prevEg = document.querySelector(".button-prev");
let $about = document.querySelector(".button-about");


let SERVER_URL = "https://api.inverse.website/";
if(process.env.NODE_ENV !== "production") {
  SERVER_URL = "http://localhost:3000/";
}
let currentMapIdx = 0;
let customMapCount = 0;
let currentEgIdx = 0;
let PARENT = null;

let stacks = [
  {"stack":[{"type":"OP","val":"x","vsize":1,"entropy":2},{"type":"OP","val":"fbm","vsize":1,"entropy":2},{"type":"OP","val":"y","vsize":1,"entropy":2},{"type":"OP","val":"fbm","vsize":1,"entropy":2},{"type":"OP","val":"t","vsize":1,"entropy":2},{"type":"OP","val":"sin","vsize":1,"entropy":2},{"type":"OP","val":"t","vsize":1,"entropy":2},{"type":"OP","val":"cos","vsize":1,"entropy":2},{"type":"OP","val":"distance","vsize":2,"entropy":1},{"type":"NUM","val":10,"vsize":null,"entropy":1},{"type":"OP","val":"*","vsize":1,"entropy":2},{"type":"OP","val":"fract","vsize":1,"entropy":2}]},
  {"stack":[{"type":"OP","val":"x","vsize":1,"entropy":2},{"type":"OP","val":"y","vsize":1,"entropy":2},{"type":"OP","val":"fbm","vsize":2,"entropy":1},{"type":"NUM","val":4,"vsize":null,"entropy":1},{"type":"NUM","val":4,"vsize":null,"entropy":1},{"type":"OP","val":"*","vsize":2,"entropy":5},{"type":"OP","val":"dup","vsize":2,"entropy":5},{"type":"OP","val":"fract","vsize":2,"entropy":5},{"type":"OP","val":"swap","vsize":2,"entropy":5},{"type":"OP","val":"floor","vsize":2,"entropy":5},{"type":"OP","val":"t","vsize":1,"entropy":2},{"type":"OP","val":"t","vsize":1,"entropy":2},{"type":"OP","val":"+","vsize":2,"entropy":3},{"type":"OP","val":"sin","vsize":2,"entropy":3},{"type":"OP","val":"distance","vsize":2,"entropy":3},{"type":"OP","val":"dup","vsize":1,"entropy":1}]},
  {"stack":[{"type":"OP","val":"x","vsize":1,"entropy":4},{"type":"OP","val":"t","vsize":1,"entropy":4},{"type":"OP","val":"+","vsize":1,"entropy":4},{"type":"OP","val":"fbm","vsize":1,"entropy":4},{"type":"NUM","val":10,"vsize":null,"entropy":1},{"type":"OP","val":"*","vsize":1,"entropy":3},{"type":"OP","val":"t","vsize":1,"entropy":3},{"type":"OP","val":"sin","vsize":1,"entropy":3},{"type":"OP","val":"+","vsize":1,"entropy":1},{"type":"OP","val":"sin","vsize":1,"entropy":3},{"type":"OP","val":"y","vsize":1,"entropy":3},{"type":"OP","val":"distance","vsize":1,"entropy":3},{"type":"NUM","val":0.2,"vsize":null,"entropy":1},{"type":"NUM","val":0.4,"vsize":null,"entropy":1},{"type":"OP","val":"smoothstep","vsize":1,"entropy":1}]},
  {"stack":[{"type":"OP","val":"x","vsize":1,"entropy":2},{"type":"OP","val":"y","vsize":1,"entropy":2},{"type":"NUM","val":10,"vsize":null,"entropy":1},{"type":"NUM","val":10,"vsize":null,"entropy":1},{"type":"OP","val":"*","vsize":2,"entropy":5},{"type":"OP","val":"dup","vsize":2,"entropy":5},{"type":"OP","val":"fract","vsize":2,"entropy":5},{"type":"OP","val":"swap","vsize":2,"entropy":5},{"type":"OP","val":"floor","vsize":2,"entropy":5},{"type":"OP","val":"t","vsize":1,"entropy":2},{"type":"OP","val":"t","vsize":1,"entropy":2},{"type":"OP","val":"+","vsize":2,"entropy":1},{"type":"OP","val":"cos","vsize":1,"entropy":3},{"type":"OP","val":"swap","vsize":1,"entropy":3},{"type":"OP","val":"sin","vsize":1,"entropy":3},{"type":"OP","val":"distance","vsize":2,"entropy":1},{"type":"NUM","val":3,"vsize":null,"entropy":1},{"type":"OP","val":"*","vsize":1,"entropy":2},{"type":"OP","val":"fract","vsize":1,"entropy":2}]},
  {"stack":[{"type":"OP","val":"x","vsize":1,"entropy":2},{"type":"OP","val":"y","vsize":1,"entropy":2},{"type":"OP","val":"y","vsize":1,"entropy":2},{"type":"OP","val":"x","vsize":1,"entropy":2},{"type":"NUM","val":0.001,"vsize":null,"entropy":1},{"type":"NUM","val":0.01,"vsize":null,"entropy":1},{"type":"OP","val":"*","vsize":2,"entropy":1},{"type":"OP","val":"/","vsize":1,"entropy":2},{"type":"OP","val":"atan","vsize":1,"entropy":2},{"type":"OP","val":"t","vsize":1,"entropy":3},{"type":"OP","val":"+","vsize":1,"entropy":3},{"type":"OP","val":"fbm","vsize":1,"entropy":3},{"type":"OP","val":"dup","vsize":1,"entropy":1},{"type":"OP","val":"distance","vsize":2,"entropy":1},{"type":"NUM","val":3,"vsize":null,"entropy":1},{"type":"OP","val":"*","vsize":1,"entropy":2},{"type":"OP","val":"fract","vsize":1,"entropy":2}]},
  {"stack":[{"type":"OP","val":"x","vsize":1,"entropy":2},{"type":"OP","val":"y","vsize":1,"entropy":2},{"type":"OP","val":"abs","vsize":2,"entropy":1},{"type":"OP","val":"max","vsize":1,"entropy":3},{"type":"OP","val":"t","vsize":1,"entropy":3},{"type":"OP","val":"sin","vsize":1,"entropy":3},{"type":"NUM","val":10,"vsize":null,"entropy":1},{"type":"OP","val":"*","vsize":1,"entropy":6},{"type":"OP","val":"*","vsize":1,"entropy":6},{"type":"OP","val":"dup","vsize":1,"entropy":6},{"type":"OP","val":"cos","vsize":1,"entropy":6},{"type":"OP","val":"swap","vsize":1,"entropy":6},{"type":"OP","val":"sin","vsize":1,"entropy":6},{"type":"OP","val":"dup","vsize":2,"entropy":1},{"type":"OP","val":"x","vsize":1,"entropy":2},{"type":"OP","val":"y","vsize":1,"entropy":2},{"type":"OP","val":"*","vsize":2,"entropy":1},{"type":"OP","val":"-","vsize":1,"entropy":5},{"type":"OP","val":"rotate","vsize":1,"entropy":5},{"type":"OP","val":"rotate","vsize":1,"entropy":5},{"type":"OP","val":"y","vsize":1,"entropy":5},{"type":"OP","val":"x","vsize":1,"entropy":5},{"type":"OP","val":"*","vsize":2,"entropy":1},{"type":"OP","val":"+","vsize":1,"entropy":1},{"type":"OP","val":"abs","vsize":2,"entropy":1},{"type":"OP","val":"max","vsize":1,"entropy":1},{"type":"NUM","val":4,"vsize":null,"entropy":1},{"type":"OP","val":"*","vsize":1,"entropy":2},{"type":"OP","val":"fract","vsize":1,"entropy":2}]}
]

let displayMapOptions = () => {
  let str = '';
  Maps.forEach( (k, i) => {
    str += `<option value=${i} ${i===currentMapIdx ? 'selected' : ''}> ${k.name} </option>`;
  })
  $mapSelect.innerHTML = str;
}

let displayMapping = () => {
  let str = '';
  let m = Maps[currentMapIdx].getMapping();
  for(const k in m) {
    str += `<p>${k}</p> <p>${m[k]}</p>`;
  }
  $wordTable.innerHTML = str;
}

let displayOps = (ops) => {
  let str = '';
  ops.forEach( o => {
    str += `<div class="stack__element" data-count="${o.vsize > 1 ? o.vsize : ''}"> ${o.val} </div>`;
  })
  $ops.innerHTML = str;
}

let compile = () => {
  let program = $editor.value;
  let nodes = Parse(program, Maps[currentMapIdx]);
  let glsl = Generate(nodes);
  canvas.updateShader(glsl);
  displayOps(nodes);
  console.log(glsl);
  return { nodes, glsl }
}

let loadNewMapping = (name, table) => {
  let newMap = new Mapping(name, table);
  Maps.push(newMap);
  currentMapIdx = Maps.length - 1;
  displayMapOptions();
  displayMapping();
}

let loadProgram = (data) => {
  $editor.value = unescape(data.program);
  let m = Maps.findIndex( x => x.name==data.map.name);
  if(data.map.modified || m === -1) {
    loadNewMapping("*" + data.map.name, data.map.table);
  } else {
    $mapSelect.value = m;
  }
  $mapSelect.dispatchEvent(new Event('change'));
}

let getSaveData = () => {
  let p = $editor.value;
  let m = Maps[currentMapIdx];
  let res = compile();
  let data = {
    program: p,
    output: res.glsl,
    map: {
      name: m.name[0] === "*" ? m.name.substr(1) : m.name,
      table: m.getMapping(),
      modified: m.modified
    },
    parent: PARENT
    // ,stack: res.nodes
  };
  return data;
}

let saveFile = () => {
  let data = getSaveData();
  data.title= $saveTitle.value || 'Untitled';
  data.author= $saveAuthor.value || 'Anonymous';
  let blob = new Blob([JSON.stringify(data)], {type: 'application/json'});
  let url = URL.createObjectURL(blob);
  let a = document.createElement("a");
  a.href = url;
  a.download = `${data.title}-${data.author}-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  setTimeout(function() {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
  }, 1000);
}

let publish = () => {
  let data = getSaveData();
  data.title= $publishTitle.value || 'Untitled';
  data.author= $publishAuthor.value || 'Anonymous';
  data.twitter= $publishTwitter.value;

  canvas.captureImage()
  .then( isrc => {
    data.img = isrc;
    // console.log(data.img);
    return fetch(`${SERVER_URL}publish`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify(data),
    })
  })
  .then(response => response.json())
  .then(data => {
    $pubUrl.innerText = data.url;
    $pubUrl.href = data.url;
    openOverlay('published');
  })
  .catch((error) => {
    alert(`Error: ${error}`)
  });
}

let openOverlay = (name) => {
  $overlay.classList.add('visible');
  if(document.querySelector(`.overlay__content.visible`)) {
    document.querySelector(`.overlay__content.visible`).classList.remove("visible");
  }
  document.querySelector(`.overlay__content-${name}`).classList.add("visible");
}

let closeOverlay = () => {
  $overlay.classList.remove('visible');
  document.querySelector(`.overlay__content.visible`).classList.remove("visible");
}

let populateMapForm = () => {
  let ops = Mapping.getAllOperators();
  let str = '';
  ops.forEach( o => {
    str += `
      <p> ${o} </p>
      <input type="text" data-op=${o} />
    `;
  })
  $mapForm.innerHTML = str;
}

let saveMap = () => {
  let vals = $mapForm.querySelectorAll('input');
  let blanks = [...vals].filter( v => v.value.trim().length === 0);
  if(blanks.length > 0) {
    alert('Please fill out all the entire table.'); // ADD CASE TO PREVENT SPECIAL CHARS
  } else {
    let words = {};
    vals.forEach( v => {
      let w = v.value.trim().toLowerCase();
      if( words[w] === undefined) { words[w] = [ v.dataset.op ];}
      else { words[w].push(v.dataset.op); }
    });

    let str = ``;
    for(const k in words) {
      if(words[k].length > 1) {
        str += `The word "${k}" has been assigned to ${words[k].join(', ')}.\n`;
      }
    }
    if(str.length > 0) {
      alert("FOUND DUPLICATES:\n" + str);
    } else {
      let wt = {};
      vals.forEach( v => wt[v.dataset.op] = v.value.trim().toLowerCase() );
      let n = $mapTitle.value.trim();
      if(n.length === 0) {
        customMapCount++;
        n = `custom_${customMapCount}`;
      }
      loadNewMapping(n, wt);
      closeOverlay();
    }
  }
}

let changeExample = (dir) => {
  $examples[currentEgIdx].classList.remove('active');
  currentEgIdx = currentEgIdx+dir > $examples.length-1 ? 0 : currentEgIdx+dir;
  currentEgIdx = currentEgIdx < 0 ? $examples.length-1 : currentEgIdx;
  $examples[currentEgIdx].classList.add('active');
}

let loadExamples = () => {
  let str = ``;
  stacks.forEach( (obj, i) => {
    str += `<div class="sidebar__example stack__elements ${i===currentEgIdx ? 'active' : ''}">`;
    obj.stack.forEach( s => {
      str += `<div class="stack__element stack__element-inverted" data-count="${s.vsize > 1 ? s.vsize : ''}"> ${s.val} </div>`;
    })
    str += `</div>`;
  })
  $examplesHolder.innerHTML = str;
  $examples = document.querySelectorAll(".sidebar__example");
}



$shuffle.addEventListener('click', () => {
  Maps[currentMapIdx].shuffle();
  displayMapping();
  compile();
});

$restore.addEventListener('click', () => {
  Maps[currentMapIdx].restore();
  displayMapping();
  compile();
});

$mapSelect.addEventListener('change', () => {
  currentMapIdx = parseInt($mapSelect.value);
  displayMapping();
  compile();
});

$editor.addEventListener('keydown', (e) => {
  if(e.code === "Enter") {
    compile();
  }
});

$save.addEventListener('click', (e) => {
  openOverlay('save');
});

$download.addEventListener('click', saveFile);

$publish.addEventListener('click', () => {
  openOverlay('publish');
});

// $post.addEventListener('click', publish);
$publishForm.addEventListener("submit", (e) => {
  e.preventDefault();
  publish();
})

$load.addEventListener('click', (e) => {
  $file.click();
});

$file.addEventListener('change', (e) => {
  if(e.target.files.length > 0) {
    let reader = new FileReader();
    reader.onload = (e) => {
      let content = e.target.result;
      try {
        loadProgram(JSON.parse(content));
      }
      catch(e) {
        alert('This does not seem to be a valid JSON file');
      }
    }
    reader.readAsText(event.target.files[0]);
  }
})

$close.addEventListener('click', closeOverlay);

$makemap.addEventListener('click', saveMap);

$createmap.addEventListener('click', (e) => {
  openOverlay('makemap');
});

$about.addEventListener('click', (e) => {
  openOverlay('about');
});

$showExamples.addEventListener('click', () => {
  $container.classList.toggle('container-split');
});

$nextEg.addEventListener('click', () => {
  changeExample(1);
});

$prevEg.addEventListener('click', () => {
  changeExample(-1);
});

$overlayWrapper.addEventListener('click', (e) => {
  e.stopPropagation();
});

$overlay.addEventListener('click', closeOverlay);

let init = () => {
  canvas.init();
  displayMapOptions();
  displayMapping();
  populateMapForm();
  loadExamples();
}

let loadSketch = () => {
  let params = (new URL(document.location)).searchParams;
  let s = params.get('sketch');
  if(s) {
    let url = `${SERVER_URL}sketch/${s}`;
    fetch(url)
    .then( r => r.json() )
    .then( data => {
      init();
      if(data.sketch) {
        PARENT = s;
        loadProgram(data.sketch);
      }
    })
    .catch( e => {
      init();
    });
  } else {
    init();
  }
}

loadSketch();
