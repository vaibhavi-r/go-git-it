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
    var width = 1000;
    var height = 520;
    var margin = { top: 0, left: 20, bottom: 40, right: 10 };

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

    // We will set the domain when the
    // data is processed.
    var xScale = d3.scaleLinear()
      .domain([0,100])
      .range([0, width]);

    // The bar chart display is horizontal
    // so we can use an ordinal scale
    // to get width and y locations.
    var yScale = d3.scaleLinear()
      .domain([0, 1, 2])
      .range([0, height - 50], 0.1, 0.1);


    //var locationScale

    var xAxis = d3.axisBottom()
       .scale(xScale);

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
      console.log("Selection - ", selection);

      selection.each(function () {
          // create svg and give it a width and height
          svg = d3.select(this).append('svg');

          console.log('SVG = ', svg);

          svg.attr('width', width + margin.left + margin.right);
          svg.attr('height', height + margin.top + margin.bottom);

          svg.append('g');

          // this group element will be used to contain all
          // other elements.
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
        // axis
        g.append('g')
          .attr('class', 'x axis')
          .attr('transform', 'translate(0,' + height + ')')
          // .call(xAxisBar);
        g.select('.x.axis').style('opacity', 0);

        //  openvis title
        g.append('text')
          .attr('class', 'title openvis-title')
          .attr('x', width / 2)
          .attr('y', height / 3)
          .text('Go Git It');

        g.append('text')
          .attr('class', 'sub-title openvis-title')
          .attr('x', width / 2)
          .attr('y', (height / 3) + (height / 5))
          .text('An Explorable Explanation');

        g.selectAll('.openvis-title')
          .attr('opacity', 0);

        // count filler word count title
        g.append('text')
          .attr('class', 'title count-title highlight')
          .attr('x', width / 2)
          .attr('y', height / 3)
          .text('180');

        g.append('text')
          .attr('class', 'sub-title count-title')
          .attr('x', width / 2)
          .attr('y', (height / 3) + (height / 5))
          .text('Filler Words');

        g.selectAll('.count-title')
          .attr('opacity', 0);


        //Insert Images for Github
        g.append("image")
          .attr("class", "picture")
          .attr("x", 1800)
          .attr("y", 0)
          .attr('opacity', 0);


        //Insert workspace rect
        g.append("rect")
            .attr("class","workspace")
            .attr("x",1800)
            .attr("y",0)
            .attr("width",100)
            .attr("height",300)
            .style("fill","#e5f5f9")
            .attr('opacity', 0);

        //Insert index rect
        g.append("rect")
            .attr("class","indexspace")
            .attr("x",1800)
            .attr("y",0)
            .attr("width",100)
            .attr("height",300)
            .style("fill","#e5f5f9")
            .attr('opacity', 0);

        //Insert local repository rect
        g.append("rect")
            .attr("class","local-rep")
            .attr("x",1800)
            .attr("y",0)
            .attr("width",100)
            .attr("height",300)
            .style("fill","#e5f5f9")
            .attr('opacity', 0);

        //Insert upstream rect
        g.append("rect")
            .attr("class","upstream")
            .attr("x",1800)
            .attr("y",0)
            .attr("width",100)
            .attr("height",300)
            .style("fill","#e5f5f9")
            .attr('opacity', 0);

        //Insert upstream rect
        g.append("rect")
            .attr("class","stash")
            .attr("x",1800)
            .attr("y",0)
            .attr("width",100)
            .attr("height",300)
            .style("fill","#e5f5f9")
            .attr('opacity', 0);

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
        activateFunctions[1] = showWorkspace;
        activateFunctions[2] = showIndex;
        activateFunctions[3] = showLocalRep;
        activateFunctions[4] = showUpstream;
        activateFunctions[5] = showStash;
        activateFunctions[6] = showStash;
        activateFunctions[7] = showStash;
        activateFunctions[8] = showStash;
        activateFunctions[9] = showStash;
        activateFunctions[10] = showStash;
        activateFunctions[11] = showStash;
        activateFunctions[12] = showStash;

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
        
          updateFunctions[7] = updateCough;

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

    /**
     * showTitle - initial title
     *
     * hides: count title
     * (no previous step to hide)
     * shows: intro title
     *
     */
    function showTitle() {
      // g.selectAll('.count-title')
      //   .transition()
      //   .duration(0)
      //   .attr('opacity', 0);

        g.selectAll('.openvis-title')
          .transition()
          .duration(600)
          .attr('opacity', 1.0);

        g.selectAll(".workspace")
          .transition()
          .duration(0)
          .attr('opacity', 0);
    }



    /**
     * showFillerTitle - filler counts
     *
     * hides: intro title
     * hides: square grid
     * shows: filler count title
     *
     */

    function hideElement(domTag){
          g.selectAll(domTag)
          .transition()
          .duration(0)
          .attr('opacity', 0);
    }

    function showElement(domTag, x, y){
        g.selectAll(domTag)
          .transition()
          .duration(600)
          .attr("x",x)
          .attr("y",y)
          .attr('opacity', 1);
    }



    function showWorkspace() {
        g.selectAll('.openvis-title')
          .transition()
          .duration(0)
          .attr('opacity', 0);

        g.selectAll('.square')
          .transition()
          .duration(0)
          .attr('opacity', 0);

        // g.selectAll('.count-title')
        //   .transition()
        //   .duration(600)
        //   .attr('opacity', 1.0);
        g.selectAll(".workspace")
          .transition()
          .duration(600)
          .attr("x",150)
          .attr("y",0)
          .attr('opacity', 1);

       g.selectAll(".indexspace")
            .transition()
            .duration(600)
            .attr('opacity', 0);
    }



    function showIndex() {

       g.selectAll(".indexspace")
            .transition()
            .duration(600)
            .attr("x",300)
            .attr("y",0)
            .attr('opacity', 1);

       g.selectAll(".local-rep")
            .transition()
            .duration(600)
            .attr('opacity', 0);
    }

    function showLocalRep() {
       g.selectAll(".local-rep")
            .transition()
            .duration(600)
            .attr("x",450)
            .attr("y",0)
            .attr('opacity', 1);

       g.selectAll(".upstream")
            .transition()
            .duration(600)
            .attr('opacity', 0);
    }

    function showUpstream() {

       g.selectAll(".upstream")
            .transition()
            .duration(600)
            .attr("x",600)
            .attr("y",0)
            .attr('opacity', 1);

       g.selectAll(".stash")
            .transition()
            .duration(600)
            .attr('opacity', 0);
    }

    function showStash() {
       g.selectAll(".stash")
            .transition()
            .duration(600)
            .attr("x",0)
            .attr("y",0)
            .attr('opacity', 1);
    }

    /**
     * highlightGrid - show fillers in grid
     *
     * hides: barchart, text and axis
     * shows: square grid and highlighted
     *  filler words. also ensures squares
     *  are moved back to their place in the grid
     */

    /**
     * showBar - barchart
     *
     * hides: square grid
     * hides: histogram
     * shows: barchart
     *
     */
    /**
     * showHistAll - show all histogram
     *
     * hides: cough title and color
     * (previous step is also part of the
     *  histogram, so we don't have to hide
     *  that)
     * shows: all histogram bars
     *
     */

    /**
     * showAxis - helper function to
     * display particular xAxis
     *
     * @param axis - the axis to show
     *  (xAxisHist or xAxisBar)
     */
    function showAxis(axis) {
        g.select('.x.axis')
          .call(axis)
          .transition().duration(500)
          .style('opacity', 1);
    }

    /**
     * hideAxis - helper function
     * to hide the axis
     *
     */
    function hideAxis() {
        g.select('.x.axis')
          .transition().duration(500)
          .style('opacity', 0);
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
     * updateCough - increase/decrease
     * cough text and color
     *
     * @param progress - 0.0 - 1.0 -
     *  how far user has scrolled in section
     */
    function updateCough(progress) {
        g.selectAll('.cough')
          .transition()
          .duration(0);
          // .attr('opacity', progress);

        // g.selectAll('.hist')
        //   .transition('cough')
        //   .duration(0)
        //   .style('fill', function (d) {
        //     return (d.x0 >= 14) ? coughColorScale(progress) : '#008080';
        //   });
    }




   /**
     * activate -
     *
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
      // .datum(data)
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