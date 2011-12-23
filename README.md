# Yet another JQuery table plugin

![The Front End](https://github.com/deepfryed/jquery.tables.js/raw/master/public/art/jquery.tables.png)


## Example

```html
  <table id="mytable" data-url="/table-data">
    <thead>
      <tr>
        <th data-type="numeric">id</th>
        <th>name</th>
      </tr>
    </thead>
  </table>

  <script src='/js/jquery.tables.js' type='text/javascript'></script>
  <script type='text/javascript'>
    $(function() {
      $('#mytable').tables();
    });
  </script>
```

## Options (with defaults)

```
  url: null                           // remote url to fetch data, also respects the data-url attribute for TABLE
  items_per_page: [10, 20, 50, 100]   // display items per page
  sorters: null                       // sort comparison function for custom data types.
                                      //   1. you can provide a data-type attribute in TH for each column.
                                      //   2. by default, jquery.tables.js supports string and numeric types.
                                      //   3. to skip sorting for a column, just add a data-nosort="1" attribute to TH
  i8n:
    display: 'Display'
    first:    'first'
    previous: 'previous'
    next:     'next'
    last:     'last'
    pageinfo: 'Showing {s} to {e} of {t}'
    loading:  'LOADING DATA ...'
    error:    'ERROR LOADING DATA'
```

## XHR/AJAX requests

XHR/AJAX requests can return either a JSON or HTML response.


### JSON

The response needs to have 3 values: total, filtered and rows.

```json

  {total: 92, filtered: 2, rows: [["1", "abby"], ["2", "sam"]]}

```

### HTML

This needs a properly formatted HTML TABLE with the results inside a TBODY element. The total and filtered
data should be included as attributes for the TABLE.

```html
  <table data-total="92" data-filtered="2">
    <tbody>
      <tr>
        <td>1</td>
        <td>abby</td>
      </tr>
      <tr>
        <td>2</td>
        <td>sam</td>
      </tr>
    </tbody>
  </table>
```

## Demo

```
bundle --path gems --standalone --binstubs
./bin/thin -R config.ru start
```
and point your browser at http://localhost:3000/


## License

[Creative Commons Attribution - CC BY](http://creativecommons.org/licenses/by/3.0)
