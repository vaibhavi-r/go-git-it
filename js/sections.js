console.log("Welcome to SECTIONS.JS");

/**
 * scrollVis - encapsulates
 * all the code for the visualization
 * using reusable charts pattern:
 * http://bost.ocks.org/mike/chart/
 */

var scrollVis = function(){
    console.log("..Scroll Vis function");

    // Keep track of which visualization
    // we are on and which was the last
    // index activated. When user scrolls
    // quickly, we want to call all the
    // activate functions that they pass.
    var lastIndex = -1;
    var activeIndex = 0;

    // main svg used for visualization
    var svg = null; //#vis

    // d3 selection that will be used
    // for displaying visualizations
    var g = null;  

    // Scales converting 0-100 to the Chart's width and height
    // Useful to specify relative x,y position, independent of custom pixel area
    xScale = d3.scaleLinear()
      .domain([0,100])
      .range([0, width]);

    yScale = d3.scaleLinear()
      .domain([0,100])
      .range([height, 0]);

    xAxis = d3.axisBottom()
       .scale(xScale);

    yAxis = d3.axisLeft()
       .scale(yScale);


    // When scrolling to a new section
    // the activation function for that
    // section is called.
    var activateFunctions = [];

    // If a section has an update function
    // then it is called while scrolling
    // through the section with the current
    // progress through the section.
    var updateFunctions = [];

    /**
     * chart
     *
     * @param selection - the current d3 selection(s)
     *  to draw the visualization in. For this
     *  example, we will be drawing it in #vis
     */

    var chart = function (selection) {
      // console.log("Selection - ", selection); //#vis div

      selection.each(function () {
          // create svg and give it a width and height
          svg = d3.select(this).append('svg');
          // console.log('SVG = ', svg);

          svg.attr('width', width + margin.left + margin.right);
          svg.attr('height', height + margin.top + margin.bottom);

          svg.append('g');

          // this group element will be used to contain all other elements.
          g = svg.select('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

          setupVis();
          setupSections();
        });
      }; //END chart


    /**
     * setupVis - creates initial DOM elements for all
     * sections of the visualization.
     */
    var setupVis = function () {

        console.log("....Setup Vis")
        // x-axis
        g.append('g')
          .attr('class', 'x axis')
          .attr('transform', 'translate(0,' + height + ')')
          .call(xAxis);
        g.select('.x.axis').style('opacity', 0);

        // y-axis
        g.append('g')
          .attr('class', 'y axis')
          .attr('transform', 'translate(0,0)')
          .call(yAxis);
        g.select('.y.axis').style('opacity', 0);


        // vis title
        g.append('text')
          .attr('class', 'title vis-title highlight')
          .attr('x', width / 2)
          .attr('y', height / 3)
          .text('Go Git It');

        g.append('text')
          .attr('class', 'sub-title vis-title')
          .attr('x', width / 2)
          .attr('y', (height / 3) + (height / 5))
          .text('An Explorable Explanation');

        g.selectAll('.vis-title')
          .attr('opacity', 0);


        //Function to create text with given dimensions, fill and opacity

        var createText = function(className,id, txt, x, y, op)
        {
            g.append("text")
              .attr("class", className)
              .attr("id",id)
              .attr("x", xScale(x))
              .attr("y", yScale(y))
              .attr('opacity',op)
              .text(txt);
        }
        

        createText("space-text","workspace-text","Workspace",25,80,0);
        createText("space-text","index-text","Index",45,80,0);
        createText("space-text","localrep-text","Local Repo",65,80,0);
        createText("space-text","remoterep-text","Remote Repo",85,80,0);
        createText("space-text","stash-text","Stash",5,80,0);


        //Function to create rectangle with given dimensions, fill and opacity
        var createRect = function(className, x, y, w, h, color, op)
        {
            g.append("rect")
              .attr("class", className + " rectangle")
              .attr("x", xScale(x))
              .attr("y", yScale(y))
              .attr("width", w)
              .attr("height", h)
              .style("fill", color)
              .attr('opacity',op);
        }

        //@global
        w = width/10;
        h = height*4.5/10; 
        //Create Rectangles for Different Locations for Content Model
        createRect("stash", -100, 65, w, h,"#dfdfde", 0);
        createRect("workspace",-100, 65, w, h, "#dfdfde", 0);
        createRect("indexspace",-100, 65, w, h, "#dfdfde", 0);
        createRect("local-rep", -100, 65, w, h, "#dfdfde", 0);
        createRect("remote-rep",200, 65, w, h, "#ebdada", 0); //Different color and start position for remote repo

        //Function to create image with given link, alt, dimensions and opacity
        var createImage = function(img, className, id, alt, x, y, w, h, op ){
            g.append("image")
              .attr("class", className)
              .attr("id", id)
              .attr("xlink:href", img)
              .attr("alt", "alt")
              .attr("x", xScale(x))
              .attr("y", yScale(y))
              .attr("width", w)
              .attr("height", h)
              .attr("opacity", op);
        }

        //Create Images for each picture that might be on the screen              
        createImage("src/images/git_icono.svg",    "icon picture", "git-icon", "git icon", 30, 100, 400, 400, 0);
        createImage("src/images/places_model.svg", "places", "places-model", "places model", 0, 100, 850, 340, 0);


        //@global
        w_file = width/10;
        h_file = w_file;   
        createImage("src/images/file-black.png",  "icon file-icon", "file1", "file", 0, 0, w_file, h_file, 0);
        createImage("src/images/file-black.png",  "icon file-icon", "file2", "file", 0, 50, w_file, h_file, 0);
        createImage("src/images/file-black.png",    "icon file-icon", "file3", "file", 0, 50, w_file, h_file, 0);
        createImage("src/images/file-black.png", "icon file-icon", "file4", "file", 0, 50, w_file, h_file, 0);


        createImage("src/images/cloud.png",    "icon place-icon", "remote-icon", "git icon", 85, 80, w_file, h_file, 0);
        createImage("src/images/local-rep.png", "icon place-icon", "local-icon", "git icon", 65, 80, w_file, h_file, 0);
        createImage("src/images/index.png",    "icon place-icon", "index-icon", "git icon", 45, 80, w_file, h_file, 0);
        createImage("src/images/directory.png", "icon place-icon", "directory-icon", "git icon", 25, 80, w_file, h_file, 0);
        createImage("src/images/stash.png",    "icon place-icon", "stash-icon", "git icon", 5, 80, w_file, h_file, 0);

        /*
          Add dynamic path for tweening image
          Inspiration: https://bl.ocks.org/mbostock/1705868
          http://bl.ocks.org/KoGor/8162640
          https://bl.ocks.org/mbostock/5649592
          http://www.thesoftwaresimpleton.com/blog/2016/06/12/animate-path-arc/
          http://bl.ocks.org/dbuezas/9306799
          https://stackoverflow.com/questions/41865014/how-to-change-easing-in-d3-pathtween-function
          https://bl.ocks.org/d3noob/ced1b9b18bd8192d2c898884033b5529
        */
        //Function to create Path data
        var getPoints = function(){
          return [
                    [480, 200],
                    [580, 400],
                    [680, 100],
                    [780, 300],
                    [180, 300],
                    [280, 100],
                    [380, 400]
                  ];
        }

        var points = getPoints();


        //var path = svg.append("path")
        //    .data([points])
        //    .attr("d", d3.line().curve(d3.curveCatmullRomOpen));
        //    // .interpolate("cardinal-closed"));

        
        console.log("....END Setup Vis")
    };


    /**
     * setupSections - each section is activated
     * by a separate function. Here we associate
     * these functions to the sections based on
     * the section's index.
     *
     */
    var setupSections = function () {

        console.log("....Setup Sections")

        // activateFunctions are called each
        // time the active section changes
        activateFunctions[0] = showTitle;
        activateFunctions[1] = showGitIntro;
        activateFunctions[2] = showLocationModel;
        activateFunctions[3] = showWorkspace;
        activateFunctions[4] = showIndex;
        activateFunctions[5] = showLocalRep;
        activateFunctions[6] = showRemoteRep;
        activateFunctions[7] = showStash;
        activateFunctions[8] = showCommandsIntro;
        activateFunctions[9] = showUpstreamCommands;
        activateFunctions[10] = showDownstreamCommands;
        activateFunctions[11] = showStashCommands;
        activateFunctions[12] = showExplore;

        // updateFunctions are called while
        // in a particular section to update
        // the scroll progress in that section.
        // Most sections do not need to be updated
        // for all scrolling and so are set to
        // no-op functions.
        for (var i = 0; i < activateFunctions.length; i++) 
        {
          updateFunctions[i] = function () {};
        }
        
         console.log("....END Setup Sections")
    };


    /**
     * ACTIVATE FUNCTIONS
     *
     * These will be called their
     * section is scrolled to.
     *
     * General pattern is to ensure
     * all content for the current section
     * is transitioned in, while hiding
     * the content for the previous section
     * as well as the next section (as the
     * user may be scrolling up or down).
     *
     */
   var hideElement = function(domTag){
          g.selectAll(domTag)
          .transition()
          .duration(100)
          .attr('opacity', 0);
    }

    var showElement = function(domTag){
        g.selectAll(domTag)
          .transition()
          .duration(600)
          .attr('opacity', 1);
    }

    // @Global
    showRectangle = function(domTag, x, y){
        g.selectAll(domTag)
          .transition()
          .duration(600)
          .delay(200)
          .attr("x",xScale(x))
          .attr("y",yScale(y))
          .attr('opacity', 1);
    }
    // @Global
    showText = function(domTag, x, y){
        g.selectAll(domTag)
          .transition()
          .duration(600)
          .delay(300)
          .attr('opacity', 1);
    }


    /**
     * showTitle - initial title
     *
     * hides: none
     * shows: landing title
     * hides: 
     */
    var showTitle = function() {
        g.selectAll('.vis-title')
          .transition()
          .duration(600)
          .attr('opacity', 1.0);

        hideElement('.picture');
    }


    /**
     * showGitIntro - what is git and why use it
     *
     * hides: landing title
     * shows: git intro images
     * hides: location model
     */

     var showGitIntro = function(){
        //Insert Images for Github
        hideElement('.vis-title');

        g.select(".picture")
          .transition()
          .duration(500)
          .attr("opacity", 1);

        hideElement('.places');
     }

    /**
     * showLocationModel - how to use vis and what is location model
     *
     * hides: none
     * shows: intro title
     * hides: workspace rect
     */
     function showLocationModel(){

          hideElement('.picture');

          g.select(".places")
          .transition()
          .duration(500)
          .attr("opacity", 1);


          hideElement('.workspace');

          hideElement('#workspace-text');
          hideElement('#index-text');
          hideElement('#localrep-text');
          hideElement('#remoterep-text');
          hideElement('#stash-text');

          hideElement('.place-icon');

     }
    


    /**
     * showWorkspace - workspace rectangle
     *
     * hides: location model intro
     * shows: workspace rect
     * hides: index rect
     */
    var showWorkspace = function() {

        showRectangle('.workspace',25,65);

        hideElement('.places');

        hideElement('.indexspace');
        hideElement('.local-rep');
        hideElement('.remote-rep');
        hideElement('.stash');

        hideElement('#index-text');
        hideElement('#index-icon');

        showElement('#directory-icon');
        showText('#workspace-text');

    }


    /**
     * showIndex - index rectangle
     *
     * hides: none
     * shows: index rect
     * hides: local rep rect
     */
    var showIndex = function() {
        showRectangle('.indexspace',45,65);
        hideElement('.local-rep');
        
        showText('#index-text');
        showElement('#index-icon');

        hideElement('#localrep-text');
        hideElement('#local-icon');

    }


    /**
     * showLocalRep - local rep rectangle
     *
     * hides: none
     * shows: local rep rect
     * hides: remote rep rect
     */
    var showLocalRep = function() {
        showRectangle('.local-rep',65,65);
        hideElement('.remote-rep');

        showText('#localrep-text');
        showElement('#local-icon');

        hideElement('#remoterep-text');
        hideElement('#remote-icon');

    }


    /**
     * showRemoteRep - remote rep rect rectangle
     *
     * hides: none
     * shows: remote rep rect
     * hides: stash rect
     */
    var showRemoteRep = function() {
        showRectangle('.remote-rep',85,65);
        hideElement('.stash');

        showText('#remoterep-text');
        showElement('#remote-icon');

        hideElement('#stash-text');
        hideElement('#stash-icon');

    }

    /**
     * showStash - stash rectangle
     *
     * hides: none
     * shows: stash rectangle
     * hides: 
     */
    var showStash = function() {
        showRectangle('.stash',5,65);
        showText('#stash-text');
        showElement('#stash-icon');
    }


    /**
     * showCommandsIntro - upstream and downstream
     *
     * hides: ??
     * shows: commands intro elements
     * hides:
     */    
    var showCommandsIntro = function(){
          resetAnimation();
    }

    /**
     * showUpstreamCommands - add, commit, push
     *
     * hides: 
     * shows: upstream command elements
     * hides:
     */    
    var showUpstreamCommands = function(){
          resetAnimation();
    }

    /**
     * showDownstreamCommands - revert, rebase, pull
     *
     * hides: 
     * shows: downstream command elements
     * hides:
     */    
    var showDownstreamCommands = function(){
          resetAnimation();
    }

    /**
     * showStashCommands - stash, apply, drop
     *
     * hides: 
     * shows:  stash command elements - 
     * hides:
     */
    var showStashCommands = function(){

      $('#quiz').addClass("showquiz");
      $('#qresults').addClass("showquiz");
      showAllRects();
      showAllTitles();
      resetAnimation();
      //showElement('#space-text');
      showElement('.place-icon');


    }

    /**
     * showExplore - interactive open-ended play area
     *
     * hides: 
     * shows: interactive elements - 
     * hides:
     */
    function showExplore(){

      $('#quiz').toggleClass("showquiz");
      $('#qresults').toggleClass("showquiz");
      hideElement('.rectangle');
      hideElement('.space-text');
      hideElement('.file-icon');
      resetAnimation();
      hideElement('.place-icon');


    }


    /**
     * UPDATE FUNCTIONS
     *
     * These will be called within a section
     * as the user scrolls through it.
     *
     * We use an immediate transition to
     * update visual elements based on
     * how far the user has scrolled
     *
     */


   /**
     * activate - function to activate particular section
     * @param index - index of the activated section
     */
    chart.activate = function (index) {
        activeIndex = index;
        var sign = (activeIndex - lastIndex) < 0 ? -1 : 1;
        var scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign);
        scrolledSections.forEach(function (i) {
          activateFunctions[i]();
        });
        lastIndex = activeIndex;
    }; //END chart activate

 
    /**
     * update
     *
     * @param index
     * @param progress
     */
    chart.update = function (index, progress) {
        updateFunctions[index](progress);
    };

 
    // return chart function
    return chart;
    console.log("Returning CHART")
    console.log("..END Scroll Vis")
}


