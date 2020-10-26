const express=require("express");
const _ =require("lodash");
const body_parser=require("body-parser");
const { static } = require("express");
const path=require("path");
const mongoose=require("mongoose");
const { Console } = require("console");
mongoose.set('useFindAndModify', false);
const daytime=require(__dirname+"/date.js");
const port=process.env.PORT||8000;
// const ejs=require("ejs");
const app= express();
// // const staticpath=path.join(__dirname+"/public");
// console.log(staticpath);

app.use(body_parser.urlencoded({extended:true}))
app.use(express.static("public"));

 var items=[];
 var totalitem=[];
 
app.set("view engine","ejs");

mongoose.connect("mongodb+srv://admin-mayuri:<password>@cluster0.0pmwj.mongodb.net/<dbname>?retryWrites=true&w=majority/tolistdb", { useNewUrlParser: true });

// create item table
const  item={
  name:String
};

//create collections sechema save table as a collection

const Items=mongoose.model("Items",item);

// create document means insert a row in table

const item1=new Items({
  name:"welcome to todolist application"
});
const item2=new Items({
  name:"Add the item to todolist application"
});
const item3=new Items({
  name:"recheck  the todolist application"
});
const totalitems=[item1,item2,item3];




app.get("/",(req,res)=>{
// show dta inside database

Items.find({},(err,showdata)=>{
if(showdata===0){

// insert data into table
Items.insertMany(totalitems,(err)=>{
  if(err){
    console.log(err);
  }
  else{
    console.log("Inserted Sucessfully");
  }
});
  res.render("/");
}  
  else{
    res.render("index",{tday:day,time:time,foodname:showdata});

  }
})

      day=daytime.getday();
      time=daytime.gettime();
     
});



app.post("/",(req,res)=>{

 let newitem=req.body.wname;
    let newlist=req.body.addlist;

    const item=new Items({
      name: newitem
     } )

    if(newlist==="Today"){
      item.save();
      res.redirect("/");
    } 
    else{
      List.findOne({name:newlist},(err,founddata)=>{
        founddata.itm.push(item);
        founddata.save();
        res.redirect("/" + newlist);
      })
    }
 
 

 
})


// creat custome list page 

// crete table
const listschema={
  name:String,
  itm:[item]
}
//crete collection means table 
const List= mongoose.model("List",listschema);

 app.get("/:customlist",(req,res)=>{
  const customlist=_.capitalize(req.params.customlist);
   
  List.findOne({name:customlist},(err,founddata)=>{
    if(!err){
      if(!founddata){
        //create new document
        const listdata=new List({
          name:customlist,
          itm:totalitems
        })
        listdata.save();
        res.redirect("/" + customlist);
      //  console.log("not EXIST");
      }
      else{
        //show existing list
        res.render("lists",{name:founddata.name,foodname:founddata.itm});
       
        // console.log(" EXIST");
      }
    }
   
  })
  
  const listdata=new List({
    name:customlist,
    itm:totalitems
  })
  listdata.save();

});
// delete record db

app.post("/delete",(req,res)=>{
  let id=req.body.wname;
  let listname=req.body.listdta;
  console.log(req.body.wname);
  if(listname==="Today"){
    Items.findByIdAndRemove(id,(err)=>{
      if(err){
        console.log(err);
      }
      else{
        console.log("deleted");
        
      }
    })
  
  }
  else{
    List.findOneAndUpdate({name:listname},
      {$pull:{itm:{_id:id}}},(err,result)=>{
     if(!err){
      res.redirect("/" + listname);
     }
     else{
      console.log(err);
    }
   })
   
}
    });
  
  

 

 
app.listen(port,()=>{
    console.log("Hii I am Listen");
})