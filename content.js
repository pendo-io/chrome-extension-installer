chrome.runtime.onMessage.addListener(
    function(){

        var script = document.createElement('script');
        script.src = chrome.extension.getURL('script.js');
        
        script.onload = function() {
            this.remove();
        };



        chrome.storage.sync.get('pendoKey', function(data) {
            var keyValue = data.pendoKey;
            script.onload = function() {
                window.postMessage({ type: "pendoKey", value: keyValue}, "*");
            };
        });

        // script.onload = function() {
        //     window.postMessage({ type: "pendoKey", value: "9edd1221-0476-4b32-4684-ccb36fcfea72" }, "*");
        // };


        (document.head || document.documentElement).appendChild(script);


    }
);

    






