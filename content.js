chrome.runtime.onMessage.addListener(
    function(){

        var script = document.createElement('script');
        script.src = chrome.extension.getURL('script.js');
        
        script.onload = function() {
            this.remove();
        };

        //content script
        chrome.storage.sync.get(['pendoKey','visitorId'], function(data) {
            var keyValue = data.pendoKey;
            var visitorId = data.visitorId;
            script.onload = function() {
                window.postMessage({ type: "pendoKey", value: [keyValue, visitorId]}, "*");
            };
        });      
        
        (document.head || document.documentElement).appendChild(script);
        
    }
);







