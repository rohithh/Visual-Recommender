numViews = 0, numVotes = 0, numAnswers = 0;
answerFlag = false;
reputationFlag = false;
var stopwords = ["a", "about", "above", "above", "across", "after", "afterwards", "again", "against", "all", "almost", "alone", "along", "already", "also","although","always","am","among", "amongst", "amoungst", "amount",  "an", "and", "another", "any","anyhow","anyone","anything","anyway", "anywhere", "are", "around", "as",  "at", "back","be","became", "because","become","becomes", "becoming", "been", "before", "beforehand", "behind", "being", "below", "beside", "besides", "between", "beyond", "bill", "both", "bottom","but", "by", "call", "can", "cannot", "cant", "co", "con", "could", "couldnt", "cry", "de", "describe", "detail", "do", "done", "down", "due", "during", "each", "eg", "eight", "either", "eleven","else", "elsewhere", "empty", "enough", "etc", "even", "ever", "every", "everyone", "everything", "everywhere", "except", "few", "fifteen", "fify", "fill", "find", "fire", "first", "five", "for", "former", "formerly", "forty", "found", "four", "from", "front", "full", "further", "get", "give", "go", "had", "has", "hasnt", "have", "he", "hence", "her", "here", "hereafter", "hereby", "herein", "hereupon", "hers", "herself", "him", "himself", "his", "how", "however", "hundred", "ie", "if", "in", "inc", "indeed", "interest", "into", "is", "it", "its", "itself", "keep", "last", "latter", "latterly", "least", "less", "ltd", "made", "many", "may", "me", "meanwhile", "might", "mill", "mine", "more", "moreover", "most", "mostly", "move", "much", "must", "my", "myself", "name", "namely", "neither", "never", "nevertheless", "next", "nine", "no", "nobody", "none", "noone", "nor", "not", "nothing", "now", "nowhere", "of", "off", "often", "on", "once", "one", "only", "onto", "or", "other", "others", "otherwise", "our", "ours", "ourselves", "out", "over", "own","part", "per", "perhaps", "please", "put", "rather", "re", "same", "see", "seem", "seemed", "seeming", "seems", "serious", "several", "she", "should", "show", "side", "since", "sincere", "six", "sixty", "so", "some", "somehow", "someone", "something", "sometime", "sometimes", "somewhere", "still", "such", "system", "take", "ten", "than", "that", "the", "their", "them", "themselves", "then", "thence", "there", "thereafter", "thereby", "therefore", "therein", "thereupon", "these", "they", "thickv", "thin", "third", "this", "those", "though", "three", "through", "throughout", "thru", "thus", "to", "together", "too", "top", "toward", "towards", "twelve", "twenty", "two", "un", "under", "until", "up", "upon", "us", "very", "via", "was", "we", "well", "were", "what", "whatever", "when", "whence", "whenever", "where", "whereafter", "whereas", "whereby", "wherein", "whereupon", "wherever", "whether", "which", "while", "whither", "who", "whoever", "whole", "whom", "whose", "why", "will", "with", "within", "without", "would", "yet", "you", "your", "yours", "yourself", "yourselves", "the"];

var request;
var question = "";
var data;

var questionWords;
var range;
var tagDict={};

function loadData(callback) {

  if(window.XMLHttpRequest) {
    request = new XMLHttpRequest();
  } else {
    request = new ActiveObject("Microsoft.XMLHTTP");
  }

  request.open("GET","data/data.json");
  request.onreadystatechange = function () {
    if (request.readyState == 4 && request.status == "200") {
      // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
      callback(request.responseText);
    }
  };

  request.send(null);


}

function resetParameters() {
  document.getElementById("votes-text").innerHTML = "Votes";
  document.getElementById("views-text").innerHTML = "Views";
  //document.getElementById("answers-text").innerHTML = "Answers";
  document.getElementById("parameters").reset();
  document.getElementById("votes").removeAttribute("disabled");
  document.getElementById("views").removeAttribute("disabled");
  document.getElementById("answers").removeAttribute("disabled");
  document.getElementById("reputation").removeAttribute("disabled");
  //document.getElementById("changeSkin").removeAttribute("disabled");
  //document.getElementById("answers").removeAttribute("disabled");
  document.getElementById("recommendPostsTitle").innerHTML = "Recommended Posts &#128077;";
  numViews = 0, numVotes = 0, numAnswers = 0;
  answerFlag = false;
  reputationFlag = false;
}


