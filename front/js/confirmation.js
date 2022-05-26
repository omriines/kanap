const queryString = window.location.search; //Récupérer id dans l'URL
// console.log(queryString);
 const urlParams = new URLSearchParams(queryString);
// console.log(urlParams);
 const id = urlParams.get("id");
 document.getElementById("orderId").innerHTML=id;