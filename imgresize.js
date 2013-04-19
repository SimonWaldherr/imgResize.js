/*
 * imgResize.js
 *
 * Copyright 2013, Simon Waldherr - http://simon.waldherr.eu/
 * Released under the MIT Licence
 * http://opensource.org/licenses/MIT
 *
 * Github:  https://github.com/SimonWaldherr/imgResize.js
 * Version: 0.0.5
 */

/*jslint browser: true*/
/*global Image*/
/*exported imgSmartResize*/

function edgeDetection(input, baseColor, grey, context, canvas) {
  "use strict";
  var output = context.createImageData(canvas.width, canvas.height),
    w = input.width,
    h = input.height,
    inputData = input.data,
    outputData = output.data,
    bytesPerRow = w * 4,
    pixel = bytesPerRow + 4,
    hm1 = h - 1,
    wm1 = w - 1,
    centerRow,
    priorRow,
    nextRow,
    factor,
    r1, g1, b1, rp, rc, rn, r2, gp, gc, gn, g2, bp, bc, bn, b2, r, g, b, x, y;
  for (y = 1; y < hm1; y += 1) {
    centerRow = pixel - 4;
    priorRow = centerRow - bytesPerRow;
    nextRow = centerRow + bytesPerRow;
    r1 = -inputData[priorRow] - inputData[centerRow] - inputData[nextRow];
    g1 = -inputData[priorRow += 1] - inputData[centerRow += 1] - inputData[nextRow += 1];
    b1 = -inputData[priorRow += 1] - inputData[centerRow += 1] - inputData[nextRow += 1];
    rp = inputData[priorRow += 2];
    rc = inputData[centerRow += 2];
    rn = inputData[nextRow += 2];
    r2 = -rp - rc - rn;
    gp = inputData[priorRow += 1];
    gc = inputData[centerRow += 1];
    gn = inputData[nextRow += 1];
    g2 = -gp - gc - gn;
    bp = inputData[priorRow += 1];
    bc = inputData[centerRow += 1];
    bn = inputData[nextRow += 1];
    b2 = -bp - bc - bn;
    for (x = 1; x < wm1; x += 1) {
      centerRow = pixel + 4;
      priorRow = centerRow - bytesPerRow;
      nextRow = centerRow + bytesPerRow;
      r = baseColor + r1 - rp - (rc * -8) - rn;
      g = baseColor + g1 - gp - (gc * -8) - gn;
      b = baseColor + b1 - bp - (bc * -8) - bn;
      r1 = r2;
      g1 = g2;
      b1 = b2;
      rp = inputData[priorRow];
      rc = inputData[centerRow];
      rn = inputData[nextRow];
      r2 = -rp - rc - rn;
      gp = inputData[priorRow += 1];
      gc = inputData[centerRow += 1];
      gn = inputData[nextRow += 1];
      g2 = -gp - gc - gn;
      bp = inputData[priorRow += 1];
      bc = inputData[centerRow += 1];
      bn = inputData[nextRow += 1];
      b2 = -bp - bc - bn;
      if (!grey) {
        outputData[pixel] = r + r2;
        outputData[pixel += 1] = g + g2;
        outputData[pixel += 1] = b + b2;
      } else {
        factor = 0.3 * (r + r2) + 0.59 * (g + g2) + 0.11 * (b + b2);
        outputData[pixel] = factor;
        outputData[pixel += 1] = factor;
        outputData[pixel += 1] = factor;
      }
      outputData[pixel += 1] = 255;
      pixel += 1;
    }
    pixel += 8;
  }
  return output;
}

function doColorBook(input, cxt, canvas, mode) {
  "use strict";
  var w = input.width,
    h = input.height,
    output = edgeDetection(input, 255, 1, cxt, canvas),
    outputData = output.data,
    newData = [],
    tempData,
    maxData = false,
    minData = false,
    pixel = 0,
    y, x, i;
  for (y = 0; y < h; y += 1) {
    for (x = 0; x < w; x += 1) {
      if (mode === 'h') {
        tempData = newData[y];
      } else if (mode === 'w') {
        tempData = newData[x];
      }
      if (outputData[pixel] < 240) {
        if (tempData === undefined) {
          if (mode === 'h') {
            newData[y] = 0;
          } else if (mode === 'w') {
            newData[x] = 0;
          }
          tempData = 0;
        }
        if (mode === 'h') {
          newData[y] += 1;
        } else if (mode === 'w') {
          newData[x] += 1;
        }
        tempData += 1;
      } else {
        if (tempData === undefined) {
          if (mode === 'h') {
            newData[y] = 0;
          } else if (mode === 'w') {
            newData[x] = 0;
          }
          tempData = 0;
        }
      }
      if ((tempData < minData) || (!minData)) {
        minData = tempData;
      }
      if ((tempData > maxData) || (!maxData)) {
        maxData = tempData;
      }
      pixel += 4;
    }
  }
  for (i = 0; i < newData.length; i += 1) {
    newData[i] = parseInt((newData[i] - minData) / (maxData - minData) * 255, 10);
  }
  return newData;
}

