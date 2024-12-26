function validateforgot() {
    if (document.forgot.email.value == '') {
        alert("please enter a valid email address.");
        document.forgot.email.focus();
        return false;
    }
    if (document.forgot.email.value != "")
    {
        if (document.forgot.email.value.indexOf("@") == -1 || document.forgot.email.value.indexOf(".") == -1 || document.forgot.email.value.indexOf(" ") != -1 || document.forgot.email.value.length < 6)
        {
            alert("Please enter a valid email.");
            document.forgot.email.focus();
            return false;
        }
    }
}

$(document).ready(function () {
    /*function randomNumber(min, max) {
     return Math.floor(Math.random() * (max - min + 1) + min);
     };
     
     function generateCaptcha() {
     $('#varcode').html([randomNumber(1, 10), '+', randomNumber(1, 10), '='].join(' '));
     };
     */

    function randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    ;

    function generateCaptcha() {
        r1 = randomNumber(1, 10);
        r2 = randomNumber(1, 10);
        $('#varcode').html([r1, '+', r2, '='].join(' '));
        if ($('#varcode').html() != '') {
            var captcha_val = parseInt(r1) + parseInt(r2);
        } else {
            var captcha_val = '';
        }
        var hid_sum = captcha_val;
        $('#captcha').val(hid_sum);

    }
    ;

    generateCaptcha();

    $('#headerSignup')
            .bootstrapValidator({
                message: 'This value is not valid',
                fields: {
                    fname: {
                        validators: {
                            notEmpty: {
                                message: 'Full name is required and cannot be empty'
                            },
                            regexp: {
                                regexp: /^[a-z\s]+$/i,
                                message: 'The full name can consist of alphabetical characters and spaces only'
                            }
                        }
                    },
                    gender: {
                        validators: {
                            notEmpty: {
                                message: 'Gender is required and cannot be empty'
                            }
                        }
                    },
                    city: {
                        validators: {
                            notEmpty: {
                                message: 'City is required and cannot be empty'
                            }
                        }
                    },
                    email: {
                        validators: {
                            notEmpty: {
                                message: 'Email address is required and cannot be empty'
                            },
                            emailAddress: {
                                message: 'Please enter a valid email address'
                            },
                            remote: {
                                type: 'POST',
                                url: 'remote1.php',
                                message: 'The email is already exists.',
                                delay: 2000
                            }
                        }
                    },
                    phone: {
                        validators: {
                            notEmpty: {
                                message: 'Mobile no. is required and cannot be empty'
                            },
                            integer: {
                                message: 'Please enter a valid mobile number'
                            },
                            stringLength: {
                                min: 10,
                                max: 10,
                                message: 'Please enter 10 digit mobile number'

                            },
                            remote: {
                                type: 'POST',
                                url: 'remote.php',
                                message: 'The phone number is already exists.',
                                delay: 2000
                            }
                        }
                    },
                    visibility_mobile: {
                        validators: {
                            notEmpty: {
                                message: 'Mobile visibility type is required and cannot be empty'
                            }
                        }
                    },
                    password: {
                        validators: {
                            notEmpty: {
                                message: 'Password is required and cannot be empty'
                            }
                        }
                    },
                    cp: {
                        validators: {
                            notEmpty: {
                                message: 'Confirm password is required and cannot be empty'
                            },
                            identical: {
                                field: 'password',
                                message: 'The password and its confirm are not the same'
                            }
                        }
                    },
                    /*code:{
                     validators: {
                     notEmpty :{
                     message: 'Spam Check code is required and cannot be empty'
                     }
                     }				
                     }*/
                    code: {
                        validators: {
                            callback: {
                                message: 'Wrong answer',
                                callback: function (value, validator, $field) {
                                    // Determine the numbers which are generated in captchaOperation
                                    //var items = $('#captchaOperation').html().split(' '),
                                    // sum   = parseInt(items[0]) + parseInt(items[2]);
                                    sum = parseInt($('#captcha').val());
                                    return value == sum;
                                }
                            }
                        }
                    }

                }
            })
            .on('error.form.bv', function (e) {
                console.log('error.form.bv');
                var $form = $(e.target);
                console.log($form.data('bootstrapValidator').getInvalidFields());
                return false;
            })
            .on('success.form.bv', function (e) {
                $('#signup_btn').val(' SAVING... ');
                formIsValid = true;
                $('.form-group', $(this)).each(function () {
                    formIsValid = formIsValid && $(this).hasClass('has-success');
                });
                //alert(formIsValid);
                if (formIsValid) {
                    $('#signup_btn', $(this)).attr('disabled', false);
                } else {
                    $('#signup_btn', $(this)).attr('disabled', true);
                }
                return true;
            })
            .on('error.field.bv', function (e, data) {
                console.log('error.field.bv -->', data);
                return false;
            })
            .on('success.field.bv', function (e, data) {
                if (data.field == 'phone' && $('#OPT').val() == '') {
                    $.ajax({
                        type: "POST",
                        url: 'sendOPT.php',
                        dataType: "text",
                        data: {
                            phone: $('#s-phone').val()
                        },
                        success: function (response) {
                            //$(".ph-ajax-loader img").hide();
                            alert('A verification code sent to your phone ');
                            $("#pup-code-worp").slideDown();
                            $('#OPT').val(response);
                            $('#headerSignup').bootstrapValidator('addField', 'popcode', {
                                validators: {
                                    notEmpty: {
                                        message: 'Please enter the OPT sent to your mobile.'
                                    },
                                    remote: {
                                        type: 'POST',
                                        url: 'remoteCode.php?c=' + $('#OPT').val(),
                                        message: 'The code is not valid.',
                                        delay: 2000
                                    }
                                }
                            });
                        },
                        error: function (xhr, status) {
                            //$(".ph-ajax-loader img").hide();
                            alert('Unknown error ' + xhr.status);
                        }
                    });

                }
                /*console.log('success.field.bv -->', data);
                 return true;*/
            })
            .on('status.field.bv', function (e, data) {
                data.element.parents('.form-group').removeClass('has-success');
                data.bv.disableSubmitButtons(false);

            });

    $('#headerLogin')
            .bootstrapValidator({
                message: 'This value is not valid',
                fields: {
                    email: {
                        validators: {
                            notEmpty: {
                                message: 'Email address is required and cannot be empty'
                            },
                            emailAddress: {
                                message: 'Please enter a valid email address'
                            }
                        }
                    },
                    password: {
                        validators: {
                            notEmpty: {
                                message: 'Password is required and cannot be empty'
                            }
                        }
                    }
                }

            })
            .on('error.form.bv', function (e) {
                $('#login_btn').val('SUBMIT');
                console.log('error.form.bv');
                var $form = $(e.target);
                console.log($form.data('bootstrapValidator').getInvalidFields());
                return false;
            })
            .on('success.form.bv', function (e) {
                $('#login_btn').val('SUBMITTING... ');
                return true;
            })

});

function chkemail(v) {
    $.post('chkemail.php', {
        val: $("#" + v).val()
    }, function (res) {
        if (res == 's') {
            alert("Email alredy exist try another one.");
            $("#" + v).val('');
        }
    });
}

