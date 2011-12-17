# Table plugin for JQuery

![The Front End](https://github.com/deepfryed/jquery.tables/raw/master/public/art/jquery.tables.png)


## Features

* handles both static html tables and dynamic content in json or html formats.
* check example ruby app for more details.

## Example

### JSON or HTML via XHR

``` html
    <!DOCTYPE html>
    <html lang='en-us' xml:lang='en-us' xmlns='http://www.w3.org/1999/xhtml'>
      <head>
        <link href='/css/jquery-ui.css' media='screen' rel='stylesheet' type='text/css'>
        <link href='/css/jquery.tables.css' media='screen' rel='stylesheet' type='text/css'>
        <script src='/js/jquery.min.js' type='text/javascript'></script>
        <script src='/js/jquery.tables.js' type='text/javascript'></script>
        <script>
          //<![CDATA[
            $(document).ready(function() {
              $('#test').bind('jqt-draw-done', function() { if (console) console.log('done rendering');});
              $('#test').tables();
            });
          //]]>
        </script>
      </head>
      <body>
        <table id='test' data-url='/table-data.json'>
          <thead>
            <tr>
              <th data-type='numeric'>id</th>
              <th>name</th>
              <th data-type='numeric'>age</th>
              <th>added</th>
            </tr>
          </thead>
          <tbody>
          </tbody>
        </table>
      </body>
    </html>
```

### Static HTML

``` html
    <!DOCTYPE html>
    <html lang='en-us' xml:lang='en-us' xmlns='http://www.w3.org/1999/xhtml'>
      <head>
        <link href='/css/jquery-ui.css' media='screen' rel='stylesheet' type='text/css'>
        <link href='/css/jquery.tables.css' media='screen' rel='stylesheet' type='text/css'>
        <script src='/js/jquery.min.js' type='text/javascript'></script>
        <script src='/js/jquery.tables.js' type='text/javascript'></script>
        <script>
          //<![CDATA[
            $(document).ready(function() {
              $('#test').bind('jqt-draw-done', function() { if (console) console.log('done rendering');});
              $('#test').tables();
            });
          //]]>
        </script>
      </head>
      <body>
        <table id='test'>
          <thead>
            <tr>
              <th data-type='numeric'>id</th>
              <th>name</th>
              <th data-type='numeric'>age</th>
              <th>added</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>0</td>
              <td>kevin 0</td>
              <td>30</td>
              <td>2011-12-17 18:03:08 +1100</td>
            </tr>
            <tr>
              <td>1</td>
              <td>david 1</td>
              <td>38</td>
              <td>2011-12-17 18:03:09 +1100</td>
            </tr>
            <tr>
              <td>2</td>
              <td>claudia 2</td>
              <td>35</td>
              <td>2011-12-17 18:03:10 +1100</td>
            </tr>
            <tr>
              <td>3</td>
              <td>kevin 3</td>
              <td>39</td>
              <td>2011-12-17 18:03:11 +1100</td>
            </tr>
            <tr>
              <td>4</td>
              <td>david 4</td>
              <td>37</td>
              <td>2011-12-17 18:03:12 +1100</td>
            </tr>
            <tr>
              <td>5</td>
              <td>david 5</td>
              <td>21</td>
              <td>2011-12-17 18:03:13 +1100</td>
            </tr>
            <tr>
              <td>6</td>
              <td>david 6</td>
              <td>21</td>
              <td>2011-12-17 18:03:14 +1100</td>
            </tr>
            <tr>
              <td>7</td>
              <td>david 7</td>
              <td>27</td>
              <td>2011-12-17 18:03:15 +1100</td>
            </tr>
            <tr>
              <td>8</td>
              <td>david 8</td>
              <td>40</td>
              <td>2011-12-17 18:03:16 +1100</td>
            </tr>
            <tr>
              <td>9</td>
              <td>sam 9</td>
              <td>21</td>
              <td>2011-12-17 18:03:17 +1100</td>
            </tr>
            <tr>
              <td>10</td>
              <td>david 10</td>
              <td>17</td>
              <td>2011-12-17 18:03:18 +1100</td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
```
