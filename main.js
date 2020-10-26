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
        form: () => document.querySelector("#constructor_form"),
        constructorTotal: () => document.querySelector("#constructor-total-price"),
        sumInerBasket: () => document.querySelector("#basket__total-sum"),
        sumOutBasket: () => document.querySelector("#semen__total"),
    };

    let priceValues = {
        soy: 10,
        sesame: 8,
        wheat: 6,
        corn: 4,
        smallPackage: 1,
        mediumPackage: 50,
        largePackage: 150,
    };


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
    listenerNodes.form().addEventListener("change", event => changePercents(event));


    // package price translate input values to weight
    let packagePrice = () => {
        if (listenerNodes.packageNode().value * 1 === 1) return priceValues.smallPackage;
        if (listenerNodes.packageNode().value * 1 === 2) return priceValues.mediumPackage;
        if (listenerNodes.packageNode().value * 1 === 3) return priceValues.largePackage;

    };

    // change constructor current value

    let constructorCurrentValue = () => {
        //get value of range inputs, change to real price by 1 kilo and pow to  package weight price

        let sum = listenerNodes.rangeInputValues()
            .reduce((accumulator, node) => (
                accumulator + (node.value * priceValues[node.id])
            ), 0);
        return Math.round((100 * sum * packagePrice()) / 100) / 100;
    };


    // form's remainder controller

    let formController = (event) => {
        // if (event.target.type === "range" && event.target.id !== "corn") {

        let cornValue = document.getElementById("corn");
        let rangeWithoutCorn = listenerNodes.rangeInputValues().slice(0, -1);
        let rangeValSum = rangeWithoutCorn.reduce((sum, val) => sum + 1 * val.value, 0);


        // set remainder in corn

        if (rangeValSum <= 100) {
            cornValue.value = 100 - rangeValSum;
        } else {
            cornValue.value = 0;
        }


        // check for sum not more than 100%

        let overFlow = 0;

        if (rangeValSum > 100) {
            overFlow = rangeValSum - 100;

            rangeWithoutCorn.map(node => {
                if (node.id !== event.target.id && event.target.type === "range") {

                    let fluent = event.target.value - overFlow;
                    overFlow = overFlow - event.target.value;
                    event.target.value = fluent;

                    if (overFlow < 0) {
                        overFlow = 0;
                    }
                }
            });

        }



        // rerender % value in html
        changePercents(event);
        // rerender current value of price above constructor
        listenerNodes.constructorTotal()
            .innerHTML = constructorCurrentValue() + " €";


        // }
    };

    formController(event);
    listenerNodes.form().addEventListener("change", event => formController(event));


    // toggle basket

    let openBasket = () => {
        listenerNodes.basketNode().style.display = "flex";
        renderBasket();
    };
    let closeBasket = () => listenerNodes.basketNode().style.display = "none";

    listenerNodes.detailBasket().addEventListener("click", () => openBasket());
    listenerNodes.closeBasketNode().addEventListener("click", () => closeBasket());


    /* _______________________________________________________________
                        LocalStorage!
     _______________________________________________________________
    */
    // send form's data to local storage
    listenerNodes.formSubmit()
        .addEventListener("click", (event) => {
            event.preventDefault();

            let dataFromForm = {
                packageValue: packagePrice(),
                id: listenerNodes.unicID(),
                totalPrice: constructorCurrentValue(),
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
        basket.innerHTML = "";
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
                                    <p class="basket__sum">${value.totalPrice}</p>
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

// change total sum inside and outside basket

        let totalSumofBasket = Math
            .round((allLocalValues
                    .reduce((totalSum, goods) => totalSum + 1 * goods.totalPrice, 0))
                * 100) / 100;

        listenerNodes.sumInerBasket().innerHTML = totalSumofBasket;
        listenerNodes.sumOutBasket().innerHTML = totalSumofBasket;


    };


    // delete from Basket/localStorage

    listenerNodes.basketContainer().addEventListener("click", event => deleteFromBasket(event));

    let deleteFromBasket = (event) => {
        let id = event.target.parentNode.id;
        window.localStorage.removeItem(id);
        renderBasket();
    };


    renderBasket();

});


