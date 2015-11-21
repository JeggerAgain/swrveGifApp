var SwrveApp = function (SwrveApp) {
    "use strict";
    var apiDataHandler = function () {

        var httpGetAsync = function (apiUrl, gifTerms, callback, renderResponseCallback) {
            if (typeof apiUrl === 'string') {
                var xmlHttp = new XMLHttpRequest();
                apiUrl = apiUrl.slice(0, apiUrl.indexOf('q=') + 2) + gifTerms[0] + apiUrl.slice(apiUrl.indexOf('q=') + 2);
                xmlHttp.onreadystatechange = function () {
                    if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                        callback(xmlHttp.responseText, renderResponseCallback);
                    }
                }
                xmlHttp.open("GET", apiUrl, true);
                xmlHttp.send(null);
            }
        };

        var processResponse = function (response, renderResponseCallback) {
            if (typeof response === 'string' || Object.prototype.toString.call(response) === '[object Array]') {
                var gifList;
                if (Object.prototype.toString.call(response) !== '[object Array]') {
                    try {
                        response = JSON.parse(response);
                    } catch (e) {
                        console.log('invalid json');
                        response = null;
                        return;
                    }
                }
                console.log(response);
                if(renderResponseCallback) {
                    renderResponseCallback(response);
                }

            }
        };
        apiDataHandler.prototype.generateApiResponse = function (apiURL, gifTerms, renderResponseCallback) {
            httpGetAsync(apiUrl, gifTerms, processResponse, renderResponseCallback);
        }
    };

    var API = {
        apiDataHandler : apiDataHandler
    };
    return API;

}(SwrveApp || {});

var renderResponse = function (response) {
    var len, i, newResult, indivdualResult;
    if(response) {
        len = response.data.length;
        for (i = 0; i < len && i < 25; i++) {
            indivdualResult = document.getElementById("result1");
            if(i===0) {
                newResult = indivdualResult
            } else {
                newResult = indivdualResult.cloneNode(true);
            }
            image = newResult.firstElementChild;
            image.setAttribute('src', response.data[i].images.fixed_height.url);
            document.getElementById("resultsContainer").appendChild(newResult);
        }
    }
}

var apiUrl = 'http://api.giphy.com/v1/gifs/search?q=&api_key=dc6zaTOxFJmzC&limit=50';
SwrveApp.apiDataHandler();
SwrveApp.apiDataHandler.prototype.generateApiResponse(apiUrl, ['cat'], renderResponse   );

