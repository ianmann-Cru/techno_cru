function ItemRecordWidget(parentWishlist, widgetSelector) {
  /**
  SELECTOR_FIELD_FORMAT: allows dynamic retrieval of a field by plugging in
  the field name.
  */
  this.SELECTOR_FIELD_FORMAT = ".js-item-record-{format}";
  this.SELECTOR_TYPE_INPUT = ".js-item-record-type";
  this.SELECTOR_COST_INPUT = ".js-item-record-cost";
  this.SELECTOR_NOTES_INPUT = ".js-item-record-notes";
  this.SELECTOR_SHOW_ADD_FORM_BUTTON = ".js-item-record-btn-show-add-form";
  this.SELECTOR_FORM_CONTAINER = ".js-form-add-record";
  this.SELECTOR_SUBMIT_FORM = ".js-item-record-submit";

  this.URL_SUBMIT = "/wishlist/api/item_request/{item_request_pk}/item_record/add/submit/";

  this.INPUT_OPTIONS_VALUES = {
    bought: "bt",
    already_have: "ah",
    unnecessary: "un"
  };

  this.selector = widgetSelector;
  this.parentWishlist = parentWishlist;

  /**
  Removes input for all fields in the form.
  */
  this.clearAddForm = function() {
    this.field("type").val("");
    this.field("cost").val("");
    this.field("notes").val("");
  }

  this.showAddForm = function() {
    $(this.selector + " " + this.SELECTOR_FORM_CONTAINER).removeClass("display-none");
  }
  this.hideAddForm = function() {
    $(this.selector + " " + this.SELECTOR_FORM_CONTAINER).addClass("display-none");
  }
  this.toggleAddForm = function() {
    form = $(this.selector + " " + this.SELECTOR_FORM_CONTAINER);
    if (form.hasClass("display-none")) {
      this.showAddForm();
    } else {
      this.hideAddForm();
    }
  }

  /**
  Returns the field with the given name. The name must match exactly the name in
  the selector of the field.
  */
  this.field = function(fieldName) {
    return $(this.selector + " " + this.SELECTOR_FIELD_FORMAT.replace("{format}", fieldName));
  }

  /**
  Returnes the input that the user has put in to the form.
  This is in the form of a dictionary where each key is
  the field name and the values are the field values.
  */
  this.getInput = function() {
    type = $(this.selector + " " + this.SELECTOR_TYPE_INPUT).val();
    cost = $(this.selector + " " + this.SELECTOR_COST_INPUT).val();
    notes = $(this.selector + " " + this.SELECTOR_NOTES_INPUT).val();
    if (type == this.INPUT_OPTIONS_VALUES.bought && (cost == "" || cost == undefined)) {
      cost = 0;
    }
    return {
      item_type: type,
      cost: cost,
      comments: notes
    };
  }

  this.setPriceFieldVisibility = function() {
    input = this.getInput();
    if (input.item_type == this.INPUT_OPTIONS_VALUES.bought) {
      this.field("cost").removeClass("display-none");
    } else {
      this.field("cost").val("");
      this.field("cost").addClass("display-none");
    }
  }

  this.submit = function() {
    var thisWidget = this;
    input = this.getInput();
    input.csrfmiddlewaretoken = getCsrfToken();
    url = this.URL_SUBMIT.replace("{item_request_pk}", this.parentWishlist.openItemRequestPk.toString());
    $.ajax({
      url: url,
      method: "POST",
      dataType: "json",
      data: input,
      success: function(json) {
        if (json.success) {
          thisWidget.parentWishlist.showItemDetails(thisWidget.parentWishlist.openItemRequestPk);
          thisWidget.parentWishlist.refresh()
        } else {
          alert("Bro, please fill out all the fields.")
        }
      },
      error: function(xhr, ajaxOptions, thrownError) {
        alert("Bro, that item record crap don't work.");
      }
    });
  }

  this.initEvents = function() {
    var thisWidget = this;
    $(document).on("click", this.selector + " " + this.SELECTOR_SHOW_ADD_FORM_BUTTON, function() {
      thisWidget.toggleAddForm();
    });

    $(document).on("change", this.selector + " " + this.SELECTOR_TYPE_INPUT, function() {
      thisWidget.setPriceFieldVisibility();
    });

    $(document).on("click", this.selector + " " + this.SELECTOR_SUBMIT_FORM, function() {
      thisWidget.submit();
    });
  }

  this.setPriceFieldVisibility();
  this.initEvents();
}








