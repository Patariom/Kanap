
//Get cart
let cart = JSON.parse(localStorage.getItem("cart"));

let cartItems = document.querySelector("#cart__items");



//-------------------------------------- DISPLAY TOTAL PRICE AND QTY --------------------------------------

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
            articlePrice.textContent = new Intl.NumberFormat('fr-FR', {style:'currency', currency: 'EUR', maximumFractionDigits: 0}).format(article.price); 

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
            articleQuantityInput.addEventListener("change", (event)=> {
                updateQuantity(event)
            });


            //Create and Fetch the article quantity from Local Storage
            articleQuantityInput.value = parseInt(quantityArticle);

            //Create a div which will be used to display the delete option
            let articleDeleteContainer = document.createElement("div");
            articleInfoSettings.appendChild(articleDeleteContainer);
            articleDeleteContainer.className = "cart__item__content__settings__delete";

            //Create the delete text
            let articleDeleteButton= document.createElement("p");
            articleDeleteContainer.appendChild(articleDeleteButton);
            articleDeleteButton.className = "deleteItem";
            articleDeleteButton.textContent = "Supprimer";

            //Add the Delete Function for each Button
            articleDeleteButton.addEventListener("click", (event)=> {
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
    if(confirm("Souhaitez-vous vraiment supprimer cet article ?") == true) {

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
        if (cart.length ==0 ) {
            localStorage.removeItem("cart");  
        }

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

    let modifiedArticleId = modifiedArticle.getAttribute("data-id");
    let modifiedArticleColor  = modifiedArticle.getAttribute("data-color");

    let article = cart.find(i => (i.id == modifiedArticleId) && (i.color == modifiedArticleColor));


    let articleNewQuantity = parseInt(event.target.value);

    if(article && (articleNewQuantity > 0 && articleNewQuantity <= 100)) {
        article.quantity = articleNewQuantity;
        localStorage.setItem("cart", JSON.stringify(cart));

        getTotalQuantity();
      
        getTotalPrice();

        displayQtyInNavBar();
    }
    else if(articleNewQuantity <=0){
        deleteArticle(event);
    }
    else {
        alert("Merci de renseigner une quantité comprise entre 1 et 100 !");
        event.target.value = article.quantity;

    }
};
    



//-------------------------------------- END OF REMOVE OR UPDATE QUANTITY --------------------------------------



//-------------------------------------- FORM MANAGEMENT ----------------------------------------------------------

//Select the differents inputs of the form
let firstName = document.querySelector("#firstName");
let lastName = document.querySelector("#lastName");
let adress = document.querySelector("#address");
let city = document.querySelector("#city");
let email = document.querySelector("#email")


//Create a set of regex rules
var regexClassic = new RegExp(/^[a-z çàâäéèêëïîôöùûüÿæœ -]{2,90}$/, "i");
var regexAdress = new RegExp(/^[a-z çàâäéèêëïîôöùûüÿæœ '",;\- \d]{2,125}$/, "i");
var regexEmail = new RegExp(/^[\w\-.]+@[\w\-.]+\.[\w]{2,6}$/, "i");


//Create the values of input
let fistNameValue, lastNameValue, adressValue, cityValue, emailValue;


//List to each input to see if they're correct
//First Name
firstName.addEventListener("blur", (e)=> {

    let errorMsgFirstName = document.querySelector("#firstNameErrorMsg");

    if (e.target.value.match(regexClassic)) {
        firstName.style.border = "2px solid green";
        errorMsgFirstName.textContent = "";
        let firstNameValue = e.target.value;
        console.log(firstNameValue);

    } else {
        firstName.style.border = "2px solid red";
        errorMsgFirstName.textContent = "Le prénom renseigné contient des caractères non autorisés ou ne respecte pas la limite de taille (entre 2 et 35 caractères)."
    }
});

//Last Name
lastName.addEventListener("blur", (e)=> {

    let errorMsgLastName = document.querySelector("#lastNameErrorMsg");

    if (e.target.value.match(regexClassic)) {
        lastName.style.border = "2px solid green";
        errorMsgLastName.textContent = "";
        let lastNameValue = e.target.value;
        console.log(lastNameValue);

    } else {
        lastName.style.border = "2px solid red";
        errorMsgLastName.textContent = "Le nom renseigné contient des caractères non autorisés ou ne respecte pas la limite de taille (entre 2 et 35 caractères)."
    }
});

//Adress
adress.addEventListener("blur", (e)=> {

    let errorMsgAdress = document.querySelector("#addressErrorMsg");

    if (e.target.value.match(regexAdress)) {
        adress.style.border = "2px solid green";
        errorMsgAdress.textContent = "";
        let adressValue = e.target.value;
        console.log(adressValue);

    } else {
        adress.style.border = "2px solid red";
        errorMsgAdress.textContent = "L'adresse renseignée contient des caractères non autorisés."
    }
});

//Ville
city.addEventListener("blur", (e)=> {

    let errorMsgCity = document.querySelector("#cityErrorMsg");

    if (e.target.value.match(regexAdress)) {
        city.style.border = "2px solid green";
        errorMsgCity.textContent = "";
        let cityValue = e.target.value;
        console.log(cityValue);

    } else {
        adress.style.border = "2px solid red";
        errorMsgCity.textContent = "La ville renseignée contient des caractères non autorisés."
    }
});


//Email
email.addEventListener("blur", (e)=> {

    let errorMsgEmail = document.querySelector("#emailErrorMsg");

    if (e.target.value.match(regexEmail)) {
        email.style.border = "2px solid green";
        errorMsgEmail.textContent = "";
        let emailValue = e.target.value;
        console.log(emailValue);

    } else {
        email.style.border = "2px solid red";
        errorMsgEmail.textContent = "Le champ renseigné ne correspond pas au format valide d'une adresse email : texte@nomdomaine.txt"
    }
});



//Create a personnalized constructor for the client that contains its personnal info and its order
//Or just an object ?
// function Client(firstName, lastName, adress, city, email, order) {
//     this.firstName = firstName;
//     this.lastName = lastName;
//     this.adress = adress;
//     this.city = city;
//     this.email = email;

//     this.order = order;
// }

//Select Btn
let orderBtn = document.querySelector("#order");

//Add a listener function to the btn
// orderBtn.addEventListener("click", ()=> {
//     let client = new Client(
//         document.querySelector("#firstName").value,
//         document.querySelector("#lastName").value,
//         document.querySelector("#address").value,
//         document.querySelector("#city").value,
//         document.querySelector("#email").value,
//         )
//     console.log(client);
// })

