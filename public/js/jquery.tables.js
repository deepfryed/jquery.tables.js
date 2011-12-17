(function ($) {
  var JQueryTables = function(el, options) {
    var table    = $(el);
    var instance = this;
    var settings = options || {};
    var icons    = {0: "ui-icon-carat-2-n-s", 1: "ui-icon-triangle-1-n", 2: "ui-icon-triangle-1-s"};

    // pagination & sorting
    settings.items_per_page = settings.items_per_page || [10, 20, 50, 100];
    settings.sorters        = settings.sorters        || {};
    settings.url            = settings.url            || table.attr('data-url');

    this.page = 0, this.total = 0, this.filtered = 0, this.pages = 0, this.buffer;
    this.limit = settings.items_per_page[0] || table.attr('data-tables-items-per-page');
    this.sort_fields = [];

    this.init = function() {
      table.wrap($('<div/>', {"class": "jqt-wrapper", "style": "display: inline-block"})).addClass('jqt-table');
      this.add_controls();
      this.add_sort_controls();
      $.each(table.find('thead th'), function(idx, th) {
        if ($(th).attr('data-type') == 'numeric')
          settings.sorters[idx] = instance.floatcmp;
        else
          settings.sorters[idx] = settings.sorters[idx] || instance.strcmp;
      });
      this.redraw();
    };

    this.add_sort_controls = function() {
      table.find('thead th').each(function(idx, th) {
        var span = $('<span/>', {"class": "ui-icon right " + icons[0]});
        $(th).append(span);
        $(th).addClass('ui-state-default');
        $(th).click(function(e) {
          var dir = $(th).data('sort-dir');
          dir = dir ? dir % 3 + 1 : 2;
          $(th).data('sort-dir', dir);

          instance.add_sort_field(e, idx, dir);

          span.removeClass($.map(icons, function(k, v) { return k; }).join(" "));
          span.addClass(icons[dir - 1]);
          instance.redraw();
        });
      });
    };

    this.add_sort_field = function(e, idx, dir) {
      if (!e.shiftKey) {
        $.each(table.find('th > span.ui-icon'), function(idx, el) {
          $(el).removeData();
          $(el).removeClass($.map(icons, function(k, v) { return k; }).join(" "));
          $(el).addClass(icons[0]);
        });

        this.sort_fields = [];
      }

      if (dir > 1)
        this.sort_fields.push([idx, dir]);
      else
        this.sort_fields = $.grep(this.sort_fields, function(arr) { return arr[0] != idx; });
    };

    this.add_controls = function() {
      var uiclass = "ui-toolbar ui-widget-header ui-helper-clearfix";
      table.before(this.top_controls().addClass(uiclass)).after(this.bottom_controls().addClass(uiclass));
    };

    this.top_controls = function() {
      var div = $('<div/>', {"class": "jqt-control top ui-corner-tl ui-corner-tr"});
      var ipp = $('<div/>', {"class": "jqt-ipp"});

      var select = $('<select/>');
      $.each(settings.items_per_page, function(idx, n) { select.append($('<option/>', {html: n})); });

      select.change(function() {
        instance.limit = parseInt($(this).val());
        instance.pages = Math.ceil(instance.filtered / instance.limit);
        if (instance.page >= instance.pages) {
          instance.page = instance.pages - 1;
        }
        instance.redraw();
      });

      var input = $('<input/>', {"name": "q"});

      input.keydown(function(e) {
        instance.query = input.val() == '' ? null : input.val();
        if (e.keyCode == 13) {
          instance.page = 0;
          instance.redraw();
        }
      });

      var search = $('<div/>', {"class": "query"}).append(input);

      return div.append(ipp.append('display').append(select).append('items')).append(search);
    };

    this.bottom_controls = function() {
      var div = $('<div/>', {"class": "jqt-control bottom ui-corner-bl ui-corner-br"});
      return div;
    };

    // TODO: i18n
    this.fetch_error = function(m) {
      alert('error loading data');
    };

    this.fetch_buffer = function(data, textStatus, jqXHR) {
      if (typeof(data) == 'string') {
        var $div          = $(data);
        instance.total    = $div.attr('data-total'),
        instance.filtered = $div.attr('data-filtered') || instance.total,
        instance.buffer   = $div.find('tbody');
      }
      else {
        instance.total = data.total, instance.filtered = data.filtered, instance.buffer = $('<tbody/>');
        $.each(data.rows, function(idx, row) {
          var tr = $('<tr/>');
          $.each(row, function(idx, value) { tr.append($('<td/>', {html: value})); });
          instance.buffer.append(tr);
        });
      }
      instance.draw();
    };

    this.fetch = function() {
      var data = {offset: this.page * this.limit, limit: this.limit};

      if (this.sort_fields.length > 0) {
        data['sf'] = $.map(this.sort_fields, function(arr) { return arr[0]; });
        data['sd'] = $.map(this.sort_fields, function(arr) { return arr[1]; });
      }

      if (this.query)
        data['q'] = this.query;

      $.ajax({type: 'get', url: settings.url, data: data, error: this.fetch_error, success: this.fetch_buffer});
    };

    this.load = function() {
      // preload buffer only the first time around.
      this.buffer = this.buffer || $('<tbody/>').append(table.find('tbody').html());
      this.total = this.filtered = this.buffer.find('tr').size();
      table.find('tbody').html('');
      this.draw();
    };

    this.draw = function() {
      var rows = this.filter();
      this.filtered = settings.url ? this.filtered : this.query ? rows.size() : this.buffer.find('tr').size();
      this.pages = Math.ceil(this.filtered / this.limit);
      table.find('tbody').html(this.order(rows).clone());
      this.update_pagination();
      table.trigger('jqt-draw-done');
    };

    this.update_pagination = function() {
      var offset  = this.page * this.limit;
      var toolbar = table.next('.jqt-control.bottom');
      var pagen   = Math.min(offset + this.limit, this.filtered);
      var text    = 'Showing ' + (offset + 1) + ' to ' + pagen + ' of ' + this.filtered;

      toolbar.find('.jqt-info').remove();
      toolbar.prepend($('<div/>', {"class": "jqt-info"}).append(text));

      var tbdiv, first, prev, next, last;

      if (toolbar.find('.jqt-pagination').size() > 0) {
        first = toolbar.find('.jqt-first');
        prev  = toolbar.find('.jqt-previous');
        next  = toolbar.find('.jqt-next');
        last  = toolbar.find('.jqt-last');
      }
      else {
        tbdiv = $('<div/>',  {"class": "jqt-pagination"});
        first = $('<span/>', {"class": "jqt-first ui-button ui-state-default", "html": "first"});
        prev  = $('<span/>', {"class": "jqt-previous ui-button ui-state-default", "html": "previous"});
        next  = $('<span/>', {"class": "jqt-next ui-button ui-state-default", "html": "next"});
        last  = $('<span/>', {"class": "jqt-last ui-button ui-state-default", "html": "last"});

        first.click(function() {
          if ($(this).is('.ui-state-disabled')) return;
          instance.page = 0;
          instance.redraw();
        });

        prev.click(function() {
          if ($(this).is('.ui-state-disabled')) return;
          instance.page -= 1;
          instance.redraw();
        });

        input = $('<input/>', {"size": 3, "placeholder": "page"});
        input.keydown(function(e) {
          if (e.keyCode == 13) {
            var page = parseInt($(this).val());
            if (page > 0 && page <= instance.pages && page != (instance.page + 1)) {
              instance.page = page - 1;
              instance.redraw();
            }
          }
        });

        next.click(function() {
          if ($(this).is('.ui-state-disabled')) return;
          instance.page += 1;
          instance.redraw();
        });

        last.click(function() {
          if ($(this).is('.ui-state-disabled')) return;
          instance.page = instance.pages - 1;
          instance.redraw();
        });

        toolbar.append(tbdiv.append(first).append(prev).append(input).append(next).append(last));
      }

      toolbar.find('.ui-button').removeClass('ui-state-disabled');

      if (this.page == 0) {
        first.addClass('ui-state-disabled');
        prev.addClass('ui-state-disabled');
      }

      if (this.page >= this.pages - 1) {
        next.addClass('ui-state-disabled');
        last.addClass('ui-state-disabled');
      }

      toolbar.find('input').val((instance.page + 1) + ' / ' + instance.pages);

    };

    this.filter = function() {
      return settings.url ?
               this.buffer.find('tr') :
               this.query ?
                 this.buffer.find('tr').filter(function(idx) { return $(this).text().match(instance.query); }) :
                 this.buffer.find('tr');
    };

    this.strcmp = function(text1, text2) {
      return text1 > text2 ? 1 : -1;
    };

    this.floatcmp = function(text1, text2) {
      var f1 = parseFloat(text1), f2 = parseFloat(text2);
      return f1 == f2 ? 0 : f1 > f2 ? 1 : -1;
    };

    this.datecmp = function(text1, text2) {
      var f1 = Date.parse(text1), f2 = Date.parse(text2);
      return f1 == f2 ? 0 : f1 > f2 ? 1 : -1;
    };

    this.getcolumn = function(tr, idx) {
      return $($(tr).find('td')[idx]).text();
    };

    this.build_sorter = function(fields) {
      return function(tr1, tr2) {
        var cmp = 0;
        var multipliers = {1: 0, 2: 1, 3: -1};
        $.each(fields, function(idx, arr) {
          var f = arr[0], dir = multipliers[arr[1]];
          var text1 = instance.getcolumn(tr1, f), text2 = instance.getcolumn(tr2, f);
          cmp = dir * (settings.sorters[f])(text1, text2);
          if (cmp != 0) return false;
        });

        return cmp;
      };
    };

    this.order = function(res) {
      var offset = this.page * this.limit;
      var sorter = this.build_sorter(this.sort_fields);
      return settings.url ?
        res :
        this.sort_fields.length > 0 ?
          res.sort(sorter).slice(offset, offset + this.limit) :
          res.slice(offset, offset + this.limit);
    };

    this.redraw = function() {
      return settings.url ? this.fetch() : this.load();
    };
  };

  $.fn.tables = function(options) {
    var key   = 'jquery.tables';
    var table = $(this).data(key);
    if (!table) {
      table = new JQueryTables(this, options);
      $(this).data(key, table);
      table.init();
    }

    return table;
  };

})(jQuery);
