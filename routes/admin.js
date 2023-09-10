var express = require('express');
var router = express.Router();
var productHelpers = require('../helpers/producthelpers');
const { log } = require('handlebars');

/* GET users listing. */
router.get('/', function(req, res, next) {

  productHelpers.getAllproducts().then((products)=>{
console.log(products);
    res.render('admin/viewsproducts',{admin:true,products})
  })

});



router.get('/addproducts',function(req,res){
  res.render('admin/addproducts')
});


router.post("/addproducts",function(req,res){
  console.log(req.body);
  console.log(req.files.Images);


  productHelpers.addproducts(req.body,(id)=>{
    let image=req.files.image
    console.log(id);
    image.mv('./public/product-images/'+id+'.jpg',(err,done)=>{
      if(!err){
      res.render('admin/addproducts');



      
    }
   } );
  
  })
  
})


  router.get('/product-delete/:id',function(req,res){
    let proId=req.params.id
    console.log(proId);
    productHelpers.deleteproduct(proId).then((response)=>{
      res.redirect('/admin/')
    })
  })


  router.get('/product-edit/:id',async (req,res)=>{
    let product=await productHelpers.getProductDetails(req.params.id)
    console.log(product);
   res.render('admin/product-edit',{product})
  })

  router.post('/product-edit/:id',(req,res)=>{
    console.log(req.params.id);
    productHelpers.updateProduct(req.params.id,req.body).then(()=>{
      res.redirect('/admin')
    })
    })
        
          

      
    
  

module.exports = router;