/**
 * display - called once data
 * has been loaded.
 * sets up the scroller and
 * displays the visualization.
 *
 * @param data - loaded tsv data
 */
function display() {
    console.log(".display function")
    // create a new plot and
    // display it
    var plot = scrollVis();
    d3.select('#vis')
      .call(plot);

    // setup scroll functionality
    var scroll = scroller()
      .container(d3.select('#graphic'));

    // pass in .step selection as the steps
    scroll(d3.selectAll('.step'));

    // setup event handling
    scroll.on('active', function (index) {
      // highlight current step text
      d3.selectAll('.step')
        .style('opacity', function (d, i) { return i === index ? 1 : 0.1; });

      // activate current section
      plot.activate(index);
    });

    scroll.on('progress', function (index, progress) {
      plot.update(index, progress);
    });
    console.log(".END display function")
}

/*  
    GLOBAL VARIABLES
    Functions and variables needed for user-driven events and maintaining state
*/

// DIMENSIONAL constants to define the size
// and margins of the vis area.
var width = 800;
var height = 520;
var margin = { top: 20, left: 20, bottom: 20, right: 20 };


var w, h; //rectangle dims
var w_file, h_file; //file icon dims


/*
    GLOBAL Scales and Functions
*/
var showRectangle;
var xScale;
var yScale;
var xAxis;
var yAxis;

