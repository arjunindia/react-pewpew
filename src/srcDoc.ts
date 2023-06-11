
const srcHTML = //html
`
<!doctype html>
<html lang="en-us">

<head>
  <meta charset="utf-8">
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">

  <title>PewEngine</title>
  <style>
    body {
      font-family: arial;
      margin: 0;
      background-color: #000;
      padding: none;
    }

    .emscripten {
      padding-right: 0;
      margin-left: auto;
      margin-right: auto;
      display: block;
    }

    div.emscripten {
      text-align: center;
    }

    canvas.emscripten {
      position: absolute;
      top: 0px;
      left: 0px;
      margin: 0px;
      width: 100%;
      height: 100%;
      overflow: hidden;
      display: block;
    }

    .spinner {
      height: 30px;
      width: 30px;
      margin: 0;
      margin-top: 20px;
      margin-left: 20px;
      display: inline-block;
      vertical-align: top;
      -webkit-animation: rotation .8s linear infinite;
      -moz-animation: rotation .8s linear infinite;
      -o-animation: rotation .8s linear infinite;
      animation: rotation 0.8s linear infinite;
      border-left: 5px solid rgb(235, 235, 235);
      border-right: 5px solid rgb(235, 235, 235);
      border-bottom: 5px solid rgb(235, 235, 235);
      border-top: 5px solid rgb(120, 120, 120);
      border-radius: 100%;
      background-color: rgb(189, 215, 46);
    }

    @-webkit-keyframes rotation {
      from {
        -webkit-transform: rotate(0deg);
      }

      to {
        -webkit-transform: rotate(360deg);
      }
    }

    @-moz-keyframes rotation {
      from {
        -moz-transform: rotate(0deg);
      }

      to {
        -moz-transform: rotate(360deg);
      }
    }

    @-o-keyframes rotation {
      from {
        -o-transform: rotate(0deg);
      }

      to {
        -o-transform: rotate(360deg);
      }
    }

    @keyframes rotation {
      from {
        transform: rotate(0deg);
      }

      to {
        transform: rotate(360deg);
      }
    }

    #floatingRectangle {
      z-index: 1;
      position: absolute;
      left: 100px;
      right: 100px;
      top: 100px;
      bottom: 100px;
      background-color: #000;
    }

    #status {
      display: inline-block;
      vertical-align: top;
      margin-top: 30px;
      margin-left: 20px;
      font-weight: bold;
      color: rgb(120, 120, 120);
    }

    #progress {
      height: 20px;
      width: 30px;
    }
  </style>
</head>

<body>

  <div class="spinner" id='spinner'></div>
  <div class="emscripten" id="status">Downloading...</div>
  </span>

  <div class="emscripten">
    <progress value="0" max="100" id="progress" hidden=1></progress>
  </div>

  <div class="emscripten_border">
    <canvas class="emscripten" id="canvas" oncontextmenu="event.preventDefault()" onmouseenter="window.focus()"
      onclick="window.focus()"></canvas>
  </div>

  <script type='text/javascript'>

    // Workaround emscripten limitation to change the canvas'
    // antialias flag.
    // The following code does *not* work:
    // SDL_GL_SetAttribute(SDL_GL_MULTISAMPLEBUFFERS, 0);
    // SDL_GL_SetAttribute(SDL_GL_MULTISAMPLESAMPLES, 0);
    canvas.savedGetContext = canvas.getContext;
    canvas.getContext = function (a, b) {
      b.antialias = true;
      b.preserveDrawingBuffer = false;
      return this.savedGetContext(a, b);
    }

    var statusElement = document.getElementById('status');
    var progressElement = document.getElementById('progress');
    var spinnerElement = document.getElementById('spinner');

    var Module = {
      preRun: [],
      postRun: [],
      print: (function () {
        return function (text) {
          if (arguments.length > 1)
            text = Array.prototype.slice.call(arguments).join(' ');
          console.log(text);
        };
      })(),
      printErr: function (text) {
        if (arguments.length > 1)
          text = Array.prototype.slice.call(arguments).join(' ');
        console.error(text);

      },
      canvas: (function () {
        var canvas = document.getElementById('canvas');
        // As a default initial behavior, pop up an alert when webgl context is lost. To make your
        // application robust, you may want to override this behavior before shipping!
        // See http://www.khronos.org/registry/webgl/specs/latest/1.0/#5.15.2
        canvas.addEventListener("webglcontextlost", function (e) {
          alert('WebGL context lost. You will need to reload the page.');
          e.preventDefault();
        }, false);

        return canvas;
      })(),
      setStatus: function (text) {
        if (!Module.setStatus.last) Module.setStatus.last = {
          time: Date.now(),
          text: ''
        };
        if (text === Module.setStatus.text) return;
        var m = text.match(/([^(]+)\\((\\d+(\\.\\d+)?)\\/(\\d+)\\)/);
        var now = Date.now();
        if (m && now - Date.now() < 30) return; // if this is a progress update, skip it if too soon
        if (m) {
          text = m[1];
          progressElement.value = parseInt(m[2]) * 100;
          progressElement.max = parseInt(m[4]) * 100;
          progressElement.hidden = false;
          spinnerElement.hidden = false;
        } else {
          progressElement.value = null;
          progressElement.max = null;
          progressElement.hidden = true;
          if (!text) spinnerElement.style.display = 'none';
        }
        statusElement.innerHTML = text;
      },
      totalDependencies: 0,
      monitorRunDependencies: function (left) {
        this.totalDependencies = Math.max(this.totalDependencies, left);
        Module.setStatus(left ? 'Preparing... (' + (this.totalDependencies - left) + '/' + this.totalDependencies + ')' : 'All downloads complete.');
      }
    };
    Module['arguments'] = ["--stand-alone"];
    Module.setStatus('Downloading...');
    window.onerror = function (event) {
      // TODO: do not warn on ok events like simulating an infinite loop or exitStatus
      Module.setStatus('Exception thrown, see JavaScript console');
      spinnerElement.style.display = 'none';
      Module.setStatus = function (text) {
        if (text) Module.printErr('[post-exception status] ' + text);
      };
    };

    try {
      WebAssembly;
      var xhr = new XMLHttpRequest();
      xhr.open('GET', '/wasm/pewengine.wasm', true);
      xhr.responseType = 'arraybuffer';
      xhr.onload = function () {
        Module.wasmBinary = xhr.response;
        var script = document.createElement('script');
        script.src = "/wasm/pewengine.js";
        document.body.appendChild(script);
      };
      xhr.send(null);
    } catch (e) {
      alert("Failed to load webasm.");
    }

    const element_that_makes_sound_on_click = document.querySelector('canvas');
    let AudioContext = window.AudioContext || window.webkitAudioContext;
    let tempAudioContext;
    function init() {
      tempAudioContext = new AudioContext();
      // Safari needs an audio context created in onclick.
      Module.audioContext = tempAudioContext;
    }
    element_that_makes_sound_on_click.onclick = function () {
      if (!tempAudioContext) {
        init();
      }
      let frameCount = 10;
      let myArrayBuffer = tempAudioContext.createBuffer(1, frameCount, tempAudioContext.sampleRate);
      let channelData = myArrayBuffer.getChannelData(0);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = 0.0;
      }
      source = tempAudioContext.createBufferSource();
      source.buffer = myArrayBuffer;
      source.connect(tempAudioContext.destination);
      source.start();
      element_that_makes_sound_on_click.onclick = null;
    }

    let wasmReady = false;
    let leval = null;
    Module['onRuntimeInitialized'] = function() {
      wasmReady = true;
      parent.postMessage({ type: "ready" }, "*");
      if(leval){
      try{
            let array = new Uint8Array(leval);
            let heapSpace = Module._malloc(array.length * array.BYTES_PER_ELEMENT);
            Module.HEAP8.set(array, heapSpace);
            Module['__Z9LoadLevelmi'](heapSpace, array.length);
          }
          catch(e){
            console.log(e);
          }
        }
}
    window.addEventListener("message", (event) => {
        // extract the data from the message event
        const { data } = event;
        const { type, level } = data;
        if (type === "log") {
            console.log(level);
        }
        if (type === "level"){
          try{
            if (!wasmReady) {
              console.log("WASM not ready yet");
              leval = level;
              return;
            }
            let array = new Uint8Array(level);
            let heapSpace = Module._malloc(array.length * array.BYTES_PER_ELEMENT);
            Module.HEAP8.set(array, heapSpace);
            Module['__Z9LoadLevelmi'](heapSpace, array.length);
          }
          catch(e){
            console.log(e);
          }
        }
      });
  </script>
</body>

</html>
`;

export default srcHTML;