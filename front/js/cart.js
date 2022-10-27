
//-------------------------------------- GLOBAL VARIABLES --------------------------------------

//Get cart and put it in a variable
let cart = JSON.parse(localStorage.getItem("cart"));

//-------------------------------------- END OF GLOBAL VARIABLES --------------------------------------


//-------------------------------------- FETCH AND POST FUNCTIONS --------------------------------------

/** 
 * Fetch right sofa from API according to the ID
 * It will be used to get all informations about sofa that weren't put in the LS 
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
 * Post Order and get order confirmation ID
 *
 */
 async function postOrder(order) {

    const req = await fetch("http://localhost:3000/api/products/order", {
        method: "POST", 
        headers: {
            "Content-Type" : "application/JSON"
        },
        body: JSON.stringify(order),  
    });

    //If the request returns an error
    if(!req.ok) {
    alert("Un problème est survenu, merci de réessayer !");

    //If the request is working
    } else {
    console.log("La commande a bien été envoyée");

    //Put the request result in a variable
    let response =  await req.json();
    
    //Redirect client to confirmation page
    document.location.href = `confirmation.html?orderid=${response.orderId}`
    }
}

//-------------------------------------- END OF FETCH AND POST FUNCTIONS --------------------------------------


//-------------------------------------- DISPLAY TOTAL PRICE AND QTY --------------------------------------

/////Variables
//Create a span to display quantity near cart icon in nav bar
//Select nav bar
let navBar = document.querySelectorAll("nav a li");
//Select second li item of nav bar
let cartIcon = navBar[1];
let totalInCartIcon = document.createElement("span");
cartIcon.append(totalInCartIcon);


/** 
 * Calculate quantity of all items in cart 
 * with reduce method
 *
 */
function getTotalQuantity() {

    //Select total quantity container
    let totalQuantity = document.querySelector("#totalQuantity");

    //Calculate quantity with reduce function
    const totalArticles = cart.reduce((a, b) => a + b.quantity, 0);

    //Display number in cart recap
    totalQuantity.textContent = totalArticles;

    //Return number to use in displayQtyInNavBar()
    return totalArticles;
}


/** 
 * Put total quantity number next to the cart icon
 * For it to work on all pages, it should be put in a separate JS file and called on each page
 *
 */
function displayQtyInNavBar() {
    totalInCartIcon.textContent = "(" + getTotalQuantity() + ")";
}


/** 
 * Calculate price of all the items in cart
 * with reduce method
 *
 */
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

//-------------------------------------- END OF DISPLAY TOTAL PRICE AND QTY --------------------------------------


//-------------------------------------- DISPLAY PRODUCT IN CART --------------------------------------

////// Variables
//Select the container of the cart items
let cartItems = document.querySelector("#cart__items");


/** 
 * Create a function and a looop that will display cart items from Local Storage
 * and fetch others informations concerning these items from API
 * 
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
            let quantityArticle = i.quantity;

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
            articlePrice.textContent = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(article.price);

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

            //Add the Update Quantity function Function for each Input
            articleQuantityInput.addEventListener("change", (event) => {
                updateQuantity(event)
            });


            //Create and Fetch the article quantity from Local Storage
            articleQuantityInput.value = parseInt(quantityArticle);

            //Create a div which will be used to display the delete option
            let articleDeleteContainer = document.createElement("div");
            articleInfoSettings.appendChild(articleDeleteContainer);
            articleDeleteContainer.className = "cart__item__content__settings__delete";

            //Create the delete text
            let articleDeleteButton = document.createElement("p");
            articleDeleteContainer.appendChild(articleDeleteButton);
            articleDeleteButton.className = "deleteItem";
            articleDeleteButton.textContent = "Supprimer";

            //Add the Delete Function for each Button
            articleDeleteButton.addEventListener("click", (event) => {
                deleteArticle(event);
            });

        })

        getTotalQuantity();

        displayQtyInNavBar();

        getTotalPrice();

    } else {
        //Display a message saying that cart is empty
        let emptyBasket = document.querySelector("h1")
        emptyBasket.textContent = "Votre panier est vide :(";

        //Hide quantity and price items
        let infoPrice = document.querySelector(".cart__price");
        infoPrice.textContent = "";

        //Hide order form
        let orderForm = document.querySelector(".cart__order");
        orderForm.textContent = "";
    }

}

//-------------------------------------- END OF DISPLAY CART --------------------------------------


//-------------------------------------- REMOVE OR UPDATE QUANTITY --------------------------------------

/** 
 * Create a delete action to remove select item in cart
 * It's combined with an addeventlistener in displaySofa()
 *
 */
