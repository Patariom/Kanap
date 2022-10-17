
//Get cart
let cart = JSON.parse(localStorage.getItem("cart"));





//-------------------------------------- DISPLAY PRODUCT IN CART --------------------------------------

/** 
 * Fetch right sofa according to the ID
 */
async function fetchSofa(idSofa) {

    //Fetch Sofa according to ID
    const fetchSofa = await fetch(`http://localhost:3000/api/products/${idSofa}`, {
        method: "GET",
    })

    //Check if sofa is fetched
    if (!fetchSofa.ok) {

        //Sofa is not fetched, display error message
        console.log("Un problème est survenu");

    } else {
        //Sofa is fetched, stock it in json
        var sofa = await fetchSofa.json();
        return sofa;
    }

}

/** 
 * Create a function and a looop that will display cart items from Local Storage
 * and fetch others informations concerning these items from API
 * The function will also display a message and hide order form if cart is empty
 *
 */

displayCart();

function displayCart() {

    //Select cart container
    let cartItems = document.querySelector("#cart__items");


    if (cart) {
        cart.forEach(async i => {
            //Select and Fetch Sofa according to ID
            let idArticle = i.id;
            let colorArticle = i.color;
            let article = await fetchSofa(idArticle);

            //Create an article in HTML to display the item
            let cartArticle = document.createElement("article");
            cartArticle.className = "cart__item";
            cartArticle.dataset.id = idArticle;
            cartArticle.dataset.color = colorArticle;
            cartItems.appendChild(cartArticle);

            //Create a div which will be used to display the visual content
            let articleIMGContainer = document.createElement("div");
            cartArticle.appendChild(articleIMGContainer);
            articleIMGContainer.className = "cart__item__img";

            //Create and fetch the image of the article
            let articleIMGPhoto = document.createElement("img");
            articleIMGContainer.appendChild(articleIMGPhoto);
            articleIMGPhoto.src = article.imageUrl;
            articleIMGPhoto.alt = article.altTxt;

            //Create a div which will be used to display the text content (description and settings)
            let articleInfoContainer = document.createElement("div");
            cartArticle.append(articleInfoContainer);
            articleInfoContainer.className = "cart__item__content";

            //Create a div which will be used to display the description
            let articleInfoDescription = document.createElement("div");
            articleInfoContainer.appendChild(articleInfoDescription);
            articleInfoDescription.className = "cart__item__content__description";

            //Create and Fetch the article name from API
            let articleName = document.createElement("h2");
            articleInfoDescription.appendChild(articleName);
            articleName.textContent = article.name;

            //Create and Fetch the article color from LS
            let articleColor = document.createElement("p");
            articleInfoDescription.appendChild(articleColor);
            articleColor.textContent = i.color;

            //Create and Fetch the article price from API
            let articlePrice = document.createElement("p");
            articleInfoDescription.appendChild(articlePrice);
            articlePrice.textContent = article.price + " €";

            //Create a div which will be used to display the settings
            let articleInfoSettings = document.createElement("div");
            articleInfoContainer.appendChild(articleInfoSettings);
            articleInfoSettings.className = "cart__item__content__settings";

            //Create a div which will be used to display the quantity setings and number
            let articleQuantity = document.createElement("div");
            articleInfoSettings.appendChild(articleQuantity);
            articleQuantity.className = "cart__item__content__settings__quantity";

            //Create the text "Qté"
            let articleQuantityTxt = document.createElement("p");
            articleQuantity.appendChild(articleQuantityTxt);
            articleQuantityTxt.textContent = "Qté :";

            //Create the input to display and change quantity
            let articleQuantityInput = document.createElement("input");
            articleQuantity.appendChild(articleQuantityInput);
            articleQuantityInput.className = "itemQuantity";
            articleQuantityInput.type = "number";
            articleQuantityInput.name = "itemQuantity";
            articleQuantityInput.min = "1";
            articleQuantityInput.max = "100";

            //Create and Fetch the article quantity from Local Storage
            articleQuantityInput.value = parseInt(i.quantity);

            //Create a div which will be used to display the delete option
            let articleDeleteContainer = document.createElement("div");
            articleInfoSettings.appendChild(articleDeleteContainer);
            articleDeleteContainer.className = "cart__item__content__settings__delete";

            //Create the delete text
            let articleDeleteButton= document.createElement("p");
            articleDeleteContainer.appendChild(articleDeleteButton);
            articleDeleteButton.className = "deleteItem";
            articleDeleteButton.textContent = "Supprimer";

            });

        

    } else {
        //Display a message saying that cart is empty
        let emptyBasket = document.querySelector("h1")
        emptyBasket.textContent = "Votre panier est vide :(";

        //hide quantity and price items
        let infoPrice = document.querySelector(".cart__price");
        infoPrice.textContent = "";

        //hide order form
        let orderForm = document.querySelector(".cart__order");
        orderForm.textContent = "";
    }

}



//-------------------------------------- END OF DISPLAY CART --------------------------------------





//-------------------------------------- DISPLAY TOTAL PRICE AND QTY --------------------------------------

////Display total quantity

getTotalQuantity() 

function getTotalQuantity() {

    //Select total quantity container
    let totalQuantity = document.querySelector("#totalQuantity");

    //Calculate quantity with reduce function
    const totalArticles = cart.reduce((a, b) => a + b.quantity, 0);

    //Display number 
    totalQuantity.textContent = totalArticles;

    //Return number to use in displayQtyInNavBar()
    return totalArticles;
}


//Put total quantity number next to the cart icon
//Should be put on a separate JS file to work on all pages

displayQtyInNavBar()

function displayQtyInNavBar() {

    //Select nav bar
    let navBar = document.querySelectorAll("nav a li");

    //Select second li item of nav bar
    let cartIcon = navBar[1];

    //Create an
    let totalInCartIcon = document.createElement("span");
    cartIcon.append(totalInCartIcon);
    totalInCartIcon.textContent = "(" + getTotalQuantity() + ")";
}




////Display total price

getTotalPrice()

async function getTotalPrice() {

    //Select total price container
    let totalPriceContainer = document.querySelector("#totalPrice");

    //Create an empty array
    let priceArray = [];

    //Create a loop to calculate each item total price
     for (let a of cart) {
        //Set the variables 
        let idArticle = a.id;
        let quantityArticle = parseInt(a.quantity);
    
        //Fetch the price from  API
        let article = await fetchSofa(idArticle);
        let priceArticle = parseInt(article.price);
    
        //Calculate the total price by articles
        totalPriceByArticle = priceArticle * quantityArticle;
    
        //Push this number into an array
        priceArray.push(totalPriceByArticle);
    
    };

    //Reduce the array in a sum
    let totalPriceSum = priceArray.reduce((c, d) => c + d, 0);

    //Display the price with the right formating
    totalPriceContainer.textContent = new Intl.NumberFormat('fr-FR').format(totalPriceSum);
}





