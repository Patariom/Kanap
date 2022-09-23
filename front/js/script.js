displayProducts();

/** 
 * Fetch products on homepage
 * (from local API)
 */
async function fetchProducts() {
    //Fetch products
    const fetchRequest = await fetch("http://localhost:3000/api/products", {
        method: "GET"
    })
    //Check if products are fetched
    if (!fetchRequest.ok) {
        //Products are not fetched, display error message
        console.log("Un problème est survenu, merci de réessayer ultérieurement !");
    } else {
        //Products are fetched, stock them in json
        var listProducts = await fetchRequest.json();
        console.log("Les produits ont bien été récupérés !");
        return listProducts;        
    }

}

/** 
 * Create and display products on homepage
 * (from local API)
 */
async function displayProducts() {
    //Fetch data
    let product = await fetchProducts();

    //Create each card
    for (let i in product) {

        const items = document.querySelector("#items");

        //Create contenair a
        let productLink = document.createElement("a");
        productLink.href = (`product.html?id=${product[i]._id}`);
        items.appendChild(productLink);

        //Create contenair article
        const productArticle = document.createElement("article");
        productLink.appendChild(productArticle);

        //Create product image
        const productImage = document.createElement("img");
        productArticle.appendChild(productImage);
        productImage.src = product[i].imageUrl;
        productImage.alt = product[i].altTxt;

        //Create product title
        const productTitle = document.createElement("h3");
        productArticle.appendChild(productTitle);
        productTitle.textContent = product[i].name;

        //Create product description
        const productDescription = document.createElement("p");
        productArticle.appendChild(productDescription);
        productDescription.textContent = product[i].description;

    };

    console.log("Les produits ont bien été créés !")

};