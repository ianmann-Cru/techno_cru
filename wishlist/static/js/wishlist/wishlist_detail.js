var LIST_CONTENT_DESIGNATOR = ".js-list-content";
var ITEM_DETAIL_CONTAINER_DESIGNATOR = ".js-item-details-component";
var WISHLIST_CONTAINER_DESIGNATOR = ".js-wishlist-container";
var WISHLIST_LIST_ITEM_DESIGNATOR = ".js-wishlist-list-item";
var WISHLIST_GET_ITEM_ADD_FORM_DESIGNATOR = ".js-list-add-button";
var WISHLIST_ITEM_ADD_SUBMIT_DESIGNATOR = ".js-add-itemrequest-submit";
var WISHLIST_ITEM_ADD_FORM_DESIGNATOR = ".js-submit-item-add-form";

var API_GET_ITEM_HTML = "/wishlist/api/item_request/";
var API_GET_ITEM_DETAILS_HTML = "/wishlist/api/item_request/details/";
var API_GET_ITEM_ADD_HTML = "/wishlist/api/item_request/add/form/";
var API_ADD_ITEM_REQUEST = "/wishlist/api/item_request/add/submit/";

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
    this.showItemDetails = function(wishlist_pk) {
      var thisWishlist = this;
      this.itemDetailDisplay().empty();
      $.ajax({
        url: API_GET_ITEM_DETAILS_HTML + wishlist_pk,
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
    Shows the html (in the detail display box) that is used to create a new
    item request.
    */
    this.showAddForm = function(wishlist_pk) {
      var thisWishlist = this;
      $.ajax({
        url: API_GET_ITEM_ADD_HTML + wishlist_pk,
        dataType: "html",
        success: function(addForm) {
          thisWishlist.itemDetailDisplay().html(addForm);
        },
        error: function(xhr, ajaxOptions, thrownError) {
          alert("Dude, can you not? Something's not right.")
        }
      });
    }

    this.clearAddForm = function() {
      wishlist_pk = this.pk();
      this.showAddForm(wishlist_pk);
    }

    /**
    Grabs the input from the add form and submits the item_request to the server
    to be created. If successful, the form is refreshed.
    */
    this.submitAddItem = function(wishlist_pk) {
      var thisWishlist = this;

      data = serializeForm($(this.selector + " " + WISHLIST_ITEM_ADD_FORM_DESIGNATOR));
      data.csrfmiddlewaretoken = getCsrfToken();
      $.ajax({
        url: API_ADD_ITEM_REQUEST + wishlist_pk + "/",
        method: "post",
        dataType: "json",
        data: data,
        success: function(response) {
          if (!response.item_request) {
            alert(Object.values(response.errors).join("\n"));
          }
          thisWishlist.clearAddForm();
          thisWishlist.refresh();
        },
        error: function(xhr, ajaxOptions, thrownError) {
          alert("Uhhh... ¯\\_(ツ)_/¯? Something's not right.")
        }
      });
    }

    /**
    Initializes JQuery events.
    */
    this.initEvents = function() {
      var thisWishlist = this;

      // Initialize jquery to show item details
      $(document).on("click", this.selector + " " + WISHLIST_LIST_ITEM_DESIGNATOR, function() {
        wishlist_pk = thisWishlist.pk();
        thisWishlist.showItemDetails(wishlist_pk);
      });

      // Initialize jquery to show add form.
      $(document).on("click", this.selector + " " + WISHLIST_GET_ITEM_ADD_FORM_DESIGNATOR, function() {
        wishlist_pk = thisWishlist.pk();
        thisWishlist.showAddForm(wishlist_pk);
      });

      // Initialize jquery to submit the add form.
      $(document).on("click", this.selector + " " + WISHLIST_ITEM_ADD_SUBMIT_DESIGNATOR, function() {
        wishlist_pk = thisWishlist.pk();
        thisWishlist.submitAddItem(wishlist_pk);
      });
    }

    this.initEvents();
    this.refresh()
}

$(document).ready(function() {
  window.wishlist = new Wishlist("#wishlist_display");
});
