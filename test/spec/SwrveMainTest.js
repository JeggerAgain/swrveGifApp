var createSandBox = function (){
    var resultCont, resultDiv, ratingDiv, sourceDiv, urlDiv;

    beforeEach(function(){
        resultCont = document.createElement('div');
        resultCont.setAttribute('id', 'resultscontainer');
        document.body.appendChild(resultCont);
        resultDiv = document.createElement('div');
        resultDiv.setAttribute('id', 'result1');
        document.getElementById('resultscontainer').appendChild(resultDiv);
        ratingDiv = document.createElement('div');
        ratingDiv.setAttribute('class', 'gifrating');
        document.getElementById('result1').appendChild(ratingDiv);
        sourceDiv = document.createElement('div');
        sourceDiv.setAttribute('class', 'gifsource');
        document.getElementById('result1').appendChild(sourceDiv);
        urlDiv = document.createElement('div');
        urlDiv.setAttribute('class', 'gifurl');
        document.getElementById('result1').appendChild(urlDiv);
        document.getElementById('result1').appendChild(document.createElement('img'));
    });

    afterEach(function(){
        resultCont.remove();
        resultCont = null;
    });
};


describe( "Direction Navigation Handler", function () {
    it("should update current pge", function () {
        SwrveApp.variables.currentPage = 1;
        spyOn(SwrveApp.navigationHandler.prototype, 'checkIfLastPage');
        SwrveApp.navigationHandler.prototype.onPageArrowClick('right')
        expect(SwrveApp.variables.currentPage).toEqual(2);
        expect(SwrveApp.navigationHandler.prototype.checkIfLastPage).toHaveBeenCalled();
    });

    it("should check if it is on the last page passing through its current start and end index", function () {
        SwrveApp.variables.currentPage = 1;
        spyOn(SwrveApp.navigationHandler.prototype, 'checkIfLastPage');
        SwrveApp.navigationHandler.prototype.onPageArrowClick('right')
        expect(SwrveApp.navigationHandler.prototype.checkIfLastPage).toHaveBeenCalledWith(50, 75);
    });
});

describe("Adding Dom Element for Each Response",function(){
    createSandBox();
    it('should add one image element for each element of the response.data array and add one rating, one source and one url element for each element of the response.data array', function() {
        SwrveApp.navigationHandler.prototype.renderResponse(response);
        expect(document.getElementById('resultscontainer').childElementCount).toEqual(3);
    });
    it('source and one url element for each element of the response.data array', function(){
        SwrveApp.navigationHandler.prototype.renderResponse(response);
        expect(document.getElementsByClassName('gifrating').length).toEqual(3);
        expect(document.getElementsByClassName('gifurl').length).toEqual(3);
        expect(document.getElementsByClassName('gifsource').length).toEqual(3);
    });
    afterEach(function(){
        document.getElementById('resultscontainer').remove();
    });
});


response = {
    data: [
        {
            images: {
                fixed_height: {
                    url: 'testUrl'
                }
            },
            rating: 'ratingTest',
            source: 'sourceTest',
            url: 'urlTest'
        },
        {
            images: {
                fixed_height: {
                    url: 'testUrl'
                }
            },
            rating: 'ratingTest',
            source: 'sourceTest',
            url: 'urlTest'
        },
        {
            images: {
                fixed_height: {
                    url: 'testUrl'
                }
            },
            rating: 'ratingTest',
            source: 'sourceTest',
            url: 'urlTest'
        }
    ]
};
