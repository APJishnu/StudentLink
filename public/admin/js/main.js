(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.sticky-top').css('top', '0px');
        } else {
            $('.sticky-top').css('top', '-100px');
        }
    });
    
    
    // Dropdown on mouse hover
    const $dropdown = $(".dropdown");
    const $dropdownToggle = $(".dropdown-toggle");
    const $dropdownMenu = $(".dropdown-menu");
    const showClass = "show";
    
    $(window).on("load resize", function() {
        if (this.matchMedia("(min-width: 992px)").matches) {
            $dropdown.hover(
            function() {
                const $this = $(this);
                $this.addClass(showClass);
                $this.find($dropdownToggle).attr("aria-expanded", "true");
                $this.find($dropdownMenu).addClass(showClass);
            },
            function() {
                const $this = $(this);
                $this.removeClass(showClass);
                $this.find($dropdownToggle).attr("aria-expanded", "false");
                $this.find($dropdownMenu).removeClass(showClass);
            }
            );
        } else {
            $dropdown.off("mouseenter mouseleave");
        }
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Header carousel
    $(".header-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        items: 1,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="bi bi-chevron-left"></i>',
            '<i class="bi bi-chevron-right"></i>'
        ]
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        center: true,
        margin: 24,
        dots: true,
        loop: true,
        nav : false,
        responsive: {
            0:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:3
            }
        }
    });
    
})(jQuery);


function showPwd(id1,id2, el) {
    let x = document.getElementById(id1);
    let y = document.getElementById(id2);
    if (x.type && y.type === "password") {
      x.type= "text";
      y.type="text";
      el.className = 'fa fa-eye-slash showpwd';
    } else {
      x.type = "password";
      y.type="password"
      el.className = 'fa fa-eye showpwd';
    }
  }

  function openNav() {
    document.getElementById("mySidebar").style.width = "250px";
}

function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
}

//password eye//
const passwordInput = document.getElementById('password');
const togglePassword = document.getElementById('show_eye');
const hidePassword = document.getElementById('hide_eye');

togglePassword.addEventListener('click', function () {
    passwordInput.type = 'text';
    togglePassword.classList.add('d-none');
    hidePassword.classList.remove('d-none');
});

hidePassword.addEventListener('click', function () {
    passwordInput.type = 'password';
    hidePassword.classList.add('d-none');
    togglePassword.classList.remove('d-none');
});


//error//
  $(document).ready(function () {
    // Set a flag to track whether the error message has been shown
    let errorMessageShown = false;

    // Function to make the error message blink
    function blinkErrorMessage() {
      if (!errorMessageShown) {
        $('#error-message').fadeOut(400).fadeIn(400, function () {
          // Set the flag to true after the first blink
          errorMessageShown = true;
        });
      }
    }

    // Call the blink function when the document is ready
    blinkErrorMessage();
  });





  
  
  
  
  