function deleteArticle(event) {

    //Check if user did not click by mistake
    if (confirm("Souhaitez-vous vraiment supprimer cet article ?") == true) {

        //Select corresponding article
        let deletedArticle = event.target.closest("article");

        //Fetch product ID and product color
        let deletedArticleID = deletedArticle.getAttribute("data-id");
        let deletedArticleColor = deletedArticle.getAttribute("data-color");

        //Remove the article from the DOM
        deletedArticle.remove();

        //Use filter to keep only the items that don't have the same color and id
        cart = cart.filter(i => (i.id !== deletedArticleID) || (i.color !== deletedArticleColor));

        //Save the cart 
        localStorage.setItem("cart", JSON.stringify(cart));

        //If cart is empty, remove the cart key in local storage
        if (cart.length == 0) {
            localStorage.removeItem("cart");
        }

        //Call functions to update totals
        getTotalQuantity();

        displayQtyInNavBar();

        getTotalPrice();

    }
}


/** 
 * Update quantity
 *
 */
function updateQuantity(event) {

    //Select corresponding article
    let modifiedArticle = event.target.closest("article");

    //Get the ID and color of the article
    let modifiedArticleId = modifiedArticle.getAttribute("data-id");
    let modifiedArticleColor = modifiedArticle.getAttribute("data-color");

    //Find in the LS the article corresponding to the ID and color of the article
    let article = cart.find(i => (i.id == modifiedArticleId) && (i.color == modifiedArticleColor));

    //Get the new quantity in the input
    let articleNewQuantity = parseInt(event.target.value);

    //If the new quantity is between 1 and 100, update quantity in LS and call functions to calculate totals
    if (article && (articleNewQuantity > 0 && articleNewQuantity <= 100)) {
        article.quantity = articleNewQuantity;
        localStorage.setItem("cart", JSON.stringify(cart));

        getTotalQuantity();

        getTotalPrice();

        displayQtyInNavBar();
    }
    //If new quantity is 0 and less, delete the article 
    else if (articleNewQuantity <= 0) {
        deleteArticle(event);
    }

    //If new quantity is superior at 100, alert the user and put back the previous quantity
    else {
        alert("Merci de renseigner une quantité comprise entre 1 et 100 !");
        event.target.value = article.quantity;

    }
};

//-------------------------------------- END OF REMOVE OR UPDATE QUANTITY --------------------------------------


//-------------------------------------- FORM MANAGEMENT ----------------------------------------------------------

////// Variables
let orderForm = document.querySelector(".cart__order__form");


//Select the differents inputs of the form
let firstName = document.querySelector("#firstName");
let lastName = document.querySelector("#lastName");
let address = document.querySelector("#address");
let city = document.querySelector("#city");
let email = document.querySelector("#email")


//Create values for input
let firstNameValue, lastNameValue, addressValue, cityValue, emailValue;


