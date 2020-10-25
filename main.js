"use strict";
window.addEventListener('load', () => {


    let listenerNodes = {
        rangeInputValues: () => Array.from(document.querySelectorAll(".constructor__range")),
        packageNode: () => document.getElementById("package"),
        formSubmit: () => document.getElementById("constructor-order"),
        basketNode: () => document.getElementById("basket"),
        basketContainer: () => document.getElementById("basket__container"),
        unicID: () => Math.random().toString(36).substr(2, 9),
        detailBasket: () => document.getElementById("top_details"),
        closeBasketNode: () => document.getElementById("close-basket"),
        topSeed: () => document.getElementById("red_round"),
    };

    let form = document.querySelector("#constructor_form");


//       form function controllers
//       __________________________


// change input % value

    let changePercents = event => {
        // if (event.target.type === "range") {
            listenerNodes.rangeInputValues().map(inputNode => {
                let idToChange = `${inputNode.id}__value`;
                document.getElementById(idToChange).innerText = inputNode.value + "%";
            });
        // }
    };
    // change input % value end
    form.addEventListener("change", event => changePercents(event));

    // form's remainder controller

    let formController = (event) => {
        // if (event.target.type === "range" && event.target.id !== "corn") {

            let cornValue = document.getElementById("corn");
            let rangeValSum = listenerNodes.rangeInputValues().slice(0, -1)
                .reduce((sum, val) => sum + 1 * val.value, 0);

            // set remainder in corn
            if (rangeValSum <= 100) {
                cornValue.value = 100 - rangeValSum;
            } else {
                cornValue.value = 0;
            }
            changePercents(event);
        // }
    };

    formController(event);
    form.addEventListener("change", event=>formController(event));


    // toggle basket

    let openBasket = () => {
        listenerNodes.basketNode().style.display = "flex";
        renderBasket();
    };
    let closeBasket = () => {
        listenerNodes.basketNode().style.display = "none";

    };

    listenerNodes.detailBasket()
        .addEventListener("click", () => openBasket());
    listenerNodes.closeBasketNode()
        .addEventListener("click", () => closeBasket());


    /* _______________________________________________________________
                        LocalStorage!
     _______________________________________________________________
    */
    // send form's data to local storage
    listenerNodes.formSubmit()
        .addEventListener("click", (event) => {
            event.preventDefault();

            let dataFromForm = {
                packageValue: listenerNodes.packageNode().value,
                id: listenerNodes.unicID(),
            };
            listenerNodes.rangeInputValues()
                .map(value => dataFromForm[value.id] = value.value);

            let serialObj = JSON.stringify(dataFromForm);
            localStorage.setItem(dataFromForm.id, serialObj);

            renderBasket();

        });


    // render basket

    let renderBasket = () => {
        let basket = listenerNodes.basketContainer();
        basket.innerHTML ="";
        let allFromLockal = () => {
            const archive = [];
            for (let i = 0; i < localStorage.length; i++) {
                archive[i] = JSON.parse(localStorage.getItem(localStorage.key(i)));
            }
            return archive;
        };
        let allLocalValues = allFromLockal();

        // render basket data
        allLocalValues.map(value => {
            if (value) {
                let innerElem = document.createElement('div');
                innerElem.setAttribute("id", value.id);
                innerElem.setAttribute("class", "basket__goods");

                let htmllToappend = `<img src="img/basket/b_semen.png" alt="" class="basket__seed">
                        <div class="goods__wrap">
                            <div class="basket__goods-list">
                                <div class="percent__wrap">
                                    <p class="percents--soy">${value.soy}</p>
                                    <span class="basket__percent">%</span>
                                </div>
                                <div class="percent__wrap">
                                    <p class="percents--sesame">${value.sesame}</p>
                                    <span class="basket__percent">%</span>
                                </div>
                                <div class="percent__wrap">
                                    <p class="percents--wheat">${value.wheat}</p>
                                    <span class="basket__percent">%</span>
                                </div>
                                <div class="percent__wrap">
                                    <p class="percents--corn">${value.corn}</p>
                                    <span class="basket__percent">%</span>
                                </div>
                            </div>
                            <div class="goods__info-wrap">
                                <div class="goods__info-container">
                                    <p class="basket__package-volume">${value.packageValue}</p>
                                    <p class="basket__package-scale">Kg</p>
                                </div>
                                <div class="goods__info-container">
                                    <p class="basket__sum">5</p>
                                    <span class="currency">€</span>
                                </div>
                            </div>

                        </div>
                        <div class="delete__goods"></div>`;


                innerElem.innerHTML = htmllToappend;

                if (htmllToappend !== undefined) {
                    basket.appendChild(innerElem);
                }
            }
        });

        // change top seed value

        listenerNodes.topSeed().innerText = localStorage.length;

    };


    // delete from Basket/localStorage

    listenerNodes.basketContainer().addEventListener("click", event=>deleteFromBasket(event));
    
    let deleteFromBasket = (event)=>{
    let id = event.target.parentNode.id;
       window.localStorage.removeItem(id);
        renderBasket();
    };


    renderBasket();

});


