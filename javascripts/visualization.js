console.log("visualization.js loaded");

DSPACE_INSTANCE = "http://ds-am2-kktest.lib.helsinki.fi/simplerest/"

function Community(id, name) {
  this.id = id;
  this.name = name;
}
function Collection(id, name) {
  this.id = id;
  this.name = name;
};
function Item(id, name) {
  this.id = id;
  this.name = name;
};

var communities = new Array();
var collections = new Array();
var items = new Array();
var curCol
//Let's start by getting rootcommunities from the DSpace instance.
$.getJSON(DSPACE_INSTANCE+"rootcommunities?media=json", function(data){
  $.each(data, function(index, data){
    console.log(data.name);
    communities.push(new Community(data.id, data.name))
  });
}).done(function() {//Iterate through communities to save collections
$.each(communities, function(index, data){
  $.getJSON(DSPACE_INSTANCE+"community/"+data.id+"/collections?media=json", function(col){
    $.each(col, function(index, col){
      console.log(col.collectionName)
      curCol = col;
      collections.push(new Collection(col.id, col.collectionName))
    });
  }).done(function() {
    $.getJSON(DSPACE_INSTANCE+"collection/"+curCol.id+"/items?media=json", function(item){
      $.each(item, function(index, item){
        items.push(new Item(item.Id, item.metadata.filter(isTitle)[0].value));
      });
    });
  });
})
});

function isTitle(element){
  return element.element == "title" ? element : null
}

var json = {
  'label': ['label A', 'label B'],
  'values': [
  {
    'label': 'date A',
    'values': [20, 40, 15, 5]
  },
  {
    'label': 'date B',
    'values': [30, 10, 45, 10]
  }
  ]
};

var labelType, useGradients, nativeTextSupport, animate;

(function() {
  var ua = navigator.userAgent,
        iStuff = ua.match(/iPhone/i) || ua.match(/iPad/i),
                typeOfCanvas = typeof HTMLCanvasElement,
                nativeCanvasSupport = (typeOfCanvas == 'object' || typeOfCanvas == 'function'),
                textSupport = nativeCanvasSupport 
                  && (typeof document.createElement('canvas').getContext('2d').fillText == 'function');
  labelType = (!nativeCanvasSupport || (textSupport && !iStuff)) ? 'Native' : 'HTML';
  nativeTextSupport = labelType == 'Native';
  useGradients = nativeCanvasSupport;
  animate = !(iStuff || !nativeCanvasSupport);
})();

var barChart = new $jit.BarChart({
 injectionInto: 'infovis',
 animate: true,
 orientation: 'vertical',
 barsOffset: 20,
 Margin: {
  top: 5,
  left: 5,
  right: 5,
  bottom: 5
 },
 labelOffset: 5,
 type: useGradients? 'stacked:gradient': 'stacked',
 showAggregates: true,
 showLabels: true,
 Label: {
  type: labelType,
  size: 13,
  family: 'Arial',
  color: 'white'
 },
 Tips: {
  enable: true,
  onShow: function(tip, elem){
    tip.innerHTML = "<b>" + elem.name + "</b>: " + elem.value;
  }
 }
});

barChart.loadJSON(json);
