//== Class Definition
var SnippetLogin = function() {

    var login = $('#m_login');

    var showErrorMsg = function(form, type, msg) {
        var alert = $('<div class="m-alert m-alert--outline alert alert-' + type + ' alert-dismissible" role="alert">\
			<button type="button" class="close" data-dismiss="alert" aria-label="Close"></button>\
			<span></span>\
		</div>');

        form.find('.alert').remove();
        alert.prependTo(form);
        alert.animateClass('fadeIn animated');
        alert.find('span').html(msg);
    }

    //== Private Functions

    var displaySignUpForm = function() {
        login.removeClass('m-login--forget-password');
        login.removeClass('m-login--signin');
        login.removeClass('m-login--confirm-auth');

        login.addClass('m-login--signup');
        login.find('.m-login__signup').animateClass('flipInX animated');
    }

    var displaySignInForm = function() {
        login.removeClass('m-login--forget-password');
        login.removeClass('m-login--signup');
        login.removeClass('m-login--confirm-auth');

        login.addClass('m-login--signin');
        login.find('.m-login__signin').animateClass('flipInX animated');
    }

    var displayForgetPasswordForm = function() {
        login.removeClass('m-login--signin');
        login.removeClass('m-login--signup');
        login.removeClass('m-login--confirm-auth');

        login.addClass('m-login--forget-password');
        login.find('.m-login__forget-password').animateClass('flipInX animated');
    }

    var displaySubmitCodeForm = function () {
        login.removeClass('m-login--signin');
        login.removeClass('m-login--signup');
        login.removeClass('m-login--forget-password');

        login.addClass('m-login--confirm-auth');
        login.find('.m-login__confirm-auth').animateClass('flipInX animated');
    }

    var handleFormSwitch = function() {
        $('#m_login_forget_password').click(function(e) {
            e.preventDefault();
            displayForgetPasswordForm();
        });

        $('#m_login_forget_password_cancel').click(function(e) {
            e.preventDefault();
            displaySignInForm();
        });

        $('#m_login_signup').click(function(e) {
            e.preventDefault();
            displaySignUpForm();
        });

        $('#m_login_confirm-auth').click(function (e) {
            e.preventDefault();
            displaySubmitCodeForm();
        });

        $('#m_login_signup_cancel').click(function(e) {
            e.preventDefault();
            displaySignInForm();
        });

        
    }

    var handleSignInFormSubmit = function() {
        $('#m_login_signin_submit').click(function(e) {
            e.preventDefault();
            var btn = $(this);
            var form = $(this).closest('form');

            form.validate({
                rules: {
                    email: {
                        required: true,
                        email: true,
                    },
                    password: {
                        required: true
                    }
                },
                messages: {
                    email: "Пожалуйста, укажите правильный Email",
                    password: {
                        required: "Пожалуйста, укажите пароль",
                        minlength: "Your password must be at least 8 characters long",
                    },
                    password_confirm: {
                        required: "Please provide a password",
                        minlength: "Your password must be at least 8 characters long",
                        equalTo: "Пароли не совпадают"
                    }
                }
            });

            if (!form.valid()) {
                return;
            }

            btn.addClass('m-loader m-loader--right m-loader--light').attr('disabled', true);

            var loginData = {
                Email: document.getElementById("loginEmail").value,
                Password: document.getElementById("loginPassword").value,
                __RequestVerificationToken: document.getElementsByName("__RequestVerificationToken")[0].value,
            };

            
            console.log("loginData", loginData);

            $.ajax({
                type: "POST",
                data: loginData,
                url: "/Api/Account/Login/ByEmail",
                cache: false,
                async: true,
                success: function (data) {
                    console.log(data);

                    btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);

                    if (data.IsSucceeded && data["ResponseObject"]["Result"] === "SuccessfulLogin") {
                        location.href = "/";
                    }
                    else if (data.IsSucceeded && data["ResponseObject"]["Result"] == "NeedConfirmation")
                    {
                        tokenSubmitter.TokenId = data["ResponseObject"]["TokenId"];
                    }
                    else {
                        showErrorMsg(form, 'danger', data.Message);
                    }
                }
            });

            return;

            
        });
    }

    var handleSignUpFormSubmit = function() {
        $('#m_login_signup_submit').click(function(e) {
            e.preventDefault();

            var btn = $(this);
            var form = $(this).closest('form');

            form.validate({
                rules: {
                    fullname: {
                        minlength: 3,
                        required: true,
                    },
                    email: {
                        required: true,
                        email: true
                    },
                    password: {
                        required: true,
                        minlength: 6,
                    },
                    rpassword: {
                        
                        equalTo: "#registerPassword",
                    },
                    //agree: {
                    //    required: true
                    //}
                },
                messages: {
                    fullname: {
                        minlength: "Ваше имя не может быть короче трех символов",
                        required: "Пожалуйста, укажите ваше имя",
                    },
                    email: "Пожалуйста, укажите правильный Email",

                    password: {
                        required: "Пожалуйста, укажите пароль",
                        minlength: "Ваш пароль не может быть короче 6 символов",
                    },
                  
                    rpassword: {
                        required: "Your password must be at least 8 characters long",
                        equalTo: "Пароли не совпадают"
                    }
                }
            });

            if (!form.valid()) {
                return;
            }

            btn.addClass('m-loader m-loader--right m-loader--light').attr('disabled', true);

            var registerData = {

                Email: document.getElementById("registerEmail").value,
                Name: document.getElementById("registerName").value,
                Password: document.getElementById("registerPassword").value,
                ConfirmPassword: document.getElementById("registerConfirmPassword").value,
                PhoneNumber: document.getElementById("registerPhoneNumber").value
            };

            console.log("Registration", registerData);

            $.ajax({
                type: "POST",
                data: registerData,
                url: "/Api/Account/Register",

                cache: false,
                success: function (data) {
                    console.log(data);

                    var form = $(".m-login__signup");

                    btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                    //form.clearForm();
                    //form.validate().resetForm();

                    if (data.IsSucceeded) {
                        // display signup form
                        displaySignInForm();
                        var signInForm = login.find('.m-login__signin form');
                        signInForm.clearForm();
                        signInForm.validate().resetForm();

                        showErrorMsg(form, 'success', data.Message);

                        location.href = "/";
                    }
                    else {
                        showErrorMsg(form, 'danger', data.Message);
                    }

                    

                    
                    
                }
            });

            return;
            
        });
    }

    var handleForgetPasswordFormSubmit = function() {
        $('#m_login_forget_password_submit').click(function(e) {
            e.preventDefault();

            var btn = $(this);
            var form = $(this).closest('form');

            form.validate({
                rules: {
                    email: {
                        required: true,
                        email: true
                    }
                },

                messages: {
                    email: {
                        required: "Пожалуйста, укажите ваш Email",
                        email: "Пожалуйста, укажите правильный Email",
                    }
                }
            });

            if (!form.valid()) {
                return;
            }

            btn.addClass('m-loader m-loader--right m-loader--light').attr('disabled', true);

            var data = {
                Email: document.getElementById("m_email").value,
            };

            form.ajaxSubmit({
                url: '/Api/Account/ForgotPassword/ByEmail',
                type: "POST",
                data: data,
                success: function(response, status, xhr, $form) { 


                    btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false); // remove 
                    form.clearForm(); // clear form
                    form.validate().resetForm(); // reset validation states

                    // display signup form
                    displaySignInForm();
                    var signInForm = login.find('.m-login__signin form');
                    signInForm.clearForm();
                    signInForm.validate().resetForm();


                    console.log("/Api/Account/ForgotPassword", response);

                    if (!response.IsSucceeded) {
                        showErrorMsg(signInForm, 'danger', response.Message);
                    }
                    else {
                        showErrorMsg(signInForm, 'success', response.Message);
                    }
                		
                }
            });
        });
    }

    var handleAuthenticationSubmit = function () {
        $("#m_login_confirm_auth_submit").click(function (e) {
            e.preventDefault();

            var form = $(this).closest('form');

            var data = {
                Token: tokenSubmitter.TokenId,
                ValidationCode: document.getElementById("m_code").value
            };

            $.ajax({
                url: '/Api/UserToken/Validate',
                type: "POST",
                data: data,
                success: function (response, status, xhr, $form) {

                    
                    console.log("Api/UserToken/Validate", response);
                    
                    if (response.IsSucceeded) {

                        var data = { Id: tokenSubmitter.TokenId };

                        $.ajax({
                            url: '/Api/UserToken/Login',
                            type: "POST",
                            data: data,
                            success: function (response, status, xhr, $form) {

                                console.log("/Api/UserToken/Login", response);

                                if (response.IsSucceeded) {
                                    location.reload();
                                }
                                else {
                                    alert(response["Message"]);
                                }

                            }
                        });
                    }
                    else {

                        showErrorMsg(form, 'danger', response.Message);
                    }

                }
            });
        });
    }

    //== Public Functions
    return {
        // public functions
        init: function() {
            handleFormSwitch();
            handleSignInFormSubmit();
            handleSignUpFormSubmit();
            handleForgetPasswordFormSubmit();
            handleAuthenticationSubmit()
        }
    };
}();

//== Class Initialization
jQuery(document).ready(function() {
    SnippetLogin.init();
});


class TokenSubmitter {
    constructor() {
        this.TokenId = "";
    }
}

var tokenSubmitter = new TokenSubmitter();