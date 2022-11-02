//-------------------------------------- DISPLAY PRODUCTS --------------------------------------

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
    let listProducts = await fetchProducts();

    //Create each card
    for (let product of listProducts) {

        const items = document.querySelector("#items");

        //Create contenair a
        let productLink = document.createElement("a");
        productLink.href = (`product.html?id=${product._id}`);
        items.appendChild(productLink);

        //Create contenair article
        const productArticle = document.createElement("article");
        productLink.appendChild(productArticle);

        //Create product image
        const productImage = document.createElement("img");
        productArticle.appendChild(productImage);
        productImage.src = product.imageUrl;
        productImage.alt = product.altTxt;

        //Create product title
        const productTitle = document.createElement("h3");
        productArticle.appendChild(productTitle);
        productTitle.textContent = product.name;

        //Create product description
        const productDescription = document.createElement("p");
        productArticle.appendChild(productDescription);
        productDescription.textContent = product.description;

    };

    console.log("Les produits ont bien été créés !")

};

//-------------------------------------- END OF DISPLAY PRODUCTS --------------------------------------

//-------------------------------------- CART MANAGEMENT --------------------------------------
function getCart() {
    let cart = JSON.parse(localStorage.getItem("cart"))
    return cart;
}
//-------------------------------------- END OF CART MANAGEMENT  --------------------------------------

//-------------------------------------- DISPLAY QUANTITY IN TOP CART ICON --------------------------------------

//Create a span to display quantity near cart icon in nav bar
//Select nav bar
let navBar = document.querySelectorAll("nav a li");
//Select second li item of nav bar
let cartIcon = navBar[1];
let totalInCartIcon = document.createElement("span");
cartIcon.append(totalInCartIcon);


/** 
 * Put total quantity number next to the cart icon
 *
 */
displayQtyInNavBar();
 function displayQtyInNavBar() {

    let cart = getCart();

    if(cart) {
    //Calculate quantity with reduce function
    const totalArticles = cart.reduce((a, b) => a + b.quantity, 0);

    //Display the number of articles in icon
    totalInCartIcon.textContent = "(" + totalArticles + ")";
    }
}

//-------------------------------------- END OF DISPLAY QUANTITY IN TOP CART ICON --------------------------------------