var edgeDetectLines = [];

function edgeDetect(options) {
  "use strict";
  var ocanvas = (typeof options.ocanvas !== 'string') ? options.ocanvas : document.getElementById(options.ocanvas),
    ocxt = ocanvas.getContext("2d"),
    input = ocxt.getImageData(0, 0, ocanvas.width, ocanvas.height),
    edgeDetectLinesTemp = [];

  edgeDetectLinesTemp[0] = doColorBook(input, ocxt, ocanvas, 'w');
  edgeDetectLinesTemp[1] = doColorBook(input, ocxt, ocanvas, 'h');
  return edgeDetectLinesTemp;
}

function boringLines(linesArray, max) {
  "use strict";
  var highest,
    newLinesArray = [],
    i,
    higharray = [];

  newLinesArray = linesArray.slice();
  max = (max === undefined) ? newLinesArray.length : (max > newLinesArray.length) ? newLinesArray.length : max;
  for (i = 0; i < max; i += 1) {
    highest = newLinesArray.indexOf(Math.min.apply(window, newLinesArray));
    if (newLinesArray[highest] < 255) {
      newLinesArray[highest] = 255;
      higharray[higharray.length] = highest;
    }
  }
  return higharray;
}

function imgSmartResize(options) {
  "use strict";
  var canvas = (typeof options.canvas !== 'string') ? options.canvas : document.getElementById(options.canvas),
    ocanvas = (typeof options.ocanvas !== 'string') ? options.ocanvas : document.getElementById(options.ocanvas),
    imgsrc = (options.img !== undefined) ? (typeof options.img !== 'string') ? options.img.src : options.img : canvas.getAttribute('data-src'),
    height = (options.height !== undefined) ? options.height : canvas.getAttribute('height'),
    width = (options.width !== undefined) ? options.width : canvas.getAttribute('width'),
    cxt = canvas.getContext("2d"),
    ocxt = ocanvas.getContext("2d"),
    ignoreRows,
    ignoreCols,
    pixel = 0,
    opixel = 0,
    img,
    x, y,
    original = ocxt.getImageData(0, 0, ocanvas.getAttribute('width'), ocanvas.getAttribute('height')),
    outputData = cxt.createImageData(width, height),
    ocanvasheight = ocanvas.getAttribute('height'),
    ocanvaswidth = ocanvas.getAttribute('width'),
    pixelid = 0,
    r, g, b,
    originalarray = original.data,
    outputarray = [],
    buf = new ArrayBuffer((width) * (height) * 4),
    buf8 = new Uint8ClampedArray(buf),
    data = new Uint32Array(buf);

  if (edgeDetectLines === undefined) {
    edgeDetectLines = edgeDetect(options);
  } else if (edgeDetectLines.length === 0) {
    edgeDetectLines = edgeDetect(options);
  }

  ignoreRows = boringLines(edgeDetectLines[1], ocanvas.getAttribute('height') - height);
  ignoreCols = boringLines(edgeDetectLines[0], ocanvas.getAttribute('width') - width);

  canvas.width = width;
  canvas.height = height;

  for (y = 0; y < ocanvasheight; ++y) {
    var starttime1 = new Date();
    for (x = 0; x < ocanvaswidth; ++x) {
      if ((ignoreRows.indexOf(y) === -1) && (ignoreCols.indexOf(x) === -1)) {
        r = originalarray[opixel] & 0xff;
        g = originalarray[++opixel] & 0xff;
        b = originalarray[++opixel] & 0xff;

        data[pixelid] =
          (255 << 24) | // alpha
        (b << 16) | // blue
        (g << 8) | // green
        r; // red

        ++pixelid;
        opixel += 2;
      } else {
        opixel += 4;
      }
    }
  }
  outputData.data.set(buf8);

  img = new Image();
  img.src = imgsrc;
  cxt.putImageData(outputData, 0, 0, 0, 0, width, height);
}
