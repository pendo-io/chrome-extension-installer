function pendoFunction(apiKey){

(function(p,e,n,d,o){var v,w,x,y,z;o=p[d]=p[d]||{};o._q=[];
v=['initialize','identify','updateOptions','pageLoad'];for(w=0,x=v.length;w<x;++w)(function(m){
  o[m]=o[m]||function(){o._q[m===v[0]?'unshift':'push']([m].concat([].slice.call(arguments,0)));};})(v[w]);
  y=e.createElement(n);y.async=!0;y.src='https://cdn.pendo.io/agent/static/'+apiKey+'/pendo.js';
  z=e.getElementsByTagName(n)[0];z.parentNode.insertBefore(y,z);})(window,document,'script','pendo');

  pendo.initialize({
    visitor: {
        id:              'success!'   
    },

    account: {
        id:           'success2!' 
    }
  });

};

window.addEventListener("message", function(event) {
    if(event.data.type === 'pendoKey') {
        window._pendoKeyValue = event.data.value;
        console.log('key:', _pendoKeyValue);

        pendoFunction(_pendoKeyValue);

    }
}, false);



// chrome.storage.sync.get('pendoKey', 
//     function(data) {


//         var pendoKey = data.pendoKey;

//         pendoFunction(pendoKey);

// });


