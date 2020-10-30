"use strict";
window.addEventListener('load', () => {


    const listenerNodes = {

        unicID: () => Math.random().toString(36).substr(2, 9),
        rangeInputValues: () => Array.from(document.querySelectorAll(".constructor__range")),
        cornNode: () => document.getElementById("corn"),
        packageNode: () => document.getElementById("package"),
        formSubmit: () => document.getElementById("constructor-order"),
        basketNode: () => document.getElementById("basket"),
        basketContainer: () => document.getElementById("basket__container"),
        detailBasket: () => document.getElementById("top_details"),
        closeBasketNode: () => document.getElementById("close-basket"),
        topSeed: () => document.getElementById("red_round"),
        form: () => document.getElementById("constructor_form"),
        constructorTotal: () => document.getElementById("constructor-total-price"),
        sumInnerBasket: () => document.getElementById("basket__total-sum"),
        sumOutBasket: () => document.getElementById("semen__total"),
        openHeaderMenu: () => document.getElementById("header__open-menu-button"),
        closeHeaderMenu: () => document.getElementById("header__close-menu-button"),
        headerNav: () => document.getElementById("header__nav"),
        openSelectors: () => document.querySelector(".open"),
        selectHTMLinput: () => document.querySelector(".select__text"),

    };


    const priceValues = {
        soy: 10,
        sesame: 8,
        wheat: 6,
        corn: 4,
        smallPackage: 1,
        mediumPackage: 50,
        largePackage: 150,
    };

    // package price translate input values to weight
    let packagePrice = () => {
        const packageNode = listenerNodes.selectHTMLinput().children[0];
        let packageValue;
        if(packageNode.id === "option-selected"){
            packageValue = 1* packageNode.getAttribute("package");
        }

        if (packageValue === 1) return priceValues.smallPackage;
        if (packageValue === 2) return priceValues.mediumPackage;
        if (packageValue === 3) return priceValues.largePackage;

    };


    //package handlers
// ________________________________________________

    // toggle selector node
    const toggleSelect = () => listenerNodes.openSelectors().classList.toggle("toggleSelect");
    listenerNodes.packageNode().addEventListener("click", () => toggleSelect());

    // render selected to input select
    const insertSelect = () => {
        let children = Array.from(listenerNodes.openSelectors().children);
        children.map(child => {
            if (child.id === "option-selected") {
                listenerNodes.selectHTMLinput().innerHTML = child.outerHTML;
            }
        })

    };
    insertSelect();


    const chooseSelect = event => {
        const children = Array.from(listenerNodes.openSelectors().children);
        children.map(child => child.removeAttribute("id"));
        if (event.target.className === "inner-option") {
            event.target.setAttribute("id", "option-selected");
            insertSelect();

        }

    };
    listenerNodes.openSelectors().addEventListener("click", event => chooseSelect(event));


    //open/close header menu
    let openHeader = event => {
        event.stopPropagation();
        listenerNodes.openHeaderMenu().style.display = "none";
        listenerNodes.headerNav().style.display = "flex";
    };
    let closeHeader = event => {
        event.stopPropagation();
        listenerNodes.openHeaderMenu().style.display = "flex";
        listenerNodes.headerNav().style.display = "none";
    };

    let shoveMenuResize = event => {
        if (window.innerWidth <= 1300) {
            closeHeader(event);
        }
        if (window.innerWidth > 1300) {
            openHeader(event);
        }
    };

    listenerNodes.openHeaderMenu().addEventListener("click", event => openHeader(event));
    listenerNodes.closeHeaderMenu().addEventListener("click", event => closeHeader(event));
    window.addEventListener("resize", event => shoveMenuResize(event));

//       form function controllers
//       __________________________


// change input % value

    let changePercents = event => {
        listenerNodes.rangeInputValues().map(inputNode => {
            let idToChange = `${inputNode.id}__value`;
            document.getElementById(idToChange).innerText = inputNode.value + "%";
        });
    };
    listenerNodes.form().addEventListener("change", event => changePercents(event));


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

        const cornValue = listenerNodes.cornNode();
        const rangeWithoutCorn = listenerNodes.rangeInputValues().slice(0, -1);
        let rangeValSum = rangeWithoutCorn
            .reduce((sum, val) => sum + 1 * val.value, 0);


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


// get localStorage data

    let allFromLocal = () => {
        const archive = [];
        for (let i = 0; i < localStorage.length; i++) {
            archive[i] = JSON.parse(localStorage.getItem(localStorage.key(i)));
        }
        return archive.filter(value => value.hasOwnProperty("packageValue"));
    };


    // render basket

    let renderBasket = () => {
        let basket = listenerNodes.basketContainer();
        basket.innerHTML = "";
        let allLocalValues = allFromLocal();

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

        listenerNodes.topSeed().innerText = allFromLocal().length;

// change total sum inside and outside basket

        let totalSumofBasket = Math
            .round((allLocalValues
                    .reduce((totalSum, goods) => totalSum + 1 * goods.totalPrice, 0))
                * 100) / 100;

        listenerNodes.sumInnerBasket().innerHTML = totalSumofBasket;
        listenerNodes.sumOutBasket().innerHTML = totalSumofBasket;


    };


    // delete from Basket/localStorage

    listenerNodes.basketContainer().addEventListener("click", event => deleteFromBasket(event));

    let deleteFromBasket = (event) => {
        event.stopPropagation();
        if (event.target.className !== "delete__goods") return false;
        let id = event.target.parentNode.id;
        window.localStorage.removeItem(id);
        renderBasket();
    };


    renderBasket();






    console.log(packagePrice());

});


