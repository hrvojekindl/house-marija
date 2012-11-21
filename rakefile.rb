require 'erb'
require 'ostruct'

def replace(name)
  dict[name]
end

task :build do
  buildir = "build"

  FileUtils.rm_rf Dir.glob(File.join(buildir, "/*"))

  FileList["phtml/*.phtml"].each do |lng_file|
    dict = {}
    lng = lng_file.split("/").last.split(".").first
    
    if !lng.eql?("default")
      FileUtils.mkdir File.join(buildir, lng)
    else
      lng = ""
    end
    
    File.open(lng_file, "r") do |lng_fin|
      while (line = lng_fin.gets)
        line.chomp!
        if !line.empty? && !line.start_with?("//")
          it = line.split(":", 2)          
          dict[it[0].strip] = it[1].strip
        end
      end
    end

    vars = OpenStruct.new(dict: dict)
    bind = vars.instance_eval { binding }
    
    FileList["*.thtml"].each do |rh_file|
      template = File.open(rh_file, "rb").read
      result = ERB.new(template).result(bind)
      fname = File.join(buildir, lng, rh_file.rpartition(".")[0] + ".html")
      File.open(fname, "wb").write(result)
    end

    ["css", "img", "js"].each do |dir|
      FileUtils.cp_r dir, File.join(buildir, lng, dir)
    end

  end
end