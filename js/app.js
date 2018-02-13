'use strict';

$(document).ready(function(){



    // START PROGRAM IS AT BOTTOM OF FILE


    // Variables
    var currentNumber = '';
    var numberCount = 0;
    var selected_city = null;
    var selected_resto = null;

    var confirmationModalHtml = `<div class="daModal">
    <h3>Thanks!</h3>
    <p>You'll be receiving the text shortly</p>
    </div>`;


    // RUN ON INIT <---------------------------------------
    $('.numberBinding').text(currentNumber);


    // click listeners
    $('.1').on('touchstart', function() { number(1) });
    $('.2').on('touchstart', function() { number(2) });
    $('.3').on('touchstart', function() { number(3) });
    $('.4').on('touchstart', function() { number(4) });
    $('.5').on('touchstart', function() { number(5) });
    $('.6').on('touchstart', function() { number(6) });
    $('.7').on('touchstart', function() { number(7) });
    $('.8').on('touchstart', function() { number(8) });
    $('.9').on('touchstart', function() { number(9) });
    $('.0').on('touchstart', function() { number(0) });
    $('.backspace_btn').on('touchstart', function() { backspace() });
    $('.submit_btn').on('touchstart', function() { submitNumberValidation() });

    // Initial setup
    $('.main').hide();













    // Main functions
    var _START = function() {
        selected_resto = getQueryParams();
        if(selected_resto) {
            console.log(selected_resto);
            
            $.get("https://us-central1-foodora-prod.cloudfunctions.net/validateResto?selected_resto=" + selected_resto, function(data, status) {
                let validRestoObj = JSON.parse(JSON.stringify(data));
                console.log(validRestoObj);

                selected_city = validRestoObj.resto_city;
                $('.main').show();
                $('.loadingMsg').hide();
            }).fail(function() {
                alert("Incorrect restaurant name in URL, get correct URL from admin panel for this app.");
            });
        }
    }


    var getQueryParams = function() {
        let selected_resto_receieved = getParameterByName('resto');
        let lang_receieved = getParameterByName('lang');
        if(selected_resto_receieved && lang_receieved) {
            if(lang_receieved == 'fr') {
                changeCopyToFrench();
            }
            return selected_resto_receieved;
        } else {
            alert("This isn't a valid resto link.");
            window.location.replace('http://www.foodora.ca/');
            return false;
        }
    }

    var checkLocalStorage = function() {
        var raw_ls = localStorage.getItem('foodora_tabApp_resto');
        console.log(raw_ls)

        if(raw_ls == null) {
            console.log("No LS variable");
            window.location.replace('http://www.everestdigital.ca/foodora_resto/');
        } else {
            var ls = JSON.parse(raw_ls);
            console.log(ls);
            console.log(ls['language']);
            if(ls['language'] == 'french') {
                changeCopyToFrench();
            }
        }
    }

    var number = function(num) {
        if(numberCount < 10) {
            if(numberCount == 3) {
                currentNumber += '-';
            } else if (numberCount == 6) {
                currentNumber += '-';
            }
            
            currentNumber += num.toString();

            numberCount++;
            // console.log(currentNumber);
            $('.numberBinding').text(currentNumber);
        }
    }

    var backspace = function() {
        if(numberCount > 0) {
            if(numberCount == 4 || numberCount == 7) {
                currentNumber = currentNumber.split('').slice(0, currentNumber.length - 2).join('');
            } else {
                currentNumber = currentNumber.split('').slice(0, currentNumber.length - 1).join('');
            }

            numberCount--;
            $('.numberBinding').text(currentNumber);
        }
    }

    var submitNumberValidation = function() {
        if(numberCount == 10) {
            submitNumber();
        } else {
            alert("The number must have at least 10 digits.");
        }
    }

    var submitNumber = function() {
        var cleanNumber = currentNumber.split('-').join('');
        if(selected_resto != null) {
            var phoneObj = {
                number: cleanNumber,
                time_created: Date.now(),
                restaurant_internal_name: selected_resto,
                city: selected_city 
            }
            
            console.log(phoneObj);
    
            $.post("https://us-central1-foodora-prod.cloudfunctions.net/phoneNumber_capture", phoneObj, function(data, status) {
                console.log("Data: " + data + "\nStatus: " + status);
                currentNumber = '';
                numberCount = 0;
    
                $('.numberBinding').text(currentNumber);
    
                // show the modal, start the modal closer
                $('.confirmationModal').html(confirmationModalHtml);
                hideModalTimer();
            });
        } else {
            alert("No restaurant selected!")
        }
        
    }

    var hideModalTimer = function() {
        setTimeout(function(){
            $('.confirmationModal').html('');
        }, 3000);
    }

    var changeCopyToFrench = function() {
        $(".left_panel h2").text("Finie l'attente.");
        $(".left_panel .line1").html("Commandez à l'avance et recevez <b>5$ de rabais.<sup>*</sup></b>");
        $(".left_panel .line2").html("Pouvons-nous avoir votre <b>numéro?</b>");
        $(".left_panel .line3").html("<sup>*</sup>Pour les nouveaux clients seulement. Crédit ajouté à votre compte lors de l'inscription, lorsque vous utilisez le lien envoyé sur votre cellulaire.");
        $(".submit_btn span").html("<b>M'envoyer</b> un texto");
        $(".submit_btn").css({"width": "55%"});
    }

    var getParameterByName = function(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }





    // START PROGRAM <--------------------------------
    _START();

});