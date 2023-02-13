import data from  './data.json' assert {type:'json'};

const productInfo = data;
// if no data error handle!!

const loadEventProducts = () => {
    const productsContainer = document.getElementById('#productsContainer')

    productInfo.map(item => {
        const productBox = document.createElement('div');

        const productIMG = document.createElement("img");
        productIMG.src = item.imgURL;
        productBox.appendChild(productIMG);

        const productName = document.createElement('h1');
        productName.innerHTML = item.name;
        productBox.appendChild(productName);


        const productPrice = document.createElement('h4');
        productPrice.innerHTML = item.price;
        productBox.appendChild(productPrice);

        const productDescription = document.createElement('p');
        productDescription.innerHTML = item.description;
        productBox.appendChild(productDescription);

        productsContainer.appendChild(productBox);
    })
};

window.addEventListener('load', loadEventProducts);
