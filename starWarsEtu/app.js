// register service worker
var CACHE_NAME = 'my-site-cache-v1';

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js', { scope: '.' }).then(function(reg) {

        if(reg.installing) {
            console.log('Service worker installing');
        } else if(reg.waiting) {
            console.log('Service worker installed');
        } else if(reg.active) {
            console.log('Service worker active');
        }

    }).catch(function(error) {
// registration failed
        console.log('Registration failed with ' + error);
    });
}

function imgLoad(imgJSON) {
    // return a promise for an image loading
    return new Promise(function(resolve, reject) {
        var request = new XMLHttpRequest();
        request.open('GET', imgJSON.url);
        request.responseType = 'blob'; //on indique que la réponse sera une donnée binaire (l'image)

        request.onload = function() {
            if (request.status == 200) {
                var arrayResponse = [];
                arrayResponse[0] = request.response;
                arrayResponse[1] = imgJSON;
                resolve(arrayResponse);
                //Promise.resolve()
                //Renvoie un objet Promise qui est tenu (résolu) avec la valeur donnée.
                //Si la valeur possède une méthode then, la promesse renvoyée « suivra » cette méthode
                //pour arriver dans son état. (définition developper.mozilla)
            } else {
                reject(Error('Image didn\'t load successfully; error code:' + request.statusText));
            }
        };

        request.onerror = function() {
            reject(Error('There was a network error.'));
        };

        // Send the request
        request.send();
    });
}

var imgSection = document.querySelector('section');

window.onload = function() {

    // load each set of image, alt text, name and caption
    for(var i = 0; i<=Gallery.images.length-1; i++) {
        imgLoad(Gallery.images[i]).then(function(arrayResponse) {
            //Si succès alors le "resolves" s'exécutera sur arrayResponse

            console.log(arrayResponse);

            var myImage = document.createElement('img');
            var myFigure = document.createElement('figure');
            var myCaption = document.createElement('caption');
            var imageURL = window.URL.createObjectURL(arrayResponse[0]);

            myImage.src = imageURL;
            imgSection.append(myImage);


            /*
                alt: "A Black Clad warrior lego toy"
                credit: "<a href=\"https://www.flickr.com/photos/legofenris/\">legOfenris</a>, published under a <a href=\"https://creativecommons.org/licenses/by-nc-nd/2.0/\">Attribution-NonCommercial-NoDerivs 2.0 Generic</a> license."
                name: "Darth Vader"
                url: "gallery/myLittleVader.jpg"
             */

            // name : credit

            myCaption.innerHTML = arrayResponse[1].name + " : " + arrayResponse[1].credit;
            imgSection.append(myFigure);
            imgSection.append(myCaption);

        }, function(Error) {
            //exécution du reject
            console.log(Error);
        });
    }
};