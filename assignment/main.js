const loadallproduct = document.querySelector('#load-allproduct');

fetch('http://localhost:3000/api/products', {
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
})

    .then(response => response.json())
    .then(data => {
        data.forEach(product => {

            let description = product.description.length > 30 ? product.description.substring(0, 25) + '...' : product.description;

            loadallproduct.innerHTML += `
                    <div class="col-md-6 col-lg-4 col-xl-3">
                        <div class="rounded position-relative fruite-item">
                            <div class="fruite-img">
                            <a href="./shop-detail.html?id=${product.id}">
                                <img src="http://localhost:3000/images/${product.img}" class="img-fluid w-100 rounded-top" alt=""></a>
                            </div>
                            <div class="text-white bg-secondary px-3 py-1 rounded position-absolute" style="top: 10px; left: 10px;">Fruits</div>
                            <div class="p-4 border border-secondary border-top-0 rounded-bottom">
                                <h4>${product.name}</h4>
                                <p>${description}</p>
                                <div class="d-flex justify-content-between flex-lg-wrap">
                                    <p class="text-dark fs-5 fw-bold mb-0">${product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}/ kg</p>
                                    <a href="./shop-detail.html?id=${product.id}" class="btn border border-secondary rounded-pill px-3 text-primary"><i class="fa fa-shopping-bag me-2 text-primary"></i>Xem chi tiết</a>
                                </div>
                            </div>
                        </div>
                    </div>
            `;
        });
    })
    .catch(err => console.log(err));


const loadcategories = document.querySelector('#load-categories');

fetch('http://localhost:3000/api/categories')
    .then(response => response.json())
    .then(data => {
        data.forEach(product => {
            loadcategories.innerHTML += `
            <div class="col-md-6 col-lg-4">
            <a href="#">
                <div class="service-item bg-secondary rounded border border-secondary">
                    <img src="http://localhost:3000/images/${product.img}" class="img-fluid rounded-top w-100" style="height: 250px; alt="">
                    <div class="px-4 rounded-bottom">
                        <div class=" text-center p-4 rounded">
                            <h5 class="text-white">${product.name}</h5>
                        </div>
                    </div>
                </div>
            </a>

            `;
        });
    })

    .catch(err => console.log(err));

const loadbestseller = document.querySelector('#load-bestseller');

fetch('http://localhost:3000/api/products/hot')
    .then(response => response.json())
    .then(data => {
        data.forEach(product => {
            let description = product.description.length > 30 ? product.description.substring(0, 25) + '...' : product.description;
            loadbestseller.innerHTML += `
                <div class="col-md-6 col-lg-6 col-xl-3">
                <div class="text-center">
                    <img src="http://localhost:3000/images/${product.img}" class="img-fluid rounded" alt="">
                    <div class="py-4">
                        <a href="#" class="h5">${product.name}</a>
                        <div class="d-flex my-3 justify-content-center">
                        <p>${description}</p>
                        </div>
                        <h4 class="mb-3">${product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</h4>
                        <a href="./shop-detail.html?id=${product.id}" class="btn border border-secondary rounded-pill px-3 text-primary"><i class="fa fa-shopping-bag me-2 text-primary"></i> Xem chi tiết</a>
                    </div>
                </div>
            </div>
            `;
        });
    })
    .catch(err => console.log(err));

const loadproductcategories = document.querySelector('#load-product-categories');

fetch('http://localhost:3000/api/products/categoryName/Thịt')
    .then(response => response.json())
    .then(data => {
        data.forEach(product => {
            let description = product.description.length > 30 ? product.description.substring(0, 25) + '...' : product.description;
            loadproductcategories.innerHTML += `
                <div class="border border-primary rounded position-relative vesitable-item" style="max-width: 300px;">
                <div class="vesitable-img">
                    <img src="http://localhost:3000/images/${product.img}" class="img-fluid w-100 rounded-top" alt="" >
                </div>
                <div class="p-4 rounded-bottom">
                    <h4>${product.name}</h4>
                    <p>${description}</p>
                    <div class="d-flex justify-content-between flex-lg-wrap">
                        <p class="text-dark fs-5 fw-bold mb-0">${product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                        <a href="./shop-detail.html?id=${product.id}" class="btn border border-secondary rounded-pill px-3 text-primary"><i
                                class="fa fa-shopping-bag me-2 text-primary"></i> Xem chi tiết</a>
                    </div>
                </div>
            </div>
           
                `;
        });
    })
    .catch(err => console.log(err));

