const User = require('../db/models/user')
const Goods = require('../db/models/goods')
require('../db/index')

// User
//   .findOne({username: 'admin@qq.com'})
//   .populate('cartList.goods')
//   .exec(function (err, doc) {
//     console.log(doc)
//   })

User.update(
  { username: 'admin@qq.com' },
  {
    $pull: {
      cartList: { productId: '201710016' }
    }
  }
).exec(function(err, doc) {
  console.log(doc)
})
