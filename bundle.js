var gulp = require('gulp');
var jspm = require('jspm');
var fs = require('fs');
var paths = require('../paths');
var shell = require('child-process-promise');
var filesize = require('filesize');
var gzipSize = require('gzip-size');

/**
 * Bundle aurelia-framework into one file
 */
gulp.task('bundle', function (done) {

  var distFile = 'aurelia.js';
  var outputFile = paths.output+ distFile;

  var cmd = [
    'aurelia-bootstrapper',
    'aurelia-http-client',
    'aurelia-dependency-injection',
    'aurelia-framework',
    'aurelia-router',
    'npm:core-js',

    'github:aurelia/metadata@0.5.0',
    'github:aurelia/task-queue@0.4.0',
    'github:aurelia/event-aggregator@0.4.0',
    'github:aurelia/templating@0.11.2',
    'github:aurelia/history@0.4.0',
    'github:aurelia/history-browser@0.4.0',
    'github:aurelia/event-aggregator@0.4.0',
    'github:aurelia/templating-router@0.12.0',
    'github:aurelia/templating-resources@0.11.1',
    'github:aurelia/templating-binding@0.11.0',
    'github:aurelia/binding@0.6.1',
    'github:aurelia/loader-default@0.7.0'

  ].join(' + ');
  
  jspm.bundle(cmd,distFile,{inject:true,minify:true}).then(function(){
    fs.rename(distFile, outputFile, function(){
      showStats(outputFile);
      done();
    });
  });

});

/**
 * Bundle application and vendor files.
 */
gulp.task('bundle-app', function (done) {

  var distFile = 'app-bundle.js';
  var outputFile = paths.output+distFile;

  if(fs.existsSync(outputFile)) fs.unlinkSync(outputFile);

  var cmd =  "**/* - aurelia";
  jspm.bundle(cmd,distFile,{inject:true,minify:true}).then(function(){
    fs.rename(distFile, outputFile, function(){
      showStats(outputFile);
      done();
    });
  });

});

/**
 * unbundle the aurelia-framework and use separate files again
 */
gulp.task('unbundle', function (done) {
  return shell.exec('jspm unbundle');
});

function showStats(distFile) {
  if(!fs.existsSync(distFile)) return null;

  var stats = fs.statSync(distFile);
  var cssFile = distFile.substr(0,distFile.lastIndexOf("."))+".css";

  var cssExists = fs.existsSync(cssFile);
  var cssStats;
  if(cssExists) cssStats = fs.statSync(cssFile);
  console.log("=============== REPORT ================");
  if(cssExists) console.log("Javascript Bundle");
  console.log("minified and mangled : " + filesize(stats.size));
  console.log("gzip: " + filesize(gzipSize.sync(fs.readFileSync(distFile))));

  if(cssExists) {
    console.log("");
    console.log("CSS Bundle");
    console.log("minified and mangled : " + filesize(cssStats.size));
    console.log("gzip: " + filesize(gzipSize.sync(fs.readFileSync(cssFile))));
  }
  console.log("=======================================");
}