/**
Contains JavaScript for the links widget for adding or editing an ItemRequest.
This widget allows user to enter multiple links in separate input fields. Then
this widget will concatenate the links with the delimiter according to
wishlist.models.ItemRequest.ONLINE_ORDER_LINKS_DELIMITER to be put into the
multivalue field called online_order_links.

Parameters:
  widgetSelector: div selector containing the parts to this widget. This should
                   contain both the actual input field and the speparated input
                   fields that make up the widget.
*/
function LinksWidget(widgetSelector) {
  this.ACTUAL_INPUT_SELECTOR = ".js-order-link-widget-actual > #id_online_order_links";
  this.WIDGET_LIST_CONTAINER = ".js-order-link-widget-control";
  this.NEW_LINK_GROUP_SELECTOR = ".js-order-link-group";
  this.ADDED_LINK_DISPLAY_SELECTOR = ".js-order-link-display";
  this.NEW_LINK_INPUT_SELECTOR = ".js-order-link-input";
  this.NEW_LINK_ADD_BTN_SELECTOR = ".js-order-link-add-btn";
  this.NEW_LINK_REMOVE_BTN_SELECTOR = ".js-order-link-remove-btn";
  this.NEW_LINK_TEMPLATE_SELECTOR = ".js-order-link-group--template";

  this.selector = widgetSelector;
  this.widget = function() {
    return $(this.selector);
  }

  this.onlineOrderLinksDelimiter = function() {
    return this.widget().attr("meta-online-order-links-delimiter");
  }

  this.actualInputControl = function() {
    return $(this.selector + " " + this.ACTUAL_INPUT_SELECTOR);
  }

  this.getInputVals = function() {
    var thisWidget = this;
    var inputs = [];
    $(this.selector + " " + this.NEW_LINK_INPUT_SELECTOR).not(this.NEW_LINK_TEMPLATE_SELECTOR).each(function() {
      inputs.push($(this).val());
    });
    return inputs;
  }

  this.getInputValSingle = function(linkGroup) {
    input = linkGroup.find(this.NEW_LINK_INPUT_SELECTOR).val()
    if (input) {
      return input.replace(/ /g,'');
    } else {
      return "";
    }
  }

  /**
  Takes the input from the widget conntrols and puts them as a single delimited
  string into the actual input field.
  */
  this.syncInput = function() {
    delimitedLinks = this.getInputVals().join(this.onlineOrderLinksDelimiter());
    this.actualInputControl().val(delimitedLinks);
  }

  /**
  Hide the input for a link group and show the anchortag for it. This shows the
  user that the link will be added. This should be done after they click the
  check button.
  */
  this.showSingleLinkDisplay = function(linkGroup) {
    inputVal = this.getInputValSingle(linkGroup);
    linkGroup.find(".js-for-editing").addClass("display-none");
    linkGroup.find(".js-for-display").removeClass("display-none");
    linkGroup.find(this.ADDED_LINK_DISPLAY_SELECTOR).attr("href", inputVal);
    linkGroup.find(this.ADDED_LINK_DISPLAY_SELECTOR).html(inputVal.substring(0,16) + "...");
  }

  /**
  Shows The link display to show the user that this link will be added.
  */
  this.finalizeLink = function(linkGroup) {
    this.showSingleLinkDisplay(linkGroup);
  }

  /**
  Goes through each input in the widget and finalizes it. Then the actual input
  field is synced.
  */
  this.confirmAddNewLink = function() {
    var thisWidget = this;
    finished = true;

    $(this.selector + " " + this.NEW_LINK_GROUP_SELECTOR).each(function() {
      val = thisWidget.getInputValSingle($(this));
      if (val.length > 0) {
        thisWidget.finalizeLink($(this));
      } else {
        finished = false;
      }
    });
    this.syncInput();
    return finished;
  }

  this.openNewEmptyLinkInput = function() {
    newLink = $(this.NEW_LINK_TEMPLATE_SELECTOR).clone();
    newLink.removeClass("display-none");
    newLink.removeClass(this.NEW_LINK_TEMPLATE_SELECTOR.substring("1"/*Remove '.' from class selector*/));
    newLink.appendTo(this.selector + " " + this.WIDGET_LIST_CONTAINER);
  }

  this.submitOpenLinkInput = function() {
    linkFinished = this.confirmAddNewLink();
    if (linkFinished) {
      this.openNewEmptyLinkInput();
    }
  }

  this.deleteLink = function(button) {
    button.parent().remove();
    this.syncInput();
  }

  /**
  Initialize JQuery events for this widget.
  */
  this.initEvents = function() {
    var thisWidget = this;

    // Initialize event for when user presses add button on links widget.
    $(document).on("click", this.selector + " " + this.NEW_LINK_ADD_BTN_SELECTOR, function() {
      thisWidget.submitOpenLinkInput()
    });

    // Initialize event for when user presses delete button on links widget.
    $(document).on("click", this.selector + " " + this.NEW_LINK_REMOVE_BTN_SELECTOR, function() {
      thisWidget.deleteLink($(this))
    });
  }

  this.initEvents();
}







