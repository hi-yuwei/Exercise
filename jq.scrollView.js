function scrollView(elements){
    elements.each(function(){
        $('html, body').animate({
            scrollTop: $(this).offset().top - $(window).height()/10 + 92
        }, 1000);
    });
};
