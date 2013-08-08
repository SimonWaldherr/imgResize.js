var demoimages = [{'name':'Air Force One','license':'Arbeit der US-Regierung','filename':'4032618153_e0c19e93a0_z.jpg','source':'http://www.flickr.com/photos/whitehouse/4032618153/','height':427},
                  {'name':'On the Moon','license':'Keine Urheberrechtsbeschränkungen','filename':'5136519916_e5beec314f_z.jpg','source':'http://www.flickr.com/photos/nasacommons/5136519916/','height':640},
                  {'name':'Tree Silhouette','license':'CC BY-SA 2.0','filename':'525294006_2f0ffd631f_z.jpg','source':'http://www.flickr.com/photos/peterpearson/525294006/','height':426},
                  {'name':'Tree and Sky','license':'CC BY-NC 2.0','filename':'2515331481_4997cae738_z.jpg','source':'http://www.flickr.com/photos/freefoto/2515331481/','height':480},
                  {'name':'Two Trees 1','license':'CC BY-SA 2.0','filename':'2280692112_96b565920b_z.jpg','source':'http://www.flickr.com/photos/salford_ian/2280692112/','height':480},
                  {'name':'Two Trees 2','license':'CC BY-NC 2.0','filename':'4448645964_d5d015135f_z.jpg','source':'http://www.flickr.com/photos/savagecabage/4448645964/','height':480},
                  {'name':'Two Trees 3','license':'CC BY-NC-SA 2.0','filename':'2430351821_0fa4bb7098_z.jpg','source':'http://www.flickr.com/photos/vertigogen/2430351821/','height':433},
                  {'name':'Two Trees 4','license':'CC BY-SA 2.0','filename':'4023839232_619709b044_z.jpg','source':'http://www.flickr.com/photos/quinnanya/4023839232/','height':480},
                  {'name':'field','license':'Public Domain','filename':'field.jpg','source':' ','height':478},
                  {'name':'sun','license':'Public Domain','filename':'sun.jpg','source':' ','height':480},
                  {'name':'Cat content','license':'Public Domain','filename':'catcontent.jpg','source':' ','height':480},
                  {'name':'L\'Ultima Cena','license':'Public Domain','filename':'lultimacena.jpg','source':' ','height':346}];

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function loadImageToCanvas(json, id) {
  loadImage({'canvas' : document.getElementById('Canvas'), 'ocanvas' : document.getElementById('originalCanvas'), 'img' : 'static/'+json[id].filename});
  loadImage({'canvas' : document.getElementById('originalCanvas'), 'img' : 'static/'+json[id].filename});
  
  document.getElementById('height').max = json[id].height;
  document.getElementById('height').value = json[id].height;
  document.getElementById('width').max = 640;
  document.getElementById('width').value = 640;
  
  document.getElementById('originalCanvas').setAttribute('height',json[id].height);
  document.getElementById('Canvas').setAttribute('height',json[id].height);
  document.getElementById('canbox').style.height = json[id].height+'px';
  edgeDetectLines = [];
  
  imgResize({'width' : 640, 'canvas' : 'Canvas'});
}

function loadLocalImageToCanvas() {
  var input, file, fr, img;
  function createImage() {
    img = new Image();
    img.onload = imageLoaded;
    img.src = fr.result;
  }
  
  function imageLoaded() {
    var ocanvas = document.getElementById("originalCanvas"),
      canvas = document.getElementById("Canvas"),
      ctx, octx;
    canvas.width = img.width;
    canvas.height = img.height;
    ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
  
    ocanvas.width = img.width;
    ocanvas.height = img.height;
    octx = ocanvas.getContext("2d");
    octx.drawImage(img, 0, 0);
    
    document.getElementById('height').max = img.height;
    document.getElementById('height').value = img.height;
    document.getElementById('width').max = img.width;
    document.getElementById('width').value = img.width;
    
    /*
    document.getElementById('originalCanvas').setAttribute('height',img.height);
    document.getElementById('Canvas').setAttribute('height',img.height);
    document.getElementById('canbox').style.height = img.height+'px';
    */
  }

  if (typeof window.FileReader !== 'function') {
    alert("The file API isn't supported on this browser yet.");
    return;
  }

  input = document.getElementById('imgfile');
  if (!input) {
    alert("Couldn't find the imgfile element.");
  } else if (!input.files) {
    alert("This browser doesn't seem to support the `files` property of file inputs.");
  } else if (!input.files[0]) {
    alert("Please select a file before clicking 'Load'");
  } else {
    file = input.files[0];
    fr = new FileReader();
    fr.onload = createImage;
    fr.readAsDataURL(file);
  }
}

