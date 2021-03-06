'use strict'

const api = require('./api')
const ui = require('./ui')

const onGetProducts = event => {
  api.getProducts()
    .then(ui.onGetProductsSuccess)
    .catch(ui.onGetProductsFailure)

  $('form').trigger('reset')
}

const onGetProduct = event => {
  event.preventDefault()
  // Store product data-id from handlebars file
  const productId = $(event.target).closest('div.product').data('id')

  api.getProduct(productId)
    .then(ui.onGetProductSuccess)
    .catch(ui.onGetProductFailure)

  $('form').trigger('reset')
}

const onSeedProducts = () => {
  api.seedProducts()
    .then(ui.onSeedProductsSuccess)
    .catch(ui.onSeedProductsFailure)
  // $('#seedModal').modal('hide')
}

const addProductEventHandlers = () => {
  onGetProducts()
  // For click on "Home" button
  $('#index-products').on('click', onGetProducts)
  // For click on View Product button - not add to cart button
  $('#show-product').on('click', onGetProduct)
  // For click on product div - not "Add to Cart" button
  $('#products').on('click', '.show-product', onGetProduct)
  $('body').on('click', '#seed-button', onSeedProducts)
}

module.exports = {
  addProductEventHandlers,
  onGetProducts
}
