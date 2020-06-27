(function() {
    var acceptedCreditCards = {
        visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
        mastercard: /^5[1-5][0-9]{14}$|^2(?:2(?:2[1-9]|[3-9][0-9])|[3-6][0-9][0-9]|7(?:[01][0-9]|20))[0-9]{12}$/,
        amex: /^3[47][0-9]{13}$/,
        discover: /^65[4-9][0-9]{13}|64[4-9][0-9]{13}|6011[0-9]{12}|(622(?:12[6-9]|1[3-9][0-9]|[2-8][0-9][0-9]|9[01][0-9]|92[0-5])[0-9]{10})$/
    };
    var cardTypes = ["Visa", "MasterCard", "Discover", "AmericanExpress"]
    var cvvnum = document.getElementById("cvv");
    var ccnum = document.getElementById("ccnum");
    var exp = document.getElementById("expiry");
    var pay = document.getElementById("pay");
    var page = document.getElementById("page");
    var redirect = document.getElementById("Redirecting");
    redirect.style.display = 'none';
    pay.disabled = true;
    var cardInfo = {}
    var disableSubmit = true;


    ccnum.addEventListener('keyup', checkCardType);
    ccnum.addEventListener('blur', checkCardValidity);

    ccnum.addEventListener('blur', checkCardLength);
    cvvnum.addEventListener('blur', checkCvv);

    document.getElementById("expiry").addEventListener('focus', checkCreditCardEntered);
    document.getElementById("cvv").addEventListener('focus', checkCreditCardEntered);


    function checkCreditCardEntered() {
        var creditCardValid = false;
        console.log("CCNUM LEN" + ccnum.value.length);
        if (ccnum.value.length == 0) {
            // Enter Card Number First
            // cardFirstAlert.style.visibility = "visible";
            ccnum.focus();
            // setTimeout(function() { cardFirstAlert.style.visibility = "hidden"; }, 1100);
        } else {
            creditCardValid = checkCardValidity();
        }
        if (!creditCardValid) {
            ccnum.focus();
        }
    }
    pay.onclick = function() {
        page.style.display = 'none';
        redirect.style.display = 'block';
    }
    cvvnum.onkeyup = function() {
        // // Validate numbers
        // var numbers = /[0-9]/g;
        // if(myInput.value.match(numbers)) {  
        //   number.classList.remove("invalid");
        //   number.classList.add("valid");
        // } else {
        //   number.classList.remove("valid");
        //   number.classList.add("invalid");
        // }
        var numbers = /^[0-9]+$/;
        if (cvvnum.value.match(numbers)) {
            //   alert('Your Registration number has accepted....');
            //document.form1.text1.focus();
            cardInfo['cvv'] = cvvnum.value;
            document.getElementById('cvvLabel').className = '';
            cvvnum.className = '';
            disableSubmit = false;
            pay.disabled = disableSubmit;
        } else {
            document.getElementById('cvvLabel').className = 'errorLabel';
            cvvnum.className = 'error';
            //document.form1.text1.focus();
        }
    }

    ccnum.onkeyup = function() {
        var numbers = /^[0-9]+$/;
        if (ccnum.value.match(numbers)) {
            cardInfo['cc'] = ccnum.value;
            document.getElementById('ccnumLabel').className = '';
            ccnum.className = '';
        } else {
            document.getElementById('ccnumLabel').className = 'errorLabel';
            ccnum.className = 'error';
            //document.form1.text1.focus();
        }
    }

    exp.onkeyup = function() {
        var expNum = exp.value.replace("/", '');
        console.log(expNum);
        var numbers = /^[0-9]+$/;
        if (expNum.match(numbers)) {
            document.getElementById('expiryLabel').className = '';
            exp.className = '';
        } else {
            document.getElementById('expiryLabel').className = 'errorLabel';
            exp.className = 'error';
        }
    }

    exp.onblur = function() {
        var validDate = true;
        var mmyyyy = exp.value.split("/");
        var mm = mmyyyy[0];
        var yyyy = mmyyyy[1];
        var monthPattern = /^\d{2}$/;
        var yearPattern = /^\d{4}$/;

        if (mm < 1 || mm > 12)
            validDate = false;

        if (!monthPattern.test(mm) || !yearPattern.test(yyyy))
            validDate = false;

        if (mmyyyy[2])
            validDate = false;

        if (validDate) {
            mm = parseInt(mm, 10);
            yyyy = parseInt(yyyy, 10);
        }
        console.log(yearPattern.test(yyyy));
        console.log(monthPattern.test(mm));
        var currentDate = new Date();
        console.log(currentDate.getDate());
        console.log("Current Year Mod 100" + currentDate.getFullYear() % 100);

        console.log("Current Month " + (currentDate.getMonth() + 1));

        console.log("current year less ? ");
        console.log(currentDate.getFullYear() < yyyy)
        console.log("current year more ? ");
        console.log(currentDate.getFullYear() > yyyy)
        if (validDate && currentDate.getFullYear() < yyyy) {
            document.getElementById('expiryLabel').className = '';
            exp.className = '';
        } else if (validDate && currentDate.getFullYear() == yyyy) {
            if ((currentDate.getMonth() + 1) < mm) {
                document.getElementById('expiryLabel').className = '';
                exp.className = '';
            } else {
                if ((currentDate.getMonth() + 1) == mm) {
                    if (currentDate.getDate() <= new Date(currentDate.getFullYear(), (currentDate.getMonth() + 1), 0).getDate()) {
                        document.getElementById('expiryLabel').className = '';
                        exp.className = '';
                    } else {
                        validDate = false;
                        document.getElementById('expiryLabel').className = 'errorLabel';
                        exp.className = 'error';
                    }
                } else {
                    validDate = false;
                    document.getElementById('expiryLabel').className = 'errorLabel';
                    exp.className = 'error';
                }
            }
        } else {
            validDate = false;
            document.getElementById('expiryLabel').className = 'errorLabel';
            exp.className = 'error';
        }
        console.log("valid exp " + validDate);
    }

    function checkCardValidity() {
        var creditCardValid = false;
        var sumDigits = 0;
        var lastDigit = ccnum.value % 10;
        console.log("last digit" + lastDigit);
        var shouldDouble = true;
        for (var i = ccnum.value.length - 2; i >= 0; i--) {
            var digit = parseInt(ccnum.value.charAt(i));
            console.log("Digit" + digit);

            if (shouldDouble) {
                digit *= 2;
            }
            console.log(digit);
            if (digit > 9) {
                digit -= 9;
            }
            sumDigits += digit;
            console.log(sumDigits);
            shouldDouble = !shouldDouble;
        }
        console.log("Sum " + sumDigits + "*9 =" + sumDigits * 9);
        if (((sumDigits * 9) % 10) == lastDigit) {
            creditCardValid = true;
        } else {
            creditCardValid = false;
        }
        console.log("creditCardValid " + creditCardValid);
        if (!creditCardValid) {
            // alert("Invalid Card Number");
            // validCardAlert.style.visibility = "visible";
            ccnum.focus();
            document.getElementById('ccnumLabel').className = 'errorLabel';
            ccnum.className = 'error';
            // setTimeout(function() { validCardAlert.style.visibility = "hidden"; }, 1100)
        } else {
            ccnum.className = '';
            document.getElementById('ccnumLabel').className = '';
        }
        return creditCardValid;
    }

    function checkCardType() {
        console.log(ccnum.value.charAt(0));
        var cardType = '';
        if (ccnum.value.length > 0) {
            if (ccnum.value.charAt(0) == 4) {
                //remove other background tile
                document.getElementById("card-tile").classList.remove("card-master");
                document.getElementById("card-tile").classList.remove("card-amex");
                document.getElementById("card-tile").classList.remove("card-discover");


                document.getElementById("card-tile").classList.add("card-visa");
                cardType = cardTypes[0];
            } else if (ccnum.value.length >= 2) {
                if (ccnum.value.charAt(0) == 5) {
                    switch (ccnum.value.charAt(1)) {
                        case '1':
                        case '2':
                        case '3':
                        case '4':
                        case '5':
                            document.getElementById("card-tile").classList.remove("card-visa");
                            document.getElementById("card-tile").classList.remove("card-amex");
                            document.getElementById("card-tile").classList.remove("card-discover");

                            document.getElementById("card-tile").classList.add("card-master");
                            cardType = cardTypes[1];
                            break;
                    }
                } else if (ccnum.value.charAt(0) == 3) {
                    switch (ccnum.value.charAt(1)) {
                        case '4':
                        case '7':
                            document.getElementById("card-tile").classList.remove("card-master");
                            document.getElementById("card-tile").classList.remove("card-visa");
                            document.getElementById("card-tile").classList.remove("card-discover");

                            document.getElementById("card-tile").classList.add("card-amex");
                            cardType = cardTypes[3];
                            break;
                    }
                } else if (ccnum.value.length >= 4) {
                    if (ccnum.value.substring(0, 4) == "6011") {
                        document.getElementById("card-tile").classList.remove("card-master");
                        document.getElementById("card-tile").classList.remove("card-amex");
                        document.getElementById("card-tile").classList.remove("card-visa");

                        document.getElementById("card-tile").classList.add("card-discover");
                        cardType = cardTypes[2];
                    } else {
                        document.getElementById("card-tile").classList.remove("card-master");
                        document.getElementById("card-tile").classList.remove("card-amex");
                        document.getElementById("card-tile").classList.remove("card-discover");
                        document.getElementById("card-tile").classList.remove("card-visa");
                    }
                }
            }
        } else {
            document.getElementById("card-tile").classList.remove("card-master");
            document.getElementById("card-tile").classList.remove("card-amex");
            document.getElementById("card-tile").classList.remove("card-discover");
            document.getElementById("card-tile").classList.remove("card-visa");
        }

        console.log(cardType);
        console.log(ccnum.value.substring(0, 3));
        return cardType;
    }

    function checkCardLength() {
        var value = ccnum.value.replace(/\D/g, '');
        var accepted = false;

        // loop through the keys (visa, mastercard, amex, etc.)
        Object.keys(acceptedCreditCards).forEach(function(key) {
            var regex = acceptedCreditCards[key];
            if (regex.test(value)) {
                accepted = true;
            }
        });

        if (!accepted) {
            ccnum.focus();
            document.getElementById('ccnumLabel').className = 'errorLabel';
            ccnum.className = 'error';
        }

    }

    function checkCvv() {
        var creditCard = ccnum.value.replace(/\D/g, '');
        var cvv = cvvnum.value.replace(/\D/g, '');
        // american express cvv is 4 digits
        if ((acceptedCreditCards.amex).test(creditCard)) {
            if ((/^\d{4}$/).test(cvv)) {
                document.getElementById('cvvLabel').className = '';
                cvvnum.className = '';
            } else {
                document.getElementById('cvvLabel').className = 'errorLabel';
                cvvnum.className = 'error';
            }
        } else if ((/^\d{3}$/).test(cvv)) { // other card & cvv is 3 digits
            document.getElementById('cvvLabel').className = '';
            cvvnum.className = '';
        } else {
            document.getElementById('cvvLabel').className = 'errorLabel';
            cvvnum.className = 'error';
        }
    }
    document.getElementById('save').addEventListener('click', saveACard);

    function saveACard() {
        //Prepare this from existing form
        cardInfo['name'] = document.getElementById('cname').value;
        cardInfo['cardNumber'] = document.getElementById('ccnum').value;
        cardInfo['expiration'] = document.getElementById('expiry').value;
        if (cardInfo.hasOwnProperty('cardNumber') && cardInfo.hasOwnProperty('expiration') && cardInfo.hasOwnProperty('name')) {
            sessionStorage.setItem(Date.now(), JSON.stringify(cardInfo))
            createSavedCards();
            cardInfo = {}; //Reinitialize cardInfo for new input
        }
    }

    function deleteACard(event) {
        let cardNumberStr = event.target.id;
        let respArr = cardNumberStr.split('-');
        let cardNumber = respArr[0];
        let keyArray = Object.keys(sessionStorage);
        if (keyArray.length > 0) {
            keyArray.forEach(elm => {
                cardElm = JSON.parse(sessionStorage.getItem(elm));
                if (cardElm['cardNumber'] === cardNumber) {
                    sessionStorage.removeItem(elm);
                    let listContainer = document.getElementById('cardList');
                    while (listContainer.firstChild) {
                        if (listContainer.firstChild.id === cardNumber) {
                            listContainer.removeChild(listContainer.firstChild);
                        }
                    }
                }
            })
        }
    }

    function refillACardDetail(event) {
        let cardNumberStr = event.target.id;
        let respArr = cardNumberStr.split('-');
        let cardNumber = respArr[0];
        let keyArray = Object.keys(sessionStorage);
        if (keyArray.length > 0) {
            keyArray.forEach(elm => {
                cardElm = JSON.parse(sessionStorage.getItem(elm));
                if (cardElm['cardNumber'] === cardNumber) {
                    cardInfo = cardElm; //Use this to refill form 
                    refillForm();
                }
            })
        }
    }

    function refillForm() {
        document.getElementById('cname').value = cardInfo['name'];
        document.getElementById('ccnum').value = cardInfo['cardNumber'];
        document.getElementById('expiry').value = cardInfo['expiration'];
        document.getElementById('cvv').value = '';
    }
    // let id1 = Date.now();
    // sessionStorage.setItem('id1', JSON.stringify({ 'cardNumber': '5378482295007945', 'expiration': '02/2023', 'name': 'Person A' }));
    // let id2 = Date.now();
    // sessionStorage.setItem('id2', JSON.stringify({ 'cardNumber': '4532554639873509', 'expiration': '02/2024', 'name': 'Person B' }));

    function getSavedCards() {
        let keyArray = Object.keys(sessionStorage);
        let savedCards = [];
        if (keyArray.length > 0) {
            keyArray.forEach(elm => {
                savedCards.push(JSON.parse(sessionStorage.getItem(elm)));
            })
        }
        return savedCards;
    }



    function prepareACard(cardData) {
        let cardNode = document.createElement("div");
        cardNode.className = 'card-bounding';
        cardNode.id = cardData['cardNumber'];
        let aside = document.createElement("aside");
        aside.innerHTML += 'Card Number:';
        cardNode.appendChild(aside);
        let cardNumConatiner = document.createElement("div");
        cardNumConatiner.className = 'card-container';
        let cardNum = document.createElement("input");
        cardNum.value = cardData['cardNumber'];
        cardNum.disabled = true;
        cardNumConatiner.appendChild(cardNum);
        cardNode.appendChild(cardNumConatiner);

        let cardDetailsContainer = document.createElement("div");
        cardDetailsContainer.className = 'card-details clearfix';
        let expiryContainer = document.createElement("div");
        expiryContainer.className = 'expiration';
        let asideExpiry = document.createElement("aside");
        asideExpiry.innerHTML += 'Expiration Date';
        expiryContainer.appendChild(asideExpiry);
        let expiration = document.createElement("input");
        expiration.value = cardData['expiration'];
        expiration.disabled = true;
        expiryContainer.appendChild(expiration);
        cardDetailsContainer.appendChild(expiryContainer);

        let cvvContainer = document.createElement("div");
        cvvContainer.className = 'cvv';
        let asideCVV = document.createElement("aside");
        asideCVV.innerHTML += 'CVV';
        cvvContainer.appendChild(asideCVV);
        let cvv = document.createElement("input");
        cvv.value = '_';
        cvv.disabled = true;
        cvvContainer.appendChild(cvv);
        cardDetailsContainer.appendChild(cvvContainer);

        let deleteButton = document.createElement("button");
        deleteButton.innerHTML += 'Delete';
        deleteButton.id = cardData['cardNumber'] + '-d';
        deleteButton.className = 'btn';

        let useButton = document.createElement("button");
        useButton.innerHTML += 'Use';
        useButton.id = cardData['cardNumber'] + '-u';
        useButton.className = 'btn';

        cardNode.appendChild(cardDetailsContainer);
        cardNode.appendChild(deleteButton);
        cardNode.appendChild(useButton);
        return { 'card': cardNode, 'delete': deleteButton, 'use': useButton };
    }

    function createSavedCards() {
        let savedCards = getSavedCards();
        if (savedCards.length > 0) {
            let listContainer = document.getElementById('cardList');
            while (listContainer.firstChild) {
                listContainer.removeChild(listContainer.firstChild);
            }
            savedCards.forEach(card => {
                let cardNode = prepareACard(card);
                listContainer.appendChild(cardNode['card']);
                cardNode['use'].addEventListener('click', refillACardDetail);
                cardNode['delete'].addEventListener('click', deleteACard);
            })
        }
    }
    createSavedCards();
})();