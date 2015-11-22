/*
 *SwrveApp contains all the JavaScript for this app
 * It is called on page load
 */
var SwrveApp = function () {
    "use strict";
    var gifTotalLimit = 500,
        gifLimitPerPage = 25,
        currentPage = 0,
        currentFilterTotalResults,

        /*
         *apiDataHandler is used to request and process data from an API
         */
        apiDataHandler = function () {

            /*
             *httpGetAsync requests data from the giphy URL and passes it to the callback
             * @param {string} apiUrl partial api url
             * @param {string} gifTerm term to be inserted into the api URL
             * @param {function} callback function which the respose is passed to
             * @param {function} renderResponseCallback optional additional function which is passed to the callback
             */
            var httpGetAsync = function (apiUrl, gifTerm, callback, renderResponseCallback) {
                if (typeof apiUrl === 'string') {
                    var xmlHttp = new XMLHttpRequest();
                    apiUrl = apiUrl.slice(0, apiUrl.indexOf('q=') + 2) + gifTerm + apiUrl.slice(apiUrl.indexOf('q=') + 2) + gifTotalLimit;
                    xmlHttp.onreadystatechange = function () {
                        if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                            callback(xmlHttp.responseText, renderResponseCallback);
                        }
                    }
                    xmlHttp.open("GET", apiUrl, true);
                    xmlHttp.send(null);
                }
            };

            /*
             *processResponse processes the API response, saves it to currentFilterTotalResults and passes it to callback if provided
             * @param {JSON} response API response
             * @param {function} renderResponseCallback callback processed response is passed to
             */
            var processResponse = function (response, renderResponseCallback) {
                if (typeof response === 'string' || Object.prototype.toString.call(response) === '[object Array]') {
                    if (Object.prototype.toString.call(response) !== '[object Array]') {
                        try {
                            response = JSON.parse(response);
                        } catch (e) {
                            console.log('invalid json');
                            response = null;
                            return;
                        }
                    }
                    currentFilterTotalResults = response;
                    if(renderResponseCallback) {
                        renderResponseCallback(response);
                    }

                }
            };

            /*
             *generateApiResponse public function called to generate API response
             * @param {string} apiUrl partial api url
             * @param {string} gifTerm term to be inserted into the api URL
             * @param {function} renderResponseCallback optional additional function which is passed to the callback
             */
            apiDataHandler.prototype.generateApiResponse = function (apiURL, gifTerm, renderResponseCallback) {
                httpGetAsync(apiUrl, gifTerm, processResponse, renderResponseCallback);
            }
        };

    /*
     * navigationHandler is used for navigation and updating results based on navigation
     */
    var navigationHandler = function() {

        /*
         * updateResults updates the src of the image elements based on arguments
         * @param {Array} response contains all response information from API
         * @param {number} min the index from which to start when displaying new results
         * @param {number} max the index to end when updating results
         */
        var updateResults = function(response, min, max) {
            var len, i, newResult, indivdualResult, image,
                j = 0;
            if (response) {
                len = max ? max : gifLimitPerPage;
                i = min ? min : 0;
                for (; i < len; i++) {
                    indivdualResult = document.getElementById("result" + (j + 1));
                    image = indivdualResult.firstElementChild;
                    image.removeAttribute('src');
                    image.setAttribute('src', response.data[i].images.fixed_height.url);
                    image.setAttribute('index', i);
                    updateGifAdditionalData(image, response.data[i]);
                    j++;
                }
            }
        };

        /*
         * updateGifAdditionalData updates the Additional Data of a give image
         * @param {DOM Element} imageElement the image for which the corresponding data should be updates
         * @param {object} data contains all the information for one result
         */
        var updateGifAdditionalData = function(imageElement, data) {
            imageElement.parentNode.getElementsByClassName('gifRating')[0].innerHTML = data.rating;
            imageElement.parentNode.getElementsByClassName('gifSource')[0].setAttribute('href', data.source);
            imageElement.parentNode.getElementsByClassName('gifURL')[0].setAttribute('href', data.url);
        };

        /*
         * checkIfLastPage checks if the current user position is the last page in
         * either direction and if so updates arrow color to black or grey
         */
        var checkIfLastPage = function() {
            var arrow;
            if(currentPage === 0) {
                arrow = document.getElementById("leftarrow");
                arrow.setAttribute('style','color: grey');
            } else {
                arrow = document.getElementById("leftarrow");
                arrow.setAttribute('style','color: black');
            }
            if(currentPage === gifTotalLimit) {
                arrow = document.getElementById("rightarrow");
                arrow.setAttribute('style','color: grey');
            } else {
                arrow = document.getElementById("rightarrow");
                arrow.setAttribute('style','color: black');
            }
        };

        /*
         * renderResponse loops through the API response and renders an image element
         * on the page for each item in the response until the page limit is reached; also updates additional data
         * @param {Object} response API JSON object
         */
        navigationHandler.prototype.renderResponse = function (response) {
            var len, i, newResult, indivdualResult, image;
            if(response) {
                len = response.data.length;
                for (i = 0; i < len && i < gifLimitPerPage; i++) {
                    indivdualResult = document.getElementById("result1");
                    if(i===0) {
                        newResult = indivdualResult
                    } else {
                        newResult = indivdualResult.cloneNode(true);
                        newResult.setAttribute('id', 'result' + (i + 1));
                    }
                    image = newResult.firstElementChild;
                    image.setAttribute('src', response.data[i].images.fixed_height.url);
                    image.setAttribute('index', i);
                    document.getElementById("resultsContainer").appendChild(newResult);
                    updateGifAdditionalData(image, response.data[i]);
                }
            }
        };

        /*
         * onFilterClick generates the API response and updates results based on the filter clicked
         * @param {String} type filter type e.g 'cat'
         */
        navigationHandler.prototype.onFilterClick = function(type) {
            var firstResult = document.getElementById("result1");
            firstResult.setAttribute('src','img/spinner.gif');
            currentPage = 0;
            apiDataHandler.prototype.generateApiResponse(apiUrl, type, updateResults);
            checkIfLastPage();
        };

        /*
         * onPageArrowClick updates results based on the direction clicked
         * @param {String} direction e.g 'right'
         */
        navigationHandler.prototype.onPageArrowClick = function(direction) {
            var startIndex, endIndex;
            window.scrollTo(0, 0);
            if(direction === 'right') {
                currentPage = currentPage + 1;
                startIndex = currentPage * gifLimitPerPage;
                endIndex = startIndex + gifLimitPerPage;

            } else {
                currentPage = currentPage - 1;
                startIndex = currentPage * gifLimitPerPage;
                endIndex = startIndex + gifLimitPerPage;
            }
            if(startIndex > -1 && endIndex > -1) {
                updateResults(currentFilterTotalResults, startIndex, endIndex);
                checkIfLastPage(startIndex, endIndex);
            }
        };

    };

    /*
     * additionalDetailsHandler is used for showing and hiding the additional detail section
     */
    var additionalDetailsHandler = function () {

        /*
         * onGifClick when the gif is click it shows the additional details below
         * @param {DOM Element} imageElement Element which additional data will be shown for
         */
        additionalDetailsHandler.prototype.onGifClick = function(imageElement) {
            var gifDataElement = imageElement.parentNode.lastElementChild;
            toggleVisibility(gifDataElement);
        }

        /*
         * toggleVisibility hides or shows element based on current state
         * @param {DOM Element} element
         */
        var toggleVisibility = function(element) {
            if(!element.getAttribute('style') || (element.getAttribute('style').indexOf('visible') === -1)) {
                element.setAttribute('style', 'visibility: visible; height: 100px;');
            } else {
                element.setAttribute('style', 'visibility: hidden; height: 0px;');
            }
        }
    };

    /*
     * Public API for Object used to access inner Objects
     */
    var API = {
        navigationHandler: navigationHandler,
        apiDataHandler: apiDataHandler,
        additionalDetailsHandler: additionalDetailsHandler
    };
    return API;

}();

var apiUrl = 'http://api.giphy.com/v1/gifs/search?q=&api_key=dc6zaTOxFJmzC&limit=';
SwrveApp.apiDataHandler();
SwrveApp.navigationHandler();
SwrveApp.additionalDetailsHandler();
SwrveApp.apiDataHandler.prototype.generateApiResponse(apiUrl, 'cat', SwrveApp.navigationHandler.prototype.renderResponse);