var newFile;
var addedFile;
var committedFile;
var pushedFile;


var quiz;

var writtenRedFile = 'src/images/document-red.png';
var writtenPurpleFile = 'src/images/document-purple.png';
var writtenBlueFile = 'src/images/document-blue.png'

var orangeCompareFile = 'src/images/compare-orange.png';
var redCompareFile = 'src/images/compare-red.png';
var blueCompareFile = 'src/images/compare-blue.png';
var purpleCompareFile = 'src/images/compare-purple.png';

var orangeImageFile = 'src/images/image-file-orange.png';
var editBlackFile = 'src/images/edit-file-black.png';



/*  UI Event Logic Implementation
    Functions to execute event logic when fired by event handler
*/
var showAllRects = function (){
    console.log("Showing All Rects!");
    showRectangle('.workspace',25,65);
    showRectangle('.indexspace',45,65);
    showRectangle('.remote-rep',85,65);
    showRectangle('.local-rep',65,65);
    showRectangle('.stash',5,65);
}


var showAllTitles = function (){
    showText('#workspace-text');
    showText('#index-text');
    showText('#localrep-text');
    showText('#remoterep-text');
    showText('#stash-text');

}



var newGreenFile = 'src/images/add-file-green.png';
var emptyBlackFile = 'src/images/file-black.png';
var writtenBlackFile = 'src/images/document-black.png'


