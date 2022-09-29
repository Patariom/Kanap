displaySofa();

/** 
 * Fetch right sofa according to the ID
 */
 async function fetchSofa() {

    //Get sofa ID from URL
    let params = (new URL(document.location)).searchParams
    let idSofa = params.get('id');
    console.log("Le canapé sélectionné a l'ID : " + idSofa);


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
        console.log(sofa);
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
    sofaPrice.textContent = sofa.price;

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
