    // Au debut chercher l'id (dans l'url)
    const queryString = window.location.search; //Récupérer la liste des variables dans l'URL
   // console.log(queryString);
    const urlParams = new URLSearchParams(queryString);
   // console.log(urlParams);
    const id = urlParams.get("id");
   // console.log(id);
    
   
  
   //Controler la quantité
   function quantityControl(quantite){
    let quant = parseInt(quantite);
    console.log(quant); 
   
   if (quant < 1 ||  quant > 100) {
    alert("La quantité doit être entre 1 et 100!");
     return false;

   }  
   else {
     return true;
   }
  }

     //Controler la quantité
     function colorControl(couleur){
      console.log(couleur); 
      
     if (couleur.trim() == "") {
      alert("Veulliez choisir une couleur!");
       return false;
  
     }  
     else {
       return true;
     }
    }

    function setLocalStorage(tableauProduits){
      localStorage.setItem("panier", JSON.stringify(tableauProduits));
    }

    function getLocalSorage(){
      if(localStorage.getItem("panier"))
      return JSON.parse(localStorage.getItem("panier"));
      else return [];
    }
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
    document.querySelector("#title").textContent = product.name;
    document.querySelector("#price").textContent = product.price;
    document.querySelector("#description").textContent = product.description;

    let colors = product.colors;
    for(var i = 0; i < colors.length; i++){
      document.querySelector("#colors").innerHTML += `<option value="${colors[i]}">${colors[i]}</option>`;
    }

    // activer le controle de la quantité
    const qte= document.getElementById("quantity");
    qte.addEventListener('change',function(){
      // Vérifier la quantité entre 1 et 100
     quantityControl(this.value);
    });

        // activer le controle de la quantité
        const couleur= document.getElementById("colors");
        couleur.addEventListener('change',function(){
          // Vérifier la quantité entre 1 et 100
          colorControl(this.value);
        });

    // On récupère l'élément sur lequel on veut détecter le clic
   const btn = document.getElementById("addToCart");
   btn.addEventListener('click',function(){
     // Vérifier la quantité et la couleur avant de passer à l'ajout au panier
    let validQte =quantityControl(document.getElementById("quantity").value);
    let validColor =colorControl(document.getElementById("colors").value);
    if(validColor && validQte){

      let color = document.getElementById("colors").value;
      let quantite =document.getElementById("quantity").value; 

      // preparation de mon produit à ajouter
      let product = {
        id: id,
        quantity: 0,
        color: color,
      };

      let tableauLocalStorage = getLocalSorage();
      
      // si c'est pas le cas:
      if (tableauLocalStorage.length >= 0) {
        let i = 0;
        let exist = false;
        // parcourir le tableau et verifier:
        while (i < tableauLocalStorage.length) {
          let obj =tableauLocalStorage[i];
          // => si existe : somme de la qte dispo + nouvelle qte 
          if (obj.id == id && obj.color == color){
            exist = true;
            tableauLocalStorage[i].quantity = parseInt(obj.quantity) + parseInt(quantite);
            setLocalStorage(tableauLocalStorage);
            
            break;
          }
          //si l'element n'est pas dispo :
          // continuer la boucler sur le tableau 
          i++;
        }
        // si le tableau est vide : je vais ajouter l'element directement 
       // => si j'ai terminer le parcours et j'ai pas trouvé le produit => j'ajoute l'element dans le tableau
       if (!exist) {
        product.quantity= parseInt(quantite);
        tableauLocalStorage.push(product);
        setLocalStorage(tableauLocalStorage);
      } 
      } 
    }
    document.location.href="../html/cart.html"});
  })
  .catch(function(err) {
    // Une erreur est survenue
    console.log(err);
    alert("Une erreur est survenue veuillez contcater l'administrateur du site!");
  });

