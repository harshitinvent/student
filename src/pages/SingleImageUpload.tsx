import { Button, message, Upload as UploadAntd } from "antd";
import React, { useState, useEffect } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { UploadProps, UploadFile, UploadFileStatus } from "antd/es/upload/interface";

interface FileData {
  uid: string;
  name: string;
  status: UploadFileStatus;
  url: string;
  thumbUrl: string;
}

interface SingleImageUploadProps {
  fileType: string[];
  value?: FileData | string;
  imageType: string;
  btnName?: string;
  onChange?: (value: FileData[] | string) => void;
  size?: number;
  width?: number;
  height?: number;
  isDimension?: boolean;
  setImageUrl: ((url: string) => void | undefined) | undefined}

const s3Config :any = {
  region: "us-east-1",
  credentials: {
    accessKeyId: "AKIAFBC97UM4I3ILWTIKQ",
    secretAccessKey: "vMUNWcZvMesuFfmUwdUYnsaOr1pp38wu8nOon8eb",
  },
  endpoint: "https://s3-noi.aces3.ai/",
  forcePathStyle: true,
  requestChecksumCalculation: "WHEN_REQUIRED",
  responseChecksumValidation: "WHEN_REQUIRED",

};

const s3Client = new S3Client(s3Config);

const SingleImageUpload: React.FC<SingleImageUploadProps> = ({ 
  fileType, 
  value, 
  imageType, 
  btnName, 
  onChange, 
  size = 5, 
  width = 600, 
  height = 600, 
  isDimension = false, 
  setImageUrl,
  ...props 
}) => {
  const [file, setFile] = useState<UploadFile[]>([]);

  const checkImageDimensions = (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = document.createElement("img");
      img.onload = () => {
        if (img.width === width && img.height === height) {
          resolve();
        } else {
          reject(
            `Please upload an image with dimensions (${width}X${height}). uploaded image is ${img.width} X ${img.height}`
          );
        }
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const beforeUpload = async (file: File): Promise<boolean> => {
    try {
      if (fileType.includes(file.type)) {
        // File type is valid
      } else {
        message.error("File format is not correct");
        return false;
      }

      const isLt2M = file.size / 1024 / 1024 < size;
      if (!isLt2M) {
        message.error(`Image must be smaller than ${size} MB!`);
        return false;
      }

      // If check dimension
      if (isDimension) {
        await checkImageDimensions(file);
      }

      return true;
    } catch (err) {
      message.error(err instanceof Error ? err.message : 'Upload error');
      return false;
    }
  };

  const onRemove = () => {
    setFile([]);
    if (onChange) {
      onChange("");
    }
  };

  useEffect(() => {
    if (value && typeof value === 'object') {
      setFile([value as FileData]);
    } else {
      setFile([]);
    }
  }, [value]);

  // Use Upload class for better S3 compatibility
  const uploadFileToS3 = async (file: File, bucketName: string): Promise<any> => {
    try {      
      const key = "school/" + imageType + "/" + file.name;
      
      const params = {
        Bucket: bucketName,
        Key: key,
        Body: file,
        ContentType: file.type,
      };
      
      const upload = new Upload({
        client: s3Client,
        params: params,
        queueSize: 1,
        partSize: 1024 * 1024 * 5, // 5MB chunks
        leavePartsOnError: false,
      });
      
      const data = await upload.done();      
      // Construct the S3 URL
      const s3Url = `https://s3-noi.aces3.ai/${bucketName}/${key}`;
      return {
        Location: s3Url,
        Key: key,
        Bucket: bucketName
      };
    } catch (error) {
      console.error('S3 upload error:', error);
      throw error;
    }
  };

  const handleImgChange: UploadProps['customRequest'] = async (options) => {
    const { file: uploadFile, onSuccess, onError, onProgress } = options;
    
    if (!uploadFile) return;
    
    const file = uploadFile as File;
    const uid = `${Date.now()}-${file.name}`;
    
    console.log('Starting upload for file:', file.name, 'Size:', file.size);
    
    // Set initial uploading state
    const uploadingFile: UploadFile = {
      uid,
      name: file.name,
      status: 'uploading',
    };
    setFile([uploadingFile]);
    
    try {
      // Simulate progress
      if (onProgress) {
        onProgress({ percent: 50 });
      }
      
      const data = await uploadFileToS3(file, "invent-co-new");
      if (data.Location && setImageUrl){
        setImageUrl(data.Location);
      }
      // Create the final file data with proper structure for Ant Design Upload
      const fileData: UploadFile = {
        uid,
        name: file.name,
        status: "done",
        url: data.Location,
        thumbUrl: data.Location,
        type: file.type,
        size: file.size,
      };
      
      console.log('Final file data to be sent:', fileData);
      
      // Update the file state to show the uploaded image
      setFile([fileData]);
      
      // Call onChange with the file data
      if (onChange) {
        console.log('Calling onChange with:', [fileData]);
        onChange([fileData as FileData]);
      }
      
      if (onProgress) {
        onProgress({ percent: 100 });
      }
      
      onSuccess?.(data);
      console.log('Upload successful, file data:', fileData);
      
    } catch (err) {
      console.error('Upload failed:', err);
      
      // Update file status to error
      const errorFile: UploadFile = {
        uid,
        name: file.name,
        status: 'error',
      };
      setFile([errorFile]);
      
      onError?.(err as Error);
    }
  };
  
  return (
    <div className="upload-area">
      <UploadAntd
        listType="picture"
        maxCount={1}
        className="upload-post-inn"
        beforeUpload={beforeUpload}
        customRequest={handleImgChange}
        onRemove={onRemove}
        fileList={file}
        {...props}
      >
        {file && file.length > 0 ? null : (
          <Button className="upload-new-button-mainj">
            <p className="ant-upload-drag-icon">
              <UploadOutlined style={{ fontSize: '24px' }} />
            </p>
            <p className="ant-upload-text">Click to upload or drag and drop</p>
          </Button>
        )}
      </UploadAntd>
    </div>
  );
};

export default SingleImageUpload;
