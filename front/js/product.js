//-------------------------------------- DISPLAY SELECTED PRODUCT --------------------------------------


//Get Sofa ID in URL
let params = (new URL(document.location)).searchParams
let idSofa = params.get('id');
console.log("Le canapé sélectionné a l'ID : " + idSofa);



displaySofa();

/** 
 * Fetch right sofa according to the ID
 */
async function fetchSofa() {

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
 * Display informations about selected sofa
 */
async function displaySofa() {

    //Fetch data
    let sofa = await fetchSofa();


    //Put page title
    let sofaPage = document.querySelector("title");
    sofaPage.textContent = sofa.name;

    //Put sofa image
    let sofaPhotoContainer = document.querySelector(".item__img")
    let sofaPhoto = document.createElement("img");
    sofaPhotoContainer.appendChild(sofaPhoto);
    sofaPhoto.src = sofa.imageUrl;
    sofaPhoto.alt = sofa.altTxt;

    //Put title
    let sofaName = document.querySelector("#title");
    sofaName.textContent = sofa.name;

    //Put price
    let sofaPrice = document.querySelector("#price");
    sofaPrice.textContent = parseInt(sofa.price);

    //Put description
    let sofaDescription = document.querySelector("#description");
    sofaDescription.textContent = sofa.description;

    //Put colors choice
    for (let i in sofa.colors) {
        let sofaColorsChoice = document.querySelector("#colors");
        let sofaColors = document.createElement("option");
        sofaColors.value = sofa.colors[i];
        sofaColors.textContent = sofa.colors[i];
        sofaColorsChoice.appendChild(sofaColors);
    }


    console.log("Le canapé sélectionné est bien affiché !")

};



//-------------------------------------- ADD PRODUCTS TO CART --------------------------------------

//Select order button in HTML
let orderBtn = document.querySelector("#addToCart");

/** 
* Add an on-click event to put the order in Local Storage 
*
* The order will be fetched in cart.
* This event uses several functions. SHOULD BE REFACTORED BC NOT DRY²
*
*/
orderBtn.addEventListener("click", () => {
    //Set selected sofa options
    var sofaOption = {
        id: idSofa,
        color: document.querySelector("#colors").value,
        quantity: parseInt(document.querySelector("#quantity").value),
    }

    //Check if order is valid with a chosen color and a quantity between 1 and 100
    if ((sofaOption.color == "") || (sofaOption.quantity <= 0) || (sofaOption.quantity > 100)) {
        //Order is not valid : the client is alerted by a pop-up depending on the problem
        if (sofaOption.color == "") {
            alert("Merci de sélectionner une couleur !")
        }
        else {
            alert("Merci de sélectionner une quantité comprise entre 0 et 100 !")
        }
    }

    //Product is valid, now we're checking if a cart already exists
    else {

        var existingCart = JSON.parse(localStorage.getItem("cart"));

        //If there is already a key "cart" in Local Storage
        if (existingCart) {
            //We are checking if in the existing cart, a product has already the same idea and color option
            let foundItem = existingCart.find(p => (p.id == sofaOption.id) && (p.color == sofaOption.color));
    
            //There's already a product with the same options
            if (foundItem != undefined) {
                //We update the quantity
                console.log("Un produit similaire a été trouvé dans le panier.")
                foundItem.quantity = parseInt(foundItem.quantity += sofaOption.quantity);
                //If the new quantity is more than 100, we can't proceed
                if(foundItem.quantity > 100) {
                    alert("La quantité totale de ce produit ne peut pas être supérieure à 100, merci de corriger !")
                }
                //If it's less than 100, the existing entry in Local Storage is updated 
                else {
                localStorage.setItem("cart", JSON.stringify(existingCart));
                console.log("La quantité de ce canapé a été mise à jour.")
                resetForm();
                }
            }
            //There's an existing cart but no similar product
            else {
                //We add the product in the cart
                existingCart.push(sofaOption);
                localStorage.setItem("cart", JSON.stringify(existingCart));
                console.log("Le produit a bien été ajouté au panier.")
                resetForm();
            }
        }
        //There's no key "cart" in Local Storage, we add the key and then push the order
        else {
        existingCart = [];
        existingCart.push(sofaOption);
        localStorage.setItem("cart", JSON.stringify(existingCart))
        console.log("Le produit a bien été ajouté au panier.")
        resetForm();
    }
}

});


/** 
* Reset the form without reloading the page after click on Order Button
*
*/
function resetForm() {
    document.querySelector("#colors").value = "";
    document.querySelector("#quantity").value = 0;
}

