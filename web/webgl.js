const canvas = document.querySelector("#glCanvas");
const gl = canvas.getContext("webgl");
if(gl === null) { alert("no webgl"); }

const fragBase = `
  precision mediump float;
  #define NUM_OCTAVES 5
  uniform vec2 uResolution;
  uniform float time;
  float rand(float n){return fract(sin(n) * 43758.5453123);}
  float rand(vec2 n) { return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453); }
  float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
  vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
  vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}
  float noise(float p){
	  float fl = floor(p);
    float fc = fract(p);
    return mix(rand(fl), rand(fl + 1.0), fc);
  }
  float noise(vec2 p){
  	vec2 ip = floor(p);
  	vec2 u = fract(p);
  	u = u*u*(3.0-2.0*u);
  	float res = mix(
  		mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
  		mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
  	return res*res;
  }
  float noise(vec3 p){
    vec3 a = floor(p);
    vec3 d = p - a;
    d = d * d * (3.0 - 2.0 * d);
    vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
    vec4 k1 = perm(b.xyxy);
    vec4 k2 = perm(k1.xyxy + b.zzww);
    vec4 c = k2 + a.zzzz;
    vec4 k3 = perm(c);
    vec4 k4 = perm(c + 1.0);
    vec4 o1 = fract(k3 * (1.0 / 41.0));
    vec4 o2 = fract(k4 * (1.0 / 41.0));
    vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
    vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);
    return o4.y * d.y + o4.x * (1.0 - d.y);
  }
  float fbm(float x) {
  	float v = 0.0;
  	float a = 0.5;
  	float shift = float(100);
  	for (int i = 0; i < NUM_OCTAVES; ++i) {
  		v += a * noise(x);
  		x = x * 2.0 + shift;
  		a *= 0.5;
  	}
  	return v;
  }
  float fbm(vec2 x) {
  	float v = 0.0;
  	float a = 0.5;
  	vec2 shift = vec2(100);
  	// Rotate to reduce axial bias
      mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
  	for (int i = 0; i < NUM_OCTAVES; ++i) {
  		v += a * noise(x);
  		x = rot * x * 2.0 + shift;
  		a *= 0.5;
  	}
  	return v;
  }
  float fbm(vec3 x) {
  	float v = 0.0;
  	float a = 0.5;
  	vec3 shift = vec3(100);
  	for (int i = 0; i < NUM_OCTAVES; ++i) {
  		v += a * noise(x);
  		x = x * 2.0 + shift;
  		a *= 0.5;
  	}
  	return v;
  }
  void main() {
    vec2 pos = 2.*(gl_FragCoord.xy - 0.5*uResolution.xy) / min(uResolution.x, uResolution.y);
    float x = pos.x;
    float y = pos.y;
    float t = time;
    gl_FragColor =
  `;

const shaders = {
  vert : `
  attribute vec4 aVertexPosition;
  void main() {
    gl_Position = aVertexPosition;
  }
  `,
  frag: `
  precision mediump float;
  uniform vec2 uResolution;
  uniform float time;
  void main() {
    vec2 pos = 2.*(gl_FragCoord.xy - 0.5*uResolution.xy) / min(uResolution.x, uResolution.y);
    gl_FragColor = vec4(sin(time+pos.x*2.), 0.14, 0.34, 1.0);
  }
  `
};
const fragLocations = {
  timeLoc: null,
  resLoc: null,
}

const program = createProgram();

function init() {
  const vertexArray = new Float32Array([
      -1., 1., 1., 1., 1., -1.,
      -1., 1., 1., -1., -1., -1.
  ]);
  const vertexNumComponents = 2;
  const vertexCount = vertexArray.length/vertexNumComponents;
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertexArray, gl.STATIC_DRAW);
  gl.useProgram(program);

  const aVertexPosition = gl.getAttribLocation(program, "aVertexPosition");
  gl.enableVertexAttribArray(aVertexPosition);
  gl.vertexAttribPointer(aVertexPosition, vertexNumComponents, gl.FLOAT, false, 0, 0);

  bindLocations(gl, program, fragLocations);

  let animate = function(t) {
    if(canvas.clientWidth !== canvas.width) canvas.width = canvas.clientWidth;
    if(canvas.clientHeight !== canvas.height) canvas.height = canvas.clientHeight;
    gl.viewport(0,0,canvas.width, canvas.height);
    gl.uniform2fv(fragLocations.resLoc, [canvas.width, canvas.height]);

    gl.uniform1f(fragLocations.timeLoc, t/1000);
    gl.clearColor(1., 1., 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, vertexCount);

    window.requestAnimationFrame(animate)
  }
  animate(0);
}

function createProgram() {
  const vs = createShader(gl.VERTEX_SHADER, shaders.vert);
  const fs = createShader(gl.FRAGMENT_SHADER, shaders.frag);
  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if(success) return program;
  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

function createShader(type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if(success) return shader;
  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

function bindLocations() {
  fragLocations.timeLoc = gl.getUniformLocation(program, "time");
  fragLocations.resLoc = gl.getUniformLocation(program, "uResolution");
}

function updateShader(newShader) {
  let f = fragBase + `vec4(${newShader}, 1.0) ; }`;
  let fs = createShader(gl.FRAGMENT_SHADER, f);
  let sh =  gl.getAttachedShaders(program);
  gl.detachShader(program, sh[1]);
  gl.deleteShader(sh[1]);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  bindLocations();
}

module.exports = { init, updateShader }
