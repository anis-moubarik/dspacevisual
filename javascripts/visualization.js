console.log("visualization.js loaded")

DSPACE_INSTANCE = "http://ds-am2-kktest.lib.helsinki.fi/simplerest/"

function Community(id, name){
  this.id = id;
  this.name = name;
}

function Collection(id, name){
  this.id = name
  this.name = name
}

function Item(id, name){
  this.id = id
  this.name = name
}

(function (){
  function init(){
    var communities, collections, items = new Array()
    var curCol

    //Stary by getting rootcommunities from the DSpace instance
    $.getJSON(DSPACE_INSTANCE+"rootcommunities?media=json", function(data){
      $.each(data, function(index, data){
        communities.push(new Community(data.id, data.name))
      });
    }).done(function(){//Iterate through communities to save collections
      $.each(communities, function(index, data){
        $.getJSON(DSPACE_INSTANCE+"community/"+data.id+"/collections?media=json", function(col){
          $.each(col, function(index, col){
            curCol = col
            collections.push(new Collection(col.id, col.collectionName))
          });
        }).done(function(){//Iterate through collections to save items
          $.getJSON(DSPACE_INSTANCE+"collection/"+curCol.id+"/items?media=json", function(item){
            $.each(item, function(index, item){
              items.push(new Item(item.Id, item.metadata.filter(isTitle)[0].value))
            });
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