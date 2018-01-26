/* eslint react/prefer-rest-params: [0] */
/* eslint prefer-spread: [0]*/
// based off of http://stackoverflow.com/a/10372280/938089
function webwork(callback) {
  // URL.createObjectURL
  window.URL = window.URL || window.webkitURL;

  const response = 'onmessage=function(event){postMessage(" + callback + "(event.data));}';

  let blob;
  try {
    blob = new Blob([response], { type: 'application/javascript' });
  } catch (e) { // Backwards-compatibility
    window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
    blob = new BlobBuilder();
    blob.append(response);
    blob = blob.getBlob();
  }

  return function wwork(...args) {
    const worker = new Worker(URL.createObjectURL(blob));
    let ran;
    if (typeof args[args.length - 1] === 'function') {
      callback = args.pop();
    } else {
      callback = function empty() { };
    }

    worker.onmessage = function message(e) {
      if (ran) { return; }
      ran = true;
      callback(null, e.data);
    };
    worker.onerror = function error(e) {
      if (ran) { return; }
      ran = true;

      callback(e);
    };
    worker.postMessage.apply(worker, args);
  };
}

export default webwork;