/* UPSTREAM COMMANDS*/

var createNewFileAnimation = function()
{
    newFile = d3.select('#file1')
                .attr("x", xScale(25))
                .attr("y", yScale(100))
                .attr("opacity",1)
                .attr("xlink:href", newGreenFile)
                  .transition()
                  .duration(1400)
                  .ease(d3.easeCubic)
                .attr("x", xScale(25))
                .attr("y", yScale(50))
                  .transition()
                  .duration(200)
                .attr("xlink:href", emptyBlackFile)
                  .transition()
                  .duration(200)
                .attr("xlink:href", editBlackFile)
                  .transition()
                  .duration(250)
                .attr("xlink:href", writtenBlackFile);
};

var gitAddAnimation = function(){

    newFile = d3.select('#file1')
                .attr("x", xScale(25))
                .attr("y", yScale(50))
                .attr("opacity",1)
                .attr("xlink:href", writtenBlackFile);


    addedFile = d3.select('#file2')
                  .attr("x", xScale(30))
                  .attr("y", yScale(50))
                  .attr("xlink:href", writtenBlackFile)
                    .transition()
                    .duration(1500)
                    .ease(d3.easeCubic)
                  .attr("x", xScale(45))
                  .attr("y", yScale(50))
                  .attr("opacity",1);
};

