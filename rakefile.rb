require 'erb'
require 'ostruct'

def replace(name)
  dict[name]
end

task :build do
  FileList["lng/*.lng"].each do |f|
    dict = {}
    lang = f.split(".", 2)[0]
    
    File.open(f, "r") do |fin|
      while (line = fin.gets)
        it = line.split(":", 2)
        dict[it[0].strip] = it[1].strip
      end
    end

    os = OpenStruct.new(dict: dict)
    closure = os.instance_eval { binding }
    
    FileList["*.rhtml"].each do |f|
      template = File.open(f, "rb").read
      result = ERB.new(template).result(closure)
      rfile = f.rpartition(".")[0] + ".html"
      File.open(rfile, "wb").write(result)
    end

    # if (!lang.eql("default"))
    #   FileUtils.rm_r lang, :force
    #   FileUtils.cp_r 'lib/', site_ruby + '/mylib'
    # end

  end
end