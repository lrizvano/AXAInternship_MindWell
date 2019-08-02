    $(function(){

        $('.tabs li').on('click', function(){
            $('.tabs li').removeClass('active');
            $(this).addClass('active');

            var tabBtn = $(this).data('tab'),
                tabCon = $('.tab-content[id^="'+tabBtn+'"]');

          $('.tab-content[id^="tab"]').removeClass('tab-active');
          $('.tab-content[id="'+tabBtn+'"]').addClass('tab-active');

        })
    })