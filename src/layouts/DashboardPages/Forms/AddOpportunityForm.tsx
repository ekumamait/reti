import {
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Row,
  Col,
  Modal,
} from "antd";
import { useEffect, useState } from "react";
import {
  useAddOpportunityMutation,
  useUpdateOpportunityMutation,
} from "../../../services/opportunities";
import moment from "moment";
import { toast } from "react-toastify";
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import { uploadImage, validateFile } from "../../../utils/uploadImage";

const { TextArea } = Input;
const { Option } = Select;

const AddOpportunitiesForm = ({
  onOk,
  onCancel,
  open,
  loading,
  initialData,
  isEdit = false,
}) => {
  const [form] = Form.useForm();
  const [addJob] = useAddOpportunityMutation();
  const [updateJob] = useUpdateOpportunityMutation();
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (initialData && open && isEdit) {
      form.setFieldsValue({
        title: initialData.title,
        description: initialData.description,
        jobType: initialData.jobType,
        jobCategory: initialData.jobCategory,
        location: initialData.location,
        companyName: initialData.companyName,
        contactEmail: initialData.contactEmail,
        positions: initialData.positions,
        experience: initialData.experience,
        minSalary: initialData.minSalary,
        maxSalary: initialData.maxSalary,
        applicationDeadline: moment(initialData.applicationDeadline),
        imageUrl: initialData.imageUrl,
      });
      setImageUrl(initialData.imageUrl);
    } else {
      form.resetFields();
      setImageUrl('');
    }
  }, [form, initialData, open, isEdit]);

  const handleImageUpload = async (file: File) => {
    if (!validateFile(file)) return;
    
    setIsUploading(true);
    try {
      const uploadedUrl = await uploadImage(file);
      setImageUrl(uploadedUrl);
      form.setFieldsValue({ imageUrl: uploadedUrl });
    } catch (error) {
      console.error('Image upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formattedData = {
        ...values,
        salary: {
          min: parseInt(values.minSalary),
          max: parseInt(values.maxSalary),
        },
        applicationDeadline: values.applicationDeadline.format("YYYY-MM-DD"),
        imageUrl: imageUrl
      };

      if (isEdit) {
        await updateJob({payload: formattedData, jobID: initialData.id }).unwrap();
        toast.success("Job updated successfully");
      } else {
        await addJob(formattedData).unwrap();
        toast.success("Job created successfully");
      }

      form.resetFields();
      setImageUrl('');
      onOk();
    } catch (error) {
      toast.error(`Operation failed ${error?.data?.message}`);
    }
  };

  return (
    <div className="space-y-4">
      <Modal
        open={open}
        onOk={onOk}
        onCancel={onCancel}
        width={600}
        title={
          <div>
            <h2 className="text-lg font-semibold">
              {isEdit ? "Edit job" : "Create a job"}
            </h2>
            <p className="text-sm font-normal text-gray-500">
              {isEdit
                ? "Update the job details below."
                : "Please fill in the form below to create a new opportunity."}{" "}
              <br />
              <span className="font-normal text-blue-500">
                Jobs will be seen by youth.
              </span>
            </p>
          </div>
        }
        footer={[
          <Button key="back" onClick={onCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={handleSubmit}
          >
            {isEdit ? "Save Changes" : "Submit"}
          </Button>,
        ]}
      >
        <div className="mt-4 p-2">
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Row gutter={[16, 16]}>
              {/* Job Title */}
              <Col span={8}>
                <Form.Item
                  label="Job Title"
                  name="title"
                  rules={[
                    { required: true, message: "Please enter the job title" },
                  ]}
                >
                  <Input placeholder="e.g., Sales Person" size="large" />
                </Form.Item>
              </Col>

              {/* Job Category */}
              <Col span={8}>
                <Form.Item
                  label="Job Category"
                  name="jobCategory"
                  rules={[
                    { required: true, message: "Please select a job category" },
                  ]}
                >
                  <Select placeholder="Select a category" size="large">
                    <Option value="it">IT</Option>
                    <Option value="marketing">Marketing</Option>
                    <Option value="finance">Finance</Option>
                    <Option value="skill">Skill</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="Qualifications">
                  <Form.List name="qualifications">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map(({ key, name, fieldKey, ...restField }) => (
                          <Row key={key} gutter={[16, 16]}>
                            <Col span={8}>
                              <Form.Item
                                {...restField}
                                name={[name]}
                                fieldKey={[fieldKey]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Please enter a qualification",
                                  },
                                ]}
                              >
                                <Input placeholder="e.g., BSc in Computer Science" />
                              </Form.Item>
                            </Col>
                            <Col>
                              <Button type="link" onClick={() => remove(name)}>
                                Remove
                              </Button>
                            </Col>
                          </Row>
                        ))}
                        <Form.Item>
                          <Button type="dashed" onClick={() => add()} block>
                            Add Qualification
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              {/* Job Type */}
              <Col span={8}>
                <Form.Item
                  label="Job Type"
                  name="jobType"
                  rules={[
                    { required: true, message: "Please select a job type" },
                  ]}
                >
                  <Select placeholder="Select job type" size="large">
                    <Option value="fulltime">Full-Time</Option>
                    <Option value="parttime">Part-Time</Option>
                    <Option value="freelance">Freelance</Option>
                  </Select>
                </Form.Item>
              </Col>

              {/* Location */}
              <Col span={8}>
                <Form.Item
                  label="Location"
                  name="location"
                  rules={[
                    {
                      required: true,
                      message: "Please enter the job location",
                    },
                  ]}
                >
                  <Input placeholder="e.g., Remote or City Name" size="large" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Positions"
                  name="positions"
                  rules={[
                    { required: true, message: "Please enter your positions" },
                  ]}
                >
                  <Input placeholder="e.g., Software Engineer" size="large" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              {/* Minimum Salary */}
              <Col span={8}>
                <Form.Item label="Minimum Salary" name="minSalary">
                  <Input placeholder="e.g., 50000" size="large" />
                </Form.Item>
              </Col>

              {/* Maximum Salary */}
              <Col span={8}>
                <Form.Item label="Maximum Salary" name="maxSalary">
                  <Input placeholder="e.g., 100000" size="large" />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  label="Company Name"
                  name="companyName"
                  rules={[
                    {
                      required: true,
                      message: "Please enter the company name",
                    },
                  ]}
                >
                  <Input placeholder="e.g., ABC Corp" size="large" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              {/* Application Deadline */}
              <Col span={8}>
                <Form.Item
                  label="Application Deadline"
                  name="applicationDeadline"
                  rules={[
                    { required: true, message: "Please select a deadline" },
                  ]}
                >
                  <DatePicker className="w-full" size="large" />
                </Form.Item>
              </Col>

              {/* Contact Email */}
              <Col span={8}>
                <Form.Item
                  label="Contact Email"
                  name="contactEmail"
                  rules={[
                    {
                      required: true,
                      type: "email",
                      message: "Please enter a valid email",
                    },
                  ]}
                >
                  <Input placeholder="e.g., hr@example.com" size="large" />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  label="Experience"
                  name="experience"
                  rules={[
                    { required: true, message: "Please enter your experience" },
                  ]}
                >
                  <Input
                    placeholder="e.g., 5 years in software development"
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* Job Description */}
            <Form.Item
              label="Job Description"
              name="description"
              rules={[
                { required: true, message: "Please enter the job description" },
              ]}
            >
              <TextArea
                rows={4}
                placeholder="Describe the responsibilities and expectations"
              />
            </Form.Item>

            <Form.Item label="Job Image">
              <div className="space-y-4">
                {imageUrl && (
                  <div className="relative">
                    <img
                      src={imageUrl}
                      alt="Job"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <Button
                      type="text"
                      icon={<DeleteOutlined className="text-red-500" />}
                      size="small"
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700 border border-red-500 hover:border-red-700 rounded-full p-1"
                      onClick={() => setImageUrl('')}
                    />
                  </div>
                )}
                <input
                  type="file"
                  id="job-image-upload"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                />
                <Button 
                  icon={<UploadOutlined />}
                  onClick={() => document.getElementById('job-image-upload')?.click()}
                  loading={isUploading}
                >
                  Upload Image
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default AddOpportunitiesForm;