function extractQuestion(){

  resetParameters();

  question=document.getElementById('question').value;
  question=question.split(' ');

  for(var i =0;i<question.length;i++) {

    for(var j =0;j<stopwords.length;j++) {
      if(question[i]==stopwords[j]) {
        question.splice(i,1);
        i--;
        break;
      }
    }
  }

  recommendPosts();

}

function OnChange(id) {

  document.getElementById("recommendPostsTitle").innerHTML = "Recommended Posts &#128077;";

  if(id=="votes-text") {
    numVotes = document.getElementById("votes").value;
    document.getElementById(id).innerHTML = "Votes: " + document.getElementById("votes").value;
  } else if (id=="views-text") {
    numViews = document.getElementById("views").value;
    document.getElementById(id).innerHTML = "Views: " + document.getElementById("views").value;
  } /*else {
    numAnswers = document.getElementById("answers").value;
    document.getElementById(id).innerHTML = "Answers: " + document.getElementById("answers").value;
  }*/
  answerFlag = false;
  reputationFlag = false;
  recommendPosts();
}

function modifyBar(id,min,max){
    var minval = document.getElementById(id);
    if(minval) {
        minval.min = min;
        minval.max = max;
    }

}

function answerSort() {
  answerFlag = true;
  reputationFlag = false;
  document.getElementById("votes-text").innerHTML = "Votes";
  document.getElementById("views-text").innerHTML = "Views";
  recommendPosts();
}

function reputationSort() {
  answerFlag = false;
  reputationFlag = true;
  document.getElementById("votes-text").innerHTML = "Votes";
  document.getElementById("views-text").innerHTML = "Views";
  recommendPosts();
}


function recommendPosts() {
  var map = {};
  var tagList=[];
  var finalPosts=[];

  var tagParentNode = document.getElementById("tag-canvas");
  var tagChild = document.getElementById("svg-container");
  if(tagChild){
    tagParentNode.removeChild(tagChild);
  }

  var parentNode = document.getElementById("recommendPosts");
  var child = document.getElementById("recommendedPosts");

  if(child) {
    parentNode.removeChild(child);
  }

  var div= document.createElement("div");
  parentNode.appendChild(div);
  div.setAttribute("id","recommendedPosts");

  if(question) {
      for(var i=question.length;i>0;i--){
        finalPosts = finalPosts.concat(filterQuestions(question,i));
        if(finalPosts.length>10){
            break;
        }
      }

      finalPosts = finalPosts.splice(0,10);

       for(var i=0;i<finalPosts.length;i++){
        if(finalPosts[i]['views']>=numViews && finalPosts[i]['votes']>=numVotes && !answerFlag && !reputationFlag){

            var p = document.createElement("p");
            p.setAttribute("onmouseover","mouseOverPost(this)");
            p.setAttribute("onmouseout","mouseOutPost()");
            div.appendChild(p);
            var a = document.createElement("a");
            a.setAttribute("target","_blank");
            a.setAttribute("class","recommended-posts");
            a.setAttribute("style","text-decoration:none;");
            a.setAttribute("tags",finalPosts[i]["tags"]);
            p.appendChild(a).setAttribute("href",finalPosts[i]["link"]);

            a.appendChild(document.createTextNode(/*i+" : "+*/finalPosts[i]["title"]));
            for(var j=0;j<finalPosts[i]['tags'].length;j++){
                if(map[finalPosts[i]['tags'][j]]){
                    map[finalPosts[i]['tags'][j]]=map[finalPosts[i]['tags'][j]]+1;
                }
                else{
                    map[finalPosts[i]['tags'][j]] = 1;
                }
            }

        } else if(answerFlag) {

          document.getElementById("recommendPostsTitle").innerHTML = "Recommended Posts &#x2714;";
          sortedAnswers = []
          sortedAnswers=sortedAnswers.concat(finalPosts.sort(function(a,b){
            return b['answer_count']-a['answer_count'];
        }));


        var p = document.createElement("p");
        p.setAttribute("onmouseover","mouseOverPost(this)");
        p.setAttribute("onmouseout","mouseOutPost()");
        div.appendChild(p);
        var a = document.createElement("a");
        a.setAttribute("target","_blank");
        a.setAttribute("class","recommended-posts");
        a.setAttribute("style","text-decoration:none;");
        a.setAttribute("tags",sortedAnswers[i]["tags"]);
        p.appendChild(a).setAttribute("href",sortedAnswers[i]["link"]);

        a.appendChild(document.createTextNode(/*i+" : "+*/sortedAnswers[i]["title"]));
        for(var j=0;j<sortedAnswers[i]['tags'].length;j++){
            if(map[sortedAnswers[i]['tags'][j]]){
                map[sortedAnswers[i]['tags'][j]]=map[sortedAnswers[i]['tags'][j]]+1;
            }
            else{
                map[sortedAnswers[i]['tags'][j]] = 1;
            }
        }

      } else if(reputationFlag) {

          document.getElementById("recommendPostsTitle").innerHTML = "Recommended Posts &#127775;";
          sortReputation = []
          sortReputation=sortReputation.concat(finalPosts.sort(function(a,b){
            return b['owner']['reputation']-a['owner']['reputation'];
        }));


        var p = document.createElement("p");
        p.setAttribute("onmouseover","mouseOverPost(this)");
        p.setAttribute("onmouseout","mouseOutPost()");
        div.appendChild(p);
        var a = document.createElement("a");
        a.setAttribute("target","_blank");
        a.setAttribute("class","recommended-posts");
        a.setAttribute("style","text-decoration:none;");
        a.setAttribute("tags",sortReputation[i]["tags"]);
        p.appendChild(a).setAttribute("href",sortReputation[i]["link"]);

        a.appendChild(document.createTextNode(/*i+" : "+*/sortReputation[i]["title"]));
        for(var j=0;j<sortReputation[i]['tags'].length;j++){
            if(map[sortReputation[i]['tags'][j]]){
                map[sortReputation[i]['tags'][j]]=map[sortReputation[i]['tags'][j]]+1;
            }
            else{
                map[sortReputation[i]['tags'][j]] = 1;
            }
        }

        }
      }


      for(var key in map){
          var temp ={};
          temp["name"] = key;
          temp["count"] = map[key];
          tagList = tagList.concat(temp);

      }
      tagDict["children"] = tagList;
      var sortedPostsVotes=[];
      sortedPostsVotes=sortedPostsVotes.concat(finalPosts.sort(function(a,b){
        return b['votes']-a['votes'];
    }));
      var sortedPostsViews=[];
      sortedPostsViews = sortedPostsViews.concat(finalPosts.sort(function(a,b){
        return b['views']-a['views'];
    }));
      modifyBar("votes",sortedPostsVotes[sortedPostsVotes.length-1]['votes'],sortedPostsVotes[0]['votes']);
      modifyBar("views",sortedPostsViews[sortedPostsViews.length-1]['views'],sortedPostsViews[0]['views']);
    }
    tagsBubbleChart();
    //hyperlinkTags();

}



