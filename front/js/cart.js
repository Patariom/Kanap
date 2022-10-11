//-------------------------------------- DISPLAY PRODUCT IN CART --------------------------------------
displayCart()


//Get cart
let cart = JSON.parse(localStorage.getItem("cart"));


//Select cart container
let cartItems = document.querySelector("#cart__items");



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
        console.log("Un article a été récupéré.")
        return sofa;
    }

}




/** 
 * Create a looop that will display cart items from Local Storage
 * and fetch others informations concerning these items from API
 *
 */

function displayCart() {
    cart.forEach(async i => {


        //Select and Fetch Sofa according to ID
        let idArticle = i.id;
        let article = await fetchSofa(i.id);

        //Create an article in HTML to display the item
        let cartArticle = document.createElement("article");
        cartArticle.className = "cart__item";
        cartArticle.dataset.id = idArticle;
        cartArticle.dataset.color = i.color;
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
        let articleDeleteOption = document.createElement("p");
        articleDeleteContainer.appendChild(articleDeleteOption);
        articleDeleteOption.className = "deleteItem";
        articleDeleteOption.textContent = "Supprimer";

 

    });

}
;


