const express=require('express')

const router=express.Router();

let Article=require('../model/article')
let User=require('../model/user')

router.get('/add',function(req,res){
    res.render('add_article',{
        add:'Add article'
    });
    console.log('working 2');
})
  
  

router.post('/add',function(req,res){
    console.log("submitted");
    req.checkBody('title','Title is required').notEmpty();
    req.checkBody('body','Body is required').notEmpty();
    let errors=req.validationErrors();

    if(errors){
        res.render('add_article',{
            add:'Add article',
            errors:errors
        })
    }else{
        let arti=new Article();
        arti.title=req.body.title;
        arti.author=req.user._id;
        arti.body=req.body.body;
    
        arti.save(function(err){
            if(err){
               
                return
            }else{
                req.flash('success','Article added')
                res.redirect('/')
            }
        })
    }
    

    
})

 //single article
 router.get('/:id',function(req,res){
    Article.findById(req.params.id,function(err,arti){
    User.findById(arti.author,function(err,user){
            res.render('art',{
                arti:arti   ,
           author:user.name 
           })  
        })
      
    })
})

//edit article
router.get('/edit/:id',function(req,res){
    Article.findById(req.params.id,function(err,arti){
       res.render('edit_art',{
           title:'Edit Article',
           arti:arti    
       });   
    })
})


router.post('/edit/:id',function(req,res){
    console.log("submitted");
    let arti={};
    arti.title=req.body.title;
    arti.author=req.body.author;
    arti.body=req.body.body;
 let query={_id:req.params.id}
    Article.update(query,arti,function(err){
        if(err){
            console.log(err)
            return
        }else{
            res.redirect('/')
        }
    })
})

module.exports=router;


