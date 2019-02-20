'use strict'

const api = require('./api')
const ui = require('./ui')
const store = require('../store')

const checkoutHandler = StripeCheckout.configure({
  key: 'pk_test_Ba2NFx0UbzDjWo1LB87WJXYN',
  locale: 'auto'
})

// const button = document.getElementById('checkout')
// button.addEventListener('click', function (ev) {
//   checkoutHandler.open({
//     name: 'Sample Store',
//     description: 'Example Purchase',
//     token: handleToken
//   })
// })

const handleToken = function (token) {
  console.log(store.Sum)
  api.checkout(token)
    .then(ui.onCheckoutSuccess)
    .then((response) => {
      console.log('response in then', response)
      console.log('cart in response', store.cart)
      const products = store.cart.products
      store.newProducts = []
      for (let i = 0; i < products.length; i++) {
        for (const key in products[i]) {
          if (key === 'product') {
            console.log('key is product', products[i][key])
            const product = products[i][key]
            store.orderProduct = (({ imagePath,description,price,title }) => ({ imagePath, description, price, title }))(product)
            console.log('picked is product', store.orderProduct)
          }
          if (key === 'quantity') {
            store.orderQuantity = products[i][key]
          }
        }
        store.newProducts.push({product: store.orderProduct, quantity: store.orderQuantity})
      }
      const purchase = {
        order: {
          orderData: {
            products: store.newProducts
          },
          totalPrice: store.Sum
        }
      }
      console.log(purchase)
      api.saveOrder(purchase)
        .then(console.log)
        .catch(console.error)
    })
    .catch(ui.onCheckoutFailure)
}

const onCheckout = () => {
  checkoutHandler.open({
    name: 'Nozama',
    description: 'Purchase',
    token: handleToken,
    amount: store.Sum * 100
  })
}

const onGetOrders = () => {
  api.getOrders(store.user._id)
    .then(ui.onGetOrdersSuccess)
    .catch(ui.onGetOrdersFail)
}

const addOrderEventHandlers = () => {
  $('body').on('click', '#checkout', onCheckout)
  $('#index-orders').on('click', onGetOrders)
}

module.exports = {
  checkoutHandler,
  addOrderEventHandlers
}