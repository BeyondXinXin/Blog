自己属于客户端程序开发（Qt/c++），本来觉得自己永远用不到python的，有计算，解方程也是也是直接matlab算一下就可以。怎奈由于种种原因必须用python搞个东西（其使用qt也可以，明天写一个qt版本，图片信息可以直接保存进数据库）；这里记录下程序。

大概内容就是  
遍历删除文件
新建文件夹
读取图片，数据用二进制保存
把原始字节码编码成 base64 字节码 
将 base64 字节码解码成 utf-8 格式的字符串
用字典的形式保存数据
保存json文件

```python
# 初始化
from sys import argv
from base64 import b64encode
from json import dumps
ENCODING = 'utf-8'    # 指定编码形式

# 输入参数
SCRIPT_NAME,IMAGE_NAME = argv
print("\n\n"+SCRIPT_NAME+"\n\n")  

# 设置路径
import glob
import os
IMAGE_NAME_load=IMAGE_NAME+"/*.jpg"
IMAGE_NAME_save=IMAGE_NAME+"/"
JSON_NAME_save=IMAGE_NAME+"/json/"
#print(glob.glob(IMAGE_NAME_load))  
if os.path.exists(IMAGE_NAME_save):   
  paths = glob.glob(os.path.join(IMAGE_NAME_save, '*.jpg'))
  paths.sort()
else:
  print("Fail")  
  exit()

# 设置生成文件夹
if os.path.exists(JSON_NAME_save): 
  json_paths = glob.glob(os.path.join(JSON_NAME_save, '*.json'))
  for path in json_paths : 
    print("删除文件：  "+path)  
    os.remove(path)
  os.removedirs(JSON_NAME_save)
os.makedirs(JSON_NAME_save) 

# 迭代写入  
for path in paths : 
  print("------------------------------")  
  path_tmp,name_tmp = os.path.split(path); 
  print("输入文件：  "+path)  
  path_save=JSON_NAME_save+name_tmp[:-4]+".json"
  print("输出文件：  "+path_save)  
  
  with open(path, 'rb') as jpg_file:# 读取二进制图片，获得原始字节码，注意 'rb'
      byte_content = jpg_file.read() 
  base64_bytes = b64encode(byte_content) # 把原始字节码编码成 base64 字节码 
  base64_string = base64_bytes.decode(ENCODING) # 将 base64 字节码解码成 utf-8 格式的字符串

# 用字典的形式保存数据
  raw_data = {}
  shapes= {}
  points= {}
  raw_data["version"] = "3.16.7"
  raw_data["flags"] = {}
  raw_data["shapes"] = [shapes]
  shapes["label"]= "deom"
  shapes["line_color"]=[] 
  shapes["fill_color"]=[] 
  shapes["points"]=[
          [243.0,203.0],
          [253.0,198.0],
          [275.0,192.0],
          [304.0,201.0],
          [320.0,213.0],
          [325.0,221.0],
          [329.0,238.0],
          [327.0,259.0],
          [322.0,273.0],
          [311.0,286.0],
          [300.0,298.0],
          [283.0,313.0],
          [269.0,308.0],
          [251.0,308.0],
          [243.0,299.0],
          [234.0,302.0],
          [219.0,280.0],
          [213.0,275.0],
          [210.0,256.0],
          [210.0,237.0],
          [219.0,222.0]]
  shapes["shape_type"]= "polygon"
  shapes["flags"]= {}
  raw_data["lineColor"] = [0,255,0,12]
  raw_data["fillColor"] = [255,0,0,128]
  raw_data["imagePath"] = ""
  raw_data["imageData"] = base64_string
  raw_data["imageHeight"] = ""
  raw_data["imageWidth"] = ""
  json_data = dumps(raw_data, indent=2)
  with open(path_save, 'w') as json_file:
      json_file.write(json_data)
print("\n\n\n Success")  

```
