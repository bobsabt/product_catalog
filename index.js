import data from  './data.json' assert {type:'json'};

const isDataValid = data ? true : false;
let sortOrder = 1;

let lowestPrice = Number.MIN_VALUE;
let highestPrice = Number.MAX_VALUE;

let actualMinPrice;
let actualMaxPrice;

let cart = {};

const range = document.querySelector(".range-selected");
const rangeInput = document.querySelectorAll(".range-input input");
const rangePrice = document.querySelectorAll(".range-price input");

if (isDataValid) {
    lowestPrice = data.reduce((currentMin, item) => { return Math.min(currentMin,item.price)}, Number.MAX_VALUE)
    highestPrice = data.reduce((currentMax, item) => { return Math.max(currentMax, item.price)}, Number.MIN_VALUE)  
}

const addProductToCart = (event) => {
    console.log(event)
    let id = event.currentTarget.id

    cart = localStorage.getItem('cart')

    if (!cart) {
        cart = []
        cart.push({"id": id, "count": 1})
    } else {
        cart = JSON.parse(cart)

        let selectedItem = cart.find(item => item.id === id)

        if(selectedItem) {
            selectedItem.count++;
        }
        else{
            cart.push({"id": id, "count": 1})
        }
    }
    localStorage.setItem('cart', JSON.stringify(cart))
    displayCart()
}

const removeSelectedItem = (event) => {
    let id = event.srcElement.id

    cart = localStorage.getItem('cart')
    cart = JSON.parse(cart)
    const selectedItemsAfterRemove = cart.filter(item => item.id !== id)

    localStorage.setItem('cart', JSON.stringify(selectedItemsAfterRemove))

    displayCart()
}

const displayCart = () => {
    let cart = localStorage.getItem('cart')
    cart = JSON.parse(cart)
    console.log(cart)
    const cashierContainer = document.getElementById('cashierContainer')

    let totalAmount = 0;
    let totalNumber = 0;

    const totalAmountTitle = document.createElement('h2');
    totalAmountTitle.innerHTML = "Total amount: " + totalAmount;
    cashierContainer.appendChild(totalAmountTitle);

    const totalNumberTitle = document.createElement('h2');
    totalNumberTitle.innerHTML = "Total number: " + totalNumber;
    cashierContainer.appendChild(totalNumberTitle);

    if(!cart || cart.length === 0) {
        const emptyMsg = document.createElement('h2');
        emptyMsg.innerHTML = "Your cart is empty";
        cashierContainer.insertAdjacentElement("afterbegin", emptyMsg);
        return
    }

    while(cashierContainer.firstChild) {
        cashierContainer.removeChild(cashierContainer.lastChild);
    }

    for (let index = 0; index < cart.length; index++) {
        const temp = data.find(data => data.id === parseInt(cart[index].id))
        
        const selectedItemBox = document.createElement('div');
        selectedItemBox.classList.add("selectedItem-box");

        const itemName = document.createElement('h4');
        itemName.innerHTML = temp.name;
        selectedItemBox.appendChild(itemName);

        const itemNumber = document.createElement('h5');
        itemNumber.innerHTML = cart[index].count + " X";
        selectedItemBox.appendChild(itemNumber);

        const itemPrice = document.createElement('h5');
        itemPrice.innerHTML = temp.price + ". -Ft";
        selectedItemBox.appendChild(itemPrice);

        const itemRemove = document.createElement('button');
        itemRemove.classList.add("remove-btn"); 
        itemRemove.setAttribute("id", temp.id);
        itemRemove.innerHTML = "X";
        selectedItemBox.addEventListener("click", removeSelectedItem, false)
        selectedItemBox.appendChild(itemRemove);
    
        cashierContainer.appendChild(selectedItemBox);

        totalAmount += temp.price * cart[index].count;
        totalNumber++;
    }

    
}