var gitCommitAnimation = function(){

    newFile = d3.select('#file1')
                .attr("x", xScale(25))
                .attr("y", yScale(50))
                .attr("opacity",1)
                .attr("xlink:href", writtenBlackFile);

    addedFile = d3.select('#file2')
                  .attr("x", xScale(45))
                  .attr("y", yScale(50))
                  .attr("opacity",1)
                  .attr("xlink:href", writtenBlackFile)
                    .transition()
                    .duration(500)
                  .attr("opacity",0);

    committedFile = d3.select('#file3')
                      .attr("x", xScale(50))
                      .attr("y", yScale(50))
                      .attr("opacity",1)
                      .attr("xlink:href", writtenBlackFile)
                        .transition()
                        .duration(1500)
                        .ease(d3.easeCubic)
                      .attr("x", xScale(65))
                      .attr("y", yScale(50))
                      .attr("opacity",1);
};

var gitPushAnimation = function(){

    newFile = d3.select('#file1')  //color 1
                .attr("x", xScale(25))
                .attr("y", yScale(50))
                .attr("opacity",1)
                .attr("xlink:href", writtenBlackFile);

    addedFile = d3.select('#file2') //color 1
                  .attr("x", xScale(45))
                  .attr("y", yScale(50))
                  .attr("opacity",0)
                  .attr("xlink:href", writtenBlackFile);


    committedFile = d3.select('#file3') //color 1
                      .attr("x", xScale(65))
                      .attr("y", yScale(50))
                      .attr("opacity",1)
                    .attr("xlink:href", writtenBlackFile);

    pushedFile = d3.select('#file4')   //color 1
                    .attr("x", xScale(70))
                    .attr("y", yScale(50))
                    .attr("opacity",1)
                      .transition()
                      .duration(1500)
                      .ease(d3.easeCubic)
                    .attr("x", xScale(85))  //color 1
                    .attr("y", yScale(50))
                    .attr("opacity",1)
                    .attr("xlink:href", writtenBlackFile);

};



