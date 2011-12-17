$:.unshift File.dirname(__FILE__)

require 'gems/bundler/setup'
require 'sinatra/base'
require 'thin'
require 'yajl'

class Thin::Backends::Base
  def stop!
    @running  = false
    @stopping = false
    EM.stop if EM.reactor_running?
    Kernel.exit
  end
end

class MyApp < Sinatra::Base
  enable :static, :logging
  NAMES = %w(kevin claudia david sam)
  ROWS  = 62.times.map {|n| [n, "#{NAMES[rand(NAMES.size)]} #{n}", rand(30) + 16, Time.now + n]}
  PICS  = %w(
    http://farm7.staticflickr.com/6213/6243090894_8b8dd862cd_t.jpg
    http://farm7.staticflickr.com/6216/6240217938_aeed84634a_t.jpg
    http://farm1.staticflickr.com/37/94767733_b9863ff689_s.jpg
  )

  set :haml, format: :html5

  helpers do
    def quicksort rows
      fields = params[:sf].map(&:to_i).zip(params[:sd].map(&:to_i))
      rows.sort do |a, b|
        fields.reduce(0) {|v, (f, dir)| v == 0 && dir > 0 ? dir < 3 ? a[f] <=> b[f] : b[f] <=> a[f] : v}
      end
    end

    def filter rows
      rows.select {|row| "#{row.join(' ')}".match(params[:q])}
    end
  end

  get '/' do
    haml :index
  end

  get '/static' do
    haml :static
  end

  get %r{/dynamic-(?<format>json|html)} do |format|
    haml :"dynamic-#{format}"
  end

  get %r{/tables(?:.(?<format>json|html))?} do |format|
    @filtered = params[:q] ? filter(ROWS) : ROWS
    @filtered = quicksort(@filtered) if params[:sf]
    @data     = @filtered.slice(params[:offset].to_i, params[:limit].to_i)

    content_type(format || 'html')
    format == 'json' ? Yajl.dump(total: 93, filtered: @filtered.size, rows: @data) : haml(:'_tables', layout: false)
  end
end

run MyApp
