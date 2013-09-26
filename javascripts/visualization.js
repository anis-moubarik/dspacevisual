console.log("visualization.js loaded")

DSPACE_INSTANCE = "http://ds-am2-kktest.lib.helsinki.fi/simplerest/"

(function (){
  function init(){
    var curCol

    //Stary by getting rootcommunities from the DSpace instance
    $.getJSON(DSPACE_INSTANCE+"rootcommunities?media=json", function(data){
      $.each(data, function(index, data){
        communities = data
      });
    }).done(function(){//Iterate through communities to save collections
      $.each(communities, function(index, data){
        $.getJSON(DSPACE_INSTANCE+"community/"+data.id+"/collections?media=json", function(col){
          $.each(col, function(index, col){
            curCol = col
          });
          collections = col
        }).done(function(){//Iterate through collections to save items
          $.getJSON(DSPACE_INSTANCE+"collection/"+curCol.id+"/items?media=json", function(item){
            items = item
          });
        });
      })
    });
    function isTitle(element){
      return element.element == "title" ? element : null
    }
  }
  $(init)
})();