/* DOWNSTREAM COMMANDS*/
var gitOthersPushAnimation = function(){
    file = d3.select('#file1')
                    .attr("x", xScale(25))
                    .attr("y", yScale(50))
                    .attr("xlink:href", writtenRedFile)
                    .attr("opacity",1);  //color 1

    committedFile = d3.select('#file2')
                    .attr("x", xScale(65))
                    .attr("y", yScale(50))
                    .attr("xlink:href", writtenRedFile)
                    .attr("opacity",1); //color 1

    pushedFile = d3.select('#file3')
                    .attr("x", xScale(85))
                    .attr("y", yScale(50))
                    .attr("xlink:href", writtenRedFile)
                    .attr("opacity",1)
                    .transition()
                    .duration(1950)
                    .attr("opacity",0); //color 1

    incomingFile = d3.select('#file4')
                    .attr("x", xScale(85))
                    .attr("y", yScale(0))
                    .attr("opacity",1)  //color 2
                    .attr("xlink:href", writtenBlueFile)
                      .transition()
                      .ease(d3.easeCubic)
                      .duration(2000)
                    .attr("x", xScale(85))
                    .attr("y", yScale(50))
                    .attr("xlink:href", writtenBlueFile)
                    .attr("opacity",1)
                      .transition()
                      .duration(300)
                    .attr("xlink:href", blueCompareFile)
                      .transition()
                      .duration(300)
                    .attr("xlink:href", redCompareFile)
                      .transition()
                      .duration(300)
                    .attr("xlink:href", purpleCompareFile)
                      .transition()
                      .duration(500)
                    .attr("xlink:href", writtenPurpleFile);
}

var gitFetchAnimation = function(){
    file = d3.select('#file1')
                    .attr("x", xScale(25))
                    .attr("y", yScale(50))
                    .attr("xlink:href", writtenRedFile)
                    .attr("opacity",1); //color 1

    committedFile = d3.select('#file2')
                    .attr("x", xScale(65))
                    .attr("y", yScale(50))
                    .attr("xlink:href", writtenRedFile)
                    .attr("opacity",1); //color 1

    pushedFile = d3.select('#file3')
                    .attr("x", xScale(85))
                    .attr("y", yScale(50))
                    .attr("xlink:href", writtenPurpleFile)
                    .attr("opacity",1); //color 3

    incomingFetchFile = d3.select('#file4') 
                      .attr("x", xScale(80))
                      .attr("y", yScale(50))
                      .attr("xlink:href", writtenPurpleFile)
                      .attr("opacity",1) //color 3
                        .transition()
                        .duration(1500)
                      .attr("x", xScale(65))
                      .attr("y", yScale(50))
                      .attr("opacity",1) 
};


var gitMergeAnimation = function(){
    file = d3.select('#file1')
                    .attr("x", xScale(25))
                    .attr("y", yScale(50))
                    .attr("xlink:href", writtenRedFile)
                    .attr("opacity",1); //color 1

    committedFile = d3.select('#file2')
                    .attr("x", xScale(65))
                    .attr("y", yScale(50))
                    .attr("xlink:href", writtenPurpleFile)
                    .attr("opacity",1); //color 3

    pushedFile = d3.select('#file3')
                    .attr("x", xScale(85))
                    .attr("y", yScale(50))
                    .attr("xlink:href", writtenPurpleFile)
                    .attr("opacity",1); //color 3

    incomingMergeFile = d3.select('#file4') 
                      .attr("x", xScale(60))
                      .attr("y", yScale(50))
                      .attr("xlink:href", writtenPurpleFile)
                      .attr("opacity",1) //color 3
                        .transition()
                        .duration(1500)
                      .attr("x", xScale(25))
                      .attr("y", yScale(50))
                      .attr("opacity",1);
};


