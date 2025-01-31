import React, { useState } from "react";
import { Tag, Button, Modal, Form, Input, Select } from "antd";
import { EditOutlined, BankOutlined, CalendarOutlined, ExperimentOutlined, RocketOutlined } from "@ant-design/icons";
import { loginDetails } from "../../../utils";

const { Option } = Select;

const ProfileDetailsExt = ({ profileData }) => {
  const userRole = loginDetails().user.role; 
    const isAdmin = userRole === "admin";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<
    | "trainingCentreDetails"
    | "trainingCohorts"
    | "retiTrainingDetails"
    | "internshipAndStartupDetails"
  >("trainingCentreDetails");
  const [form] = Form.useForm();

  const [details, setDetails] = useState({
    trainingCentreDetails: {
      nameOfTrainingCentre: profileData?.data?.trainingCentreDetails?.nameOfTrainingCentre,
      locationVillage: profileData?.data?.trainingCentreDetails?.locationVillage,
      locationSubCounty: profileData?.data?.trainingCentreDetails?.locationSubCounty,
      locationSettlement: profileData?.data?.trainingCentreDetails?.locationSettlement,
      mainTelephoneContact: profileData?.data?.trainingCentreDetails?.mainTelephoneContact,
      alternativeTelephoneContact: profileData?.data?.trainingCentreDetails?.alternativeTelephoneContact,
    },
    trainingCohorts: {
      cohort: profileData?.data?.trainingCohorts?.cohort,
      tradeTakenDuringTraining: profileData?.data?.trainingCohorts?.tradeTakenDuringTraining,
    },
    retiTrainingDetails: {
      startTime: profileData?.data?.retiTrainingDetails?.startTime,
      completionStatus: profileData?.data?.retiTrainingDetails?.completionStatus,
      reasonForDroppingOut: profileData?.data?.retiTrainingDetails?.reasonForDroppingOut,
      monthsSpent: profileData?.data?.retiTrainingDetails?.monthsSpent,
      certificationStatus: profileData?.data?.retiTrainingDetails?.certificationStatus,
    },
    internshipAndStartupDetails: {
      completionTime: profileData?.data?.internshipAndStartupDetails?.completionTime,
      internshipPlacement: profileData?.data?.internshipAndStartupDetails?.internshipPlacement,
      startupKitReceived: profileData?.data?.internshipAndStartupDetails?.startupKitReceived,
      startupGrantReceived: profileData?.data?.internshipAndStartupDetails?.startupGrantReceived,
    },
  });

  const openEditModal = (type) => {
    setEditingType(type);
    setIsModalOpen(true);
    form.resetFields();
  };

  const handleSave = (values) => {
    setDetails((prev) => ({
      ...prev,
      [editingType]: { ...prev[editingType], ...values },
    }));
    setIsModalOpen(false);
  };

  return (
    <div className="pt-4 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b">
        <h1 className="text-2xl font-bold text-gray-900">Training & Development</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Training Institution Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <BankOutlined className="text-blue-500" />
              Institution Details
            </h2>
            {isAdmin && (
            <EditOutlined 
              className="cursor-pointer text-blue-500 hover:text-blue-700"
              onClick={() => openEditModal("trainingCentreDetails")}
            />
            )}
          </div>
          <div className="space-y-3">
            {Object.entries(details.trainingCentreDetails).map(([key, value]) => (
              <div key={key} className="flex justify-between items-start border-b pb-2">
                <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}:</span>
                <span className="text-gray-800 font-medium">{value || 'Not specified'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Cohort Details Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <CalendarOutlined className="text-green-500" />
              Cohort Details
            </h2>
            {isAdmin && (
            <EditOutlined 
              className="cursor-pointer text-blue-500 hover:text-blue-700"
              onClick={() => openEditModal("trainingCohorts")}
            />
            )}
          </div>
          <div className="space-y-3">
            {Object.entries(details.trainingCohorts).map(([key, value]) => (
              <div key={key} className="flex justify-between items-start border-b pb-2">
                <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}:</span>
                <span className="text-gray-800 font-medium">{value || 'Not specified'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RETI Training Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <ExperimentOutlined className="text-purple-500" />
              RETI Program Details
            </h2>
            {isAdmin && (
            <EditOutlined 
              className="cursor-pointer text-blue-500 hover:text-blue-700"
              onClick={() => openEditModal("retiTrainingDetails")}
            />
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(details.retiTrainingDetails).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <p className="text-sm text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</p>
                <p className="font-medium text-gray-800">{value || '—'}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Internship & Startup Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <RocketOutlined className="text-red-500" />
              Internship & Startup
            </h2>
            {isAdmin && (
            <EditOutlined 
              className="cursor-pointer text-blue-500 hover:text-blue-700"
              onClick={() => openEditModal("internshipAndStartupDetails")}
            />
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(details.internshipAndStartupDetails).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <p className="text-sm text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</p>
                <p className="font-medium text-gray-800">{value || '—'}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        title={`Edit ${editingType}`}
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        okText="Save"
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          {editingType === "trainingCentreDetails" &&
            Object.entries(details.trainingCentreDetails).map(
              ([key, value]) => (
                <Form.Item
                  key={key}
                  label={key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                  name={key}
                  initialValue={value}
                  rules={[{ required: true, message: `Please enter ${key}` }]}
                >
                  <Input placeholder={`Enter ${key}`} />
                </Form.Item>
              )
            )}

          {editingType === "trainingCohorts" &&
            Object.entries(details.trainingCohorts).map(([key, value]) => (
              <Form.Item
                key={key}
                label={key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
                name={key}
                initialValue={value}
                rules={[{ required: true, message: `Please enter ${key}` }]}
              >
                <Input placeholder={`Enter ${key}`} />
              </Form.Item>
            ))}

          {editingType === "retiTrainingDetails" &&
            Object.entries(details.retiTrainingDetails).map(([key, value]) => (
              <Form.Item
                key={key}
                label={key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
                name={key}
                initialValue={value}
                rules={[{ required: true, message: `Please enter ${key}` }]}
              >
                <Input placeholder={`Enter ${key}`} />
              </Form.Item>
            ))}

          {editingType === "internshipAndStartupDetails" &&
            Object.entries(details.internshipAndStartupDetails).map(
              ([key, value]) => (
                <Form.Item
                  key={key}
                  label={key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                  name={key}
                  initialValue={value}
                  rules={[{ required: true, message: `Please enter ${key}` }]}
                >
                  <Input placeholder={`Enter ${key}`} />
                </Form.Item>
              )
            )}
        </Form>
      </Modal>
    </div>
  );
};

export default ProfileDetailsExt;
