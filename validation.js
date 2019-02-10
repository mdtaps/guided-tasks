$(document).ready(function() {
    /*--- Section: Event Listeners for Form Validation ---*/
    var requiredFields = $('[data-shipping^="ship"]');

    //Validate values exist in required shipping fields
    $("#customerInfoFormButton").on('click', function() {
        var invalidRequiredField = false;      
        //If data-shipping starts with 'ship', iterate through elements
        //and give a red border to those with missing values
        requiredFields.each(function() {
            //For country and state dropdowns, only mark as missing
            //if "<Select One>" is selected
            var requiredField = $(this);

            removeErrors(requiredField);

            switch (requiredField.data("shipping")) {
                case "shipCountry":
                case "shipState":
                    if (requiredField.find("select").prop("selectedOptions")[0].text == "<Select One>") {
                        setErrors(requiredField, 'Please choose valid option');
                        invalidRequiredField = true;
                    }
                    break;
                case "shipPhone":
                    if ( !validatePhoneNumberFormat( requiredField ) ) {
                        invalidRequiredField = true;
                    }
                    break;
                case "shipEmail":
                    if ( !validateEmailFormat( requiredField ) ) {
                        invalidRequiredField = true;
                    }
                    break;
                default:
                    if (!requiredField.val()) {
                        setErrors(requiredField, 'Field required');
                        invalidRequiredField = true;
                    }
            }
        });

        //If no fields are empty/invalid, submit the form
        if(!invalidRequiredField) {
            $("#customerInfoForm")[0].submit();
        }
    });

    //Validation for email field
    var $shipEmailElement = $("[data-shipping='shipEmail']");
    $shipEmailElement.on("change", (function() {
        return validateEmailFormat($shipEmailElement);
    }));

    //Validation for phone field
    var $shipPhoneElement = $("[data-shipping='shipPhone']");
    $shipPhoneElement.on("change", (function() {
        return validatePhoneNumberFormat($shipPhoneElement);
    }));

    //Removing error display
    requiredFields.each(function() {
        var $this = $(this);

        //If element is of type 'input', remove errors on keypress
        if($this.is("input")) {
            $this.on("keypress", function() {    
                //Remove warning if data is entered
                removeErrors($this);
            })
        } else {
            //If other type of field, remove errors
            //on change
            $this.on("change", function() {
                removeErrors($this);
            });
        }
    });

    /*--- Section: Custom Field Validation Functions ---*/

    function validateEmailFormat(emailField) {
        var emailIsValid = true;

        removeErrors(emailField);

        if(!validateEmail(emailField.val())) {
            setErrors(emailField, 'Invalid email format');
            emailIsValid = false;
        }

        return emailIsValid;
    }

    function validatePhoneNumberFormat(phoneField) {
        var phoneNumber = phoneField.val();
        var re = /[\D]/g;
        var phoneNumberIsValid = true;

        //Remove all non-digits
        phoneField.val(phoneNumber.replace(re, ""));

        removeErrors($(phoneField));
        //Show error if not enough digits
        if(phoneField.val().length < 10) {
            setErrors(phoneField, 'Invalid Phone Number');
            phoneNumberIsValid = false;
        }

        return phoneNumberIsValid;
    }



    //Show/hide state text field when "Outside US" is
    //selected/unselected in state dropdown
    var $shipStateSelect = $("#ShipStateSelect");
    var $otherState = $("[data-shipping='otherState");
    var $shipCountry = $("#ShipCountry");

    /*--- Section: Setup Default Display on Load ---*/

    if($shipStateSelect.length > 0) {
        //Set initial show/hide state
        if($shipStateSelect.val() === '') {
            $shipStateSelect.val( $("#ShipStateSelect option")[1].value );
            hideElement($otherState[0]);
        }
    }

    /*--- Section: Event Listeners for Showing/Hiding "Other State/Province" ---*/
    $shipStateSelect.on("change", function() {
        //If 'Outside US' is the selected state, show "Other State/Province" field
        if(this.value === '') {
            showElement($otherState[0]);

        //Else, hide "Other State/Province" field and change Shipping Country to "US"
        } else {
            hideElement($otherState[0]);
            if($shipCountry.val() !== 'US') {
                $shipCountry.val('US');
            }
        }
    });

    $shipCountry.on("change", function() {
        //If "US" is NOT the selected country, change ship state to
        //"Outside US" and show the "Other State/Province" field
        if(this.value !== "US") {
            $shipStateSelect.val('');
            showElement($otherState[0]);

        //Else, if "US" is selected, hide "Other State/Province" field
        } else {
            hideElement($otherState[0]);

            //If Shipping State is "Outside US", change to first state in list
            if($shipStateSelect.val() === "") {
                $shipStateSelect.val($shipStateSelect.find("option")[1].value);
            }
        }
    });

    /*--- Section: Helper Functions ---*/
    function removeErrors(element) {
        element.next(".error").remove();
        element.removeClass("invalid-input");
    }

    function setErrors(element, errorText) {
        var errorText = errorText || "Field is invalid";
        element.addClass("invalid-input");
        element.parent().append("<span class='error'>" + errorText + "</span>");
    }

    function validateEmail(email) {
        var re = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/;
        return re.test(email);
    }

    function showElement(element) {
        element.style.display = "block";
    }

    function hideElement(element) {
        element.style.display = "none";
    }
});