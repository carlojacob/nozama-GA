'use strict'

const api = require('./api')
const ui = require('./ui')
const store = require('../store')
const cartEvents = require('../cart/events')

const checkoutHandler = StripeCheckout.configure({
  key: 'pk_test_V9DZfPXiW4nqdR9oNfPnadOI00Irg6vT5s',
  locale: 'auto'
})

const handleToken = function (token) {
  api.checkout(token)
    .then(ui.onCheckoutSuccess)
    .then((response) => {
      const products = store.cart.products
      store.newProducts = []
      for (let i = 0; i < products.length; i++) {
        for (const key in products[i]) {
          if (key === 'product') {
            const product = products[i][key]
            store.orderProduct = (({ imagePath, description, price, title }) => ({ imagePath, description, price, title }))(product)
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
      onSaveOrder(purchase)
    })
    .catch(ui.onCheckoutFailure)
}

const onSaveOrder = data => {
  api.saveOrder(data)
    .then((response) => {
      // console.log('response in save order', response)
      return store.data
    })
    .then(() => {
      store.emptyCart.cart.owner = store.user._id
      cartEvents.onUpdateCart(store.emptyCart)
      return store.emptyCart
    })
    .catch(ui.onFailure)
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
  $('.index-orders').on('click', onGetOrders)
}

module.exports = {
  checkoutHandler,
  addOrderEventHandlers
}