function exportCanvasToImage() {
  var canvas = document.getElementById("Canvas");
  window.open(canvas.toDataURL('png'), "imgResize.js", "width="+canvas.width+",height="+canvas.height+",left=100,top=200");
}

function printImgList(json, id) {
  var i, output = '', regex = /(http:\/\/www\.([a-zA-Z.\/_]+))/i, linktext;
  for(i=0;i<json.length;i+=1) {
    if(json[i].license !== 'Public Domain') {
      linktext = regex.exec(json[i].source);
      output += '<li><b class="baf bluehover w120 changeImage" data-imgid="'+i+'">'+json[i].name+'</b> <i>(license: '+json[i].license+', from: <a href="'+json[i].source+'">'+linktext[2]+'</a>)</i></li>';
    } else {
      output += '<li><b class="baf bluehover w120 changeImage" data-imgid="'+i+'">'+json[i].name+'</b> <i>(license: '+json[i].license+')</i></li>';
    }
  }
  document.getElementById(id).innerHTML = output;
}

function loadImage(options) {
  "use strict";
  var canvas = (typeof options.canvas !== 'string') ? options.canvas : document.getElementById(options.canvas),
    imgsrc = (options.img !== undefined) ? (typeof options.img !== 'string') ? options.img.src : options.img : canvas.getAttribute('data-src'),
    cxt, img;

  canvas.setAttribute('data-src', imgsrc);
  cxt = canvas.getContext("2d");
  img = new Image();
  img.onload = function () {
    cxt.drawImage(img, 0, 0);
  };
  img.src = imgsrc;
}

function imgResize(options) {
  "use strict";
  var canvas = (typeof options.canvas !== 'string') ? options.canvas : document.getElementById(options.canvas),
    imgsrc = (options.img !== undefined) ? (typeof options.img !== 'string') ? options.img.src : options.img : canvas.getAttribute('data-src'),
    height = (options.height !== undefined) ? options.height : canvas.getAttribute('height'),
    width = (options.width !== undefined) ? options.width : canvas.getAttribute('width'),
    cxt, img;
  canvas.setAttribute('width', width);
  canvas.setAttribute('height', height);
  cxt = canvas.getContext("2d");
  img = new Image();
  img.src = imgsrc;

  cxt.drawImage(img, 0, 0, width, height);
}

var i, resizeMode = 'Normal', selectedImage, imagebuttons = document.getElementsByClassName('changeImage'), modebuttons = document.getElementsByClassName('changeResizeMode');
function $val(id) {
  return document.getElementById(id).value;
}
function changeSlider() {
  if(resizeMode === 'Normal') {
    imgResize({'height' : $val('height'), 'width' : $val('width'), 'canvas' : 'Canvas'});
  } else if(resizeMode === 'Smart') {
    imgSmartResize({'height' : $val('height'), 'width' : $val('width'), 'canvas' : 'Canvas', 'ocanvas' : 'originalCanvas', 'mode': 1});
  } else if(resizeMode === 'Smart+') {
    imgSmartResize({'height' : $val('height'), 'width' : $val('width'), 'canvas' : 'Canvas', 'ocanvas' : 'originalCanvas', 'mode': 2});
  }
}
window.onload = function() {
  selectedImage = random(0, demoimages.length-1);
  printImgList(demoimages,'imglist');
  loadImageToCanvas(demoimages, selectedImage);
  imagebuttons[selectedImage].className += ' blue';
  for (i = 0; i < modebuttons.length; i++) {
    modebuttons[i].onclick = function () {
      var classes, i, active;
      for (i = 0; i < modebuttons.length; i++) {
        classes = modebuttons[i].className.split(/\s+/);
        active = classes.indexOf('blue');
        if(active !== -1) {
          classes[active] = '';
        }
        modebuttons[i].className = classes.join(" ");
      }
      edgeDetectLines = [];
      this.className += ' blue';
      resizeMode = this.innerHTML;
      changeSlider();
    }
  }
  for (i = 0; i < imagebuttons.length; i++) {
    imagebuttons[i].onclick = function () {
      var classes, i, active;
      for (i = 0; i < imagebuttons.length; i++) {
        classes = imagebuttons[i].className.split(/\s+/);
        active = classes.indexOf('blue');
        if(active !== -1) {
          classes[active] = '';
        }
        imagebuttons[i].className = classes.join(" ");
      }
      this.className += ' blue';
      loadImageToCanvas(demoimages,this.getAttribute("data-imgid"));
    }
  }
};
