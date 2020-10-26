
 module.exports.getday=function(){

var date =new Date();
    
var day="";
  var options={
      weekday:"long",
      day:"numeric",
      month:"long"
  }

  day=date.toLocaleDateString("en-US",options);
  return day;

}

 module.exports.gettime=function(){
    var date =new Date();
    
var day="";
  var options={
      weekday:"long",
      day:"numeric",
      month:"long"
  }

  
  time=date.toLocaleTimeString();
  return time;
}