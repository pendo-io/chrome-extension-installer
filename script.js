function pendoFunction(apiKey, visitorId, accountId, _lightningOption, _adoptOption) {
    // pendo snippet depends on there being at least 1 script element, but there may not be since this script removes itself
    // so we have to create a blank script element in that case
    var scripts = document.getElementsByTagName('script');
    if (scripts.length == 0) {
        var s = document.createElement('script');
        document.head.appendChild(s);
    }

    if (_lightningOption) {
        (function (apiKey) {
            (function (p, e, n, d, o) {
                var v, w, x, y, z;
                o = p[d] = p[d] || {};
                o._q = [];
                v = [
                    "initialize",
                    "identify",
                    "updateOptions",
                    "pageLoad",
                    "track",
                ];
                for (w = 0, x = v.length; w < x; ++w)
                    (function (m) {
                        o[m] =
                            o[m] ||
                            function () {
                                o._q[m === v[0] ? "unshift" : "push"](
                                    [m].concat([].slice.call(arguments, 0))
                                );
                            };
                    })(v[w]);
                y = e.createElement(n);
                y.async = !0;
                y.src =
                    "https://pendo-io-static.storage.googleapis.com/agent/releases/2.65.1/pendo.lightning.min.js";
                z = e.getElementsByTagName(n)[0];
                z.parentNode.insertBefore(y, z);
            })(window, document, "script", "pendo");
        })(apiKey);
        // Call this whenever information about your visitors becomes available
        pendo.initialize({
            apiKey: apiKey,
            visitor: {
              id: visitorId
            },
            account: {
              id: accountId,
            },
        });

    } 

    else if (_adoptOption) {

        if(!!window.parent.pendo) {

            pendo.identify(
              visitorId,
              "Adopt Account"
            );        

            console.log("PE Adopt Mode On");            

        }

        else {

            (function (p, e, n, d, o) {
                var v, w, x, y, z;
                o = p[d] = p[d] || {};
                o._q = [];
                v = ["initialize", "identify", "updateOptions", "pageLoad"];
                for (w = 0, x = v.length; w < x; ++w)
                    (function (m) {
                        o[m] =
                            o[m] ||
                            function () {
                                o._q[m === v[0] ? "unshift" : "push"](
                                    [m].concat([].slice.call(arguments, 0))
                                );
                            };
                    })(v[w]);
                y = e.createElement(n);
                y.async = !0;
                y.src = "https://cdn.pendo.io/agent/static/" + apiKey + "/pendo.js";
                z = e.getElementsByTagName(n)[0];
                z.parentNode.insertBefore(y, z);
            })(window, document, "script", "pendo");

            pendo.initialize({
                visitor: {
                    id: visitorId,
                },

                account: {
                    id: accountId,
                },
            });

        }


    } 

    else {
        (function (p, e, n, d, o) {
            var v, w, x, y, z;
            o = p[d] = p[d] || {};
            o._q = [];
            v = ["initialize", "identify", "updateOptions", "pageLoad"];
            for (w = 0, x = v.length; w < x; ++w)
                (function (m) {
                    o[m] =
                        o[m] ||
                        function () {
                            o._q[m === v[0] ? "unshift" : "push"](
                                [m].concat([].slice.call(arguments, 0))
                            );
                        };
                })(v[w]);
            y = e.createElement(n);
            y.async = !0;
            y.src = "https://cdn.pendo.io/agent/static/" + apiKey + "/pendo.js";
            z = e.getElementsByTagName(n)[0];
            console.log('z: ', z);
            z.parentNode.insertBefore(y, z);
        })(window, document, "script", "pendo");

        pendo.initialize({
            visitor: {
                id: visitorId,
            },

            account: {
                id: accountId,
            },
        });
    }
}

window.addEventListener(
    "message",
    function (event) {
        if (event.data.type === "pendoInjectorKey") {
            var _pendoKeyValue = event.data.keyValue;
            var _pendoVisitorIdValue = event.data.visitorIdValue;
            var _pendoAccountIdValue = event.data.accountIdValue;
            var _lightningOption = event.data.lightningValue;
            var _adoptOption = event.data.adoptValue;
            pendoFunction(
                _pendoKeyValue,
                _pendoVisitorIdValue,
                _pendoAccountIdValue,
                _lightningOption,
                _adoptOption
            );
        }
    },
    false
);
