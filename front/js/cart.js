function getLocalSorage() {
  if (localStorage.getItem("panier"))
    return JSON.parse(localStorage.getItem("panier"));
  else return [];
}

let products = [];
loadPage();

function loadPage() {
  let tableauLocalStorage = getLocalSorage();
  const panier = document.querySelector('#cart__items');
  panier.innerHTML = "";
  products = [];
  if (tableauLocalStorage.length >= 0) {
    // parcourir le tableau 
    let totalPrice = 0;
    let totalQte = 0;
    for (let i in tableauLocalStorage) {
      // Remplir le tableau products
      products.push(tableauLocalStorage[i].id);
      fetch("http://localhost:3000/api/products/" + tableauLocalStorage[i].id)
        .then(function (res) {

          if (res.ok) {
            return res.json();
          }
        })
        .then(function (product) {

          let newArticle = `<article class="cart__item" data-id="${tableauLocalStorage[i].id}" data-color="${tableauLocalStorage[i].color}"
          data-price="${product.price}" data-quantity="${tableauLocalStorage[i].quantity}">
     <div class="cart__item__img">
     
       <img src="${product.imageUrl}" alt="${product.altTxt}">
     </div>
     <div class="cart__item__content">
       <div class="cart__item__content__description">
         <h2>${product.name} </h2>
         <p>${tableauLocalStorage[i].color} </p>
         <p>${product.price} €</p>
       </div>
       <div class="cart__item__content__settings">
         <div class="cart__item__content__settings__quantity">
           <p>Qté : </p>
           <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${tableauLocalStorage[i].quantity}">
         </div>
         <div class="cart__item__content__settings__delete">
           <p class="deleteItem">Supprimer</p>
         </div>
       </div>
     </div>
   </article>`;
          panier.innerHTML += newArticle;
          totalPrice += (parseInt(product.price) * parseInt(tableauLocalStorage[i].quantity));
          totalQte += parseInt(tableauLocalStorage[i].quantity);
          document.querySelector('#totalPrice').textContent = totalPrice;
          document.querySelector('#totalQuantity').textContent = totalQte;
          addListenerForDelete(tableauLocalStorage);
          addListenerForQuantities(tableauLocalStorage);
        })
        .catch(function (err) {
          // Une erreur est survenue
          console.log(err);
          alert("Une erreur est survenue veuillez contcater l'administrateur du site!");
        });
    }
  }

}
 //Controler la quantité
 function quantityControl(quantite){
  let quant = parseInt(quantite);
  console.log(quant); 
 
 if (quant < 1 ||  quant > 100) {
  return false;

 }  
 else {
   return true;
 }
}


function addListenerForDelete(tableauLocalStorage) {

  // slectionner tous les boutons delete
  const allDeleteButtons = document.querySelectorAll(".deleteItem");
  allDeleteButtons.forEach(element => {
    // ajouter les actions sur le delete
    element.addEventListener('click', function (event) {
      event.stopPropagation();
      event.preventDefault();
      // referencer le parent du bouton delete pour pouvoir lire les dataset
      const closest = element.closest(".cart__item");
   //   console.log(closest);

      // utiliser les dataset pour supprimer l'element du tableau localStorage 
      let id = closest.dataset.id;
      let color = closest.dataset.color;

      // Supprimer et Mettre à jour le localStorage
      findAndDeleteElement(id, color, tableauLocalStorage);
      // Mise à jour de la page : ( soit actualiser la page (pas conseiller) / soit supprimer le closest)
      loadPage();

    });
  })
}

function findAndDeleteElement(id, color, tableau) {

  for (let j in tableau) {
    if (tableau[j].color == color && tableau[j].id == id) {
      tableau.splice(j, 1);
      localStorage.setItem("panier", JSON.stringify(tableau));
      break;
    }
  }
}


