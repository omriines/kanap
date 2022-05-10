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
    document.querySelector("#title").innerHTML = product.name;
    document.querySelector("#price").innerHTML = product.price;
    document.querySelector("#description").innerHTML = product.description;
    let colors = product.colors;
    for(var i = 0; i < colors.length; i++){
      document.querySelector("#colors").innerHTML += `<option value="${colors[i]}">${colors[i]}</option>`;
    }
   //Controler la quantité
   function  quantityControl(quant){
    console.log(quant); 
    
   if (quant < 1 ||  quant > 100) {
     return false;

   }  
   else {
     return true;
   }
  }
   const qte = document.getElementById("quantity");
    // On récupère l'élément sur lequel on veut détecter le clic
    qte.addEventListener('change', function() { 
      let quantity = qte.value; 
     
     if (!quantityControl(quantity)){
      alert("La quantité doit être entre 1 et 100");
      qte.focus();
     };
                   
    });
 

  })
  .catch(function(err) {
    // Une erreur est survenue
    console.log(err);
    alert("Une erreur est survenue veuillez contcater l'administrateur du site!");
  });

  // se renseigner sur les listener 
  // coder une fonction qui controle la quantité ( entre 0 et 100 )