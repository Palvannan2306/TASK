
const express =require('express');
const path=require('path');
const mongoose=require('mongoose')
const bodyParser=require('body-parser')
const expressValidator=require('express-validator')
const flash=require('connect-flash')
const session=require('express-session')
const config=require('./config/database')
const passport=require('passport')

mongoose.connect(config.database)
let db=mongoose.connection;

db.once('open',function(){
    console.log('Connected')
})

db.on('error',function(err){
    console.log(err);
})




const app=express();

let Article=require('./model/article')


//public folder
app.use(express.static(path.join(__dirname,'public')))

//body parser
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

//Express session
app.use(session({
    secret:'keyboard cat',
    resave:true,
    saveUninitialized:true
}))

//Express-Messages
app.use(flash())
app.use(function(req,res,next){
    res.locals.messages=require('express-messages')(req,res)
    next()
})

//Express Validator
app.use(expressValidator({
    errorFormatter:function(param,msg,value){
        var namespace=param.split('.')
        ,root=namespace.shift()
        ,formParam=root;
        while(namespace.length){
            formParam+='['+namespace.shift()+']';
        }
        return{
            param:formParam,
            msg:msg,
            value:value
        }
        }
    }
    
))

//passport config
require('./config/passport')(passport)
app.use(passport.initialize())
app.use(passport.session())

app.get('*',function(req,res,next){
    res.locals.user=req.user || null;
    next();
})

app.set('views',path.join(__dirname,'views'))
app.set('view engine','pug');

app.get('/',function(req,res){
   
   Article.find({},function(err,articles){
       if(err){
           console.log(err)
       }else{
        res.render('index',{
            title:'Articles',
            articles:articles
       })
       }});
    
    });
  
    
    let art=require('./routes/articles')
   let uses=require('./routes/users');
const { cookie } = require('express-validator');
    app.use('/article',art)
app.use('/user',uses)
    
   
app.listen(2306);
