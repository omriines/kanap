// Au debut chercher l'id (dans l'url)
const queryString = window.location.search;
console.log(queryString);
    const urlParams = new URLSearchParams(queryString);
    console.log(urlParams);
    const id = urlParams.get("id");
    console.log(id);
    

// Appeler le produit par son id
fetch("http://localhost:3000/api/products/"+id)
  .then(function(res) {
    
    if (res.ok) {
      return res.json();
    }
  })
  .then(function(product) {
   
    console.log(product);
    document.querySelector(".item__img").innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`;

  })
  .catch(function(err) {
    // Une erreur est survenue
    console.log(err);
    alert("Une erreur est survenue veuillez contcater l'administrateur du site!");
  });

  // se renseigner sur les listener 
  // coder une fonction qui controle la quantité ( entre 0 et 100 )