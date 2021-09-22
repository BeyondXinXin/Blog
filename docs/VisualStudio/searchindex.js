Object.assign(window.search, {"doc_urls":["index.html#visualstudio使用笔记","优化/停靠窗口布局修改后闪退（2017）.html#停靠窗口布局修改后闪退2017","Cmake/cmake工程：missing_and_no_known_rule_to_make_it.html#cmake工程missing-and-no-known-rule-to-make-it","MORE.html#更多"],"index":{"documentStore":{"docInfo":{"0":{"body":1,"breadcrumbs":2,"title":1},"1":{"body":3,"breadcrumbs":2,"title":1},"2":{"body":44,"breadcrumbs":9,"title":4},"3":{"body":0,"breadcrumbs":0,"title":0}},"docs":{"0":{"body":"很少用VisualStudio开发，但作为宇宙第一IDE还是需要掌握一下的。","breadcrumbs":"VisualStudio » VisualStudio使用笔记","id":"0","title":"VisualStudio使用笔记"},"1":{"body":"换工作了，最近使用vs开发。调式功能真的爽，不愧是宇宙第一。不过遇到个问题，不管是代码还是各种悬浮窗口，只要不是默认布局拖动就闪退，有点小郁闷。看了下大概原因是vs版本或者系统版本比较老。 我这里通过更新最新版本的 VS 可以解决问题 xxx","breadcrumbs":"优化 » 停靠窗口布局修改后闪退（2017） » 停靠窗口布局修改后闪退（2017）","id":"1","title":"停靠窗口布局修改后闪退（2017）"},"2":{"body":"最近研究 Visual Studio 直接使用cmake工程，总是遇到 missing and no known rule to make it 这个错误。报这个错误一般是指cmake路径错误，无法找到对应的规则。可是我确认自己这块没有问题。本来当随时vs默认安装的cmake版本有问题，也各种改和替换vs的默认调用工具。最后发现了问题： Visual Studio使用cmake会生成一个给vs自己解析的配置json文件。类似于Qt的.user，cmake-gui的tmpsetting。叫做 CMakeSettings.json，自动生成路径跟最顶层的CMakeLists.txt在一起。 { \"configurations\": [ { \"name\": \"x64-Release\", \"generator\": \"Ninja\", \"configurationType\": \"RelWithDebInfo\", \"inheritEnvironments\": [ \"msvc_x64_x64\" ], \"buildRoot\": \"${env.USERPROFILE}\\\\CMakeBuilds\\\\${workspaceHash}\\\\build\\\\${name}\", \"installRoot\": \"${env.USERPROFILE}\\\\CMakeBuilds\\\\${workspaceHash}\\\\install\\\\${name}\", \"cmakeCommandArgs\": \"\", \"buildCommandArgs\": \"-v\", \"ctestCommandArgs\": \"\" } ]\n} name ： 这个配置文件的名称 generator：构建工具，vs默认使用Ninja（可以替代make构建编译过程） configurationType：配置类型，默认是RelWithDebInfo，可我是要用Release呀。 inheritEnvironments：编译环境 buildRoot：编译文件目录 installRoot：编译结果目录 Args：cmake bulid ctest 参数 这里要改两个地方 configurationType改成 Release 或者 Debug cmakeCommandArgs -j12 改好了重新生成就可以了，还报错应该还是路径有问题，比如你的工程用了其他的第三方库，可是其他库没有编译成功。","breadcrumbs":"Cmake » cmake工程：missing and no known rule to make it » cmake工程：missing and no known rule to make it","id":"2","title":"cmake工程：missing and no known rule to make it"},"3":{"body":"","breadcrumbs":"更多 » 更多","id":"3","title":"更多"}},"length":4,"save":true},"fields":["title","body","breadcrumbs"],"index":{"body":{"root":{"2":{"0":{"1":{"7":{"df":1,"docs":{"1":{"tf":1.0}}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}},"a":{"df":0,"docs":{},"r":{"df":0,"docs":{},"g":{"df":0,"docs":{},"s":{"df":0,"docs":{},"：":{"c":{"df":0,"docs":{},"m":{"a":{"df":0,"docs":{},"k":{"df":1,"docs":{"2":{"tf":1.0}}}},"df":0,"docs":{}}},"df":0,"docs":{}}}}}},"b":{"df":0,"docs":{},"u":{"df":0,"docs":{},"i":{"df":0,"docs":{},"l":{"d":{"c":{"df":0,"docs":{},"o":{"df":0,"docs":{},"m":{"df":0,"docs":{},"m":{"a":{"df":0,"docs":{},"n":{"d":{"a":{"df":0,"docs":{},"r":{"df":0,"docs":{},"g":{"df":1,"docs":{"2":{"tf":1.0}}}}},"df":0,"docs":{}},"df":0,"docs":{}}},"df":0,"docs":{}}}}},"df":0,"docs":{},"r":{"df":0,"docs":{},"o":{"df":0,"docs":{},"o":{"df":0,"docs":{},"t":{"df":1,"docs":{"2":{"tf":1.4142135623730951}}}}}}},"df":0,"docs":{}}},"l":{"df":0,"docs":{},"i":{"d":{"df":1,"docs":{"2":{"tf":1.0}}},"df":0,"docs":{}}}}},"c":{"df":0,"docs":{},"m":{"a":{"df":0,"docs":{},"k":{"df":0,"docs":{},"e":{"c":{"df":0,"docs":{},"o":{"df":0,"docs":{},"m":{"df":0,"docs":{},"m":{"a":{"df":0,"docs":{},"n":{"d":{"a":{"df":0,"docs":{},"r":{"df":0,"docs":{},"g":{"df":1,"docs":{"2":{"tf":1.4142135623730951}}}}},"df":0,"docs":{}},"df":0,"docs":{}}},"df":0,"docs":{}}}}},"df":1,"docs":{"2":{"tf":1.0}},"s":{"df":0,"docs":{},"e":{"df":0,"docs":{},"t":{"df":0,"docs":{},"t":{"df":0,"docs":{},"i":{"df":0,"docs":{},"n":{"df":0,"docs":{},"g":{"df":0,"docs":{},"s":{".":{"df":0,"docs":{},"j":{"df":0,"docs":{},"s":{"df":0,"docs":{},"o":{"df":0,"docs":{},"n":{"df":0,"docs":{},"，":{"df":0,"docs":{},"自":{"df":0,"docs":{},"动":{"df":0,"docs":{},"生":{"df":0,"docs":{},"成":{"df":0,"docs":{},"路":{"df":0,"docs":{},"径":{"df":0,"docs":{},"跟":{"df":0,"docs":{},"最":{"df":0,"docs":{},"顶":{"df":0,"docs":{},"层":{"df":0,"docs":{},"的":{"c":{"df":0,"docs":{},"m":{"a":{"df":0,"docs":{},"k":{"df":0,"docs":{},"e":{"df":0,"docs":{},"l":{"df":0,"docs":{},"i":{"df":0,"docs":{},"s":{"df":0,"docs":{},"t":{"df":0,"docs":{},"s":{".":{"df":0,"docs":{},"t":{"df":0,"docs":{},"x":{"df":0,"docs":{},"t":{"df":1,"docs":{"2":{"tf":1.0}}}}}},"df":0,"docs":{}}}}}}}}},"df":0,"docs":{}}},"df":0,"docs":{}}}}}}}}}}}}}}}}}},"df":0,"docs":{}}}}}}}}},"工":{"df":0,"docs":{},"程":{"df":0,"docs":{},"：":{"df":0,"docs":{},"m":{"df":0,"docs":{},"i":{"df":0,"docs":{},"s":{"df":0,"docs":{},"s":{"df":1,"docs":{"2":{"tf":1.0}}}}}}}}},"路":{"df":0,"docs":{},"径":{"df":0,"docs":{},"错":{"df":0,"docs":{},"误":{"df":0,"docs":{},"，":{"df":0,"docs":{},"无":{"df":0,"docs":{},"法":{"df":0,"docs":{},"找":{"df":0,"docs":{},"到":{"df":0,"docs":{},"对":{"df":0,"docs":{},"应":{"df":0,"docs":{},"的":{"df":0,"docs":{},"规":{"df":0,"docs":{},"则":{"df":0,"docs":{},"。":{"df":0,"docs":{},"可":{"df":0,"docs":{},"是":{"df":0,"docs":{},"我":{"df":0,"docs":{},"确":{"df":0,"docs":{},"认":{"df":0,"docs":{},"自":{"df":0,"docs":{},"己":{"df":0,"docs":{},"这":{"df":0,"docs":{},"块":{"df":0,"docs":{},"没":{"df":0,"docs":{},"有":{"df":0,"docs":{},"问":{"df":0,"docs":{},"题":{"df":0,"docs":{},"。":{"df":0,"docs":{},"本":{"df":0,"docs":{},"来":{"df":0,"docs":{},"当":{"df":0,"docs":{},"随":{"df":0,"docs":{},"时":{"df":0,"docs":{},"v":{"df":0,"docs":{},"s":{"df":0,"docs":{},"默":{"df":0,"docs":{},"认":{"df":0,"docs":{},"安":{"df":0,"docs":{},"装":{"df":0,"docs":{},"的":{"c":{"df":0,"docs":{},"m":{"a":{"df":0,"docs":{},"k":{"df":0,"docs":{},"e":{"df":0,"docs":{},"版":{"df":0,"docs":{},"本":{"df":0,"docs":{},"有":{"df":0,"docs":{},"问":{"df":0,"docs":{},"题":{"df":0,"docs":{},"，":{"df":0,"docs":{},"也":{"df":0,"docs":{},"各":{"df":0,"docs":{},"种":{"df":0,"docs":{},"改":{"df":0,"docs":{},"和":{"df":0,"docs":{},"替":{"df":0,"docs":{},"换":{"df":0,"docs":{},"v":{"df":1,"docs":{"2":{"tf":1.0}}}}}}}}}}}}}}}}}}},"df":0,"docs":{}}},"df":0,"docs":{}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}},"df":0,"docs":{}},"o":{"df":0,"docs":{},"n":{"df":0,"docs":{},"f":{"df":0,"docs":{},"i":{"df":0,"docs":{},"g":{"df":0,"docs":{},"u":{"df":0,"docs":{},"r":{"a":{"df":0,"docs":{},"t":{"df":0,"docs":{},"i":{"df":0,"docs":{},"o":{"df":0,"docs":{},"n":{"df":0,"docs":{},"t":{"df":0,"docs":{},"y":{"df":0,"docs":{},"p":{"df":1,"docs":{"2":{"tf":1.4142135623730951}},"e":{"df":0,"docs":{},"：":{"df":0,"docs":{},"配":{"df":0,"docs":{},"置":{"df":0,"docs":{},"类":{"df":0,"docs":{},"型":{"df":0,"docs":{},"，":{"df":0,"docs":{},"默":{"df":0,"docs":{},"认":{"df":0,"docs":{},"是":{"df":0,"docs":{},"r":{"df":0,"docs":{},"e":{"df":0,"docs":{},"l":{"df":0,"docs":{},"w":{"df":0,"docs":{},"i":{"df":0,"docs":{},"t":{"df":0,"docs":{},"h":{"d":{"df":0,"docs":{},"e":{"b":{"df":0,"docs":{},"i":{"df":0,"docs":{},"n":{"df":0,"docs":{},"f":{"df":0,"docs":{},"o":{"df":0,"docs":{},"，":{"df":0,"docs":{},"可":{"df":0,"docs":{},"我":{"df":0,"docs":{},"是":{"df":0,"docs":{},"要":{"df":0,"docs":{},"用":{"df":0,"docs":{},"r":{"df":0,"docs":{},"e":{"df":0,"docs":{},"l":{"df":0,"docs":{},"e":{"a":{"df":0,"docs":{},"s":{"df":1,"docs":{"2":{"tf":1.0}}}},"df":0,"docs":{}}}}}}}}}}}}}}}},"df":0,"docs":{}}},"df":0,"docs":{}}}}}}}}}}}}}}}}}}}}}}}}}},"df":1,"docs":{"2":{"tf":1.0}}}}}}}}},"t":{"df":0,"docs":{},"e":{"df":0,"docs":{},"s":{"df":0,"docs":{},"t":{"c":{"df":0,"docs":{},"o":{"df":0,"docs":{},"m":{"df":0,"docs":{},"m":{"a":{"df":0,"docs":{},"n":{"d":{"a":{"df":0,"docs":{},"r":{"df":0,"docs":{},"g":{"df":1,"docs":{"2":{"tf":1.0}}}}},"df":0,"docs":{}},"df":0,"docs":{}}},"df":0,"docs":{}}}}},"df":1,"docs":{"2":{"tf":1.0}}}}}}},"d":{"df":0,"docs":{},"e":{"b":{"df":0,"docs":{},"u":{"df":0,"docs":{},"g":{"df":1,"docs":{"2":{"tf":1.0}}}}},"df":0,"docs":{}}},"df":0,"docs":{},"e":{"df":0,"docs":{},"n":{"df":0,"docs":{},"v":{".":{"df":0,"docs":{},"u":{"df":0,"docs":{},"s":{"df":0,"docs":{},"e":{"df":0,"docs":{},"r":{"df":0,"docs":{},"p":{"df":0,"docs":{},"r":{"df":0,"docs":{},"o":{"df":0,"docs":{},"f":{"df":0,"docs":{},"i":{"df":0,"docs":{},"l":{"df":0,"docs":{},"e":{"df":0,"docs":{},"}":{"\\":{"\\":{"c":{"df":0,"docs":{},"m":{"a":{"df":0,"docs":{},"k":{"df":0,"docs":{},"e":{"b":{"df":0,"docs":{},"u":{"df":0,"docs":{},"i":{"df":0,"docs":{},"l":{"d":{"df":0,"docs":{},"s":{"\\":{"\\":{"$":{"df":0,"docs":{},"{":{"df":0,"docs":{},"w":{"df":0,"docs":{},"o":{"df":0,"docs":{},"r":{"df":0,"docs":{},"k":{"df":0,"docs":{},"s":{"df":0,"docs":{},"p":{"a":{"c":{"df":0,"docs":{},"e":{"df":0,"docs":{},"h":{"a":{"df":0,"docs":{},"s":{"df":0,"docs":{},"h":{"df":0,"docs":{},"}":{"\\":{"\\":{"b":{"df":0,"docs":{},"u":{"df":0,"docs":{},"i":{"df":0,"docs":{},"l":{"d":{"\\":{"\\":{"$":{"df":0,"docs":{},"{":{"df":0,"docs":{},"n":{"a":{"df":0,"docs":{},"m":{"df":1,"docs":{"2":{"tf":1.0}}}},"df":0,"docs":{}}}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}}}}},"df":0,"docs":{},"i":{"df":0,"docs":{},"n":{"df":0,"docs":{},"s":{"df":0,"docs":{},"t":{"a":{"df":0,"docs":{},"l":{"df":0,"docs":{},"l":{"\\":{"\\":{"$":{"df":0,"docs":{},"{":{"df":0,"docs":{},"n":{"a":{"df":0,"docs":{},"m":{"df":1,"docs":{"2":{"tf":1.0}}}},"df":0,"docs":{}}}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}}}},"df":0,"docs":{}}}}}},"df":0,"docs":{}},"df":0,"docs":{}}}}},"df":0,"docs":{}}}},"df":0,"docs":{}},"df":0,"docs":{}}}}}}}}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}}},"df":0,"docs":{}}}}},"df":0,"docs":{}}}},"df":0,"docs":{}}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}}}}}}}}}}}}}},"df":0,"docs":{}}}},"g":{"df":0,"docs":{},"e":{"df":0,"docs":{},"n":{"df":0,"docs":{},"e":{"df":0,"docs":{},"r":{"a":{"df":0,"docs":{},"t":{"df":0,"docs":{},"o":{"df":0,"docs":{},"r":{"df":0,"docs":{},"：":{"df":0,"docs":{},"构":{"df":0,"docs":{},"建":{"df":0,"docs":{},"工":{"df":0,"docs":{},"具":{"df":0,"docs":{},"，":{"df":0,"docs":{},"v":{"df":0,"docs":{},"s":{"df":0,"docs":{},"默":{"df":0,"docs":{},"认":{"df":0,"docs":{},"使":{"df":0,"docs":{},"用":{"df":0,"docs":{},"n":{"df":0,"docs":{},"i":{"df":0,"docs":{},"n":{"df":0,"docs":{},"j":{"a":{"df":0,"docs":{},"（":{"df":0,"docs":{},"可":{"df":0,"docs":{},"以":{"df":0,"docs":{},"替":{"df":0,"docs":{},"代":{"df":0,"docs":{},"m":{"a":{"df":0,"docs":{},"k":{"df":1,"docs":{"2":{"tf":1.0}}}},"df":0,"docs":{}}}}}}}},"df":0,"docs":{}}}}}}}}}}}}}}}}}}}}},"df":1,"docs":{"2":{"tf":1.0}}}}}},"u":{"df":0,"docs":{},"i":{"df":0,"docs":{},"的":{"df":0,"docs":{},"t":{"df":0,"docs":{},"m":{"df":0,"docs":{},"p":{"df":0,"docs":{},"s":{"df":0,"docs":{},"e":{"df":0,"docs":{},"t":{"df":1,"docs":{"2":{"tf":1.0}}}}}}}}}}}},"i":{"df":0,"docs":{},"n":{"df":0,"docs":{},"h":{"df":0,"docs":{},"e":{"df":0,"docs":{},"r":{"df":0,"docs":{},"i":{"df":0,"docs":{},"t":{"df":0,"docs":{},"e":{"df":0,"docs":{},"n":{"df":0,"docs":{},"v":{"df":0,"docs":{},"i":{"df":0,"docs":{},"r":{"df":0,"docs":{},"o":{"df":0,"docs":{},"n":{"df":1,"docs":{"2":{"tf":1.4142135623730951}}}}}}}}}}}}}},"s":{"df":0,"docs":{},"t":{"a":{"df":0,"docs":{},"l":{"df":0,"docs":{},"l":{"df":0,"docs":{},"r":{"df":0,"docs":{},"o":{"df":0,"docs":{},"o":{"df":0,"docs":{},"t":{"df":1,"docs":{"2":{"tf":1.4142135623730951}}}}}}}}},"df":0,"docs":{}}}}},"j":{"1":{"2":{"df":1,"docs":{"2":{"tf":1.0}}},"df":0,"docs":{}},"df":0,"docs":{}},"k":{"df":0,"docs":{},"n":{"df":0,"docs":{},"o":{"df":0,"docs":{},"w":{"df":0,"docs":{},"n":{"df":1,"docs":{"2":{"tf":1.4142135623730951}}}}}}},"m":{"a":{"df":0,"docs":{},"k":{"df":0,"docs":{},"e":{"df":1,"docs":{"2":{"tf":1.4142135623730951}}}}},"df":0,"docs":{},"i":{"df":0,"docs":{},"s":{"df":0,"docs":{},"s":{"df":1,"docs":{"2":{"tf":1.0}}}}},"s":{"df":0,"docs":{},"v":{"c":{"_":{"df":0,"docs":{},"x":{"6":{"4":{"_":{"df":0,"docs":{},"x":{"6":{"4":{"df":1,"docs":{"2":{"tf":1.0}}},"df":0,"docs":{}},"df":0,"docs":{}}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}}},"df":0,"docs":{}},"df":0,"docs":{}}}},"n":{"a":{"df":0,"docs":{},"m":{"df":0,"docs":{},"e":{"df":1,"docs":{"2":{"tf":1.4142135623730951}}}}},"df":0,"docs":{},"i":{"df":0,"docs":{},"n":{"df":0,"docs":{},"j":{"a":{"df":1,"docs":{"2":{"tf":1.0}}},"df":0,"docs":{}}}}},"r":{"df":0,"docs":{},"e":{"df":0,"docs":{},"l":{"df":0,"docs":{},"e":{"a":{"df":0,"docs":{},"s":{"df":1,"docs":{"2":{"tf":1.4142135623730951}}}},"df":0,"docs":{}},"w":{"df":0,"docs":{},"i":{"df":0,"docs":{},"t":{"df":0,"docs":{},"h":{"d":{"df":0,"docs":{},"e":{"b":{"df":0,"docs":{},"i":{"df":0,"docs":{},"n":{"df":0,"docs":{},"f":{"df":0,"docs":{},"o":{"df":1,"docs":{"2":{"tf":1.0}}}}}}},"df":0,"docs":{}}},"df":0,"docs":{}}}}}}},"u":{"df":0,"docs":{},"l":{"df":0,"docs":{},"e":{"df":1,"docs":{"2":{"tf":1.4142135623730951}}}}}},"s":{"df":0,"docs":{},"t":{"df":0,"docs":{},"u":{"d":{"df":0,"docs":{},"i":{"df":0,"docs":{},"o":{"df":1,"docs":{"2":{"tf":1.0}},"使":{"df":0,"docs":{},"用":{"c":{"df":0,"docs":{},"m":{"a":{"df":0,"docs":{},"k":{"df":0,"docs":{},"e":{"df":0,"docs":{},"会":{"df":0,"docs":{},"生":{"df":0,"docs":{},"成":{"df":0,"docs":{},"一":{"df":0,"docs":{},"个":{"df":0,"docs":{},"给":{"df":0,"docs":{},"v":{"df":0,"docs":{},"s":{"df":0,"docs":{},"自":{"df":0,"docs":{},"己":{"df":0,"docs":{},"解":{"df":0,"docs":{},"析":{"df":0,"docs":{},"的":{"df":0,"docs":{},"配":{"df":0,"docs":{},"置":{"df":0,"docs":{},"j":{"df":0,"docs":{},"s":{"df":0,"docs":{},"o":{"df":0,"docs":{},"n":{"df":0,"docs":{},"文":{"df":0,"docs":{},"件":{"df":0,"docs":{},"。":{"df":0,"docs":{},"类":{"df":0,"docs":{},"似":{"df":0,"docs":{},"于":{"df":0,"docs":{},"q":{"df":0,"docs":{},"t":{"df":0,"docs":{},"的":{".":{"df":0,"docs":{},"u":{"df":0,"docs":{},"s":{"df":0,"docs":{},"e":{"df":0,"docs":{},"r":{"df":0,"docs":{},"，":{"c":{"df":0,"docs":{},"m":{"a":{"df":0,"docs":{},"k":{"df":1,"docs":{"2":{"tf":1.0}}}},"df":0,"docs":{}}},"df":0,"docs":{}}}}}}},"df":0,"docs":{}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}},"df":0,"docs":{}}},"df":0,"docs":{}}}}}},"df":0,"docs":{}}}},"v":{"df":1,"docs":{"2":{"tf":1.0}},"i":{"df":0,"docs":{},"s":{"df":0,"docs":{},"u":{"a":{"df":0,"docs":{},"l":{"df":1,"docs":{"2":{"tf":1.4142135623730951}},"s":{"df":0,"docs":{},"t":{"df":0,"docs":{},"u":{"d":{"df":0,"docs":{},"i":{"df":0,"docs":{},"o":{"df":1,"docs":{"0":{"tf":1.0}},"开":{"df":0,"docs":{},"发":{"df":0,"docs":{},"，":{"df":0,"docs":{},"但":{"df":0,"docs":{},"作":{"df":0,"docs":{},"为":{"df":0,"docs":{},"宇":{"df":0,"docs":{},"宙":{"df":0,"docs":{},"第":{"df":0,"docs":{},"一":{"df":0,"docs":{},"i":{"d":{"df":1,"docs":{"0":{"tf":1.0}}},"df":0,"docs":{}}}}}}}}}}}}}}},"df":0,"docs":{}}}}}},"df":0,"docs":{}}}},"s":{"df":1,"docs":{"1":{"tf":1.0}},"开":{"df":0,"docs":{},"发":{"df":0,"docs":{},"。":{"df":0,"docs":{},"调":{"df":0,"docs":{},"式":{"df":0,"docs":{},"功":{"df":0,"docs":{},"能":{"df":0,"docs":{},"真":{"df":0,"docs":{},"的":{"df":0,"docs":{},"爽":{"df":0,"docs":{},"，":{"df":0,"docs":{},"不":{"df":0,"docs":{},"愧":{"df":0,"docs":{},"是":{"df":0,"docs":{},"宇":{"df":0,"docs":{},"宙":{"df":0,"docs":{},"第":{"df":0,"docs":{},"一":{"df":0,"docs":{},"。":{"df":0,"docs":{},"不":{"df":0,"docs":{},"过":{"df":0,"docs":{},"遇":{"df":0,"docs":{},"到":{"df":0,"docs":{},"个":{"df":0,"docs":{},"问":{"df":0,"docs":{},"题":{"df":0,"docs":{},"，":{"df":0,"docs":{},"不":{"df":0,"docs":{},"管":{"df":0,"docs":{},"是":{"df":0,"docs":{},"代":{"df":0,"docs":{},"码":{"df":0,"docs":{},"还":{"df":0,"docs":{},"是":{"df":0,"docs":{},"各":{"df":0,"docs":{},"种":{"df":0,"docs":{},"悬":{"df":0,"docs":{},"浮":{"df":0,"docs":{},"窗":{"df":0,"docs":{},"口":{"df":0,"docs":{},"，":{"df":0,"docs":{},"只":{"df":0,"docs":{},"要":{"df":0,"docs":{},"不":{"df":0,"docs":{},"是":{"df":0,"docs":{},"默":{"df":0,"docs":{},"认":{"df":0,"docs":{},"布":{"df":0,"docs":{},"局":{"df":0,"docs":{},"拖":{"df":0,"docs":{},"动":{"df":0,"docs":{},"就":{"df":0,"docs":{},"闪":{"df":0,"docs":{},"退":{"df":0,"docs":{},"，":{"df":0,"docs":{},"有":{"df":0,"docs":{},"点":{"df":0,"docs":{},"小":{"df":0,"docs":{},"郁":{"df":0,"docs":{},"闷":{"df":0,"docs":{},"。":{"df":0,"docs":{},"看":{"df":0,"docs":{},"了":{"df":0,"docs":{},"下":{"df":0,"docs":{},"大":{"df":0,"docs":{},"概":{"df":0,"docs":{},"原":{"df":0,"docs":{},"因":{"df":0,"docs":{},"是":{"df":0,"docs":{},"v":{"df":1,"docs":{"1":{"tf":1.0}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}},"x":{"6":{"4":{"df":1,"docs":{"2":{"tf":1.0}}},"df":0,"docs":{}},"df":0,"docs":{},"x":{"df":0,"docs":{},"x":{"df":1,"docs":{"1":{"tf":1.0}}}}}}},"breadcrumbs":{"root":{"2":{"0":{"1":{"7":{"df":1,"docs":{"1":{"tf":1.7320508075688772}}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}},"a":{"df":0,"docs":{},"r":{"df":0,"docs":{},"g":{"df":0,"docs":{},"s":{"df":0,"docs":{},"：":{"c":{"df":0,"docs":{},"m":{"a":{"df":0,"docs":{},"k":{"df":1,"docs":{"2":{"tf":1.0}}}},"df":0,"docs":{}}},"df":0,"docs":{}}}}}},"b":{"df":0,"docs":{},"u":{"df":0,"docs":{},"i":{"df":0,"docs":{},"l":{"d":{"c":{"df":0,"docs":{},"o":{"df":0,"docs":{},"m":{"df":0,"docs":{},"m":{"a":{"df":0,"docs":{},"n":{"d":{"a":{"df":0,"docs":{},"r":{"df":0,"docs":{},"g":{"df":1,"docs":{"2":{"tf":1.0}}}}},"df":0,"docs":{}},"df":0,"docs":{}}},"df":0,"docs":{}}}}},"df":0,"docs":{},"r":{"df":0,"docs":{},"o":{"df":0,"docs":{},"o":{"df":0,"docs":{},"t":{"df":1,"docs":{"2":{"tf":1.4142135623730951}}}}}}},"df":0,"docs":{}}},"l":{"df":0,"docs":{},"i":{"d":{"df":1,"docs":{"2":{"tf":1.0}}},"df":0,"docs":{}}}}},"c":{"df":0,"docs":{},"m":{"a":{"df":0,"docs":{},"k":{"df":0,"docs":{},"e":{"c":{"df":0,"docs":{},"o":{"df":0,"docs":{},"m":{"df":0,"docs":{},"m":{"a":{"df":0,"docs":{},"n":{"d":{"a":{"df":0,"docs":{},"r":{"df":0,"docs":{},"g":{"df":1,"docs":{"2":{"tf":1.4142135623730951}}}}},"df":0,"docs":{}},"df":0,"docs":{}}},"df":0,"docs":{}}}}},"df":1,"docs":{"2":{"tf":1.4142135623730951}},"s":{"df":0,"docs":{},"e":{"df":0,"docs":{},"t":{"df":0,"docs":{},"t":{"df":0,"docs":{},"i":{"df":0,"docs":{},"n":{"df":0,"docs":{},"g":{"df":0,"docs":{},"s":{".":{"df":0,"docs":{},"j":{"df":0,"docs":{},"s":{"df":0,"docs":{},"o":{"df":0,"docs":{},"n":{"df":0,"docs":{},"，":{"df":0,"docs":{},"自":{"df":0,"docs":{},"动":{"df":0,"docs":{},"生":{"df":0,"docs":{},"成":{"df":0,"docs":{},"路":{"df":0,"docs":{},"径":{"df":0,"docs":{},"跟":{"df":0,"docs":{},"最":{"df":0,"docs":{},"顶":{"df":0,"docs":{},"层":{"df":0,"docs":{},"的":{"c":{"df":0,"docs":{},"m":{"a":{"df":0,"docs":{},"k":{"df":0,"docs":{},"e":{"df":0,"docs":{},"l":{"df":0,"docs":{},"i":{"df":0,"docs":{},"s":{"df":0,"docs":{},"t":{"df":0,"docs":{},"s":{".":{"df":0,"docs":{},"t":{"df":0,"docs":{},"x":{"df":0,"docs":{},"t":{"df":1,"docs":{"2":{"tf":1.0}}}}}},"df":0,"docs":{}}}}}}}}},"df":0,"docs":{}}},"df":0,"docs":{}}}}}}}}}}}}}}}}}},"df":0,"docs":{}}}}}}}}},"工":{"df":0,"docs":{},"程":{"df":0,"docs":{},"：":{"df":0,"docs":{},"m":{"df":0,"docs":{},"i":{"df":0,"docs":{},"s":{"df":0,"docs":{},"s":{"df":1,"docs":{"2":{"tf":1.7320508075688772}}}}}}}}},"路":{"df":0,"docs":{},"径":{"df":0,"docs":{},"错":{"df":0,"docs":{},"误":{"df":0,"docs":{},"，":{"df":0,"docs":{},"无":{"df":0,"docs":{},"法":{"df":0,"docs":{},"找":{"df":0,"docs":{},"到":{"df":0,"docs":{},"对":{"df":0,"docs":{},"应":{"df":0,"docs":{},"的":{"df":0,"docs":{},"规":{"df":0,"docs":{},"则":{"df":0,"docs":{},"。":{"df":0,"docs":{},"可":{"df":0,"docs":{},"是":{"df":0,"docs":{},"我":{"df":0,"docs":{},"确":{"df":0,"docs":{},"认":{"df":0,"docs":{},"自":{"df":0,"docs":{},"己":{"df":0,"docs":{},"这":{"df":0,"docs":{},"块":{"df":0,"docs":{},"没":{"df":0,"docs":{},"有":{"df":0,"docs":{},"问":{"df":0,"docs":{},"题":{"df":0,"docs":{},"。":{"df":0,"docs":{},"本":{"df":0,"docs":{},"来":{"df":0,"docs":{},"当":{"df":0,"docs":{},"随":{"df":0,"docs":{},"时":{"df":0,"docs":{},"v":{"df":0,"docs":{},"s":{"df":0,"docs":{},"默":{"df":0,"docs":{},"认":{"df":0,"docs":{},"安":{"df":0,"docs":{},"装":{"df":0,"docs":{},"的":{"c":{"df":0,"docs":{},"m":{"a":{"df":0,"docs":{},"k":{"df":0,"docs":{},"e":{"df":0,"docs":{},"版":{"df":0,"docs":{},"本":{"df":0,"docs":{},"有":{"df":0,"docs":{},"问":{"df":0,"docs":{},"题":{"df":0,"docs":{},"，":{"df":0,"docs":{},"也":{"df":0,"docs":{},"各":{"df":0,"docs":{},"种":{"df":0,"docs":{},"改":{"df":0,"docs":{},"和":{"df":0,"docs":{},"替":{"df":0,"docs":{},"换":{"df":0,"docs":{},"v":{"df":1,"docs":{"2":{"tf":1.0}}}}}}}}}}}}}}}}}}},"df":0,"docs":{}}},"df":0,"docs":{}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}},"df":0,"docs":{}},"o":{"df":0,"docs":{},"n":{"df":0,"docs":{},"f":{"df":0,"docs":{},"i":{"df":0,"docs":{},"g":{"df":0,"docs":{},"u":{"df":0,"docs":{},"r":{"a":{"df":0,"docs":{},"t":{"df":0,"docs":{},"i":{"df":0,"docs":{},"o":{"df":0,"docs":{},"n":{"df":0,"docs":{},"t":{"df":0,"docs":{},"y":{"df":0,"docs":{},"p":{"df":1,"docs":{"2":{"tf":1.4142135623730951}},"e":{"df":0,"docs":{},"：":{"df":0,"docs":{},"配":{"df":0,"docs":{},"置":{"df":0,"docs":{},"类":{"df":0,"docs":{},"型":{"df":0,"docs":{},"，":{"df":0,"docs":{},"默":{"df":0,"docs":{},"认":{"df":0,"docs":{},"是":{"df":0,"docs":{},"r":{"df":0,"docs":{},"e":{"df":0,"docs":{},"l":{"df":0,"docs":{},"w":{"df":0,"docs":{},"i":{"df":0,"docs":{},"t":{"df":0,"docs":{},"h":{"d":{"df":0,"docs":{},"e":{"b":{"df":0,"docs":{},"i":{"df":0,"docs":{},"n":{"df":0,"docs":{},"f":{"df":0,"docs":{},"o":{"df":0,"docs":{},"，":{"df":0,"docs":{},"可":{"df":0,"docs":{},"我":{"df":0,"docs":{},"是":{"df":0,"docs":{},"要":{"df":0,"docs":{},"用":{"df":0,"docs":{},"r":{"df":0,"docs":{},"e":{"df":0,"docs":{},"l":{"df":0,"docs":{},"e":{"a":{"df":0,"docs":{},"s":{"df":1,"docs":{"2":{"tf":1.0}}}},"df":0,"docs":{}}}}}}}}}}}}}}}},"df":0,"docs":{}}},"df":0,"docs":{}}}}}}}}}}}}}}}}}}}}}}}}}},"df":1,"docs":{"2":{"tf":1.0}}}}}}}}},"t":{"df":0,"docs":{},"e":{"df":0,"docs":{},"s":{"df":0,"docs":{},"t":{"c":{"df":0,"docs":{},"o":{"df":0,"docs":{},"m":{"df":0,"docs":{},"m":{"a":{"df":0,"docs":{},"n":{"d":{"a":{"df":0,"docs":{},"r":{"df":0,"docs":{},"g":{"df":1,"docs":{"2":{"tf":1.0}}}}},"df":0,"docs":{}},"df":0,"docs":{}}},"df":0,"docs":{}}}}},"df":1,"docs":{"2":{"tf":1.0}}}}}}},"d":{"df":0,"docs":{},"e":{"b":{"df":0,"docs":{},"u":{"df":0,"docs":{},"g":{"df":1,"docs":{"2":{"tf":1.0}}}}},"df":0,"docs":{}}},"df":0,"docs":{},"e":{"df":0,"docs":{},"n":{"df":0,"docs":{},"v":{".":{"df":0,"docs":{},"u":{"df":0,"docs":{},"s":{"df":0,"docs":{},"e":{"df":0,"docs":{},"r":{"df":0,"docs":{},"p":{"df":0,"docs":{},"r":{"df":0,"docs":{},"o":{"df":0,"docs":{},"f":{"df":0,"docs":{},"i":{"df":0,"docs":{},"l":{"df":0,"docs":{},"e":{"df":0,"docs":{},"}":{"\\":{"\\":{"c":{"df":0,"docs":{},"m":{"a":{"df":0,"docs":{},"k":{"df":0,"docs":{},"e":{"b":{"df":0,"docs":{},"u":{"df":0,"docs":{},"i":{"df":0,"docs":{},"l":{"d":{"df":0,"docs":{},"s":{"\\":{"\\":{"$":{"df":0,"docs":{},"{":{"df":0,"docs":{},"w":{"df":0,"docs":{},"o":{"df":0,"docs":{},"r":{"df":0,"docs":{},"k":{"df":0,"docs":{},"s":{"df":0,"docs":{},"p":{"a":{"c":{"df":0,"docs":{},"e":{"df":0,"docs":{},"h":{"a":{"df":0,"docs":{},"s":{"df":0,"docs":{},"h":{"df":0,"docs":{},"}":{"\\":{"\\":{"b":{"df":0,"docs":{},"u":{"df":0,"docs":{},"i":{"df":0,"docs":{},"l":{"d":{"\\":{"\\":{"$":{"df":0,"docs":{},"{":{"df":0,"docs":{},"n":{"a":{"df":0,"docs":{},"m":{"df":1,"docs":{"2":{"tf":1.0}}}},"df":0,"docs":{}}}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}}}}},"df":0,"docs":{},"i":{"df":0,"docs":{},"n":{"df":0,"docs":{},"s":{"df":0,"docs":{},"t":{"a":{"df":0,"docs":{},"l":{"df":0,"docs":{},"l":{"\\":{"\\":{"$":{"df":0,"docs":{},"{":{"df":0,"docs":{},"n":{"a":{"df":0,"docs":{},"m":{"df":1,"docs":{"2":{"tf":1.0}}}},"df":0,"docs":{}}}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}}}},"df":0,"docs":{}}}}}},"df":0,"docs":{}},"df":0,"docs":{}}}}},"df":0,"docs":{}}}},"df":0,"docs":{}},"df":0,"docs":{}}}}}}}}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}}},"df":0,"docs":{}}}}},"df":0,"docs":{}}}},"df":0,"docs":{}}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}}}}}}}}}}}}}},"df":0,"docs":{}}}},"g":{"df":0,"docs":{},"e":{"df":0,"docs":{},"n":{"df":0,"docs":{},"e":{"df":0,"docs":{},"r":{"a":{"df":0,"docs":{},"t":{"df":0,"docs":{},"o":{"df":0,"docs":{},"r":{"df":0,"docs":{},"：":{"df":0,"docs":{},"构":{"df":0,"docs":{},"建":{"df":0,"docs":{},"工":{"df":0,"docs":{},"具":{"df":0,"docs":{},"，":{"df":0,"docs":{},"v":{"df":0,"docs":{},"s":{"df":0,"docs":{},"默":{"df":0,"docs":{},"认":{"df":0,"docs":{},"使":{"df":0,"docs":{},"用":{"df":0,"docs":{},"n":{"df":0,"docs":{},"i":{"df":0,"docs":{},"n":{"df":0,"docs":{},"j":{"a":{"df":0,"docs":{},"（":{"df":0,"docs":{},"可":{"df":0,"docs":{},"以":{"df":0,"docs":{},"替":{"df":0,"docs":{},"代":{"df":0,"docs":{},"m":{"a":{"df":0,"docs":{},"k":{"df":1,"docs":{"2":{"tf":1.0}}}},"df":0,"docs":{}}}}}}}},"df":0,"docs":{}}}}}}}}}}}}}}}}}}}}},"df":1,"docs":{"2":{"tf":1.0}}}}}},"u":{"df":0,"docs":{},"i":{"df":0,"docs":{},"的":{"df":0,"docs":{},"t":{"df":0,"docs":{},"m":{"df":0,"docs":{},"p":{"df":0,"docs":{},"s":{"df":0,"docs":{},"e":{"df":0,"docs":{},"t":{"df":1,"docs":{"2":{"tf":1.0}}}}}}}}}}}},"i":{"df":0,"docs":{},"n":{"df":0,"docs":{},"h":{"df":0,"docs":{},"e":{"df":0,"docs":{},"r":{"df":0,"docs":{},"i":{"df":0,"docs":{},"t":{"df":0,"docs":{},"e":{"df":0,"docs":{},"n":{"df":0,"docs":{},"v":{"df":0,"docs":{},"i":{"df":0,"docs":{},"r":{"df":0,"docs":{},"o":{"df":0,"docs":{},"n":{"df":1,"docs":{"2":{"tf":1.4142135623730951}}}}}}}}}}}}}},"s":{"df":0,"docs":{},"t":{"a":{"df":0,"docs":{},"l":{"df":0,"docs":{},"l":{"df":0,"docs":{},"r":{"df":0,"docs":{},"o":{"df":0,"docs":{},"o":{"df":0,"docs":{},"t":{"df":1,"docs":{"2":{"tf":1.4142135623730951}}}}}}}}},"df":0,"docs":{}}}}},"j":{"1":{"2":{"df":1,"docs":{"2":{"tf":1.0}}},"df":0,"docs":{}},"df":0,"docs":{}},"k":{"df":0,"docs":{},"n":{"df":0,"docs":{},"o":{"df":0,"docs":{},"w":{"df":0,"docs":{},"n":{"df":1,"docs":{"2":{"tf":2.0}}}}}}},"m":{"a":{"df":0,"docs":{},"k":{"df":0,"docs":{},"e":{"df":1,"docs":{"2":{"tf":2.0}}}}},"df":0,"docs":{},"i":{"df":0,"docs":{},"s":{"df":0,"docs":{},"s":{"df":1,"docs":{"2":{"tf":1.0}}}}},"s":{"df":0,"docs":{},"v":{"c":{"_":{"df":0,"docs":{},"x":{"6":{"4":{"_":{"df":0,"docs":{},"x":{"6":{"4":{"df":1,"docs":{"2":{"tf":1.0}}},"df":0,"docs":{}},"df":0,"docs":{}}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}}},"df":0,"docs":{}},"df":0,"docs":{}}}},"n":{"a":{"df":0,"docs":{},"m":{"df":0,"docs":{},"e":{"df":1,"docs":{"2":{"tf":1.4142135623730951}}}}},"df":0,"docs":{},"i":{"df":0,"docs":{},"n":{"df":0,"docs":{},"j":{"a":{"df":1,"docs":{"2":{"tf":1.0}}},"df":0,"docs":{}}}}},"r":{"df":0,"docs":{},"e":{"df":0,"docs":{},"l":{"df":0,"docs":{},"e":{"a":{"df":0,"docs":{},"s":{"df":1,"docs":{"2":{"tf":1.4142135623730951}}}},"df":0,"docs":{}},"w":{"df":0,"docs":{},"i":{"df":0,"docs":{},"t":{"df":0,"docs":{},"h":{"d":{"df":0,"docs":{},"e":{"b":{"df":0,"docs":{},"i":{"df":0,"docs":{},"n":{"df":0,"docs":{},"f":{"df":0,"docs":{},"o":{"df":1,"docs":{"2":{"tf":1.0}}}}}}},"df":0,"docs":{}}},"df":0,"docs":{}}}}}}},"u":{"df":0,"docs":{},"l":{"df":0,"docs":{},"e":{"df":1,"docs":{"2":{"tf":2.0}}}}}},"s":{"df":0,"docs":{},"t":{"df":0,"docs":{},"u":{"d":{"df":0,"docs":{},"i":{"df":0,"docs":{},"o":{"df":1,"docs":{"2":{"tf":1.0}},"使":{"df":0,"docs":{},"用":{"c":{"df":0,"docs":{},"m":{"a":{"df":0,"docs":{},"k":{"df":0,"docs":{},"e":{"df":0,"docs":{},"会":{"df":0,"docs":{},"生":{"df":0,"docs":{},"成":{"df":0,"docs":{},"一":{"df":0,"docs":{},"个":{"df":0,"docs":{},"给":{"df":0,"docs":{},"v":{"df":0,"docs":{},"s":{"df":0,"docs":{},"自":{"df":0,"docs":{},"己":{"df":0,"docs":{},"解":{"df":0,"docs":{},"析":{"df":0,"docs":{},"的":{"df":0,"docs":{},"配":{"df":0,"docs":{},"置":{"df":0,"docs":{},"j":{"df":0,"docs":{},"s":{"df":0,"docs":{},"o":{"df":0,"docs":{},"n":{"df":0,"docs":{},"文":{"df":0,"docs":{},"件":{"df":0,"docs":{},"。":{"df":0,"docs":{},"类":{"df":0,"docs":{},"似":{"df":0,"docs":{},"于":{"df":0,"docs":{},"q":{"df":0,"docs":{},"t":{"df":0,"docs":{},"的":{".":{"df":0,"docs":{},"u":{"df":0,"docs":{},"s":{"df":0,"docs":{},"e":{"df":0,"docs":{},"r":{"df":0,"docs":{},"，":{"c":{"df":0,"docs":{},"m":{"a":{"df":0,"docs":{},"k":{"df":1,"docs":{"2":{"tf":1.0}}}},"df":0,"docs":{}}},"df":0,"docs":{}}}}}}},"df":0,"docs":{}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}},"df":0,"docs":{}}},"df":0,"docs":{}}}}}},"df":0,"docs":{}}}},"v":{"df":1,"docs":{"2":{"tf":1.0}},"i":{"df":0,"docs":{},"s":{"df":0,"docs":{},"u":{"a":{"df":0,"docs":{},"l":{"df":1,"docs":{"2":{"tf":1.4142135623730951}},"s":{"df":0,"docs":{},"t":{"df":0,"docs":{},"u":{"d":{"df":0,"docs":{},"i":{"df":0,"docs":{},"o":{"df":1,"docs":{"0":{"tf":1.7320508075688772}},"开":{"df":0,"docs":{},"发":{"df":0,"docs":{},"，":{"df":0,"docs":{},"但":{"df":0,"docs":{},"作":{"df":0,"docs":{},"为":{"df":0,"docs":{},"宇":{"df":0,"docs":{},"宙":{"df":0,"docs":{},"第":{"df":0,"docs":{},"一":{"df":0,"docs":{},"i":{"d":{"df":1,"docs":{"0":{"tf":1.0}}},"df":0,"docs":{}}}}}}}}}}}}}}},"df":0,"docs":{}}}}}},"df":0,"docs":{}}}},"s":{"df":1,"docs":{"1":{"tf":1.0}},"开":{"df":0,"docs":{},"发":{"df":0,"docs":{},"。":{"df":0,"docs":{},"调":{"df":0,"docs":{},"式":{"df":0,"docs":{},"功":{"df":0,"docs":{},"能":{"df":0,"docs":{},"真":{"df":0,"docs":{},"的":{"df":0,"docs":{},"爽":{"df":0,"docs":{},"，":{"df":0,"docs":{},"不":{"df":0,"docs":{},"愧":{"df":0,"docs":{},"是":{"df":0,"docs":{},"宇":{"df":0,"docs":{},"宙":{"df":0,"docs":{},"第":{"df":0,"docs":{},"一":{"df":0,"docs":{},"。":{"df":0,"docs":{},"不":{"df":0,"docs":{},"过":{"df":0,"docs":{},"遇":{"df":0,"docs":{},"到":{"df":0,"docs":{},"个":{"df":0,"docs":{},"问":{"df":0,"docs":{},"题":{"df":0,"docs":{},"，":{"df":0,"docs":{},"不":{"df":0,"docs":{},"管":{"df":0,"docs":{},"是":{"df":0,"docs":{},"代":{"df":0,"docs":{},"码":{"df":0,"docs":{},"还":{"df":0,"docs":{},"是":{"df":0,"docs":{},"各":{"df":0,"docs":{},"种":{"df":0,"docs":{},"悬":{"df":0,"docs":{},"浮":{"df":0,"docs":{},"窗":{"df":0,"docs":{},"口":{"df":0,"docs":{},"，":{"df":0,"docs":{},"只":{"df":0,"docs":{},"要":{"df":0,"docs":{},"不":{"df":0,"docs":{},"是":{"df":0,"docs":{},"默":{"df":0,"docs":{},"认":{"df":0,"docs":{},"布":{"df":0,"docs":{},"局":{"df":0,"docs":{},"拖":{"df":0,"docs":{},"动":{"df":0,"docs":{},"就":{"df":0,"docs":{},"闪":{"df":0,"docs":{},"退":{"df":0,"docs":{},"，":{"df":0,"docs":{},"有":{"df":0,"docs":{},"点":{"df":0,"docs":{},"小":{"df":0,"docs":{},"郁":{"df":0,"docs":{},"闷":{"df":0,"docs":{},"。":{"df":0,"docs":{},"看":{"df":0,"docs":{},"了":{"df":0,"docs":{},"下":{"df":0,"docs":{},"大":{"df":0,"docs":{},"概":{"df":0,"docs":{},"原":{"df":0,"docs":{},"因":{"df":0,"docs":{},"是":{"df":0,"docs":{},"v":{"df":1,"docs":{"1":{"tf":1.0}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}},"x":{"6":{"4":{"df":1,"docs":{"2":{"tf":1.0}}},"df":0,"docs":{}},"df":0,"docs":{},"x":{"df":0,"docs":{},"x":{"df":1,"docs":{"1":{"tf":1.0}}}}}}},"title":{"root":{"2":{"0":{"1":{"7":{"df":1,"docs":{"1":{"tf":1.0}}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}},"c":{"df":0,"docs":{},"m":{"a":{"df":0,"docs":{},"k":{"df":0,"docs":{},"e":{"df":0,"docs":{},"工":{"df":0,"docs":{},"程":{"df":0,"docs":{},"：":{"df":0,"docs":{},"m":{"df":0,"docs":{},"i":{"df":0,"docs":{},"s":{"df":0,"docs":{},"s":{"df":1,"docs":{"2":{"tf":1.0}}}}}}}}}}}},"df":0,"docs":{}}},"df":0,"docs":{},"k":{"df":0,"docs":{},"n":{"df":0,"docs":{},"o":{"df":0,"docs":{},"w":{"df":0,"docs":{},"n":{"df":1,"docs":{"2":{"tf":1.0}}}}}}},"m":{"a":{"df":0,"docs":{},"k":{"df":0,"docs":{},"e":{"df":1,"docs":{"2":{"tf":1.0}}}}},"df":0,"docs":{}},"r":{"df":0,"docs":{},"u":{"df":0,"docs":{},"l":{"df":0,"docs":{},"e":{"df":1,"docs":{"2":{"tf":1.0}}}}}},"v":{"df":0,"docs":{},"i":{"df":0,"docs":{},"s":{"df":0,"docs":{},"u":{"a":{"df":0,"docs":{},"l":{"df":0,"docs":{},"s":{"df":0,"docs":{},"t":{"df":0,"docs":{},"u":{"d":{"df":0,"docs":{},"i":{"df":0,"docs":{},"o":{"df":1,"docs":{"0":{"tf":1.0}}}}},"df":0,"docs":{}}}}}},"df":0,"docs":{}}}}}}}},"lang":"English","pipeline":["trimmer","stopWordFilter","stemmer"],"ref":"id","version":"0.9.5"},"results_options":{"limit_results":30,"teaser_word_count":30},"search_options":{"bool":"OR","expand":true,"fields":{"body":{"boost":1},"breadcrumbs":{"boost":1},"title":{"boost":2}}}});