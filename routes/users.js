
var express = require('express');
var router = express.Router();
const productHelpers = require('../helpers/producthelpers');
const userHelpers =require('../helpers/user-helpers')
const verifyLogin=(req,res,next)=>{
  if(req.session.loggedIn){
    next()
  }else{
    res.redirect('/login')
  }
}



/* GET home page. */


router.get('/', async function (req, res, next) {
  let user=req.session.user
  console.log(user);
  let cartCount=null
  if(req.session.user){
  cartCount=await userHelpers.getCartCount(req.session.user._id)
  }

productHelpers.getAllproducts().then((products)=>{
  //console.log(products);
      res.render('user/view-products',{products,user,cartCount})
      })
     });



     router.get('/login',function(req,res){
      if(req.session.loggedIn){
        res.redirect('/')
      }else{
        res.render('user/login',{"loginErr":req.session.loginErr})
      req.session.loginErr=false
      }
     })

      

      
     router.get('/signup',function(req,res){
      res.render('user/signup')

     })

     router.post('/signup',function(req,res){
      userHelpers.doSignup(req.body).then((response)=>{
        console.log(req.body);
        console.log(response);
       
        req.session.loggedIn=true
        req.session.user.response
        res.redirect('/')
     })
    
    })

    // router.post('/signup',(req,res)=>{
    //   userHelpers.doSignup(req.body).then((response)=>{
    //     console.log(req.body);
    //     console.log(response);
    //     req.session.loggedIn=true
    //     req.session.user.response
    //    res.render('/')
    // })
    //   })











    router.post('/login',function(req,res){

      
      //console.log(req.body);
       userHelpers.doLogin(req.body).then((response)=>{
       if(response.status){
        req.session.loggedIn=true
        console.log(req.body)
        req.session.user=response.user
          res.redirect('/')
        } else{
          res.session.loginErr=true
          res.redirect('/login')
        }
      })
      
    })

    router.get('/logout',function(req,res){
      req.session.destroy()
      res.redirect('/')

    })

    router.get('/cart',verifyLogin,async(req,res)=>{
    
   let products=await userHelpers.getCartproducts(req.session.user._id)
   console.log(products);

      res.render('user/cart',{products,user:req.session.user})
    })


    router.get('/add-to-cart/:id',(req,res)=>{
      console.log('api call');
      userHelpers.addToCart(req.params.id,req.session.user._id).then(()=>{
       res.json({status:true})
      })
    })





module.exports = router;
