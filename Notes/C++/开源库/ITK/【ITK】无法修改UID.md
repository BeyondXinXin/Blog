# 【ITK】无法修改UID


工作时遇到的一个问题，需要自己构建一系列DICOM文件，鼓捣了半天发现生成的DICOM的序列id都是在写出的时候随机生成的。

- ITK的itk::ImageFileWriter
- VTK的vtkDicomImageWriter

上边两个其实都是使用GDCM的gdcm::pixmapWriter，这玩意好像加了个强制的保护，无法修改DICOM文件属性 。即使在写入过程中，将DICOM文件作为输入传入，输出文件也可能不包含输入文件中的所有DICOM字段。

[https://itk.org/Doxygen/html/classitk_1_1GDCMImageIO.html](https://itk.org/Doxygen/html/classitk_1_1GDCMImageIO.html)

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/c%2B%2B/%E5%BC%80%E6%BA%90%E5%BA%93/itk/%E3%80%90itk%E3%80%91%E6%97%A0%E6%B3%95%E4%BF%AE%E6%94%B9uid.md/356104015211257.png =1200x)

如果写出的几个ID无法修改，那么其他软件在读取的时候肯定不会当成一个系列，也没办法做后续操作。

也许ITK有专门修改ID的办法，我是没找到。换个思路，试了下DCMTK默认可以修改/添加所有的标签，不需要额外的设置。

最后实现的办法，利用opencv和itk现成的方法生成并保存需要的序列影像（DICOM文件）。让后用DCMTK强制修改几个需要的ID。

```cpp
        DcmFileFormat fileformat;
        OFCondition oc = fileformat.loadFile(in_path.toLocal8Bit().data());
        fileformat.getDataset()->putAndInsertString(DCM_SeriesInstanceUID,
                           "1.2.840.113619.2.292.65140653520588659061.1552006679.1484.33");
        fileformat.getDataset()->putAndInsertString(DCM_StudyInstanceUID,
                           "1.2.840.113619.2.292.65140653520588659061.1552005022.1480.86");
        fileformat.getDataset()->putAndInsertString(DCM_SOPInstanceUID,
                           "1.2.840.113619.2.205.114374079573872.178409.1552386274354.14");
        fileformat.saveFile(out_path.toLocal8Bit().data());
```








