/** 
 * Fetch and display products on homepage
 */
async function fetchProducts() {
    //Fetch products
    const fetchRequest = await fetch("http://localhost:3000/api/products", {
        method: "GET"
    })
    //Check if products are fetched
    if (!fetchRequest.ok) {
        //Products are not fetched, display error message
        alert("Un problème est survenu, merci de réessayer ultérieurement !");
    } else {
        //Products are fetched, proceed
        let listProducts = await fetchRequest.json();
        console.log("Les produits ont bien été récupérés.");

        //Display products
        for (let i in listProducts) {

            const items = document.querySelector("#items");

            //Create contenair a
            const productLink       = document.createElement("a");
            // productLink = listProducts[i]._id;

            items.appendChild(productLink);
            //Create contenair article
            const productArticle    = document.createElement("article");
            productLink.appendChild(productArticle);

            //Create product image
            const productImage      = document.createElement("img");
            productArticle.appendChild(productImage);
            productImage.src = listProducts[i].imageUrl;
            productImage.alt = listProducts[i].altTxt;

            //Create product title
            const productTitle      = document.createElement("h3");
            productArticle.appendChild(productTitle);
            productTitle.textContent = listProducts[i].name;

            //Create product description
            const productDescription= document.createElement("p");
            productArticle.appendChild(productDescription);
            productDescription.textContent = listProducts[i].description;
        };
    };
}

fetchProducts();
