// TIMES

let timesContainer = document.getElementById("times-container")

let startTime = document.createElement("p")
startTime.innerHTML = "<b>Début de la simulation :</b> " + times.immersion
timesContainer.appendChild(startTime)

let immersionTime = document.createElement("p")
immersionTime.innerHTML = "<b>Plongée :</b> " + times.diving
timesContainer.appendChild(immersionTime)

let endTime = document.createElement("p")
endTime.innerHTML = "<b>Fin de la simulation :</b> " + times.end
timesContainer.appendChild(endTime)


if( times.events.length ) {
  let eventsTime = document.createElement("p")
  eventsTime.innerHTML = "<b>Evenements :</b>"
  timesContainer.appendChild(eventsTime)

  let eventsContainer = document.createElement("ul")
  times.events.map(e => {
    let eventContainer = document.createElement("li")
    eventContainer.innerHTML = "<b>" + e.type.toUpperCase() + "</b> : " + e.date
    eventsContainer.appendChild(eventContainer)
  })
  timesContainer.appendChild(eventsContainer)
}

// CHARTS + VIDEO

let video = document.getElementById("video")

function changeVideoPosition(time) {
  video.currentTime = parseInt("" + time / 1000)
}

// https://playground.anychart.com/docs/v8/samples/AGST_Line_Marker_06

anychart.onDocumentReady(function () {
    // create data set on our data
    if(bpmData.length) {
      var bpmDataSet = anychart.data.set(bpmData);
      
      // map data for the first series, take x from the zero column and value from the first column of data set
      var bpmSeriesData = bpmDataSet.mapAs({ x: 'x', value: 'y' });
    }

    if(breathData.length) {
      var breathDataSet = anychart.data.set(breathData); // todo: change into breathData

      // map data for the second series, take x from the zero column and value from the second column of data set
      var breathSeriesData = breathDataSet.mapAs({ x: 'x', value: 'y' });
    }

    // create line chart
    var chart = anychart.line();

    // time scale
    chart.xScale(anychart.scales.dateTime());
    /* chart.xScale().minimum(Date.UTC(2009, 11, 31));
    chart.xScale().maximum(Date.UTC(2011, 0, 01)); */
    chart.xScroller(true);

    // crosshair settings
    var crosshair = chart.crosshair();
    // enable crosshair
    crosshair.enabled(true);
    // set custom function for formatting x crossshair label
    var xCrossLabel = crosshair.xLabel();
    xCrossLabel.format(function() {
      var date = new Date(this.rawValue);
      var hours = date.getHours() - 1;
      var minutes = "0" + date.getMinutes();
      var seconds = "0" + date.getSeconds();

      // Will display time in 10:30:23 format
      var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
      return formattedTime;
    });
    // set custom function for formatting y crossshair label
    var yCrossLabel = crosshair.yLabel();
    yCrossLabel.enabled(false);

    let dataRef = bpmData.length ? bpmData : breathData

    // vertical marker on times
    // var lineMarker = chart.lineMarker();
    // lineMarker.value(dataRef[50].x); // TODO: change with corresponding times
    // lineMarker.layout("vertical");
    // lineMarker.scale(chart.xScale());

    // var text = chart.textMarker(0);
    // text.value(dataRef[50].x); // TODO: change with corresponding times
    // text.axis(chart.xAxis());
    // text.text("Plongée");
    // text.align("top");
    // text.anchor("left-top");
    // text.offsetX(3);
    // text.rotation(0);

    chart.tooltip().title(false).separator(false).format(function() {
      return "Valeur: " + this.value;
    });

    // turn on chart animation
    chart.animation(true);

    // set chart padding
    chart.padding([10, 20, 5, 20]);

    // turn on the crosshair
    chart.crosshair().enabled(true).yLabel(false).yStroke(null);

    // set tooltip mode to point
    chart.tooltip().positionMode('point');

    // set chart title text settings
    /* chart.title(
      'Trend of Sales of the Most Popular Products of ACME Corp.'
    ); */

    chart.xAxis().labels().padding(5);

    // create first series with mapped data
    if(bpmData.length) {
      var bpmSeries = chart.line(bpmSeriesData);
      bpmSeries.name('BPM');
      bpmSeries.hovered().markers().enabled(true).type('circle').size(4);
      bpmSeries
        .tooltip()
        .position('right')
        .anchor('left-center')
        .offsetX(5)
        .offsetY(5);
    }
    
    // create second series with mapped data
    if(breathData.length) {
      var breathSeries = chart.line(breathSeriesData);
      breathSeries.name('Breath');
      breathSeries.hovered().markers().enabled(true).type('circle').size(4);
      breathSeries
        .tooltip()
        .position('right')
        .anchor('left-center')
        .offsetX(5)
        .offsetY(5);
    }
    

    // turn the legend on
    chart.legend().enabled(true).fontSize(13).padding([0, 0, 10, 0]);

    // ONCLICK EVENT
    chart.listen("pointClick", function(e) {
      changeVideoPosition(dataRef[e.pointIndex].x)
    });

    // CONNECT TO VIDEO
    var marker = chart.lineMarker(1);
    marker.layout("vertical");
    marker.scale(chart.xScale());
    marker.stroke({
      thickness: 2,
      color: "red",
      dash: "2 7"
    });
    video.addEventListener("timeupdate", function(e) {
      console.log(e.target.currentTime * 1000)
      marker.value(e.target.currentTime * 1000); // TODO: change with corresponding times
    })

    // set container id for the chart
    chart.container("chart-container");
    // initiate chart drawing
    chart.draw();
}); 

// BOTTOM : Layering

let chartContainer = document.getElementById("chart-container");

window.addEventListener("scroll", e => {
  if((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
    chartContainer.style.position = "relative"
    chartContainer.style.opacity = 0.7
    computedBottom = video.offsetHeight + 40
    chartContainer.style.bottom = "-" + computedBottom + "px"
  } else {
    chartContainer.style.position = "static"
    chartContainer.style.opacity = 1
  }
})