# sw-test

Service Worker test repository. This is a very simple demo to show basic service worker features in action. The demo can be seen on [our GitHub pages](https://mdn.github.io/sw-test/).

You can find a lot more out about how this works by reading [Using Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers).
In particular, read [Why is my service worker failing to register?](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers#Why_is_my_service_worker_failing_to_register)
if you are having problems getting your code to do anything. You need to change the paths relative to where you are serving your files from!

# Set up

To start server for this project, you can use a lightweight tool: [https://chrome.google.com/webstore/detail/web-server-for-chrome/ofhbbkphhbklhfoeikjpcbhemlocgigb](https://chrome.google.com/webstore/detail/web-server-for-chrome/ofhbbkphhbklhfoeikjpcbhemlocgigb)

Or if you have [Python](https://python.org/) on your machine, you can just do as follow:

1. cd to the project's parent directory
2. run the commands below:

## Python 2
```
python -m SimpleHTTPServer 8001
```

## Python 3
```
python3 -m http.server 8001
```

then you just open: [http://localhost:8001/sw-test/](http://localhost:8001/sw-test/)