var LIST_CONTENT_DESIGNATOR = ".js-list-content";
var ITEM_DETAIL_CONTAINER_DESIGNATOR = ".js-item-details-component";
var WISHLIST_CONTAINER_DESIGNATOR = ".js-wishlist-container";
var WISHLIST_LIST_ITEM_DESIGNATOR = ".js-wishlist-list-item";
var WISHLIST_GET_ITEM_ADD_FORM_DESIGNATOR = ".js-list-add-button";
var WISHLIST_ITEM_ADD_SUBMIT_DESIGNATOR = ".js-add-itemrequest-submit";
var WISHLIST_ITEM_ADD_FORM_DESIGNATOR = ".js-submit-item-add-form";
var WISHLIST_ITEM_ADD_LINKS_WIDGET_DESIGNATOR = ".js-order-link-widget";
var WISHLIST_ITEMRECORD_WIDGET_DESIGNATOR = ".js-widget-item-records";

var API_GET_ITEM_HTML = "/wishlist/api/item_request/";
var API_GET_ITEM_DETAILS_HTML = "/wishlist/api/item_request/details/";
var API_GET_ITEM_ADD_HTML = "/wishlist/api/item_request/add/form/";
var API_ADD_ITEM_REQUEST = "/wishlist/api/item_request/add/submit/";

function Wishlist(selector) {
    this.selector = selector;
    this.openItemRequestPk = undefined;
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
    this.showItemDetails = function(item_pk) {
      var thisWishlist = this;
      this.itemDetailDisplay().empty();
      $.ajax({
        url: API_GET_ITEM_DETAILS_HTML + item_pk,
        dataType: "html",
        success: function(itemDetails) {
          thisWishlist.itemDetailDisplay().html(itemDetails);
          thisWishlist.openItemRequestPk = parseInt(item_pk);
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
          thisWishlist.linksWidget.openNewEmptyLinkInput();
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
        itemPk = $(this).attr("data-pk");
        thisWishlist.showItemDetails(itemPk);
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
    this.refresh();

    this.linksWidget = new LinksWidget(this.selector + " " + WISHLIST_ITEM_ADD_LINKS_WIDGET_DESIGNATOR);
    this.itemRecordWidget = new ItemRecordWidget(this, this.selector + " " + WISHLIST_ITEMRECORD_WIDGET_DESIGNATOR);
}





$(document).ready(function() {
  window.wishlist = new Wishlist("#wishlist_display");
});
