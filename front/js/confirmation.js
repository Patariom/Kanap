//-------------------------------------- GLOBAL VARIABLES --------------------------------------

//Get the confirmation ID from the URL
let params = (new URL(document.location)).searchParams
let orderIdNumber = params.get("orderid");

//-------------------------------------- END OF GLOBAL VARIABLES --------------------------------------


//-------------------------------------- CART MANAGEMENT --------------------------------------

/** 
 * Remove any key from Local Storage
 */
 function emptyCart() {
    localStorage.clear();
}

//-------------------------------------- END OF CART MANAGEMENT --------------------------------------


//-------------------------------------- DISPLAY MANAGEMENT --------------------------------------

/**
 * Display client orderID and name on the page
 * 
 */
function displayConfirmationMessage() {
    
    //Get client name form Local Storage
    let client = localStorage.getItem("client");

    //Select the confirmation message container
    let confirmationContainer = document.querySelector(".confirmation p");

    //when client arrives first on the page
    if (client) {
        //Display the confirmation message with the name and number of client
        confirmationContainer.innerHTML = `<p>Merci ${client} ! <br> Commande validée ! <br>Votre numéro de commande est : <br> ${orderIdNumber}</p>`;

        //If client refreshes the page, local storage is cleared and there is no name anymore so we adapt the message
    } else {
        confirmationContainer.innerHTML = `<p>Commande validée ! <br>Votre numéro de commande est : <br> ${orderIdNumber}</p>`;
    }
}

/**
 * Create a function to redirect the client if he/she goes to the confirmation page without an order ID
 * 
 */

confirmationPageDisplay()
function confirmationPageDisplay() {

    if (orderIdNumber) {

        displayConfirmationMessage();

        emptyCart()
        
    } else {
        document.location.href = `index.html`
    }

}

//-------------------------------------- END OF DISPLAY MANAGEMENT --------------------------------------