function addListenerForQuantities(tableauLocalStorage) {

  // slectionner tous les boutons delete
  const allQuantities = document.querySelectorAll(".itemQuantity");
  allQuantities.forEach(element => {
    // ajouter les actions sur le delete
    element.addEventListener('change', function (event) {
      event.stopPropagation();
      event.preventDefault();
      // referencer le parent du bouton delete pour pouvoir lire les dataset
      const closest = element.closest(".cart__item");
      console.log(closest);

      // utiliser les dataset pour supprimer l'element du tableau localStorage 
      let id = closest.dataset.id;
      let color = closest.dataset.color;
      let newQty = parseInt(this.value);
      // Supprimer et Mettre à jour le localStorage
      findAndUpdateElement(id, color, newQty, tableauLocalStorage);
      // Mise à jour de la page : ( soit actualiser la page (pas conseiller) / soit supprimer le closest)
      loadPage();

    });
  })
}

function findAndUpdateElement(id, color, newQty, tableau) {

  for (let j in tableau) {
    if (tableau[j].color == color && tableau[j].id == id) {
      // le controle de la qte entre 1 et 100
     let validQte=quantityControl(newQty);
     if (validQte) {
      tableau[j].quantity = newQty;
      localStorage.setItem("panier", JSON.stringify(tableau));
      break;
    }
    else alert("La quantité doit être entre 1 et 100");
    }
  }
}
function validText(input, content, regex) {
  let textRegexp = new RegExp(regex);
  //Vérifier le contenu de champ
  let testText = textRegexp.test(input.value);
  let msg = input.nextElementSibling;

  if (testText) {
    msg.innerHTML = content + " " + "Valide";
    return true;
  }
  else {
    msg.innerHTML = content + " " + "Non Valide";
    return false;
  }

}

let form = document.querySelector('.cart__order__form');
form.firstName.addEventListener('change', function () {
  validText(this, 'Prénom', '^[A-Z][A-Za-z\é\è\ê\-]+$');
});
form.lastName.addEventListener('change', function () {
  validText(this, 'Nom', '^[A-Z][A-Za-z\é\è\ê\-]+$');
});
form.city.addEventListener('change', function () {
  validText(this, 'Ville', '^[A-Z][A-Za-z\é\è\ê\-]+$');
});
form.address.addEventListener('change', function () {
  validText(this, 'Adresse', '[a-zA-Z0-9,.-]+$');
});
form.email.addEventListener('change', function () {
  validText(this, 'Email', '^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]{2,}[.][a-zA-Z]{2,3}$');
});

const btnCommander = document.getElementById("order");
btnCommander.addEventListener('click', function () {

  if (validText(form.email, 'Email', '^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]{2,}[.][a-zA-Z]{2,3}$') &&
    validText(form.address, 'Adresse', '[a-zA-Z0-9,.-]+$') &&
    validText(form.city, 'Ville', '^[A-Z][A-Za-z\é\è\ê\-]+$') &&
    validText(form.lastName, 'Nom', '^[A-Z][A-Za-z\é\è\ê\-]+$') &&
    validText(form.firstName, 'Prénom', '^[A-Z][A-Za-z\é\è\ê\-]+$')) {


    let contact = {

      "firstName": document.getElementById('firstName').value,
      "lastName": document.getElementById('lastName').value,
      "address": document.getElementById('address').value,
      "city": document.getElementById('city').value,
      "email": document.getElementById('email').value

    }

    //  
    fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ contact: contact, products: products })

    })
      .then(function (res) {
        if (res.ok) {
          return res.json();
        }
      })
      .then(function (value) {
        let orderID = value.orderId;
        // vider le localstorage 
        localStorage.removeItem("panier");
        document.location.href = "../html/confirmation.html?id=" + orderID;
      })
      .catch(function (err) {
        // Une erreur est survenue
        console.log(err);
        alert("Une erreur est survenue! Veuillez contacter l'administrateur du site!!");
      });
  }
  else {
    alert("Veuillez verifier le formulaire!!");
  }
});
