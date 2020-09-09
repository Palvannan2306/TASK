const express=require('express')
const router=express.Router();
const bcrypt=require('bcryptjs')
const passport=require('passport')

let User=require('../model/user')

router.get('/register',function(req,res){
    res.render('register');
})
 
router.post('/register',function(req,res){


    const name=req.body.name;
    const email=req.body.email;
    const username=req.body.username;
    const password=req.body.password;
    const conpassword=req.body.conpassword;

    req.checkBody('name','Name is required').notEmpty();
    req.checkBody('email','Email is required').notEmpty();
    req.checkBody('email','Email is not valid').isEmail();
    req.checkBody('username','Username is required').notEmpty();
    req.checkBody('password','Password is required').notEmpty();
    req.checkBody('conpassword','Confirm-Password is required').notEmpty();
    req.checkBody('conpassword','Password dont match').equals(req.body.password);

    let errors=req.validationErrors();
 
    if(errors){
       
        console.log(errors)
        res.render('register',{
            errors:errors
        })
    }else{
        let newUser=User({
            name:name,
            email:email,
            username:username,
            password:password,
            conpassword:conpassword
        })
        bcrypt.genSalt(10,function(err,salt){
            bcrypt.hash(newUser.password,salt,function(err,hash){
                if(err){
                    console.log(err)
                    console.log("hi kat")
                    return
                }
                newUser.password=hash;
                newUser.save(function(err){
                    if(err){
                        console.log(err);
                        return;
                    }else{
                        req.flash('success','you r login')
                        res.redirect('/user/login')
                    }
                });
            })
        })
    }
   
})
router.get('/login',function(req,res){
    res.render('login')
})

router.post('/login',function(req,res,next){
    passport.authenticate('local',{
        successRedirect:'/',
        failureRedirect:'/user/login',
        failureflash:true
    })(req,res,next)
})


router.get('/logout',function(req,res){
    req.logout();
    req.flash('success','U R logout')
    res.redirect('/user/login')
})
module.exports=router;