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
function Item() { };

var communities = new Array();
var collections = new Array();
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
      console.log(col.collectionName);
      collections.push(new Collection(col.id, col.collectionName))
    });
  });
});
});