function filterQuestions(questionWords,range){
    var finalQuestion=[];
    for(var i=0;i<data.length;i++){
        var dataQuestion = data[i]["title"];
        var count=0;
        for(var j=0;j<questionWords.length;j++){
          if(questionWords[j]=="r") {
            questionWords[j] = questionWords[j].toUpperCase();
          }
          if(dataQuestion.includes(questionWords[j])){
              count++;
              if(count>=range){
                  finalQuestion.push(data[i]);
              }
          }
        }

    }
    finalQuestion.sort(function(a,b){
        return b['votes']-a['votes'];
    });
    return finalQuestion.splice(0,20);
}

// D3 Tags Bubble Chart

function tagsBubbleChart() {
  var t = d3.transition().duration(750).ease(d3.easeLinear);
  var color = d3.scaleOrdinal(d3.schemeCategory20);

  var diameter = 600;
  var color = d3.scaleOrdinal(d3.schemeCategory20);
  var bubble = d3.pack(tagDict).size([diameter,diameter]).padding(1.5);

  var canvas = d3.select("#tag-canvas");

  var svgCanvas = canvas.append("svg").attr("width", diameter).attr("height", diameter).attr("id","svg-container");

  var nodes = d3.hierarchy(tagDict).sum(function(d) {
    return d.count;
  }).sort(function(a, b) { return a.count - b.count; });

  var node = svgCanvas.selectAll(".node").data(bubble(nodes).descendants()).enter().filter(function(d) {
    return !d.children;
  }).append("g").attr("class","node").attr("onmouseover","mouseOverTag(this)").attr("onmouseout","mouseOutTag()").attr("transform", function(d) {
    return "translate("+d.x+","+d.y+")";
  });

  node.append("title").text(function(d) {
    return "Tag: " + d.data.name + " ; Count: " + d.data.count;
  });

  node.append("circle").transition(t).attr("r", function(d) {
    return d.r;
  }).style("fill", function(d,i) {
    return color(i);
  });

  node.append("text").style("text-anchor", "middle").append("a").attr("xlink:href", function(d) {
    return "https://www.google.com/#q=" + d.data.name;
  }).attr("target","_blank").text(function(d) {
    return d.data.name;
  });



}


