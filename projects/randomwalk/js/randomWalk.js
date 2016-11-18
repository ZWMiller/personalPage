// Copyright (C) 2011 Jan Wrobel <wrr@mixedbit.org>
// Table Structure from Jan Wrobel
// Everything else - ZW Miller 2016

var globalwalkers = [];
var walkSpeed;

"use strict";

var CELL_SIZE_PX = 15;
var easel = {
  selector: 0,
  wcolors:  ["#D41316","#55F01D","#F8FF6B","#FFDB3B","#00E3E0","#3064FF","#F261FF"],
  wpcolors: ["#9C1F21","#328C11","#CCD613","#E89F00","#1AABA9","#1643C9","#B221BF"],
  mapcolor: ["#06EEFF","#06EEFF","#06EEFF","#25FF1D","#25FF1D","#25FF1D"],
  mappcolor:["#1668E3","#2D3BFF","#27A9FF","#1AB114","#1DC817","#127C0E"],
  bgcolor: "#333333"
} 
var timer;

function createTable(height, width) {
  var space, row, cell, i, j;
  space = document.getElementById("space");
  for (i = 0; i < height; i += 1) {
    row = space.insertRow(-1);
    for (j = 0; j < width; j += 1) {
      cell = row.insertCell(j);
      cell.style.width = (CELL_SIZE_PX - 1) + "px";
      cell.style.height = (CELL_SIZE_PX - 1) + "px";
      cell.style.background = easel.bgcolor;
    }
  }
}

function checkForWrapAround(wlk){
  if(wlk.x < 0)
    wlk.x = getWidth()-1;
  if(wlk.x > getWidth()-1)
    wlk.x = 0;
  if(wlk.y < 0)
    wlk.y = getHeight()-1;
  if(wlk.y > getHeight()-1)
    wlk.y = 0;
}

function displaySpace(walkers) {
  var table, row, cell, k, i, j;
  table = document.getElementById("space");
  for(var wlk of walkers){
    checkForWrapAround(wlk);
    row = table.rows[wlk.y];
    cell = row.cells[wlk.x];
    cell.style.background = wlk.color;
    for(var pspace of wlk.previouspositions){
      row = table.rows[pspace[1]];
      cell = row.cells[pspace[0]];
      cell.style.background = wlk.pcolor;
    }
  }
}


function create2dArray(height, width) {
  var result, i;
  result = [];
  result.length = height;
  for (i = 0; i < height; i += 1) {
    result[i] = [];
    result[i].length = width;
  }
  return result;
}

function getWindowWidthAndHeight() {
  // the more standards compliant browsers
  // (mozilla/netscape/opera/IE7) use window.innerWidth and
  // window.innerHeight
  if (typeof window.innerWidth !== 'undefined') {
    return [window.innerWidth, window.innerHeight];
  }

  // IE6 in standards compliant mode (i.e. with a valid doctype as the
  // first line in the document)
  if (typeof document.documentElement !== 'undefined'
      && typeof document.documentElement.clientWidth !==
    'undefined' && document.documentElement.clientWidth !== 0) {
        return [document.documentElement.clientWidth,
          document.documentElement.clientHeight];
      }
      // older versions of IE
      return [document.getElementsByTagName('body')[0].clientWidth,
        document.getElementsByTagName('body')[0].clientHeight];

}

function getWindowWidth() {
  return getWindowWidthAndHeight()[0];
}

function getWindowHeight() {
  return getWindowWidthAndHeight()[1];
}

function getHeight(){
  return Math.floor(getWindowHeight() / CELL_SIZE_PX) - 1;
}

function getWidth(){
  return Math.floor(getWindowWidth() / CELL_SIZE_PX) - 1;
}

function main() {
  var width, height, space;
  width = Math.floor(getWindowWidth() / CELL_SIZE_PX) - 1;
  height = Math.floor(getWindowHeight() / CELL_SIZE_PX) - 1;
  createTable(height, width);
  space = create2dArray(height, width);
  globalwalkers = createInitialWalkers(7);
  walkSpeed = 100;
  runProgram(globalwalkers);
}

function runProgram(walkers){
  displaySpace(walkers);
  evolveWalkers(walkers);
  var callback = function() {
    runProgram(walkers);
  }
  timer = setTimeout(callback,walkSpeed);
}

function evolveWalkers(walkers){
  for(var wlk of walkers){
    wlk.previouspositions.pop(); 
    wlk.previouspositions.push([wlk.x,wlk.y]);

    var rnd = Math.random()*4;
    if(rnd < 1)
      wlk.x++;
    else if(rnd<2)
      wlk.x--;
    else if(rnd<3)
      wlk.y++;
    else if(rnd<4)
      wlk.y--;
  }
}

function createInitialWalkers(numWalkers){
  var walkerArray=[];
  for(var nWalk=0; nWalk<numWalkers; nWalk++){
    if(walkerArray.length >=7)
      walkerArray.pop();
    easel.selector++;
    walkerArray.unshift(instantiateWalker(easel.wcolors[easel.selector%7],easel.wpcolors[easel.selector%7]));
  }
  return walkerArray;
}

function instantiateWalker(clr1, clr2){
  return {
    x: Math.floor(Math.random()*getWidth()),
    y: Math.floor(Math.random()*getHeight()),
    previouspositions: [],
    clearposition: [],
    color:  clr1,
    pcolor: clr2,
    bcolor: easel.bgcolor
  };
}

if (window.attachEvent) {
  window.attachEvent('onload', main);
} else {
  window.onload = main;
}

function addUserWalker(){ 
  stopProgramLoop();
  setTimeout(handleWalkers(),walkSpeed);
}

function stopProgramLoop(){
  window.clearTimeout(timer);
}

function handleWalkers(){
  if(globalwalkers.length > 10)
    deleteOldestWalker();
  var userLeadColor = "#"+document.getElementById("leadColor").value; 
  var userTrailColor = "#"+document.getElementById("trailColor").value; 
  globalwalkers.unshift(instantiateWalker(userLeadColor,userTrailColor));
  runProgram(globalwalkers);
}

function addMapWalkers(){
  stopProgramLoop();
  setTimeout(startMapWalkers(),walkSpeed);
}
function startMapWalkers(){

  for(var walkN=0; walkN<easel.mapcolor.length; walkN++){
    globalwalkers.unshift(instantiateWalker(easel.mapcolor[walkN],easel.mappcolor[walkN]));
  }
    runProgram(globalwalkers);
}

function toggleWalkSpeed(){
  stopProgramLoop();
  if(walkSpeed == 100)
    walkSpeed = 20;
  else if(walkSpeed == 20)
    walkSpeed = 100;
  runProgram(globalwalkers);
}

function deleteOldestWalker(){
  if(globalwalkers.length <= 0)
    return;
  var wlk = globalwalkers[globalwalkers.length - 1]
  var table = document.getElementById("space");
  var row = table.rows[wlk.y];
  var cell = row.cells[wlk.x];
  cell.style.background = wlk.pcolor;
  for(var pspace of wlk.previouspositions){
    row = table.rows[pspace[1]];
    cell = row.cells[pspace[0]];
      cell.style.background = wlk.pcolor;
  }
  globalwalkers.pop();
}

function clearScreenAndWalkers()
{
  var row, cell;
  stopProgramLoop();
  var table = document.getElementById("space");
  while(globalwalkers.length > 0){
    deleteOldestWalker();
  }
  for (var i = 0; i < getHeight(); i += 1) {
    for (var j = 0; j < getWidth(); j += 1) {
      row = table.rows[i];
      cell = row.cells[j];
      cell.style.background = easel.bgcolor;
    }
  }
}