const detail = document.querySelector('#load-detail');
//show chi tiết 1 sản phẩm
const id = window.location.href.split('id=')[1];
fetch(`http://localhost:3000/api/products/${id}`)
    .then(response => response.json())
    .then(data => {
        detail.innerHTML += `
                    <div class="row g-4">
                                    <div class="col-lg-6">
                                        <div class="border rounded">
                                            <a href="#">
                                                <img src="http://localhost:3000/images/${data.img}" class="img-fluid rounded" alt="Image">
                                            </a>
                                        </div>
                                    </div>
                                    <div class="col-lg-6">
                                        <h4 class="fw-bold mb-3">${data.name}</h4>
                                        <h5 class="fw-bold mb-3">${data.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</h5>
                                        <p class="mb-4">${data.description}</p>
                                        <div class="input-group quantity mb-5" style="width: 100px;">
                                            <div class="input-group-btn">
                                                <button class="btn btn-sm btn-minus rounded-circle bg-light border" >
                                                    <i class="fa fa-minus"></i>
                                                </button>
                                            </div>
                                            <input type="text" class="form-control form-control-sm text-center border-0" value="1">
                                            <div class="input-group-btn">
                                                <button class="btn btn-sm btn-plus rounded-circle bg-light border">
                                                    <i class="fa fa-plus"></i>
                                                </button>
                                            </div>
                                        </div>
                                        <a href="#" class="btn border border-secondary rounded-pill px-4 py-2 mb-4 text-primary"><i class="fa fa-shopping-bag me-2 text-primary"></i> Thêm vào giỏ</a>
                                    </div>
                                    <div class="col-lg-12">
                                        <nav>
                                            <div class="nav nav-tabs mb-3">
                                                <button class="nav-link active border-white border-bottom-0" type="button" role="tab"
                                                    id="nav-about-tab" data-bs-toggle="tab" data-bs-target="#nav-about"
                                                    aria-controls="nav-about" aria-selected="true">Mô tả</button>
                                            </div>
                                        </nav>
                                        <div class="tab-content mb-5">
                                            <div class="tab-pane active" id="nav-about" role="tabpanel" aria-labelledby="nav-about-tab">
                                                <p>${data.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                </div>
                `;
    })
    .catch(err => console.log(err));

// Xử lý khi trang được tải
document.addEventListener('DOMContentLoaded', function() {
    // Hàm fetch và hiển thị sản phẩm theo danh mục
    function fetchAndDisplayProductsByCategory(categoryName) {
        fetch(`http://localhost:3000/api/products/categoryName/${categoryName}`)
            .then(response => response.json())
            .then(data => {
                const loadshop = document.querySelector('#load-shop');
                loadshop.innerHTML = ''; // Xóa nội dung cũ của #load-shop
                data.forEach(product => {
                    let description = product.description.length > 30 ? product.description.substring(0, 25) + '...' : product.description;
                    // Tạo HTML cho mỗi sản phẩm và thêm vào #load-shop
                    loadshop.innerHTML += `
                        <div class="col-md-6 col-lg-6 col-xl-4">
                            <div class="rounded position-relative fruite-item">
                                <div class="fruite-img">
                                    <img src="http://localhost:3000/images/${product.img}" class="img-fluid w-100 rounded-top" alt="">
                                </div>
                                <div class="p-4 border border-secondary border-top-0 rounded-bottom">
                                    <h4>${product.name}</h4>
                                    <p>${description}</p>
                                    <div class="d-flex justify-content-between flex-lg-wrap">
                                        <p class="text-dark fs-5 fw-bold mb-0">${product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}/ kg</p>
                                        <a href="./shop-detail.html?id=${product.id}"
                                            class="btn border border-secondary rounded-pill px-3 text-primary"><i
                                                class="fa fa-shopping-bag me-2 text-primary"></i> Xem giỏ hàng</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                });
            })
            .catch(err => console.log(err));
    }

    // Thêm sự kiện click vào danh mục
    const loadcatenum = document.querySelector('#load-catenum');
    loadcatenum.addEventListener('click', function(event) {
        if (event.target.classList.contains('fruite-name')) {
            const categoryName = event.target.innerText.trim();
            fetchAndDisplayProductsByCategory(categoryName);
        }
    });

    // Load tất cả danh mục khi trang được tải
    fetch('http://localhost:3000/api/categories')
        .then(response => response.json())
        .then(data => {
            const loadcatenum = document.querySelector('#load-catenum');
            data.forEach(category => {
                loadcatenum.innerHTML += `
                    <div class="d-flex justify-content-between fruite-name">
                        <a href="#"><i class="fas fa-apple-alt me-2"></i>${category.name}</a>
                    </div>
                `;
            });
        })
        .catch(err => console.log(err));

    // Load sản phẩm ban đầu khi trang được tải
    fetch('http://localhost:3000/api/products')
        .then(response => response.json())
        .then(data => {
            const loadshop = document.querySelector('#load-shop');
            data.forEach(product => {
                let description = product.description.length > 30 ? product.description.substring(0, 25) + '...' : product.description;
                // Tạo HTML cho mỗi sản phẩm và thêm vào #load-shop
                loadshop.innerHTML += `
                    <div class="col-md-6 col-lg-6 col-xl-4">
                        <div class="rounded position-relative fruite-item">
                            <div class="fruite-img">
                                <img src="http://localhost:3000/images/${product.img}" class="img-fluid w-100 rounded-top" alt="">
                            </div>
                            <div class="p-4 border border-secondary border-top-0 rounded-bottom">
                                <h4>${product.name}</h4>
                                <p>${description}</p>
                                <div class="d-flex justify-content-between flex-lg-wrap">
                                    <p class="text-dark fs-5 fw-bold mb-0">${product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}/ kg</p>
                                    <a href="./shop-detail.html?id=${product.id}"
                                        class="btn border border-secondary rounded-pill px-3 text-primary"><i
                                            class="fa fa-shopping-bag me-2 text-primary"></i> Xem giỏ hàng</a>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });
        })
        .catch(err => console.log(err));
});