var gitPullAnimation = function(){

    file = d3.select('#file1')
                    .attr("x", xScale(25))
                    .attr("y", yScale(50))
                    .attr("xlink:href", writtenRedFile)
                    .attr("opacity",1); //color 1

    committedFile = d3.select('#file2')
                    .attr("x", xScale(65))
                    .attr("y", yScale(50))
                    .attr("xlink:href", writtenRedFile)                    
                    .attr("opacity",1); //color 1

    pushedFile = d3.select('#file3')
                    .attr("x", xScale(85))
                    .attr("y", yScale(50))
                    .attr("xlink:href", writtenPurpleFile)
                    .attr("opacity",1); //color 3

    incomingFetchFile = d3.select('#file4') 
                      .attr("x", xScale(80))
                      .attr("y", yScale(50))
                      .attr("xlink:href", writtenPurpleFile)
                      .attr("opacity",1) //color 3
                        .transition()
                        .duration(1500)
                      .attr("x", xScale(65))
                      .attr("y", yScale(50))
                      .attr("opacity",1); //color 3

    incomingMergeFile = d3.select('#file2')
                    .attr("x", xScale(65))
                    .attr("y", yScale(50))
                    .attr("xlink:href", writtenPurpleFile)                    
                    .attr("opacity",1) //color 3
                      .transition()
                      .delay(1500)
                      .duration(1500)
                    .attr("x", xScale(25))
                    .attr("y", yScale(50))
                    .attr("opacity",1); //color 3

};

/* STASH COMMANDS*/

var gitEditAnimation = function()
{

    editFile = d3.select('#file1')
                .attr("x", xScale(25))
                .attr("y", yScale(100))
                .attr("opacity",1)
                .attr("xlink:href", newGreenFile)
                  .transition()
                  .duration(1400)
                  .ease(d3.easeCubic)
                .attr("x", xScale(25))
                .attr("y", yScale(40))
                  .transition()
                  .duration(100)
                .attr("xlink:href", emptyBlackFile)
                  .transition()
                  .duration(300)
                .attr("xlink:href", editBlackFile);


    incomingFile = d3.select('#file4')
                    .attr("x", xScale(85))
                    .attr("y", yScale(0))
                    .attr("opacity",1)  //other file
                    .attr("xlink:href", orangeImageFile)
                      .transition()
                      .ease(d3.easeCubic)
                      .delay(1500)
                      .duration(2000)
                    .attr("x", xScale(85))
                    .attr("y", yScale(60))
                    .attr("opacity",1);  //other
}


var gitStashAnimation = function(){
    stashedFile = d3.select('#file1');
    if(stashedFile.attr('opacity') == 1 && stashedFile.attr('x') >= xScale(25))
    {
      console.log('Edited File in Working Directory');
      stashedFile.attr("x", xScale(25))
                  .attr("y", yScale(40))
                  .attr("xlink:href", editBlackFile)                  
                  .attr("opacity",1) //new file
                    .transition()
                    .ease(d3.easeCubic)
                    .duration(1500)
                  .attr("x", xScale(5))
                  .attr("y", yScale(40))
                  .attr("opacity",1); //edit file
     }
     else
     {
        console.log('No untracked file to stash in working directory!');
     }
}

var gitStashPopAnimation = function(){
    stashedFile = d3.select('#file1');
    if(stashedFile.attr('opacity') == 1 && stashedFile.attr('x') == xScale(5)){
          console.log('Popping from stash!');

        stashedFile.attr("x", xScale(5))
                   .attr("y", yScale(40))
                   .attr("opacity",1) //edit file
                      .transition()
                      .duration(1500)
                      .ease(d3.easeCubic)                      
                    .attr("x", xScale(25))
                    .attr("y", yScale(40))
                    .attr("opacity",1); //edit file

        popFile = d3.select('#file2')
                    .attr("x", xScale(5))
                    .attr("y", yScale(40))
                    .attr("xlink:href", editBlackFile)
                    .attr("opacity",1) //edit file
                      .transition()
                      .duration(2000)
                    .attr("opacity",0);
        }
    else{
          console.log('No file to pop from stash!');
        }
}

