#
# * tinyOSF.js
# *
# * Copyright 2013, Simon Waldherr - http://simon.waldherr.eu/
# * Released under the MIT Licence
# * http://opensource.org/licenses/MIT
# *
# * Github:  https://github.com/SimonWaldherr/imgResize.js
# * Version: 0.0.2
# 

#jslint browser: true

#global Image

#exported imgSmartResize, loadImage, imgResize
loadImage = (options) ->
  "use strict"
  canvas = (if (typeof options.canvas isnt "string") then options.canvas else document.getElementById(options.canvas))
  imgsrc = (if (options.img isnt `undefined`) then (if (typeof options.img isnt "string") then options.img.src else options.img) else canvas.getAttribute("data-src"))
  cxt = undefined
  img = undefined
  canvas.setAttribute "data-src", imgsrc
  cxt = canvas.getContext("2d")
  img = new Image()
  img.onload = ->
    cxt.drawImage img, 0, 0

  img.src = imgsrc
edgeDetection = (input, baseColor, grey, context, canvas) ->
  "use strict"
  output = context.createImageData(canvas.width, canvas.height)
  w = input.width
  h = input.height
  inputData = input.data
  outputData = output.data
  bytesPerRow = w * 4
  pixel = bytesPerRow + 4
  hm1 = h - 1
  wm1 = w - 1
  centerRow = undefined
  priorRow = undefined
  nextRow = undefined
  factor = undefined
  r1 = undefined
  g1 = undefined
  b1 = undefined
  rp = undefined
  rc = undefined
  rn = undefined
  r2 = undefined
  gp = undefined
  gc = undefined
  gn = undefined
  g2 = undefined
  bp = undefined
  bc = undefined
  bn = undefined
  b2 = undefined
  r = undefined
  g = undefined
  b = undefined
  x = undefined
  y = undefined
  y = 1
  while y < hm1
    centerRow = pixel - 4
    priorRow = centerRow - bytesPerRow
    nextRow = centerRow + bytesPerRow
    r1 = -inputData[priorRow] - inputData[centerRow] - inputData[nextRow]
    g1 = -inputData[priorRow += 1] - inputData[centerRow += 1] - inputData[nextRow += 1]
    b1 = -inputData[priorRow += 1] - inputData[centerRow += 1] - inputData[nextRow += 1]
    rp = inputData[priorRow += 2]
    rc = inputData[centerRow += 2]
    rn = inputData[nextRow += 2]
    r2 = -rp - rc - rn
    gp = inputData[priorRow += 1]
    gc = inputData[centerRow += 1]
    gn = inputData[nextRow += 1]
    g2 = -gp - gc - gn
    bp = inputData[priorRow += 1]
    bc = inputData[centerRow += 1]
    bn = inputData[nextRow += 1]
    b2 = -bp - bc - bn
    x = 1
    while x < wm1
      centerRow = pixel + 4
      priorRow = centerRow - bytesPerRow
      nextRow = centerRow + bytesPerRow
      r = baseColor + r1 - rp - (rc * -8) - rn
      g = baseColor + g1 - gp - (gc * -8) - gn
      b = baseColor + b1 - bp - (bc * -8) - bn
      r1 = r2
      g1 = g2
      b1 = b2
      rp = inputData[priorRow]
      rc = inputData[centerRow]
      rn = inputData[nextRow]
      r2 = -rp - rc - rn
      gp = inputData[priorRow += 1]
      gc = inputData[centerRow += 1]
      gn = inputData[nextRow += 1]
      g2 = -gp - gc - gn
      bp = inputData[priorRow += 1]
      bc = inputData[centerRow += 1]
      bn = inputData[nextRow += 1]
      b2 = -bp - bc - bn
      unless grey
        outputData[pixel] = r + r2
        outputData[pixel += 1] = g + g2
        outputData[pixel += 1] = b + b2
      else
        factor = 0.3 * (r + r2) + 0.59 * (g + g2) + 0.11 * (b + b2)
        outputData[pixel] = factor
        outputData[pixel += 1] = factor
        outputData[pixel += 1] = factor
      outputData[pixel += 1] = 255
      pixel += 1
      x += 1
    pixel += 8
    y += 1
  output
doColorBookH = (input, cxt, canvas) ->
  "use strict"
  w = input.width
  h = input.height
  output = edgeDetection(input, 255, 1, cxt, canvas)
  outputData = output.data
  newData = []
  maxData = false
  minData = false
  pixel = 0
  y = undefined
  x = undefined
  i = undefined
  y = 0
  while y < h
    x = 0
    while x < w
      if outputData[pixel] < 240
        newData[y] = 0  if newData[y] is `undefined`
        newData[y] += 1
      else
        newData[y] = 0  if newData[y] is `undefined`
      minData = newData[y]  if (newData[y] < minData) or (not minData)
      maxData = newData[y]  if (newData[y] > maxData) or (not maxData)
      pixel += 4
      x += 1
    y += 1
  i = 0
  while i < newData.length
    newData[i] = parseInt((newData[i] - minData) / (maxData - minData) * 255, 10)
    i += 1
  newData
