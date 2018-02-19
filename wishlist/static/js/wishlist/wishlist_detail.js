var LIST_CONTENT_DESIGNATOR = ".js-list-content";
var ITEM_DETAIL_CONTAINER_DESIGNATOR = ".js-item-details-component";
var WISHLIST_CONTAINER_DESIGNATOR = ".js-wishlist-container";
var WISHLIST_LIST_ITEM_DESIGNATOR = ".js-wishlist-list-item";
var WISHLIST_ITEM_ADD_DESIGNATOR = ".js-list-add-button";
var API_GET_ITEM_HTML = "/wishlist/api/item_request/";
var API_GET_ITEM_DETAILS_HTML = "/wishlist/api/item_request/details/";

function Wishlist(selector) {
    this.selector = selector;
    this.listContainer = function() {
      return $(this.selector).find(WISHLIST_CONTAINER_DESIGNATOR);
    }
    this.pk = function() {
      return parseInt(this.listContainer().attr("data-pk"));
    }
    this.listContent = function() {
      return this.listContainer().find(LIST_CONTENT_DESIGNATOR);
    }
    this.itemDetailDisplay = function() {
      return $(this.selector).find(ITEM_DETAIL_CONTAINER_DESIGNATOR);
    }

    /**
    Loads the items for this wishlist in the list display.
    */
    this.refresh = function() {
      var thisWishlist = this;
      this.listContent().empty();
      $.ajax({
        url: API_GET_ITEM_HTML + this.pk(),
        dataType: "html",
        success: function(itemHtml) {
          thisWishlist.listContent().html(itemHtml);
        },
        error: function(xhr, ajaxOptions, thrownError) {
          alert("Bro, what are you doing?");
        }
      });
    }

    /**
    Populates the item detail window with the details of
    the ItemRecord with the given primary key.
    */
    this.showItemDetails = function(pk) {
      var thisWishlist = this;
      this.itemDetailDisplay().empty();
      $.ajax({
        url: API_GET_ITEM_DETAILS_HTML + pk,
        dataType: "html",
        success: function(itemDetails) {
          thisWishlist.itemDetailDisplay().html(itemDetails);
        },
        error: function(xhr, ajaxOptions, thrownError) {
          alert("Bro, what are you doing? Something's not right.");
        }
      });
    }

    /**
    Initializes JQuery events.
    */
    this.initEvents = function() {
      var thisWishlist = this;
      $(document).on("click", this.selector + " " + WISHLIST_LIST_ITEM_DESIGNATOR, function() {
        pk = parseInt($(this).attr("data-pk"));
        thisWishlist.showItemDetails(pk);
      });

      $(document).on("click", this.selector + " " + WISHLIST_ITEM_ADD_DESIGNATOR, function() {
        
      });
    }

    this.initEvents();
    this.refresh()
}

$(document).ready(function() {
  window.wishlist = new Wishlist("#wishlist_display");
});
