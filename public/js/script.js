window.onload = async function() {
    try {
        // Fetch hot products
        const hotProductsResponse = await axios.get('/api/products/hot');
        const hotProducts = hotProductsResponse.data;
        displayProducts('hotProducts', hotProducts);

        // Fetch products from category 1
        const category1ProductsResponse = await axios.get('/api/products/categoryId/1');
        const category1Products = category1ProductsResponse.data;
        displayProducts('category1Products', category1Products);

        // Fetch products from category 2
        const category2ProductsResponse = await axios.get('/api/products/categoryId/2');
        const category2Products = category2ProductsResponse.data;
        displayProducts('category2Products', category2Products);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function displayProducts(containerId, products) {
    const container = document.getElementById(containerId);
    if (products.length > 0) {
        const productList = document.createElement('ul');
        products.forEach(product => {
            const listItem = document.createElement('li');
            listItem.textContent = product.name;
            productList.appendChild(listItem);
        });
        container.appendChild(productList);
    } else {
        container.textContent = 'No products available';
    }
}
