console.log("visualization.js loaded")

DSPACE_INSTANCE = localStorage.getItem("dspace_url") == null ? "http://ds-am2-kktest.lib.helsinki.fi/simplerest/" : localStorage.getItem("dspace_url");

var communitiesls;

(function (){
  function init(){
    //Start by getting rootcommunities from the DSpace instance
    if($.cookie('lsInvalidate') == undefined){
      $.getJSON(DSPACE_INSTANCE+"rootcommunities?media=json", function(data){
        communities = data
      });
    }

    function isTitle(element){
      return element.element == "title" ? element : null
    }
    collectionget = null
    if(localStorage.getItem("collections") == null){
      console.log("localStorage invalidated, loading collections");
      collectionget = $.getJSON(DSPACE_INSTANCE+"collections", function(cols){
        collections = cols;
      });
    }
    itemget = null
    if(localStorage.getItem("items") == null){
      console.log("localStorage invalidated, loading items");
      itemget = $.getJSON(DSPACE_INSTANCE+"items", function(data){
        items = data;
      });
    }
    userget = null
    if(localStorage.getItem("users") == null){
      console.log("localStorage invalidated, loading users");
      userget = $.getJSON(DSPACE_INSTANCE+"users", function(data){
        users = data;
      });
    }
  }
  
  function initLs(){
    //init users localstorage
    if(userget != null){
      userget.complete(function(){
        localStorage.setItem("users", JSON.stringify(users));
        visualizeUsers();
      });
    }
    if(localStorage.getItem("users") != null){
      users = JSON.parse(localStorage.getItem("users"))
      visualizeUsers();
    }

    //init collections localstorage
    if(collectionget != null){
      collectionget.complete(function(){
        localStorage.setItem("collections", JSON.stringify(collections));
      });
    }
    if(localStorage.getItem("collections") != null){
      collections = JSON.parse(localStorage.getItem("collections"))
    }

    //init items localstorage
    if(itemget != null){
      itemget.complete(function(){
        localStorage.setItem("items", JSON.stringify(items));
        fun();
      });
    }
    if(localStorage.getItem("items") != null){
      items = JSON.parse(localStorage.getItem("items"))
      fun();
    }
  }

  function visualizeUsers(){
    var emails = new Array();
    var howMany = 0;
    var dataForEmail = {
      labels : [ ],
      datasets : [
      {
        fillColor : "rgba(151,187,205,0.5)",
        strokeColor : "rgba(151,187,205,1)",
        data : [ ]
      }
      ]
    }
    $.each(users, function(index, user){
      if(user.id > howMany)
        howMany = user.id
      var emailDomain = user.email.replace(/.*@/, "");
      emails[emailDomain] = emails[emailDomain] == undefined ? 1 : emails[emailDomain]+1
      console.log(emails)

    });
    var emailsForChart = []
    var i = 0
    for(var key in emails){
      emailsForChart[i] = emails[key]
      dataForEmail.labels.push(key)
      i++
    }
    dataForEmail.datasets[0].data = emailsForChart
    console.log(emailsForChart)
    console.log(howMany)
    var ctx2 = $('#emailDist').get(0).getContext("2d")
    var ctx = $('#usersChart').get(0).getContext("2d")
    var data = {
      labels : ["Users"],
      datasets : [
      {
        fillColor : "rgba(151,187,205,0.5)",
        strokeColor : "rgba(151,187,205,1)",
        data : [howMany]
      }
      ]
    }
    var opt1 = {
      scaleOverride : true,
      scaleSteps : (howMany+10)/(howMany/2),
      scaleStepWidth : howMany/2,
      scaleStartValue : 0
    }
    var opt2 = {
      scaleOverride : true,
      scaleSteps : 6,
      scaleStepWidth : 1,
      scaleStartValue : 0
    }
    new Chart(ctx).Bar(data, opt1);
    new Chart(ctx2).Radar(dataForEmail, opt2)
  }
  function fun(){
    var jee = {0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0}
    var mo = new Array()
    $.each(items, function(index, item){
      var dateString = item.metadata.filter(isIssued)[0].value
      mo[item.collections[0]] = mo[item.collections[0]] == undefined ? 1 : mo[item.collections[0]]+1
      date = new Date(Date.parse(dateString))
      jee[date.getMonth()] = jee[date.getMonth()]+1
    });
    var dataForChart = new Array()
    var dataForChart2 = new Array()
    var labelsForChart2 = new Array()
    for(var i = 0; i < 12; i++){
      dataForChart[i] = jee[i]
    }

    for(var i = 0; i < collections.length; i++){
      var name = collections[i].collectionName
      labelsForChart2[i] = name
      console.log(name)
      dataForChart2[i] = mo[name]
    }

    var data2 = {
      labels : labelsForChart2,
      datasets : [
      {
        fillColor : "rgba(151,187,205,0.5)",
        strokeColor : "rgba(151,187,205,1)",
        data : dataForChart2
      }
      ]
    }

    var data = {
      labels : ["January", "February", "March", "April", "May",
      "June", "July", "August", "September", "October",
      "November", "December"],
      datasets : [
      {
        fillColor : "rgba(151,187,205,0.5)",
        strokeColor : "rgba(151,187,205,1)",
        pointColor : "rgba(151,187,205.1)",
        pointStrokeColor : "#fff",
        data : dataForChart
      }
      ]
    }
    var ctx = $('#myChart').get(0).getContext("2d")
    var opt1 = {
      scaleOverride : true,
      scaleSteps : 7,
      scaleStepWidth : 1,
      scaleStartValue : 0
    }
    new Chart(ctx).Line(data, opt1)
    var ctx2 = $('#collectionsChart').get(0).getContext("2d")
    var opt = {
      scaleOverride : true,
      scaleSteps : 22,
      scaleStepWidth : 1,
      scaleStartValue : 0
    }
    new Chart(ctx2).Bar(data2, opt)
  }//End Fun()

  function isIssued(element){
    return element.qualifier == "issued" ? element : null
  }

  //Button event listener
  $(document).ready(function(){
    var invalidateCache = $.cookie('lsInvalidate');
    if(invalidateCache == undefined){
      localStorage.clear();
      $.cookie('lsInvalidate', false, {expires: 1});
    }
    $('.bar').parent().hide()
    $('#submitBtn').click(function(event){
      event.preventDefault()
      var text = $('#sresturl').val();
    //RegEx to replace http/s with empty string
    text = text.replace(/http:\/\/|https:\/\//gi, "")
    if(text.substr(-1) == '/'){
      text = text.substr(0, text.length - 1);
    }
    console.log(text)
    testSimpleRest(text)
  });
  });
  
  function testSimpleRest(text){
    localStorage.clear();
   $.getJSON("http://"+text+"/rootcommunities?media=json", function(data){
    $(".bar").parent().fadeIn(1000)
    $(".bar").css("width", "0%")
    $('.bar').width(200)
    console.log(data)
    jee = data
    if(jee.length == 0){
      alert("Your DSpace instance is empty!")
    }
    if(jee[0].name.length == 0){
      alert("There was a problem with configuring your DSpace instance")
      $(".bar").parent().hide()
    }
  }).fail(function(){
    alert("invalid simplerest instance/url")
    $(".bar").parent().hide()
  }).complete(function(){
    setTimeout(function(){
      $(".bar").css("width", "100%");
      localStorage.setItem("dspace_url", "http://"+text+"/");
      $(init)
      $(fun)
    }, 3000)
    setTimeout(function(){
      $('.bar').parent().fadeOut(500)
      $('.bar').width(0)
    }, 10000)
  });
}

$(init)
$(initLs)
})();
