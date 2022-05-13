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
    const  quantityControl = (quant)=>{
    console.log(quant); 
    
   if (quant < 1 ||  quant > 100) {
     return false;

   }  
   else {
     return true;
   }
  }
  
    // On récupère l'élément sur lequel on veut détecter le clic
  
    
   
    
   const btn = document.getElementById("addToCart");
   btn.addEventListener('click',function(){
     // Vérifier la quantité entre 1 et 100
     const qte = document.getElementById("quantity");
     let quantity = qte.value; 
     
     if (!quantityControl(quantity)){
      alert("La quantité doit être entre 1 et 100");
      qte.focus();
     };
     // Stocker un produit dans localstorage
    let liste, color;
    liste = document.getElementById("colors");
    color = liste.options[liste.selectedIndex].text;
    // si localStorage est rempli
     if (localStorage.length !== 0) {
       let i = 0;
       let exist = false;
      console.log("localStorage.length:" + localStorage.length);

       while (i < localStorage.length) {
        let obj = localStorage.getItem(i);
        let objPrd = JSON.parse(obj);
        
        if (objPrd.id == id && objPrd.color == color){
          let productsJson = {
            id: id,
            quantity: parseInt(objPrd.quantity) + parseInt(qte.value),
            color: color,
          };
          localStorage.setItem(i, JSON.stringify(productsJson));
          exist = true;
          break;
        }
        i++
      }
      // si le produit n'existe pas dans localStorage on l'ajoute
      if (exist == false){
        i = localStorage.length;
        let productsJson = {
          id: id,
          quantity: qte.value,
          color: color,
        };
        localStorage.setItem(i, JSON.stringify(productsJson));
    
      }
      
    
     } 
     // si localStorage est vide on ajoute le premier ligne
     else {
       let productsJson = {
         id: id,
         quantity: qte.value,
         color: color,
       };
       localStorage.setItem(0, JSON.stringify(productsJson));
     }
    });
  })
  .catch(function(err) {
    // Une erreur est survenue
    console.log(err);
    alert("Une erreur est survenue veuillez contcater l'administrateur du site!");
  });