var gitStashPullAnimation = function()
{
    var editFilePos = d3.select('#file1').attr('x');
    if(editFilePos <= xScale(5))
    {
        console.log('Working Tree is CLEAN');
        incomingFetchFile = d3.select('#file4')
                        .attr("x", xScale(85))
                        .attr("y", yScale(60))
                        .attr("xlink:href", orangeImageFile)
                        .attr("opacity",1)  //other file
                          .transition()
                          .duration(1500)
                          .ease(d3.easeCubic)
                        .attr("x", xScale(65))
                        .attr("y", yScale(60))
                        .attr("opacity",1);  //other

        incomingMergeFile = d3.select('#file3')
                        .attr("x", xScale(65))
                        .attr("y", yScale(60))
                        .attr("xlink:href", orangeImageFile)
                        .attr("opacity",0)  //other file
                          .transition()
                          .delay(1500)
                          .duration(1500)
                          .ease(d3.easeCubic)
                        .attr("x", xScale(25))
                        .attr("y", yScale(60))
                        .attr("opacity",1);  //other
    }
    else
    {
        easement = d3.easeBounce;
        console.log('Working Tree is DIRTY');
        remote = d3.select('#file4')
                        .attr("x", xScale(85))
                        .attr("y", yScale(60))
                        .attr("opacity",1)  //other file
                          .transition()
                          .duration(500)
                          .ease(easement)
                        .attr("x", xScale(80))
                        .attr("y", yScale(60))
                        .attr("opacity",1)  //other
                          .transition()
                          .duration(500)
                          .ease(easement)
                        .attr("x", xScale(90))
                        .attr("y", yScale(60))
                        .attr("opacity",1)  //other
                          .transition()
                          .ease(easement)
                          .duration(500)
                        .attr("x", xScale(85))
                        .attr("y", yScale(60))
                        .attr("opacity",1);  //other
    }
}

/* FILE COMMANDS*/
var resetAnimation = function(){
  d3.selectAll('.file-icon')
      .attr('x',xScale(0))
      .attr('y',yScale(0))
      .transition()
      .duration(300)
    .attr("opacity", 0);
};


/*  UI Event Handlers
    Attaching Event Handlers and Listeners to user-driven elements in the story
*/
// $('#loc-model-rect-link').click(function(){ showAllRects(); return false; });

//File commands
$('.reset-link').click(function(){ resetAnimation(); return false; });

//Upstream Commands - create, add, commit, push
$('#upstream-create-link').click(function(){ createNewFileAnimation(); return false; });
$('#upstream-add-link').click(function(){ gitAddAnimation(); return false; });
$('#upstream-commit-link').click(function(){ gitCommitAnimation(); return false; });
$('#upstream-push-link').click(function(){ gitPushAnimation(); return false; });

//Downstream Commands - create, add, commit, push
$('#downstream-others-push-link').click(function(){ gitOthersPushAnimation(); return false; });
$('#downstream-fetch-link').click(function(){ gitFetchAnimation(); return false; });
$('#downstream-merge-link').click(function(){ gitMergeAnimation(); return false; });
$('#downstream-pull-link').click(function(){ gitPullAnimation(); return false; });

//Up + Down  Commands - New File, Stash, Apply, Pull, Pop
$('#updown-stash-link').click(function(){ gitStashAnimation(); return false; });
$('#updown-edit-link').click(function(){ gitEditAnimation(); return false; });
$('#updown-pull-link').click(function(){ gitStashPullAnimation(); return false; });
$('#updown-pop-link').click(function(){ gitStashPopAnimation(); return false; });


// set up scroll and display
display();
//initializeUIHandlers();

console.log("End of SECTIONS.JS");