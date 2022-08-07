var express = require('express');
var router = express.Router();
const multer  = require('multer');
var adminHelpers = require('../helpers/admin-helpers');
var productHelpers = require('../helpers/product-helpers');
const userHelpers = require('../helpers/user-helpers');
const categoryHelpers = require('../helpers/category-helpers');

const fileStorageEngine = multer.diskStorage({
  destination: (req,file,cb)=>{
    cb(null,'./public/public-admin/product-images')
  },
  filename:(req,file,cb)=>{
    cb(null, Date.now() + "--" + file.originalname);
  }
})
const upload = multer({ storage: fileStorageEngine });

// newAdmin();
function newAdmin(){
  adminData={
    userName: 'admin@gmail.com',
    password: '123'
  }
adminHelpers.addAdmin(adminData).then((data)=>{
  console.log('Admin data added');
})
}  

const verifyLoginAdmin = (req, res, next) => {
  if (req.session.admin) next();
  else {
    req.session.noAdmin = 'You have to login first';
    res.redirect('/admin');
  }
} 

/* GET users listing. */
router.get('/', function(req, res, next) {
  if(req.session.admin){
    res.render('admin/index',{admin:true});
  }else{
    res.render('admin/login',{admin:true,noHeader:true, adminLoginError:req.session.adminLoginError,noAdmin: req.session.noAdmin})
    req.session.adminLoginError = false;
    req.session.noAdmin = false; 
  }
});

router.post('/login',(req,res)=>{
  adminHelpers.getAdmin(req.body).then((response)=>{
    if(response.status){
      req.session.admin = true;
      res.redirect('/admin');
    }else{
      req.session.adminLoginError = 'Please enter valid details';
      res.redirect('/admin');
    }
  })
})

router.get('/view-users',verifyLoginAdmin,(req,res)=>{
  userHelpers.getAllUsers().then((users)=>{
    res.render('admin/view-users',{users,'admin':true})
  })
})

router.get('/block/:id',(req,res)=>{
  req.session.user = false;
  userHelpers.blockUser(req.params.id).then(()=>{
    res.redirect('/admin/view-users');
  })
})

router.get('/unblock/:id',(req,res)=>{
  userHelpers.unblockUser(req.params.id).then(()=>{
    res.redirect('/admin/view-users');
  })
})
 
router.get('/view-products',verifyLoginAdmin,(req,res)=>{
  productHelpers.getAllProducts().then((products)=>{
    res.render('admin/view-products',{admin:true,products});
  })
})

router.get('/category',verifyLoginAdmin,(req,res)=>{
  categoryHelpers.getAllCategories().then((categories)=>{
    res.render('admin/category',{admin:true,categories});
  })
})

router.get('/add-category',verifyLoginAdmin,(req,res)=>{
  res.render('admin/add-category',{admin:true})
})

router.post('/add-category',verifyLoginAdmin,(req,res)=>{
  categoryHelpers.addCategory(req.body).then(()=>{
    res.redirect('/admin/category');
  })
})

router.post('/categorySelected',(req,res)=>{
  if(req.body.category == 'Travel'){
  categoryHelpers.getSubCategory().then((subCategory)=>{
    console.log('subCategory')
    console.log(subCategory)
     res.json(subCategory);

  })}else{
    response.category =false;
    res.json(response)
  }
})

router.get('/add-products',verifyLoginAdmin,(req,res)=>{
  categoryHelpers.getAllCategories().then((categories)=>{
    console.log(categories);
    categoryHelpers.getSubCategory().then((subCategory)=>{
    res.render('admin/add-products',{admin:true,categories,subCategory});
  })
})
  
})

router.post('/add-products', upload.array('images'), (req, res) => {
  productHelpers.addProducts(req.body).then(((id)=>{
    res.redirect('/admin/view-products')
  }))
  var filenames = req.files.map(function (file) {
    return file.filename;
  });
  req.body.images = filenames;
})

router.get('/edit-product/:id',(req,res)=>{
  productHelpers.getProduct(req.params.id).then((product)=>{
    categoryHelpers.getAllCategories().then((categories)=>{
      categoryHelpers.getSubCategory().then((subCategory)=>{
        res.render('admin/edit-product',{product,categories,subCategory,admin: true});
      })
      
    })
  })
})

router.post('/edit-product/:id',upload.array('images'),(req,res)=>{
  var filenames = req.files.map(function (file) {
    return file.filename;
  });
  req.body.images = filenames;
  productHelpers.editProduct(req.body,req.params.id).then((response)=>{
    console.log(response);
    res.redirect('/admin/view-products')
  })
  
})

router.get('/delete-product/:id',(req,res)=>{
  productHelpers.deleteProduct(req.params.id).then((response)=>{
    res.redirect('/admin/view-products');
  })
})

router.get('/logout',(req,res)=>{
  req.session.admin = false;
  res.redirect('/admin');
})


module.exports = router;
