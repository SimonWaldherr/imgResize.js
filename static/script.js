var demoimages = [{'name':'Air Force One','license':'Arbeit der US-Regierung','filename':'4032618153_e0c19e93a0_z.jpg','source':'http://www.flickr.com/photos/whitehouse/4032618153/','height':427},
                  {'name':'On the Moon','license':'Keine Urheberrechtsbeschränkungen','filename':'5136519916_e5beec314f_z.jpg','source':'http://www.flickr.com/photos/nasacommons/5136519916/','height':640},
                  {'name':'Tree Silhouette','license':'CC BY-SA 2.0','filename':'525294006_2f0ffd631f_z.jpg','source':'http://www.flickr.com/photos/peterpearson/525294006/','height':426},
                  {'name':'Tree and Sky','license':'CC BY-NC 2.0','filename':'2515331481_4997cae738_z.jpg','source':'http://www.flickr.com/photos/freefoto/2515331481/','height':480},
                  {'name':'Two Trees','license':'CC BY-SA 2.0','filename':'2280692112_96b565920b_z.jpg','source':'http://www.flickr.com/photos/salford_ian/2280692112/','height':480}];
function loadImageToCanvas(json, id) {
  loadImage({'canvas' : document.getElementById('Canvas'), 'ocanvas' : document.getElementById('originalCanvas'), 'img' : 'static/'+json[id].filename});
  loadImage({'canvas' : document.getElementById('originalCanvas'), 'img' : 'static/'+json[id].filename});
  document.getElementById('height').setAttribute('max',json[id].height);
  document.getElementById('height').setAttribute('value',json[id].height);
  document.getElementById('width').setAttribute('value',640);
  document.getElementById('heights').setAttribute('max',json[id].height);
  document.getElementById('heights').setAttribute('value',json[id].height);
  document.getElementById('widths').setAttribute('value',640);
  
  document.getElementById('originalCanvas').setAttribute('height',json[id].height);
  document.getElementById('Canvas').setAttribute('height',json[id].height);
  edgeDetectLines = [];
}
function printImgList(json, id) {
  var i, output = '', regex = /(http:\/\/www\.([a-zA-Z.\/_]+))/i, linktext;
  for(i=0;i<json.length;i+=1) {
    linktext = regex.exec(json[i].source);
    output += '<li><b onclick="loadImageToCanvas(demoimages,'+i+')">'+json[i].name+'</b> <i>(license: '+json[i].license+', from: <a href="'+json[i].source+'">'+linktext[2]+'</a>)</i></li>';
  }
  document.getElementById(id).innerHTML = output;
}
window.onload = function() {
  printImgList(demoimages,'imglist');
  loadImageToCanvas(demoimages, 0);
};
