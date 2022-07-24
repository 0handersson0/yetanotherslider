# Yet another slider 🤷‍♂️

Implementation of an pure JS imageslider supporting auto rotate, draggable slides and clickable arrows.

# To use
Download and add ref to [yas.js](https://github.com/0handersson0/yetanotherslider/blob/main/lib/yas.js). 👾

### Minimal implementation
```
<html>
    <body>
        <div id="yas_1" class="slider">
          <img src="..." />
          <img src="..." />
          <img src="..." />
          <img src="..." />
        </div>
        <script src="yas.js"></script>
    </body>
</html>
```
## Attributes
___

| Attribute | Default value |
| ----------- | ----------- 
| display | 3 
| auto | 2000 (ms)
| speed | 0.8 (s)
| draggable | false
| arrows | BC 

## Arrow position attribute explination

___

| Value | Explenation |
| ----------- | ----------- 
| TR | Top right
| TC | Top center
| TL | Top left
| BR | Bottom right
| BC | Bottom center
| BR | Bottom right
___

## Multiple sliders on same page

For multiple sliders on same page simply decorate with id attribute

`<div id="yas-1" class="slider">
          <img src="..." />
          <img src="..." />
          <img src="..." />
          <img src="..." />
        </div>
        <div id="yas-2" class="slider">
          <img src="..." />
          <img src="..." />
          <img src="..." />
          <img src="..." />
        </div>
        <div id="yas-3" class="slider">
          <img src="..." />
          <img src="..." />
          <img src="..." />
          <img src="..." />
        </div>`