doColorBookW = (input, cxt, canvas) ->
  "use strict"
  w = input.width
  h = input.height
  output = edgeDetection(input, 255, 1, cxt, canvas)
  outputData = output.data
  newData = []
  maxData = false
  minData = false
  pixel = 0
  y = undefined
  x = undefined
  i = undefined
  y = 0
  while y < h
    x = 0
    while x < w
      if outputData[pixel] < 240
        newData[x] = 0  if newData[x] is `undefined`
        newData[x] += 1
      else
        newData[x] = 0  if newData[x] is `undefined`
      minData = newData[x]  if (newData[x] < minData) or (not minData)
      maxData = newData[x]  if (newData[x] > maxData) or (not maxData)
      pixel += 4
      x += 1
    y += 1
  i = 0
  while i < newData.length
    newData[i] = parseInt((newData[i] - minData) / (maxData - minData) * 255, 10)
    i += 1
  newData
edgeDetect = (options) ->
  "use strict"
  canvas = (if (typeof options.canvas isnt "string") then options.canvas else document.getElementById(options.canvas))
  cxt = canvas.getContext("2d")
  input = cxt.getImageData(0, 0, canvas.width, canvas.height)
  edgeDetectLines[0] = doColorBookW(input, cxt, document.getElementById("originalCanvas"))
  edgeDetectLines[1] = doColorBookH(input, cxt, document.getElementById("originalCanvas"))
  document.getElementById("json").innerHTML = JSON.stringify(edgeDetectLines)
  edgeDetectLines
imgResize = (options) ->
  "use strict"
  canvas = (if (typeof options.canvas isnt "string") then options.canvas else document.getElementById(options.canvas))
  imgsrc = (if (options.img isnt `undefined`) then (if (typeof options.img isnt "string") then options.img.src else options.img) else canvas.getAttribute("data-src"))
  height = (if (options.height isnt `undefined`) then options.height else canvas.getAttribute("height"))
  width = (if (options.width isnt `undefined`) then options.width else canvas.getAttribute("width"))
  cxt = undefined
  img = undefined
  canvas.setAttribute "width", width
  canvas.setAttribute "height", height
  cxt = canvas.getContext("2d")
  img = new Image()
  img.src = imgsrc
  cxt.drawImage img, 0, 0, width, height
imgSmartResize = (options) ->
  boringLines = (linesArray, max) ->
    highest = undefined
    i = undefined
    higharray = []
    max = (if (max is `undefined`) then linesArray.length else (if (max > linesArray.length) then linesArray.length else max))
    i = 0
    while i < max
      highest = linesArray.indexOf(Math.min.apply(window, linesArray))
      if linesArray[highest] < 255
        linesArray[highest] = 255
        higharray[higharray.length] = highest
      i += 1
    higharray
  "use strict"
  canvas = (if (typeof options.canvas isnt "string") then options.canvas else document.getElementById(options.canvas))
  imgsrc = (if (options.img isnt `undefined`) then (if (typeof options.img isnt "string") then options.img.src else options.img) else canvas.getAttribute("data-src"))
  height = (if (options.height isnt `undefined`) then options.height else canvas.getAttribute("height"))
  width = (if (options.width isnt `undefined`) then options.width else canvas.getAttribute("width"))
  cxt = canvas.getContext("2d")
  ocanvas = document.getElementById("originalCanvas")
  ocxt = ocanvas.getContext("2d")
  ignoreRows = undefined
  ignoreCols = undefined
  pixel = 0
  opixel = 0
  img = undefined
  x = undefined
  y = undefined
  original = ocxt.getImageData(0, 0, ocanvas.getAttribute("width"), ocanvas.getAttribute("height"))
  outputData = cxt.createImageData(width, height)
  edgeDetect canvas: "Canvas"
  ignoreRows = boringLines(edgeDetectLines[1], ocanvas.getAttribute("height") - height)
  ignoreCols = boringLines(edgeDetectLines[0], ocanvas.getAttribute("width") - width)
  canvas.width = width
  canvas.height = height
  y = 0
  while y < ocanvas.getAttribute("height")
    x = 0
    while x < ocanvas.getAttribute("width")
      if (ignoreRows.indexOf(y) is -1) and (ignoreCols.indexOf(x) is -1)
        outputData.data[pixel] = original.data[opixel]
        outputData.data[pixel += 1] = original.data[opixel += 1]
        outputData.data[pixel += 1] = original.data[opixel += 1]
        outputData.data[pixel += 1] = 255
        opixel += 1
        opixel += 1
        pixel += 1
      else
        opixel += 1
        opixel += 1
        opixel += 1
        opixel += 1
      x += 1
    y += 1
  img = new Image()
  img.src = imgsrc
  cxt.putImageData outputData, 0, 0, 0, 0, width, height
edgeDetectLines = []
