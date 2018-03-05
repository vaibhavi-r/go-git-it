console.log("Welcome to SECTIONS.JS");

/**
 * scrollVis - encapsulates
 * all the code for the visualization
 * using reusable charts pattern:
 * http://bost.ocks.org/mike/chart/
 */
var scrollVis = function(){

    console.log("..Scroll Vis function");
    // constants to define the size
    // and margins of the vis area.
    var width = 800;
    var height = 520;
    var margin = { top: 20, left: 20, bottom: 20, right: 20 };


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
    var xScale = d3.scaleLinear()
      .domain([0,100])
      .range([0, width]);

    var yScale = d3.scaleLinear()
      .domain([0,100])
      .range([height, 0]);

    var xAxis = d3.axisBottom()
       .scale(xScale);

    var yAxis = d3.axisLeft()
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
        g.select('.x.axis').style('opacity', 1);

        // y-axis
        g.append('g')
          .attr('class', 'y axis')
          .attr('transform', 'translate(0,0)')
          .call(yAxis);
        g.select('.y.axis').style('opacity', 1);


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


        var w = width/10;
        var h = height*4.5/10; 
        //Create Rectangles for Different Locations for Content Model
        createRect("stash", 0, 65, w, h,"#e7fef1", 0);
        createRect("workspace",0, 65, w, h, "#e7fef1", 0);
        createRect("indexspace",0, 65, w, h, "#e7fef1", 0);
        createRect("local-rep", 0, 65, w, h, "#e7fef1", 0);
        createRect("remote-rep",100, 65, w, h, "#f1e7fe", 0); //Different color and start position for remote repo


        var createImage = function(){
            g.append("image")
              .attr("class", "picture")
              .attr("x", xScale(50))
              .attr("xlink:href","/src/images/file-black.svg" )
              .attr("alt", "sample image")
              .attr("y", yScale(65))
              .attr("width", 50)
              .attr("height", 50);
        }

        createImage();



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


   function hideElement(domTag){
          g.selectAll(domTag)
          .transition()
          .duration(100)
          .attr('opacity', 0);
    }

    function showElement(domTag){
        g.selectAll(domTag)
          .transition()
          .duration(600)
          .attr('opacity', 1);
    }

    function showRectangle(domTag, x, y){
        g.selectAll(domTag)
          .transition()
          .duration(600)
          .attr("x",xScale(x))
          .attr("y",yScale(y))
          .attr('opacity', 1);
    }


    /**
     * showTitle - initial title
     *
     * hides: none
     * shows: landing title
     * hides: 
     */
    function showTitle() {

        g.selectAll('.vis-title')
          .transition()
          .duration(600)
          .attr('opacity', 1.0);

        hideElement('.workspace');
    }


    /**
     * showGitIntro - what is git and why use it
     *
     * hides: landing title
     * shows: git intro images
     * hides: location model
     */

     function showGitIntro(){
        //Insert Images for Github
        hideElement('.vis-title');

        g.select(".picture")
          .attr("x", xScale(50))
          .attr("xlink:href","/src/images/file-black.svg" )
          .attr("alt", "sample image")
          .attr("y", yScale(65))
          .attr("width", 50)
          .attr("height", 50);
     }


    /**
     * showLocationModel - how to use vis and what is location model
     *
     * hides: none
     * shows: intro title
     * hides: workspace rect
     */
     function showLocationModel(){


          hideElement('.workspace');

     }
    

    /**
     * showWorkspace - workspace rectangle
     *
     * hides: location model intro
     * shows: workspace rect
     * hides: index rect
     */
    function showWorkspace() {
        showRectangle('.workspace',25,65);
        hideElement('.indexspace');
    }


    /**
     * showIndex - index rectangle
     *
     * hides: none
     * shows: index rect
     * hides: local rep rect
     */
    function showIndex() {
        showRectangle('.indexspace',45,65);
        hideElement('.local-rep');
    }


    /**
     * showLocalRep - local rep rectangle
     *
     * hides: none
     * shows: local rep rect
     * hides: remote rep rect
     */
    function showLocalRep() {

        showRectangle('.local-rep',65,65);
        hideElement('.remote-rep');

    }


    /**
     * showRemoteRep - remote rep rect rectangle
     *
     * hides: none
     * shows: remote rep rect
     * hides: stash rect
     */
    function showRemoteRep() {
        showRectangle('.remote-rep',85,65);
        hideElement('.stash');
    }


    /**
     * showStash - stash rectangle
     *
     * hides: none
     * shows: stash rectangle
     * hides: 
     */

    function showStash() {
        showRectangle('.stash',5,65);
    }


    /**
     * showCommandsIntro - upstream and downstream
     *
     * hides: ??
     * shows: commands intro elements
     * hides:
     */    
    function showCommandsIntro(){

    }

    /**
     * showUpstreamCommands - add, commit, push
     *
     * hides: 
     * shows: upstream command elements
     * hides:
     */    
    function showUpstreamCommands(){

    }

    /**
     * showDownstreamCommands - revert, rebase, pull
     *
     * hides: 
     * shows: downstream command elements
     * hides:
     */    
    function showDownstreamCommands(){

    }

    /**
     * showStashCommands - stash, apply, drop
     *
     * hides: 
     * shows:  stash command elements - 
     * hides:
     */
    function showStashCommands(){

    }

    /**
     * showExplore - interactive open-ended play area
     *
     * hides: 
     * shows: interactive elements - 
     * hides:
     */
    function showExplore(){

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

// set up scroll and display
display();
console.log("End of SECTIONS.JS");