'use strict';

$(document).ready(function(){



    // START PROGRAM IS AT BOTTOM OF FILE


    // Variables
    var currentNumber = '';
    var numberCount = 0;
    var restosObj = null;
    var selected_city = null;
    var selected_resto = null;
    var selected_lang = 'en';

    var confirmationModalHtml = `<div class="daModal">
    <h3>Thanks!</h3>
    <p>You'll be receiving the text shortly</p>
    </div>`;

    var invalidNumberModalHTML = `<div class="daModal">
    <p>The number must have at least 10 digits.</p>
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
        // make call to get cities
            // show select tag
        
        $.get("https://us-central1-foodora-prod.cloudfunctions.net/get_cities", function(data, status) {
            let cities = JSON.parse(JSON.stringify(data));
            // console.log(cities);
            let citiesArr = Object.keys(cities);

            for(var cityName of citiesArr) {
                // console.log(cityName)
                $('#citiesSelector').append($('<option>', {
                    value: cityName,
                    text: cityName
                }));
            }
            
            $('.loadingText').hide();
            $('#citiesSelectorBtn').on('touchstart', function() { selectCity() });
            $('.citiesSelectorDiv').show();
        })
    }

    var selectCity = function() {
        // console.log($('#citiesSelector').val())
        $.get("https://us-central1-foodora-prod.cloudfunctions.net/get_restos?city=" + $('#citiesSelector').val(), function(data, status) {
            restosObj = JSON.parse(JSON.stringify(data));
            // console.log(restosObj);
            let restosArr = Object.keys(restosObj);

            for(var restoName of restosArr) {
                // console.log(restoName)
                $('#restosSelector').append($('<option>', {
                    value: restoName,
                    text: restoName
                }));
            }
            
            $('.citiesSelectorDiv').hide();
            $('#restosSelectorBtn').on('touchstart', function() { selectResto(restosObj) });

            $('.restosSelectorDiv').show();
            
            // $('.loadingMsg').hide();
            // $('.main').show();
        })
    }

    var selectResto = function() {
        console.log($('#restosSelector').val())
        
        if($('#langSelector').val() == 'fr') {
            changeCopyToFrench();
            selected_lang = 'fr';
        }

        selected_resto = $('#restosSelector').val();
        selected_city = restosObj[$('#restosSelector').val()]['resto_city'];

        $('.loadingMsg').hide();
        $('.main').show();
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
        if(currentNumber.split('-').join('') == 123)  {
            alert("Cool");
            return false;
        }
        if(numberCount == 10) {
            submitNumber();
        } else {
            
            // show the modal, start the modal closer
            $('.confirmationModal').html(invalidNumberModalHTML);
            hideModalTimer(1500);

            // alert("The number must have at least 10 digits.");
        }
    }

    var submitNumber = function() {
        var cleanNumber = currentNumber.split('-').join('');
        if(selected_resto != null) {
            var phoneObj = {
                number: cleanNumber,
                time_created: Date.now(),
                restaurant_internal_name: selected_resto,
                city: selected_city,
                selected_lang: selected_lang
            }
            
            console.log(phoneObj);
    
            // $.post("https://us-central1-foodora-prod.cloudfunctions.net/phoneNumber_capture", phoneObj, function(data, status) {
            //     console.log("Data: " + data + "\nStatus: " + status);
            //     currentNumber = '';
            //     numberCount = 0;
    
            //     $('.numberBinding').text(currentNumber);
    
            //     // show the modal, start the modal closer
            //     $('.confirmationModal').html(confirmationModalHtml);
            //     hideModalTimer(3000);
            // });
        } else {
            alert("No restaurant selected!")
        }
        
    }

    var hideModalTimer = function(msecs) {
        setTimeout(function(){
            $('.confirmationModal').html('');
        }, msecs);
    }

    var changeCopyToFrench = function() {
        $(".left_panel h2").text("Finie l'attente.");
        $(".left_panel .line1").html("Commandez à l'avance et recevez <b>10$ de rabais.<sup>*</sup></b>");
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