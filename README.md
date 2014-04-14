# Crocodile WebRTC SDK: JavaScript Library Examples

Example web applications using the crocodile-rtc library.

## Getting Started
get a copy of this repository:

````
git clone https://github.com/crocodilertc/crocodile-rtc-examples.git
```` 

Alternatively, download a zip file of the repository by clicking on the button to the right labelled _Download ZIP_.

The directory _dist_ contains concatenated, minified CSS and JavaScript files. _[Node.js][node]_ can be used to create a clean build of the _dist_ directory:

On the command line, If you have _[Node.js][node]_ installed, navigate to the directory of the example you would like to use and run the install command:

````
npm install
````

This downloads any dependencies that are needed to build a distribution of the project. Now on the command line run GRUNT to build a distribution of the project:

````
grunt
````

Once the command has finished loading, it will re-create the folder labelled _dist_. Add this folder to the same location of the web page you would like to use the example in.
For example; if the web page called _click2call.html_ is located in the folder _www_. A copy of the _dist_ folder should be placed in the _www_ folder.

Now you can use the example in your web page. The example below uses the _click-2-call_ application:

````html
<link href='dist/css/crocodilertc-click2call-plugin.min.css' rel='stylesheet' type='text/css'/>
<script src="dist/js/crocodilertc-click2call-plugin.min.js"></script>
<script>
  var config = {
    apiKey: 'FIXME',
    addressToCall: 'FIXME@crocodilertc.net',
    click2callDisplayName: 'FIXME'
  };
  croc_click2call(config);
</script>
````

This will create a click-2-call tab on the right hand side of your web page. You will need to replace the _FIXME_ place holder with appropriate values.

* The _apiKey_ property requires an API key registered on the Crocodile network. To register go to [https://www.crocodilertc.net/](https://www.crocodilertc.net/)
* The _addresssToCall_ property requires the address of a registered user for free calls. To make calls to non-registered numbers you will need to add balance to your API key.
* The _click2callDisplayName_ property requires a string of any characters except " This will be displayed to the recipient.

[node]: http://nodejs.org/

## Advanced Click-2-Call Distributions

### Building Lighter Click-2-Call applications

The Click-2-Call application can be configured to build _audio_ only or _video_ only versions of the application. The lighter build enables the application to load faster. 
This option is intended for users that would like to only use audio or video.

To build an audio only version of the Click-2-Call application, run the command:

````
grunt audio
````

To build a video only version of the Click-2-Call application, run the command:

````
grunt video
````

### Build Click-2-Call to a Custom Directory

The Click-2-Call application uses image files that it MUST know the location of. It builds the application assuming that its default location will be in the _dist_ folder in the same location as the HTML page
that will be using it.

If you would like to place the _dist_ folder into a different location from the HTML page using it, run the command:

````
grunt --pathToDist='path/to/dist'
````

You will need to replace the value _path/to/dist_ with the path to the _dist_ folder you would like to use. The path can be absolute, or relative to the HTML page initiating the application.

Once the command has finished loading, it will re-create the folder labelled _dist_. Add this folder to the value of the _pathToDist_ option. For example;
if the web page called _click2call.html_ is located in the folder _www_ and the _pathToDist_ option is set to _path/to/dist_. A copy of the _dist_ folder should be placed
in the _www/path/to/_ directory resolving the _dist_ folder to _www/path/to/dist_.

## Documentation
For more details on the examples, see the [crocodile-rtc-wiki](https://wiki.crocodilertc.net/).  