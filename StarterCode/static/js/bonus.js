// BellyButton BioDiversity Plotly Challenge
  // To accomplish this, I created the following 4 functions:
      // 1. init()
      // 2. getMetadata(sampleId)
      // 3. getCharts(sampleId)
      // 4. optionChanged(newSelection)


// Function to initialize the page with default plots
function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample as the default sample when page initializes
    const defaultSample = sampleNames[0];
      getMetadata(defaultSample);  
      getCharts(defaultSample);
      
 });
}

// Function to handle drowdown selection changes; corresponds to "onchange" in index.html
function optionChanged(newSelection) {
  // Fetch new data each time a new sample is selected
  getMetadata(newSelection);
  getCharts(newSelection);
}

// Function to get MetaData for both the Demographic Info Panel and to build/update Gauge chart
function getMetadata(sampleId) {
    d3.json("samples.json").then((data) => {
      console.log(data)

      var metadata = data.metadata;
      //console.log(metadata)
      var metadataArray = metadata.filter(metadataObject => metadataObject.id == sampleId);
      //console.log(metadataArray)
      var metadataResult = metadataArray[0]
      //console.log(metadataResult)
      
      // Update the Demographic Info panel data reflected on the screen with the selected "Test Subject ID No"
      var demoInfo = d3.select("#sample-metadata");
      demoInfo.html("");
      Object.entries(metadataResult).forEach(([key, value]) => {
        demoInfo.append("h6").text(`${key}: ${value}`);
      });

      // BONUS: Wash Frequency Gauge Chart
        var washFrequency = metadataResult.wfreq;
     
        var gaugeData = [
          {
            type: "indicator",
            mode: "gauge+number",
            value: washFrequency,
            title: { text: "Wash Frequency", font: { size: 24 } },
            gauge: {
              axis:
                { range: [0, 9], tickcolor: "darkblue" },
          
              bar: { color: "teal" },
              bgcolor: "white",
              borderwidth: 2,
              bordercolor: "lightgray",
              steps: [
                { range: [0, 9], color: "beige", label: "0-1" }
              ],
            }
          }
        ];
        
        var gaugeLayout = {
          width: 500,
          height: 400,
          margin: { t: 100, 
                    r: 30, 
                    l: 30, 
                    b: 30 },
          paper_bgcolor: "white",
          font: { color: "teal", family: "Arial" }
        };
        
        Plotly.newPlot('gauge', gaugeData, gaugeLayout);
          //Plotly.newPlot('gauge', gaugeData, gaugeLayout);
    });
  }

// Function to get/update the Plotly Bar and Bubble charts
function getCharts(sampleId) {

  // Use `d3.json` to fetch the sample data for the plots based on sampleId selected in dropdown
  d3.json("samples.json").then((data) => {
    var sample = data.samples;
    //console.log(sample)
    var chartArray = sample.filter(samplesObject => samplesObject.id == sampleId);
    //console.log(chartArray)
    var chartResult = chartArray[0]
    //console.log(chartResult)

    // Create chart variables
    var ids = chartResult.otu_ids;
    var labels = chartResult.otu_labels;
    var values = chartResult.sample_values;

    // Create Plotly Bar chart using sample data
    var barTrace = {
      x: values.slice(0,10).reverse(),                        //slice used to grab the Top 10 values, reverse used to reorg the bar chart view
      y: ids.slice(0,10).reverse().map(id => "OTU " + id),    //creating a text for ids so it will not read as a number altering the look of the chart
      text: labels.slice(0,10).reverse(),
      type: "bar",
      orientation: "h",
      marker: {
        color: 'rgb(142,124,195)'
      }
    }

    var barData = [barTrace];

    var barLayout = {
        margin: {
            l: 100,
            r: 100,
            t: 100,
            b: 30
        },
    }

    Plotly.newPlot("bar", barData, barLayout);

    // Create Plotly Bubble Chart using sample data
    var bubbleTrace = {
      x: ids,
      y: values,
      mode: "markers",
      marker: {
          size: values,
          color: ids},
      text: labels
    }

    var bubbleData = [bubbleTrace];

    var bubbleLayout = {
      xaxis: {title: "OTU ID"},
      height: 500,
      width: 1200
    }

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);    

 });
 }

// Initialize the default dashboard
init();