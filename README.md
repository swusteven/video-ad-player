## Criteo video player

## Purpose

This library aims at rendering ad videos with a vast file (either by content or by URL).
You can import this library as a package or as a file. Both are provided in the examples

### Usage

There are two examples in the `examples/` folder of how to use the library. You could either install it with npm or you can directly include the bundled script file and css in an html file. 

The package provides two APIs to render your videos. 
- From URL: `criteoVideoPlayerFromUrl`. The script will fetch the VAST file from the URL and afterwards display the video. 
- From content: `criteoVideoPlayerFromContent`. The script will use the passed file content (expecting a stringified XML) and afterwards display the video. 

For each, you should provide a `video element` which should be an HTML element in which you want the video to be rendered. 
