const expressFunction = require('express');
const authorization = require('../config/authorize');
const router = expressFunction.Router();
const mongoose = require('mongoose');

var Schema = require("mongoose").Schema;
const e = require('express');
const cartSchema = Schema({
    customerid: String,
    gameid: String,
    deviceid: String,
    name: String,
    quantity: Number,
    price: Number
},  {
    conllection: 'carts'
});

let Cart
try {
    Cart = mongoose.model('carts')
} catch (error) {
    
    Cart = mongoose.model('carts', cartSchema);
}


const addtocart = (data) => {
    return new Promise((resolve, reject) => {
        var add_cart = new Cart({
            customerid: data.customerid,
            gameid: data.gameid,
            deviceid: data.deviceid,
            name: data.name,
            quantity: data.quantity,
            price: data.price
        })
        add_cart.save((err,data) => {
            if(data){
               resolve(data)
            }else{
                reject(new Error('Cannot add to Cart'))
            }
        })
    })
}

const updatecart = (payload) => {
    return new Promise((resolve, reject) => {
        const query = {customerid: payload.customerid,deviceid: payload.deviceid }
       if(payload.deviceid){
        Cart.findOneAndUpdate(query,{ $set :{quantity: payload.quantity,}},(err, data) => {
            if(data){
                resolve(data)
            }else{
                reject(new Error('Cannot Update'))
            }
        })
       }
    })
}

const getCart = (customerid) =>{
    return new Promise((resolve, reject) => {
        Cart.find({customerid:customerid},(err, data) => {
            if(data){
                resolve(data)
                reject(new Error('Cannot get User Data'))
            }
            else{
                reject(new Error('Cannot get User Data'))
            }
        })
        
    })
}

const deleteallcart = (customerid) => {
    return new Promise((resolve, reject) => {
        console.log('delete')      
          Cart.deleteMany({customerid:customerid},(err, data) => {            
              if(data.deletedCount != 0){
                  resolve(data)
              }else{
                  reject(new Error('Cannot Delete'))
              }
          })
      
    })
  }

const deletefromcart = (customerid,productid) => {
  return new Promise((resolve, reject) => {
      console.log('delete')
    console.log(productid)
    if(productid[0] === 'D'){        
        Cart.deleteOne({customerid:customerid,deviceid:productid},(err, data) => {            
            if(data.deletedCount != 0){
                resolve(data)
            }else{
                reject(new Error('Cannot Delete'))
            }
        })
    }else{
        Cart.deleteOne({customerid:customerid,gameid:productid},(err, data) => {
            if(data.deletedCount != 0){
                resolve(data)
            }else{
                reject(new Error('Cannot Delete'))
            }
        })
    }
  })
}

router.route('/addtocart/:userid/:quantity').post(authorization,(req, res) => {
    var payload
    const userid = req.params.userid
    const quantity = req.params.quantity
    if(req.body['id'][0] === 'G'){
        console.log(req.body['id'][0])
         payload = {
            customerid: userid,
            gameid: req.body['id'],
            name: req.body['title'],
            quantity: 1,
            price: req.body['price']
        }
    }else{
         payload = {
            customerid: userid,
            deviceid: req.body['id'],
            name: req.body['name'],
            quantity: quantity,
            price: req.body['price']
        }
    }
    
    addtocart(payload)
    .then(result => {
        res.status(200).send(result)
    })
    .catch(err => {
        console.log(err)
    })
})

router.route('/updatecart/:quantity').put(authorization,(req, res) => {
    const quantity = req.params.quantity
    const payload = {
        customerid: req.body.customerid,
        gameid: req.body.gameid,
        deviceid: req.body.deviceid,
        quantity: quantity
    }
    updatecart(payload)
    .then(result => {
        res.status(200).send(result)
    })
    .catch(err => {
        console.log(err)
      
    })
})

router.route('/getcart/:customerid').get(authorization,(req, res) => {
    const customerid = req.params.customerid
    getCart(customerid)
    .then(result => {
        res.status(200).send(result)
    })
    .catch(err => {
        console.log(err)
    })
})
router.route('/deletefromcart/:customerid/:productid').delete(authorization,(req, res) => {
    console.log('product')
    console.log(req.params.productid)
    console.log('hello')
    console.log(req.params.customerid)
    const customerid = req.params.customerid
    const productid = req.params.productid
    deletefromcart(customerid,productid)
    .then(result => {
        res.status(200).send(result)
    })
    .catch(err => {
        console.log(err)
    })
})
router.route('/deleteallcart/:customerid').delete(authorization,(req, res) => {
    const customerid = req.params.customerid
    console.log(customerid)
    deleteallcart(customerid)
    .then(result => {
        res.status(200).send(result)
    })
    .catch(err => {
        console.log(err)
    })
})


module.exports = router