const displayProducts = (sortOrder, actualMinPrice, actualMaxPrice) => {

    const productsContainer = document.getElementById('productsContainer')
    
    const minInput = document.getElementById('minInput')
    minInput.setAttribute("min", lowestPrice);
    minInput.setAttribute("max", highestPrice);
    minInput.setAttribute("value", lowestPrice);
    
    const maxInput = document.getElementById('maxInput')
    maxInput.setAttribute("min", lowestPrice);
    maxInput.setAttribute("max", highestPrice);
    maxInput.setAttribute("value", highestPrice);

    const minInputShow = document.getElementById('minInputShow')
    minInputShow.setAttribute("min", lowestPrice);
    minInputShow.setAttribute("max", highestPrice);
    minInputShow.setAttribute("value", lowestPrice);

    const maxInputShow = document.getElementById('maxInputShow')
    maxInputShow.setAttribute("min", lowestPrice);
    maxInputShow.setAttribute("max", highestPrice);
    maxInputShow.setAttribute("value", highestPrice);

    while (productsContainer.firstChild) {
        productsContainer.removeChild(productsContainer.lastChild);
      }

    if (!isDataValid) {
        const errorMsg = document.createElement('h1');
        errorMsg.innerHTML = "Oops something went wrong";
        productsContainer.appendChild(errorMsg);
        return
    }
    // sort and filter the products
    const filteredProducts = data.filter(item => item.price >= actualMinPrice && item.price <= actualMaxPrice)
    const productInfo = filteredProducts.sort((a,b)=> (a.price - b.price)*sortOrder)
    

    productInfo.map(item => {
        const productBox = document.createElement('div');
        productBox.classList.add("product-box");

        //image need alt
        const productIMG = document.createElement("img");
        productIMG.classList.add("image");
        productIMG.src = item.imgURL;
        productBox.appendChild(productIMG);

        const productCart = document.createElement("img");
        productCart.classList.add("cart");
        productCart.setAttribute("id", item.id);
        productCart.src = "./Pictures/cart.jpg";
        productCart.addEventListener("click", addProductToCart, false)
        productBox.appendChild(productCart);

        const productName = document.createElement('h1');
        productName.innerHTML = item.name + item.id;
        productBox.appendChild(productName);

        const productDescription = document.createElement('p');
        productDescription.innerHTML = item.description;
        productBox.appendChild(productDescription);

        const productPrice = document.createElement('h3');
        productPrice.innerHTML = item.price + ". -Ft";
        productBox.appendChild(productPrice);

        productsContainer.appendChild(productBox);
    })

    displayCart()
};

window.addEventListener('load', displayProducts(sortOrder, lowestPrice, highestPrice));




const arrowDown = document.getElementById("arrow-down")
const arrowUp = document.getElementById("arrow-up")
arrowUp.addEventListener('click', () => {
    sortOrder = 1;
    displayProducts(sortOrder, lowestPrice, highestPrice)
});
arrowDown.addEventListener('click', () => {
    sortOrder = -1;
    displayProducts(sortOrder, lowestPrice, highestPrice)
});

rangeInput.forEach((input) => {
    input.addEventListener("input", (e) => {
      let minRange = parseInt(rangeInput[0].value);
      let maxRange = parseInt(rangeInput[1].value);
      if (maxRange - minRange < lowestPrice) {     
        if (e.target.className === "min") {
          rangeInput[0].value = maxRange - lowestPrice;        
        } else {
          rangeInput[1].value = minRange + lowestPrice;        
        }
      } else {
        rangePrice[0].value = minRange;
        rangePrice[1].value = maxRange;
        range.style.left = (minRange / rangeInput[0].max) * 100 + "%";
        range.style.right = 100 - (maxRange / rangeInput[1].max) * 100 + "%";
      }
      actualMaxPrice = maxRange
      actualMinPrice = minRange;
      displayProducts(sortOrder, actualMinPrice, actualMaxPrice)
    },
)});

rangePrice.forEach((input) => {
    input.addEventListener("input", (e) => {
      let minPrice = rangePrice[0].value;
      let maxPrice = rangePrice[1].value;
      if (maxPrice - minPrice >= lowestPrice && maxPrice <= rangeInput[1].max) {
        if (e.target.className === "min") {
          rangeInput[0].value = minPrice;
          range.style.left = (minPrice / rangeInput[0].max) * 100 + "%";
        } else {
          rangeInput[1].value = maxPrice;
          range.style.right = 100 - (maxPrice / rangeInput[1].max) * 100 + "%";
        }
      }
    },
)});