//Create a set of regex rules
let regexClassic = new RegExp(/^[a-z çàâäéèêëïîôöùûüÿæœ -]{2,90}$/, "i");
let regexAddress = new RegExp(/^[a-z çàâäéèêëïîôöùûüÿæœ '",;\- \d]{2,125}$/, "i");
let regexEmail = new RegExp(/^[\w-\.]+@[\w-\.]+\.[\w]{2,6}$/, "i");


/** 
 * Check each input to see if they match the regex
 *
 */
function checkFirstName() {
    if (firstName.value.match(regexClassic)) {
        firstName.style.border = "2px solid rgba(42, 18, 206, 0.9)";
        firstNameErrorMsg.textContent = "";
        firstNameValue = firstName.value;

    } else {
        firstName.style.border = "2px solid red";
        firstNameErrorMsg.textContent = "Le prénom ne doit pas contenir de numéros ou de caractères spéciaux, et avoir une taille comprise entre 2 et 90 caractères.";
        firstNameValue = false;
    }
    console.log(firstNameValue);
};

function checkLastName() {
    if (lastName.value.match(regexClassic)) {
        lastName.style.border = "2px solid rgba(42, 18, 206, 0.9)";
        lastNameErrorMsg.textContent = "";
        lastNameValue = lastName.value;

    } else {
        lastName.style.border = "2px solid red";
        lastNameErrorMsg.textContent = "Le nom ne doit pas contenir de numéros ou de caractères spéciaux, et avoir une taille comprise entre 2 et 90 caractères.";
        lastName = false;
    }
    console.log(lastNameValue);
};

function checkAddress() {
    if (address.value.match(regexAddress)) {
        address.style.border = "2px solid rgba(42, 18, 206, 0.9)";
        addressErrorMsg.textContent = "";
        addressValue = address.value;

    } else {
        address.style.border = "2px solid red";
        addressErrorMsg.textContent = "L'adresse ne doit pas contenir de caractères spéciaux et avoir une taille comprise entre 2 et 125 caractères.";
        addressValue = false;
    }
    console.log(addressValue);
};

function checkCity() {
    if (city.value.match(regexClassic)) {
        city.style.border = "2px solid rgba(42, 18, 206, 0.9)";
        cityErrorMsg.textContent = "";
        cityValue = city.value;

    } else {
        city.style.border = "2px solid red";
        cityErrorMsg.textContent = "La ville ne doit pas contenir de numéros et de caractères spéciaux, et avoir une taille comprise entre 2 et 90 caractères.";
        cityValue = false;
    }
    console.log(cityValue);
};

function checkEmail() {
    if (email.value.match(regexEmail)) {
        email.style.border = "2px solid rgba(42, 18, 206, 0.9)";
        emailErrorMsg.textContent = "";
        emailValue = email.value;

    } else {
        email.style.border = "2px solid red";
        emailErrorMsg.textContent = "Le champ renseigné ne correspond pas au format valide d'une adresse email : texte@nomdomaine.txt !";
        emailValue = false;
    }
    console.log(emailValue);
};


/** 
 * Create a personnalized constructor for the client that contains its personnal info
 *
 */
function Client() {
    this.firstName = firstNameValue;
    this.lastName = lastNameValue;
    this.address = addressValue;
    this.city = cityValue;
    this.email = emailValue;
}


/** 
 * Get product ID in an array to send 
 *
 */
function getOrderedProductId() {

    let productsIdArray = [];

    //Create a loop to get each product id of the products in cart and push them in an array
    for (let product of cart) {
        let productId = product.id;
        productsIdArray.push(productId);
    }
    
    return productsIdArray;
}


//Add an event on form to submit the order
orderForm.addEventListener("submit", (event) => {

    event.preventDefault();

    //Run all the checks on input
    checkFirstName();
    checkLastName();
    checkAddress();
    checkCity();
    checkEmail();

    //If any input has a false value, then it will be circled in red thanks to the checkfunction and an alert message will be displayed
    if ((emailValue == false) || (cityValue == false) || (lastNameValue == false) || (firstNameValue == false) || (addressValue == false)) {
        alert("Merci de vérifier et corriger votre formulaire de commande !")

    }

    //If all inputs are valid, the order will continue to be processed
    else {
        //Create an objet name contact using the client constructor
        let contact = new Client;

        //Get the array of products ID
        let products = getOrderedProductId();

        //Create a new object conataining the contact and the products
        let data = {
            contact,
            products,
        };

        //Post this data object to API and redirect client to confirmation page
        console.log(data);
        postOrder(data);

        //Clear the local Storage
        localStorage.removeItem("cart");

    }

});


