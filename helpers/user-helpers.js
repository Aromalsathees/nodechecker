var db = require('../config/connection')
var collections=require('../config/collections')
const bcrypt=require('bcrypt')
var objectId=require('mongodb').ObjectID


module.exports={
    doSignup:(userData)=>{
        return new Promise(async (resolve, reject)=>{
            userData.password = await bcrypt.hash(userData.password,10)
            db.get().collection(collections.USER_COLLECTION).insertOne(userData).then((data)=>{
                resolve(data.insertedId)
            })

        })
       
    },
    doLogin:(userData)=>{
        console.log(userData);

        
         return new Promise(async (resolve, reject)=>{
            
            let loginStatus=false;
            let response={}
          let user=await db.get().collection(collections.USER_COLLECTION).findOne({emailaddress:userData.emailaddress})

          console.log(user);
          if(user){
          bcrypt.compare(userData.password,user.password).then((status)=>{
           if(status){
            console.log('login successs');
           response.user=user
           response.status=true
            resolve(response)
           }else{
           console.log('login ayyoo');
            resolve({status:false})
           }
           
          })
        }else{
           console.log('login failed');
           resolve({status:false })
        }


          
 })
    },

    addToCart:(proId,userId)=>{
        let proObj={
            item:objectId(proId),
            quantity:1
        }

        return new Promise(async(resolve,reject)=>{
            let userCart=await db.get().collection(collections.CART_COLLECTION).findOne({user:objectId(userId)})
            if(userCart){
                let proExist=userCart.products.findIndex(product=> product.item==proId)
                console.log(proExist);

                if(proExist!==-1){
                    db.get().collection(collections.CART_COLLECTION).updateOne({'products.item':objectId(proId)},
                    {
                      $inc:{'products.$.quantity':1}
                    }
                    ).then(()=>{
                        resolve()
                    })
                }else{


            db.get().collection(collections.CART_COLLECTION).updateOne({user:objectId(userId)},
                 {
                
                    $push:{products:proObj  }


                
                 }
            ).then((response)=>{
              resolve()
            })
        }



            }else{
                let cartObj={
                    user:objectId(userId),
                    products:[proObj]
                }
                db.get().collection(collections.CART_COLLECTION).insertOne(cartObj).then((response)=>{
                    
                    resolve()
                })

            }
        })
    },
    getCartproducts:(userId)=>{
        return new Promise(async(resolve,reject)=>{
          let cartItems=await db.get().collection(collections.CART_COLLECTION).aggregate([
            {
                $match:{user:objectId(userId)}
            },
            {
                  $unwind:'$products'
                },
                {
                  $project:{
                    item:'$products.item',
                    quantity:'$products.quantity'
                  }
                },
                {
                  $lookup:{
                    from:collections.PRODUCT_COLLECTION,
                    localField:'item',
                    foreignField:'_id',
                    as:'product'
                  }
                },
                {
                  $project:{
                    item:1,quantity:1,product:{$arrayElemAt:['$product',0]}
                  }
                }


                
            // {
            //     $lookup:{
            //         from:collections.PRODUCT_COLLECTION,
            //         let:{proList:'$products'},
            //         pipeline:[
            //             {
            //                $match:{
            //                  $expr:{
            //                     $in:['$_id',"$$proList"]
            //                  }
            //                }
            //             }
            //         ],
            //         as:'cartItems'
            //     }
            // }
          ]).toArray()
          console.log(cartItems[0].products);
          resolve(cartItems)
        })
    },
    getCartCount:(userId)=>{
        return new Promise(async(resolve,reject)=>{{
            let count=0
            let cart=await db.get().collection(collections.CART_COLLECTION).findOne({user:objectId(userId)})
            

            if(cart){
             count=cart.products.length
            }
            resolve(count)
        }})
    }
    
}




