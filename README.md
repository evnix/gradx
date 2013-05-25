gradx
=====

A gradient selector and modifier tool 

For complete Documentation, visit: http://codologic.com/page/gradx-jquery-javascript-gradient-selector-library



gradx requires jQuery . 

if jQuery UI is not present, you have to include the file dom-drag.js, otherwise
gradX will automatically use the jQuery UI's draggable method

How to use:

You need to have a div where gradX will be loaded 

for eg. 

```html
<div id='load_here'></div>
```

Then initiate gradx this way

```javascript
gradX("#load_here");
```

Note: gradx only supports id here.

Look at demo.html for a complete example

Includes:
dom-drag.js  
jQuery color picker
