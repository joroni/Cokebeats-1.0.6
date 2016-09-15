define(['jquery', 'core/theme-app', 'core/theme-tpl-tags', 'core/modules/storage',
        'theme/js/bootstrap.min', 'theme/js/auth/auth-pages', 'theme/js/auth/simple-login',
        'theme/js/auth/premium-posts', 'theme/js/comments', 'js/jquery.smoothState.js',
        'js/main.js', 'theme/js/script', 'theme/js/swiper.min', 'theme/js/lazyload', 'theme/js/actions'
       
    ],
    function ( $, App, TemplateTags, Storage ) {

        var $refresh_button = $('#refresh-button');

        /**
         * Launch app contents refresh when clicking the refresh button :
         */
        $refresh_button.click(function ( e ) {
            e.preventDefault();
            closeMenu();
            App.refresh();
        });

        /**
         * Animate refresh button when the app starts refreshing
         */
        App.on('refresh:start', function () {
            $refresh_button.addClass('refreshing');
        });


      //  App.addCustomRoute( 'component-latest', 'my-home-template' );

        //App.addCustomRoute( 'component-custom-page', 'my-home-template' );
        // Simple way: use of "default-route" (by default, "launch-route" = "default-route").
// This is if you don't need to differentiate your "launch route" from your "default route"

//Add our home page (will have the #my-home-route fragment and use the "my-home-template" to render):
        /*    App.addCustomRoute( 'all-posts', 'my-home-template' );

         App.filter( 'default-route', function( default_route ) {
         default_route = 'all-posts';
         return default_route ;
         } );
         */

        /**
         * When the app stops refreshing :
         * - scroll to top
         * - stop refresh button animation
         * - display success or error message
         *
         * Callback param : result : object {
	 *		ok: boolean : true if refresh is successful,
	 *		message: string : empty if success, error message if refresh fails,
	 *		data: object : empty if success, error object if refresh fails :
	 *					   use result.data to get more info about the error
	 *					   if needed.
	 * }
         */
        App.on('refresh:end', function ( result ) {
            scrollTop();
            Storage.clear('scroll-pos');
            $refresh_button.removeClass('refreshing');
            if (result.ok) {
                //$( '#feedback' ).removeClass( 'error' ).html( '<i id="feedback" class="fa fa-check-circle" style="color: #00ff00; font-size: 2em; text-shadow: 0 0 1px #888;"></i> ' ).slideDown();
                $('#feedback').removeClass('error').html('<div id="feedback" class="foramoment animated fadeOut" style="background-color: lawngreen !important; color: #000 !important;; font-size: 1em; text-shadow: 0 0 0px #888;">Updates successful</div> ').slideDown();
            } else {
                $('#feedback').addClass('error').html(result.message).slideDown();
            }
        });

        /**
         * When an error occurs, display it in the feedback box
         */
        App.on('error', function ( error ) {
            $('#feedback').addClass('error').html(error.message).slideDown();
        });

        /**
         * Hide the feedback box when clicking anywhere in the body
         */
        $('body').click(function ( e ) {
            $('#feedback').slideUp();
        });


      /*  $('#BtnAll').click(function ( e ) {
            $('#archive').hide();
            $('#archive2').slideUp();
            alert('A2');
        });
*
        /**
         * Back button
         */
        var $back_button = $('#go-back');

        //Show/Hide back button (in place of refresh button) according to current screen:
        App.on('screen:showed', function () {
            var display = App.getBackButtonDisplay();
            if (display === 'show') {
                $refresh_button.hide();
                $back_button.show();
            } else if (display === 'hide') {
                $back_button.hide();
                $refresh_button.show();
            }
        });

        //Go to previous screen when clicking back button:
        $back_button.click(function ( e ) {
            e.preventDefault();
            App.navigateToPreviousScreen();
        });



        /**
         * Allow to click anywhere on post list <li> to go to post detail :
         */
        $('#container').on('click', 'li.media', function ( e ) {
            e.preventDefault();
            var navigate_to = $('a', this).attr('href');
            App.navigate(navigate_to);
        });

   /*     $('#BtnLatest').on('click', function() {
            $('#component-latest').show();
            $('#component-custom-page').hide();
            alert('Latest Show');
        });

        $('#BtnAll').on('click', function() {
            $('#component-latest').hide();
            $('#component-custom-page').show();
            alert('All Show');
        });
*/
        /**
         * Close menu when we click a link inside it.
         * The menu can be dynamically refreshed, so we use "on" on parent div (which is always here):
         */
        $('#navbar-collapse').on('click', 'a', function ( e ) {
            closeMenu();
        });




        /**
         * Open all links inside single content with the inAppBrowser
         */
        $("#container").on("click", ".single-content a, .page-content a", function ( e ) {
            e.preventDefault();
            openWithInAppBrowser(e.target.href);
        });

        $("#container").on("click", ".comments", function ( e ) {
            e.preventDefault();

            $('#waiting').show();

            App.displayPostComments(
                $(this).attr('data-post-id'),
                function ( comments, post, item_global ) {
                    //Do something when comments display is ok
                    //We hide the waiting panel in 'screen:showed'
                },
                function ( error ) {
                    //Do something when comments display fail (note that an app error is triggered automatically)
                    $('#waiting').hide();
                }
            );
        });

        /**
         * "Get more" button in post lists
         */
        $('#container').on('click', '.get-more', function ( e ) {
            e.preventDefault();

            var $this = $(this);

            var text_memory = $this.text();
            $this.attr('disabled', 'disabled').text('Loading...');

            App.getMoreComponentItems(
                function () {
                    //If something is needed once items are retrieved, do it here.
                    //Note : if the "get more" link is included in the archive.html template (which is recommended),
                    //it will be automatically refreshed.
                    $this.removeAttr('disabled');
                },
                function ( error, get_more_link_data ) {
                    $this.removeAttr('disabled').text(text_memory);
                }
            );
        });


        /**
         * Do something before leaving a screen.
         * Here, if we're leaving a post list, we memorize the current scroll position, to
         * get back to it when coming back to this list.
         */
        App.on('screen:leave', function ( current_screen, queried_screen, view ) {
            //current_screen.screen_type can be 'list','single','page','comments'
            if (current_screen.screen_type == 'list') {
                Storage.set('scroll-pos', current_screen.fragment, $('body').scrollTop());
            }
        });

        /**
         * Do something when a new screen is showed.
         * Here, if we arrive on a post list, we resore the scroll position
         */
        App.on('screen:showed', function ( current_screen, view ) {
            //current_screen.screen_type can be 'list','single','page','comments'
            if (current_screen.screen_type == 'list') {
                var pos = Storage.get('scroll-pos', current_screen.fragment);
                if (pos !== null) {
                    $('body').scrollTop(pos);
                } else {
                    scrollTop();
                }
            } else {
                scrollTop();
            }

            if (current_screen.screen_type == 'comments') {
                $('#waiting').hide();
            }

        });

        /**
         * Example of how to react to network state changes :
         */

        App.on('network:online', function ( event ) {
            $('#feedback').removeClass('error').html("Online :)").slideDown();
        });

        App.on('network:offline', function ( event ) {
            $('#feedback').addClass('error').html("Disconnected :(").slideDown();
        });


        /**
         * Manually close the bootstrap navbar
         */
        function closeMenu() {
            var navbar_toggle_button = $(".navbar-toggle").eq(0);
            if (!navbar_toggle_button.hasClass('collapsed')) {
                navbar_toggle_button.click();
            }
        }

        /**
         * Get back to the top of the screen
         */
        function scrollTop() {
            window.scrollTo(0, 0);
        }

        /**
         * Opens the given url using the inAppBrowser
         */
        /* function openWithInAppBrowser( url ) {
         window.open( url, "_blank", "location=no" );
         }
         */


    });


