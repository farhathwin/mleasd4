// Function to capitalize each word in a string
function capitalizeWords(str) {
    return str.replace(/\b\w/g, function (char) {
        return char.toUpperCase();
    });
}

// Function to populate currency dropdown
function populateCurrencyDropdown() {
    const currencyApiUrl = "https://v6.exchangerate-api.com/v6/9b2ad421a9b9105cae128161/latest/USD"; // Replace with your API key
    fetch(currencyApiUrl)
        .then(response => response.json())
        .then(data => {
            console.log("API response:", data); // Log API response to verify its structure
            const currencyDropdown = document.getElementById('default_currency');
            const currencies = Object.keys(data.conversion_rates);

            currencies.forEach(currency => {
                const option = document.createElement('option');
                option.value = currency;
                option.textContent = currency;
                currencyDropdown.appendChild(option);
            });

            // Set the default currency value if it exists
            const defaultCurrency = currencyDropdown.getAttribute('data-default');
            console.log("Default Currency:", defaultCurrency); // Log default currency to verify its value
            if (defaultCurrency) {
                currencyDropdown.value = defaultCurrency;
            }
        })
        .catch(error => {
            console.error('Error fetching currency data:', error);
        });
}

// Function to populate country dropdown
function populateCountryDropdown() {
    const countryApiUrl = "https://restcountries.com/v3.1/all"; // API endpoint for country data
    fetch(countryApiUrl)
        .then(response => response.json())
        .then(data => {
            console.log("API response:", data); // Log API response to verify its structure
            const countryDropdown = document.getElementById('country');

            data.forEach(country => {
                const option = document.createElement('option');
                option.value = country.name.common;
                option.textContent = country.name.common;
                countryDropdown.appendChild(option);
            });

            // Set the default country value if it exists
            const defaultCountry = countryDropdown.getAttribute('data-default');
            console.log("Default Country:", defaultCountry); // Log default country to verify its value
            if (defaultCountry) {
                countryDropdown.value = defaultCountry;
            }
        })
        .catch(error => {
            console.error('Error fetching country data:", error');
        });
}

// Attach keyup event to the input fields
$(document).ready(function () {
    // Initialize the International Telephone Input library
    var input = document.querySelector("#businhessPone");  // Replace with the actual ID of your phone input field
    var iti = window.intlTelInput(input, {
        separateDialCode: true,  // Enable separate country and dial code in the dropdown
        utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@17.0.13/build/js/utils.js",  // Add utilsScript for formatting and validation
    });

    // Attach keyup event to capitalize text input fields
    $('input[type="text"]').on('input', function () {
        // Get the input value
        var inputValue = $(this).val();

        // Exclude email and website fields from capitalization
        if ($(this).attr('name') !== 'business_email' && $(this).attr('name') !== 'website') {
            // Capitalize each word in the input value
            var capitalizedValue = capitalizeWords(inputValue);

            // Update the input value with the capitalized text
            $(this).val(capitalizedValue);
        }
    });

    $('#updateProfileBtnuser').on('click', function (e) {
        e.preventDefault();
        
        // Get the selected country data
        var countryData = iti.getSelectedCountryData();
        var countryCode = countryData.dialCode;
    
        // Get the phone number without the dial code and leading zeros
        var phoneWithoutCode = iti.getNumber(intlTelInputUtils.numberFormat.INTERNATIONAL)
            .replace("+" + countryCode, "")
            .replace(/^0+/, "")
            .trim();
    
        // Get the full international phone number including the country code
        var fullPhoneNumber = "+" + countryCode + " " + phoneWithoutCode;
    
        // Set the ITI value to the hidden input before serializing the form data
        $('#businhessPone').val(fullPhoneNumber);
    
        // Log the phone number to the console (for debugging)
        console.log("Full Phone Number:", fullPhoneNumber);
    
        // Serialize the form data
        var formData = new FormData($('#userProfileForm')[0]);  // Ensure the form ID is correct
    
        // Log the form data to the console
        console.log("Form Data (User):", formData);
    
        // Send a POST request to the server
        $.ajax({
            url: '/userprofile',
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function (data, textStatus, jqXHR) {
                // Check the HTTP status code for success (2xx range)
                if (jqXHR.status >= 200 && jqXHR.status < 300) {
                    $('#uploadStatus').html('<span style="color: green;">&#10003; Successfully updated</span>');
                    location.reload();  // Refresh the page
                } else {
                    $('#uploadStatus').html('<span style="color: red;">X Update failed</span>');
                }
            },
            error: function () {
                // Handle the error
                $('#uploadStatus').html('<span style="color: red;">X Update failed</span>');
            }
        });
    });

    // Populate currency and country dropdowns
    populateCurrencyDropdown();
    populateCountryDropdown();
});
