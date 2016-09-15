
function feedback() {
    alert('Feedback In Progress');
}
$(window).load(function() {
           $('.loader').fadeOut('fast');
        });



$(document).ready(function(){

    $('#BtnLatest').on('click', function() {
        $('li:nth-child(n+7)').hide();

        // $('#component-latest').show();
       // $('#component-custom-page').hide();
        alert('Latest Show');
    });

    $('#BtnAll').on('click', function() {
        $('#component-latest').hide();
        $('#component-custom-page').show();
        alert('All Show');
    });
    //li:nth-child(n+7) { display:none; }

    // click outside spy
    $('html').on('click',function(){
        $('.search').removeClass('active');
    });// end click outside spy
    
    // toggle search 
    $('.search .search-button').on('click',function(e){        
        $(this).parent('.search').toggleClass('active');
        e.stopPropagation();
    });
    $('.search .search-container').on('click',function(e){
        e.stopPropagation();
    });// end toggle search

    // MixItUp
    if($('.mix-grid').length > 0)
        $('.mix-grid').mixItUp();  
    // end MixItUp
    
    // end animate on scroll
    
});

$(function(){    
    onPageResize();
    navController();    
});

$(window).scroll(function(){    
    if($(window).scrollTop() > 40){
        $('.page-container').addClass('page-header-fixed');
        
        if($(window).scrollTop() < 40)
            $('.page-container .page-content').css('padding-top',$(window).scrollTop());
    }else{
        $('.page-container').removeClass('page-header-fixed');    
        $('.page-container .page-content').css('padding-top','');
    }
});

$(window).resize(function(){
    onPageResize();
});

// on page resize actions
function onPageResize(){
    
    var pageWidth = window.innerWidth || $(document).width();
    
    if(pageWidth <= 1100)
        $('.page-header .navigation').addClass('navigation-mobile');
    else
        $('.page-header .navigation').removeClass('navigation-mobile,active').find('li').removeClass('open');
    
}// end on page resize actions

// navigation controller 
function navController(){
    
    // toggle navigation
    $('.navigation-toggle-button').on('click',function(){
        $('.page-header .navigation').toggleClass('active');
    });// end toggle navigation
    
    $('.page-header-holder').on('click','.navigation-mobile li > a',function(e){
        
        var li = $(this).parent('li');
        
        if(li.children('ul').length > 0){            
            li.toggleClass('open');
        }
        
    });    
    
}// end navigation controller 

// animate on scroll
    $('#btnBack').click(function(){
                    window.location = 'index.html';
                    });

    $('#btnRegister').click(function(){
                    window.location = 'register.html';
                    });

    $('#btnLogin').click(function(){
                    window.location = 'login.html';
                    });

    $('#btnAbout').click(function(){
                    window.location = 'about.html';
                    });
					
	 $('#btnTemplates').click(function(){
                    window.location = 'templates.html';
                    });

    $('#btnSettings').click(function(){
                     window.location = 'settings.html';
                     });


    