$(document).on('click', 'a', function ( e ) {
    if ($(this).attr('target') === '_blank') {
        window.open($(this).attr('href'), '_system', 'location=no');
        e.preventDefault();
    }

});

//App.addCustomRoute( 'my-page-route', 'my-page-template', { title : 'for the template' } );

/**
 And if you want to pass dynamic data to the template, you can use the
 'template_args' filter :
 */
/*App.filter( 'template-args', function( template_args, view_type, view_template ) {
 if( view_template == 'my-page-template' ) {
 template_args.my_custom_arg = { my: custom_dynamic_value };
 }
 return template_args;
 } );*/

//In app's theme (functions.js)

/**
 The following allows to create a custom screen on app side only
 (meaning it does not correspond to an existing WordPress page or post).
 In this example, the page is accessed at the "url" #my-page-route and
 uses the template 'my-page-template' to render. Last arguments allows to pass
 custom data to the template.
 */
//App.addCustomRoute( 'my-page-route', 'my-page-template', { title : 'for the template' } );

/**
 And if you want to pass dynamic data to the template, you can use the
 'template_args' filter :
 */
/*App.filter( 'template-args', function( template_args, view_type, view_template ) {
 if( view_template == 'my-page-template' ) {
 template_args.my_custom_arg = { my: custom_dynamic_value };
 }
 return template_args;
 } );*/