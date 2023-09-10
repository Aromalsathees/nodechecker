

var db=require('../config/connection')
var collection=require('../config/collections')
var objectId=require('mongodb').ObjectID

module.exports={
 addproducts:(product,callback)=>{
        console.log(product);

        db.get().collection('product').insertOne(product).then((data)=>{
        
        callback(data.insertedId)       

    })
},
 getAllproducts:()=>{
    return new Promise(async(resolve,reject)=>{
        let products=await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
        resolve(products)
    })
 },

 deleteproduct:(proId)=>{
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.PRODUCT_COLLECTION).removeOne({_id:objectId(proId)}).then((response)=>{
            console.log(response)
         resolve(response)
        })
    })
 },


    getProductDetails:(proId)=>{
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:objectId(proId)}).then((product)=>{
            resolve(product)
        })
    })
 },

 updateProduct:(proId,proDetails)=>{
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:objectId(proId)},{
            $set:{
                name:proDetails.name,
                Description:proDetails.Description,
                Category:proDetails.Category
            }
        }).then((response)=>{
            resolve()
        })
    })
 }
 
}