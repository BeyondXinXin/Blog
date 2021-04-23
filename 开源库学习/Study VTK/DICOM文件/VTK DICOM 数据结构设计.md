# VTK DICOM 数据结构设计

项目地址：
[CodeChina kissDicomViewer](https://codechina.csdn.net/a15005784320/kiss-dicom-viewer)  
详细介绍：
[CSDN 一个简单的 DICOM 浏览器](https://beondxin.blog.csdn.net/article/details/108678403)  

---

&emsp;&emsp;参考代码：
* Volume Filter参数参考：**GavriloviciEduard** [https://github.com/GavriloviciEduard?tab=repositories](https://github.com/GavriloviciEduard?tab=repositories)

---

## 目的
&emsp;&emsp;分享下自己在做 **kissDicomViewer** 时关于`DICOM`文件数据结构设计的思路。
&emsp;&emsp;自己用到过的 c++ 的开源`DICOM`协议使用主要有两类：
* `GDCM（itk/vtk都是用的这个）`
* `DCMTK`

&emsp;&emsp;个人使用感受：易用性：`DCMTK` > `itk` > `GDCM` > `vtkDicom`。

&emsp;&emsp;无奈，这四种还必须都用。`itk`本身还有很多分割配准的库、如果用`vtk`做可视化，某些情况只能用`vtkDicom`（itk转过来的有问题）、`GDCM`可以很好地读取心电图数据、如果需要修改标签或提供`pacs`服务只有`DCMTK`可以搞（`itk`该标签有各种限制）。


---

## vtk的DICOM文件结构设计 

&emsp;&emsp;[DCMTK的DICOM文件结构设计](https://beondxin.blog.csdn.net/article/details/108680479)


&emsp;&emsp;`DICOM`存储服务一般按照这四类保存。每一个**SERIES**可能一层，也可能多层。z轴可以表示：时间，空间，时间+空间。导致如果想读取`DICOM`文件需要完整的整一份`DICOM`协议。如果没有设计合适的数据结构，再处理`DICOM`影像时很是棘手。`VTK`作为医学影像可视化很是方便，但是竟然没有一个合适的`DICOM`数据结构。`vtkDICOMReader/writer`用过的都知道有多坑。


- **PATIENT**  （病人）
- **STUDY**  （检查）   
- **SERIES**    （序列）
- **IMAGE** （影像）

├── **PATIENT**  （病人）
│ │ └── **STUDY**  （检查）
│ │ │ │ └── **SERIES**    （序列）
│ │ │ │ │ │ └── **IMAGE** （影像）
│ │ │ │ └── **SERIES**    （序列）
│ │ │ │ │ │ └── **IMAGE** （影像）
│ │ │ │ │ │ └── **IMAGE** （影像）
│ │ └── **STUDY**  （检查）
│ │ │ │ └── **SERIES**    （序列）
│ │ │ │ │ │ └── **IMAGE** （影像）


&emsp;&emsp;参考**GavriloviciEduard**的代码（文章开头有github链接），感觉他用的思路很好。先利用`DCMTK`读取一遍文件，把关系都搞清，标签也获取到，然后用`vtkDICOMReader`再读取。虽然增加了读取的步骤，但是增加的耗时可以忽略，而`vtk`很难搞清的关系也解决了。

&emsp;&emsp;用四个类（`Patient、STUDY、SERIES、IMAGE`）分别存储病人、检查、序列、影像。仿照`QObject`构建一个树形结构。`CoreRepository`类用来存储这些数据，`CoreController`用来管理数据结构，`DicomReader`负责利用`DCMTK`预加载、`FilesImporter`是一个文件处理线程。



&emsp;&emsp;完整代码在**kissDicomViewer**的**VolumeMprPlugan**里，这里贴出四个类的头文件：

```cpp
namespace KISS::VtkImageData {
    class Patient {
      public:
        Patient() = default;
        ~Patient() = default;

        [[nodiscard]] std::string getPatientID() const {
            return m_patientid;
        }
        [[nodiscard]] int getIndex() const {
            return static_cast<int>(m_index);
        }
        void setPatientID(const std::string &t_id) {
            m_patientid = t_id;
        }
        void setIndex(const int &t_index) {
            m_index = t_index;
        }

        [[nodiscard]] std::vector<std::unique_ptr<Study>> &getStudies() {
            return m_studies;
        }
        [[nodiscard]] Study *addStudy(std::unique_ptr<Study> t_study);
        [[nodiscard]] std::size_t findStudyIndex(Study *t_study);
      private:
        std::size_t m_index = -1;
        std::string m_patientid = {};
        std::vector<std::unique_ptr<Study>> m_studies = {};

    };
}

namespace KISS::VtkImageData {
    class Patient;
    class Study {
      public:
        Study() = default;
        ~Study() = default;
        void setParentObject(Patient *t_parent) {
            m_parent = t_parent;
        }
        [[nodiscard]] Patient *getParentObject() const {
            return m_parent;
        }
        void setUID(const std::string &t_uid) {
            m_uid = t_uid;
        }
        [[nodiscard]] std::string getUID() const {
            return m_uid;
        }
        void setIndex(const int &t_index) {
            m_index = t_index;
        }
        [[nodiscard]] int getIndex() const {
            return static_cast<int>(m_index);
        }
        [[nodiscard]] Series *addSeries(
            std::unique_ptr<Series> t_series, bool &t_newSeries);
        std::vector<std::unique_ptr<Series>> &getSeries() {
            return m_series;
        }
        [[nodiscard]] std::size_t findSeriesIndex(Series *t_series);
      private:
        std::size_t m_index = -1;
        Patient *m_parent = {};
        std::string m_uid = {};
        std::vector<std::unique_ptr<Series>> m_series = {};
    };
}


namespace KISS::VtkImageData {

    class Study;

    class Series {
      public:
        Series() = default;
        ~Series() = default;

        //getters
        [[nodiscard]] export Study *getParentObject() const {
            return m_parent;
        }
        [[nodiscard]] export std::string getUID() const {
            return m_uid;
        }
        [[nodiscard]] export Image *getNextSingleFrameImage(Image *t_image);
        [[nodiscard]] export Image *getPreviousSingleFrameImage(Image *t_image);
        [[nodiscard]] export Image *getSingleFrameImageByIndex(const int &t_index);
        [[nodiscard]] export std::set<std::unique_ptr<Image>, Image::imageCompare> &getSinlgeFrameImages() {
            return m_singleFrameImages;
        }
        [[nodiscard]] export std::set<std::unique_ptr<Image>, Image::imageCompare> &getMultiFrameImages() {
            return m_multiFrameImages;
        }
        [[nodiscard]] export int getIndex() const {
            return static_cast<int>(m_index);
        }
        [[nodiscard]] export vtkSmartPointer<vtkDICOMReader> getReaderForAllSingleFrameImages();
        [[nodiscard]] export vtkSmartPointer<vtkDICOMMetaData> getMetaDataForSeries();

        //setters
        export void setParentObject(Study *t_parent) {
            m_parent = t_parent;
        }
        export void setUID(const std::string &t_uid) {
            m_uid = t_uid;
        }
        export void setIndex(const int &t_index) {
            m_index = t_index;
        }

        [[nodiscard]] export Image *addSingleFrameImage(
            std::unique_ptr<Image> t_image, bool &t_newImage);
        [[nodiscard]] export Image *addMultiFrameImage(
            std::unique_ptr<Image> t_image, bool &t_newImage);
        [[nodiscard]] export std::size_t findImageIndex(
            const std::set<std::unique_ptr<Image>, Image::imageCompare> &t_images,
            Image *t_image);
        struct seriesCompare {
            bool operator()(const std::unique_ptr<Series> &t_lhs,
                            const std::unique_ptr<Series> &t_rhs) const {
                return isLess(t_lhs.get(), t_rhs.get());
            }
        };
      private:
        std::size_t m_index = -1;
        Study *m_parent = {};
        std::string m_uid = {};

        vtkWeakPointer<vtkDICOMReader> m_readerSingleFrame = {};
        vtkSmartPointer<vtkDICOMMetaData> m_metaDataSingleFrame = {};
        std::set<std::unique_ptr<Image>, Image::imageCompare> m_singleFrameImages = {};
        std::set<std::unique_ptr<Image>, Image::imageCompare> m_multiFrameImages = {};

        static bool isLess(Series *t_lhs, Series *t_rhs);

    };
}

namespace KISS::VtkImageData {
    class Series;

    class Image {
      public:
        Image() = default;
        ~Image() = default;

        //getters
        [[nodiscard]] export Series *getParentObject() const {
            return m_parent;
        }
        [[nodiscard]] export std::string getImagePath() const {
            return m_path;
        }
        [[nodiscard]] export std::string getSOPInstanceUID() const {
            return m_sopInstanceUid;
        }
        [[nodiscard]] export std::string getClassUID() const {
            return m_classUid;
        }
        [[nodiscard]] export std::string getFrameOfRefernceID() const {
            return m_frameOfReferenceId;
        }
        [[nodiscard]] export std::string getModality() const {
            return m_modality;
        }
        [[nodiscard]] export int getWindowCenter() const {
            return m_windowsCenter;
        }
        [[nodiscard]] export int getWindowWidth() const {
            return m_windowWidth;
        }
        [[nodiscard]] export int getRows() const {
            return m_rows;
        }
        [[nodiscard]] export int getColumns() const {
            return m_columns;
        }
        [[nodiscard]] export int getNumberOfFrames() const {
            return m_numberOfFrames;
        }
        [[nodiscard]] export double getSliceLocation() const {
            return m_sliceLocation;
        }
        [[nodiscard]] export int getAcquisitionNumber() const {
            return m_acquisitionNumber;
        }
        [[nodiscard]] export bool getIsMultiFrame() const {
            return m_isMultiframe;
        }
        [[nodiscard]] export int getIndex() const {
            return m_index;
        }
        [[nodiscard]] export double getPixelSpacingX() const {
            return m_pixelSpacingX;
        }
        [[nodiscard]] export double getPixelSpacingY() const {
            return m_pixelSpacingY;
        }
        [[nodiscard]] export int getInstanceNumber() const {
            return m_instanceNumber;
        }

        /**
        * Getter for image reader. If image reader is null is created.
        */
        [[nodiscard]] export vtkSmartPointer<vtkDICOMReader> getImageReader() const;

        //setters
        void export setParentObject(Series *t_parent) {
            m_parent = t_parent;
        }
        void export setImagePath(const std::string &t_path) {
            m_path = t_path;
        }
        void export setSOPInstanceUID(const std::string &t_sopInstanceUid) {
            m_sopInstanceUid = t_sopInstanceUid;
        }
        void export setClassUID(const std::string &t_classUid) {
            m_classUid = t_classUid;
        }
        void export setFrameOfRefernceID(const std::string &t_frameOfReferenceId) {
            m_frameOfReferenceId = t_frameOfReferenceId;
        }
        void export setModality(const std::string &t_modality) {
            m_modality = t_modality;
        }
        void export setWindowCenter(const int &t_windowsCenter) {
            m_windowsCenter = t_windowsCenter;
        }
        void export setWindowWidth(const int &t_windowWidth) {
            m_windowWidth = t_windowWidth;
        }
        void export setRows(const int &t_rows) {
            m_rows = t_rows;
        }
        void export setColumns(const int &t_columns) {
            m_columns = t_columns;
        }
        void export setNumberOfFrames(const int &t_numberOfFrames) {
            m_numberOfFrames = t_numberOfFrames;
        }
        void export setSliceLocation(const double &t_sliceLocation) {
            m_sliceLocation = t_sliceLocation;
        }
        void export setAcquisitionNumber(const int &t_acquisitionNumber) {
            m_acquisitionNumber = t_acquisitionNumber;
        }
        void export setIsMultiFrame(const bool &t_isMultiframe) {
            m_isMultiframe = t_isMultiframe;
        }
        void export setIndex(const int &t_index) {
            m_index = t_index;
        }
        void export setPixelSpacingX(const double &t_spacing) {
            m_pixelSpacingX = t_spacing;
        }
        void export setPixelSpacingY(const double &t_spacing) {
            m_pixelSpacingY = t_spacing;
        }
        void export setInstanceNumber(const int &t_number) {
            m_instanceNumber = t_number;
        }

        /**
        * Functor for set compare
        */
        struct imageCompare {
            bool operator()(const std::unique_ptr<Image> &t_lhs,
                            const std::unique_ptr<Image> &t_rhs) const {
                return isLess(t_lhs.get(), t_rhs.get());
            }
        };

        export bool equal(Image *t_image) const;

      private:
        std::size_t m_index = -1;
        Series *m_parent = {};

        std::string m_path = {};

        std::string m_sopInstanceUid = {};
        std::string m_classUid = {};
        std::string m_frameOfReferenceId = {};
        std::string m_modality = {};


        int m_instanceNumber = {};
        int m_windowsCenter = {};
        int m_windowWidth = {};
        int m_rows = {};
        int m_columns = {};
        int m_numberOfFrames = {};
        double m_sliceLocation = {};
        double m_pixelSpacingX = -1;
        double m_pixelSpacingY = -1;
        int m_acquisitionNumber = {};
        bool m_isMultiframe = false;
        vtkWeakPointer<vtkDICOMReader> m_imageReader = {};

        static bool isLess(Image *t_lhs, Image *t_rhs);
    };
}
```














