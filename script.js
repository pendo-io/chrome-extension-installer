function pendoFunction(apiKey, visitorId, _lightningOption){

  if(_lightningOption) {

  (function(apiKey){
    (function(p,e,n,d,o){var v,w,x,y,z;o=p[d]=p[d]||{};o._q=[];
    v=['initialize','identify','updateOptions','pageLoad','track'];for(w=0,x=v.length;w<x;++w)(function(m){
        o[m]=o[m]||function(){o._q[m===v[0]?'unshift':'push']([m].concat([].slice.call(arguments,0)));};})(v[w]);
        y=e.createElement(n);y.async=!0;y.src="https://pendo-io-static.storage.googleapis.com/agent/releases/2.59.1/pendo.lightning.min.js";
        z=e.getElementsByTagName(n)[0];z.parentNode.insertBefore(y,z);})(window,document,'script','pendo');
    })(apiKey);
        // Call this whenever information about your visitors becomes available
    pendo.initialize({ apiKey: apiKey, visitor: {id: visitorId}});


  console.log(_lightningOption);

  }

  else {

  (function(p,e,n,d,o){var v,w,x,y,z;o=p[d]=p[d]||{};o._q=[];
    v=['initialize','identify','updateOptions','pageLoad'];for(w=0,x=v.length;w<x;++w)(function(m){
    o[m]=o[m]||function(){o._q[m===v[0]?'unshift':'push']([m].concat([].slice.call(arguments,0)));};})(v[w]);
    y=e.createElement(n);y.async=!0;y.src='https://cdn.pendo.io/agent/static/'+apiKey+'/pendo.js';
    z=e.getElementsByTagName(n)[0];z.parentNode.insertBefore(y,z);})(window,document,'script','pendo');

  pendo.initialize({
    visitor: {
        id:              visitorId   
    },

    account: {
        id:           'test-account' 
    }
  });

  }



};

window.addEventListener("message", function(event) {
    if(event.data.type === 'pendoKey') {
        window._pendoKeyValue = event.data.value[0];
        window._pendoVisitorIdValue = event.data.value[1];
        window._lightningOption = event.data.value[2];
        pendoFunction(_pendoKeyValue, _pendoVisitorIdValue, _lightningOption); 
    };
}, false);