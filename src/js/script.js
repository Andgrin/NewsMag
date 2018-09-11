
//= ../../node_modules/jquery/dist/jquery.js


(function() {
   console.log("init NEW  NewsPage");

   var newsList = $("#newsList"),
		 singeNewsView = $("#singeNewsView"),
		 singeNewsViewContainer = $("#singeNewsView .news-container"),

      // Create Tamplates Clones  
       newsListItemTamplate = $("#newsListItemTamplate"),
		 singleNewTamplate = $("#singleNewTamplate"),

	   // Single News preview buttons		
	    btnCloseNews = $("#newsClose"),
		 btnNextNews = $("#newsNext"),
		 btnNewsPrev = $("#newsPrev"),

	    currentSingleNewsViewId = 0,
		 minNewsId = 0,
		 maxNewsId = 0;


	//
	//  NEWS LIST Functions
	//

	//   Load news list
   function loadNewsList() {
      $.get( "http://localhost:3004/newsList/", function() {
         })
         .done(function(data) {
				maxNewsId = data.length - 1;
            for ( var i = 0; i < data.length; i++ ) {
					renderNewsListItem(data[i]);
				}
         })
         .fail(function() {
           alert( "Fail to load data" );
         });
	}
	
	// Change News List to Single News Preview
	function goToSingleNewsPreview(newsId) {
		newsList.hide();
		newsList.empty();

		singeNewsView.show();
		loadSingleNews( newsId );
	}

	//   Render news list items
	function renderNewsListItem (data) {
		var item = newsListItemTamplate.clone(),
			 commentsText = function() {
				if (data.comments === 1) {
					return data.comments +  " comment"
				} else {
					return data.comments +  " comments"
				}
			 };

		item.attr("id", "newsCard-"  + data.id);
		item.css({ "border-bottom-color": data.color });

		// Insert data to clone
		item.find( ".news-item__img" ).attr("src", "img/news-img-card-0"+ data.id +"-min.jpg");
		item.find( ".news-item__date" ).html(data.date);
		item.find( ".news-item__comments" ).html(commentsText);
		item.find( ".news-item__title" ).html(data.title);
		item.find( ".news-item__text" ).text(data.subtitle);

		// Enevt on click go to news preview
		item.on("click touchend", function(){
			goToSingleNewsPreview(data.id);
		});

		newsList.append(item);
	}





	//
	//  SINGLE NEWS PREVIEW Functions
	//

	//	  Close single news preview and show news list
   function closeSingleNewsView() {
      singeNewsView.hide();
      singeNewsViewContainer.empty();
      newsList.empty();
      newsList.show();
		loadNewsList();
   }

	//   Change single news item
   function changeSingleNewsView(numb) {
		singeNewsViewContainer.empty();
      loadSingleNews( numb );
	}
	
	
	//   Load single news
   function loadSingleNews(index) {
      $.get( "http://localhost:3004/newsList/" + index, function() {
         })
         .done(function(data) {
            renderSingleNews(data);
         })
         .fail(function() {
           alert( "Fail to load data" );
         });
	}
	
	//   Render single news preview
	function renderSingleNews(data) {
		// Set new current id
		currentSingleNewsViewId = data.id;

		var parent = singleNewTamplate.clone(),
			 paragraphsContainer = parent.find( ".item-data__paragraphs" ),
			 commentsText = function() {
				if (data.comments === 1) {
					return data.comments +  " comment"
				} else {
					return data.comments +  " comments"
				}
			 };

		parent.attr("id", "singleNewsPreview-"  + data.id);

		// Insert data to clone
		parent.find( ".item-data__img" ).css({
			"background-image": "url(img/news-img-title-0"+ data.id +"-min.jpg)"
		});
		parent.find( ".item-data__date" ).html(data.date);
		parent.find( ".item-data__comments" ).html(commentsText);
		parent.find( ".item-data__title" ).html(data.title);
		parent.find( ".item-data__subtitle" ).text(data.subtitle);

		for (var i = 0; i < data.paragraphs.length; i++ ) {
			var p = $('<p/>', { class: "regular-text" });
			p.text(data.paragraphs[i]);
			paragraphsContainer.append(p);
		}

		//  Set clone to page
		singeNewsViewContainer.append(parent);

		// Check if buttons can be clicked
		isButtomCanBeActive(btnNewsPrev, data.id, minNewsId);
		isButtomCanBeActive(btnNextNews ,data.id, maxNewsId);
	}

	//   Check if buttons can be clicked
	function isButtomCanBeActive (btn, currentId, otherId) {
		if (currentId == otherId) {
			btn.addClass("disable");
		} else {
			btn.removeClass("disable");
		}
	}


	




   $(".header__side-nav .list .container").on("mouseenter", function(){
      $(this).addClass("hovered");
   }).on("mouseleave", function(){
      $(this).removeClass("hovered");
   });

   //
   //   BUTTONS EVENTS
	//

   btnCloseNews.bind("click touchend", function(e){
      e.preventDefault();
      closeSingleNewsView();
   });

   btnNewsPrev.bind("click touchend", function(e){
      e.preventDefault();
      changeSingleNewsView(currentSingleNewsViewId - 1);
   });

   btnNextNews.bind("click touchend", function(e){
      e.preventDefault();
      changeSingleNewsView(currentSingleNewsViewId + 1);
   });

	$("#sideMenuShowBtn").on("touchend", function(){
		$(".header__side-nav").toggleClass("show");
	})


	//  LOAD NEWS LIST
	loadNewsList();

})();
