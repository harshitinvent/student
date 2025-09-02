import { Card, Form, Input, Modal, Table, message, Upload } from 'antd';
import { useState, useEffect } from 'react';
import Button from '../../components/shared/Button';
import { IAnemities, IAmenityResponse } from '../../types/accomodations';
import { amenitiesAPI } from '../../services/amenitiesAPI';
import SingleImageUpload from '../SingleImageUpload';
import { UploadFileStatus } from 'antd/es/upload/interface';
import SnackbarComponent from '../../components/shared/Snackbar';

interface FileData {
  uid: string;
  name: string;
  status: UploadFileStatus;
  url: string;
  thumbUrl: string;
}

export const Amenities = () => {
  // -------- Constants -----------
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [amenities, setAmenities] = useState<IAmenityResponse[]>([]);
  const [selectedImageData, setSelectedImageData] = useState<FileData[]>([]);
  const [form] = Form.useForm();
  const [url, setImageUrl] = useState<string>('');
  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingAmenity, setEditingAmenity] = useState<IAmenityResponse | null>(
    null
  );
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [paginationLoading, setPaginationLoading] = useState(false);
  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  //----------- Handlers ------------

  const handleCreate = () => {
    setIsEditMode(false);
    setEditingAmenity(null);
    form.resetFields();
    setSelectedImageData([]);
    setImageUrl('');
    setModalVisible(true);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setIsEditMode(false);
    setEditingAmenity(null);
    form.resetFields();
    setSelectedImageData([]);
    setImageUrl('');
  };

  // Handle image upload change
  const handleImageChange = (value: FileData[] | string) => {
    console.log('Image change triggered with value:', value);

    if (Array.isArray(value) && value.length > 0) {
      // Ensure we have a valid URL
      if (value[0]?.url && value[0]?.status === 'done') {
        setSelectedImageData(value);
        // Update the image URL when a new image is uploaded
        setImageUrl(value[0].url);
      } else {
        console.warn(
          '⚠️ Image uploaded but URL or status is invalid:',
          value[0]
        );
        setSelectedImageData([]);
        setImageUrl('');
      }
    } else {
      console.log('Image value is string (cleared) or empty array:', value);
      setSelectedImageData([]);
      setImageUrl('');
    }
  };

  // Handle pagination change
  const handlePaginationChange = (page: number, size?: number) => {
    setCurrentPage(page);
    if (size && size !== pageSize) {
      setPageSize(size);
      setCurrentPage(1); // Reset to first page when page size changes
    }
    // Fetch data for the new page
    fetchAmenities(page, size || pageSize);
  };

  // -------- Submit Form ----------
  const handleModalSubmit = async (values: IAnemities) => {
    try {
      if (!selectedImageData || selectedImageData.length === 0) {
        console.log('Please upload an image');
        return;
      }

      // Get the image URL from the uploaded file data
      const imageUrl = selectedImageData[0]?.url || url;
      const imageStatus = selectedImageData[0]?.status;

      if (!imageUrl) {
        console.log('Failed to get image URL');
        return;
      }

      if (imageStatus !== 'done') {
        console.log(
          'Image upload is not complete. Please wait for upload to finish.'
        );
        return;
      }

      setLoading(true);

      // Create amenity with name and imageUrl
      const amenityData: IAnemities = {
        name: values.name,
        imageUrl: imageUrl,
      };

      let result;
      if (isEditMode && editingAmenity) {
        // Update existing amenity
        result = await amenitiesAPI.updateAmenity(
          editingAmenity.id,
          amenityData
        );
        if (result) {
          console.log('Amenity updated successfully!');
        } else {
          console.log('Failed to update amenity');
        }
      } else {
        // Create new amenity
        result = await amenitiesAPI.createAmenity(amenityData);
        console.log('Result result here-->', result);
        if (result) {
          console.log('Amenity created successfully!');
        } else {
          console.log('Failed to create amenity');
        }
      }

      if (result) {
        setModalVisible(false);
        setIsEditMode(false);
        setEditingAmenity(null);
        form.resetFields();
        setSelectedImageData([]);
        setImageUrl('');
        // Refresh the current page after creating/updating amenity
        fetchAmenities(currentPage, pageSize);
      }
    } catch (error) {
      console.log('Error found here-->', error);
      setSnackbarMessage(
        error instanceof Error ? error.message : String(error)
      );
      setSnackbarOpen(true);
      const action = isEditMode ? 'updating' : 'creating';
    } finally {
      setLoading(false);
    }
  };

  // Fetch amenities with pagination
  const fetchAmenities = async (
    page: number = currentPage,
    size: number = pageSize
  ) => {
    try {
      setPaginationLoading(true);

      // Send pagination parameters to backend
      const result = await amenitiesAPI.getAmenities(page, size);

      if (result?.data) {
        setAmenities(result.data);
        setTotal(result.total || result.data.length);
      } else {
        setAmenities([]);
        setTotal(0);
      }
    } catch (error) {
      console.error('Error fetching amenities:', error);
      setAmenities([]);
      setTotal(0);
    } finally {
      setPaginationLoading(false);
    }
  };

  useEffect(() => {
    // Initialize with first page and default page size
    fetchAmenities(1, pageSize);
  }, []);

  // Table columns
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Image',
      dataIndex: 'url',
      key: 'url',
      render: (imageUrl: string, record: IAmenityResponse) => {
        return (
          <img
            src={imageUrl}
            alt={`${record.name} amenity`}
            className="h-12 w-12 rounded border border-gray-200 object-cover"
            onError={(e) => {
              e.currentTarget.src = '/pic/services/default.png';
            }}
            onLoad={() => {
              console.log('Image loaded successfully:', imageUrl);
            }}
          />
        );
      },
    },

    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: IAmenityResponse) => (
        <div className="flex gap-2">
          <Button
            className="text-blue-600 hover:text-blue-800"
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Button
            className="text-red-600 hover:text-red-800"
            onClick={() => handleDelete(record.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const handleEdit = (amenity: IAmenityResponse) => {
    setIsEditMode(true);
    setEditingAmenity(amenity);

    // Extract filename from URL or use amenity name
    const urlParts = amenity.url.split('/');
    const fileName = urlParts[urlParts.length - 1] || `${amenity.name}.jpg`;

    // Set the existing image
    setImageUrl(amenity.url);
    setSelectedImageData([
      {
        uid: amenity.id,
        name: fileName,
        status: 'done',
        url: amenity.url,
        thumbUrl: amenity.url,
      },
    ]);

    // Pre-fill the form with existing data
    form.setFieldsValue({
      name: amenity.name,
      imageUpload: url
        ? url
        : {
            uid: amenity.id,
            name: fileName,
            status: 'done',
            url: amenity.url,
            thumbUrl: amenity.url,
          },
    });

    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const result = await amenitiesAPI.deleteAmenity(id);
      if (result.success) {
        console.log('Amenity deleted successfully!');
        // Refresh the current page after deletion
        fetchAmenities(currentPage, pageSize);
      } else {
        console.log('Failed to delete amenity');
      }
    } catch (error) {
      console.error('Error deleting amenity:', error);
      console.log('An error occurred while deleting the amenity');
    }
  };

  return (
    <div className="m-20">
      <Card
        className="vanue-management-card mb-6"
        title={
          <div className="card-header-main">
            <div className="card-header">
              <h3 className="card-title">Amenities</h3>
              <p className="card-subtitle">Manage Amenities</p>
            </div>
            <Button onClick={handleCreate}>Add New Amenity</Button>
          </div>
        }
      >
        <Table
          columns={columns}
          dataSource={amenities}
          rowKey="id"
          loading={paginationLoading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
            pageSizeOptions: ['5', '10', '20', '50'],
            onChange: handlePaginationChange,
            onShowSizeChange: handlePaginationChange,
          }}
        />
      </Card>

      <Modal
        className="add-vendor-modal"
        open={modalVisible}
        onCancel={handleModalCancel}
        footer={null}
        title={isEditMode ? 'Edit Amenity' : 'Add Amenity'}
        width={600}
        centered
      >
        <Form form={form} layout="vertical" onFinish={handleModalSubmit}>
          <Form.Item
            className="input-field-main"
            name="name"
            label="Amenity Name"
            rules={[{ required: true, message: 'Please enter amenity name' }]}
          >
            <Input
              className="input-field-inn"
              placeholder="e.g., Wi-Fi, Air Conditioning"
            />
          </Form.Item>

          <Form.Item
            className="input-field-main"
            name="imageUpload"
            label="Upload Image"
            rules={[{ required: true, message: 'Please upload an image' }]}
          >
            <SingleImageUpload
              fileType={['image/jpeg', 'image/png', 'image/webp', 'image/gif']}
              imageType="amenities"
              value={
                isEditMode && editingAmenity ? selectedImageData[0] : undefined
              }
              onChange={handleImageChange}
              size={5} // 5MB max
              btnName="Image"
              setImageUrl={setImageUrl}
            />
          </Form.Item>

          {/* Custom footer inside form */}
          <div className="modal-custom-footer">
            <Button className="fill-grey-btn" onClick={handleModalCancel}>
              Cancel
            </Button>
            <Button
              className="fill-dark-btn"
              htmlType="submit"
              disabled={!selectedImageData || selectedImageData.length === 0}
            >
              {loading
                ? isEditMode
                  ? 'Updating...'
                  : 'Creating...'
                : isEditMode
                  ? 'Update Amenity'
                  : 'Create Amenity'}
            </Button>
          </div>
        </Form>
      </Modal>

      <SnackbarComponent
        open={snackbarOpen}
        message={snackbarMessage}
        onClose={() => setSnackbarOpen(false)}
      />
    </div>
  );
};
