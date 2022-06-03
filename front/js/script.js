//fetch nous permet d'envoyer une requête HTTP de type GET au service web 
fetch("http://localhost:3000/api/products")
  .then(function (res) {

    if (res.ok) {
      return res.json();
    }
  })
  .then(function (products) {
    const items = document.querySelector('#items');
    for (let product of products) {
      let newA = document.createElement('a');
      newA.setAttribute("href", "./product.html?id=" + product._id);
      let newArticle = document.createElement('article');
      newA.appendChild(newArticle);
      let newImg = document.createElement('img');
      newImg.setAttribute("src", product.imageUrl);
      newImg.setAttribute("alt", product.altTxt);
      newArticle.appendChild(newImg);
      let newH3 = document.createElement('h3');
      newH3.classList.add("productName");
      newH3.innerHTML = product.name;
      newArticle.appendChild(newH3);
      let newP = document.createElement("p");
      newP.classList.add("productDescription");
      newP.innerHTML = product.description;
      newArticle.appendChild(newP);
      items.append(newA);
      console.log(newA);
    }
  })
  .catch(function (err) {
    // Une erreur est survenue
    console.log(err);
    alert("Une erreur est survenue veuillez contcater l'administrateur du site!");
  });