function init() {
 loadData(function(response) {
  //Parse JSON string into object
  data = JSON.parse(response);
 });

}

function mouseOverTag(e) {
    var target = e;
    var svgContainer = document.getElementById("svg-container");
    for(var i = 0; i<svgContainer.childElementCount;i++) {
      if(svgContainer.children[i]!=target) {
        svgContainer.children[i].setAttribute("opacity",0.3);
      }
    }


    var tagName = target.children[2].innerHTML;
    var paragraphStyle = target.children[1].getAttribute("style");
    paragraphStyle = paragraphStyle.replace("fill:","color:");
    paragraphStyle += "text-decoration:none;font-weight:bold;";

    var recommendedPosts = document.getElementById("recommendedPosts");

    for(var i = 0; i<recommendedPosts.childElementCount; i++) {
      tags = recommendedPosts.children[i].children[0].getAttribute("tags").split(",");

      if(tags.includes(tagName)) {
        recommendedPosts.children[i].children[0].setAttribute("style",paragraphStyle);
      }
      else {
        recommendedPosts.children[i].setAttribute("style","opacity:0.3");
      }
    }

}

function mouseOutTag() {

  var svgContainer = document.getElementById("svg-container");
  for(var i = 0; i<svgContainer.childElementCount;i++) {

    svgContainer.children[i].removeAttribute("opacity");

  }

  var recommendedPosts = document.getElementById("recommendedPosts");

  for(var i = 0; i<recommendedPosts.childElementCount; i++) {

    recommendedPosts.children[i].children[0].setAttribute("style","text-decoration:none;");
    recommendedPosts.children[i].removeAttribute("style");
  }

}

function mouseOverPost(e) {
  var target = e;
  var tags = target.children[0].getAttribute("tags").split(",")

  var svgContainer = document.getElementById("svg-container");

  for(var i = 0; i<svgContainer.childElementCount; i++) {
    if(!tags.includes(svgContainer.children[i].children[2].innerHTML)) {
      svgContainer.children[i].setAttribute("opacity",0.3);

    }
  }

  var container = document.getElementById("recommendedPosts");

  for(var i = 0; i<container.childElementCount; i++) {
    if(target!=container.children[i]) {
      container.children[i].setAttribute("style","opacity:0.3");
    }
  }

}

function mouseOutPost() {
  var svgContainer = document.getElementById("svg-container");

  for(var i = 0; i<svgContainer.childElementCount; i++) {
    svgContainer.children[i].removeAttribute("opacity");
  }

  var container = document.getElementById("recommendedPosts");

  for(var i = 0; i<container.childElementCount; i++) {
    container.children[i].removeAttribute("style");
    
  }


}

function changeSkin() {

  if(document.getElementById("changeSkin").innerHTML=="Dark") {
    document.getElementById("changeSkin").innerHTML = "Light";

    var child = document.getElementById("inpage-style");

    var head = document.getElementsByTagName("head")[0];
    if(child) {
      head.removeChild(child);
    }
    var style = document.createElement("style");
    head.appendChild(style);
    style.setAttribute("id","inpage-style");
    style.appendChild(document.createTextNode("a{color: white;};"));
    document.getElementById("question").setAttribute("style","color:#000;")
    document.getElementsByTagName("BODY")[0].setAttribute("style","background:#000;color:#fff;");

    document.getElementById("changeSkin").setAttribute("style","background:floralwhite;color:#000;");

  }
  else {
    document.getElementById("changeSkin").innerHTML = "Dark";
    var child = document.getElementById("inpage-style");

    var head = document.getElementsByTagName("head")[0];
    if(child) {
      head.removeChild(child);
    }
    var style = document.createElement("style");
    head.appendChild(style);
    style.setAttribute("id","inpage-style");
    style.appendChild(document.createTextNode("a{color: #000;};"));
    document.getElementById("question").setAttribute("style","color:#000;")
    document.getElementsByTagName("BODY")[0].setAttribute("style","background:floralwhite;color:#000;");
    document.getElementById("changeSkin").setAttribute("style","background:black;color:#fff;");
  }


 }

 /*function hyperlinkTags() {
  var nodes = document.getElementsByClassName("node");
  var length = nodes.length;

  for (var i =0;i<length;i++) {
    var textNode = nodes[i].children[2]
    var tagName = textNode.innerHTML;
    
    query = "https://www.google.com/#q=" + tagName;

    var child = document.createElement("a");
    textNode.innerHTML = textNode.appendChild(child);
    child.setAttribute("href",query);
    child.setAttribute("_target","blank");
    child.appendChild(document.createTextNode(tagName));
  
  }

  
 }*/

init();
