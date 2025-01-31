import React, { useEffect, useState } from "react";
import { Tag, Button, Modal, Form, Input, Select } from "antd";
import { EditOutlined, UserOutlined, EnvironmentOutlined, TeamOutlined, ToolOutlined } from "@ant-design/icons";
import { loginDetails } from "../../../utils";

const { Option } = Select;

const ProfileDetails = ({ profileData }) => {

  const userRole = loginDetails().user.role; 
  const isAdmin = userRole === "admin";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<
    | "skillsAndTraining"
    | "artisanDetails"
    | "geoLocationDetails"
    | "participantDetails"
  >("skillsAndTraining");
  const [form] = Form.useForm();

  const [details, setDetails] = useState({
    skillsAndTraining: {
      traineeCategory: "Not specified",
      trainingDuration: "Not specified",
      trainingLocation: "Not specified",
    },
    artisanDetails: {
      categoryOfArtisan: "Not specified",
      nameOfHost: "Not specified",
      villageOfArtisan: "Not specified",
      subcountyOfArtisan: "Not specified",
      centerRefugeeSettlement: "Not specified",
      hostContact: "Not specified",
    },
    geoLocationDetails: {
      partnerResponsible: "Not specified",
      region: "Not specified",
      district: "Not specified",
      settlement: "Not specified",
      subCounty: "Not specified",
      parishZoneCluster: "Not specified",
      village: "Not specified",
    },
    participantDetails: {
      nameOfParticipant: "Not specified",
      groupNumber: "Not specified",
      individualNumber: "Not specified",
      nin: "Not specified",
      sex: "Not specified",
      age: "Not specified",
      maritalStatus: "Not specified",
      specialInterestCategory: "Not specified",
      disabilityType: "Not specified",
      numberOfDisabilities: "Not specified",
      mainDisabilityDetails: "Not specified",
      nationalityCategory: "Not specified",
      uniqueIdNo: "Not specified",
    },
  });

  // Update details state when profileData changes
  useEffect(() => {
    if (profileData) {
      setDetails({
        skillsAndTraining: {
          traineeCategory: profileData?.data?.skillsAndTraining?.traineeCategory || "Not specified",
          trainingDuration: profileData?.data?.skillsAndTraining?.trainingDuration || "Not specified",
          trainingLocation: profileData?.data?.skillsAndTraining?.trainingLocation || "Not specified",
        },
        artisanDetails: {
          categoryOfArtisan: profileData?.data?.artisanDetails?.categoryOfArtisan || "Not specified",
          nameOfHost: profileData?.data?.artisanDetails?.nameOfHost || "Not specified",
          villageOfArtisan: profileData?.data?.artisanDetails?.villageOfArtisan || "Not specified",
          subcountyOfArtisan: profileData?.data?.artisanDetails?.subcountyOfArtisan || "Not specified",
          centerRefugeeSettlement: profileData?.data?.artisanDetails?.centerRefugeeSettlement || "Not specified",
          hostContact: profileData?.data?.artisanDetails?.hostContact || "Not specified",
        },
        geoLocationDetails: {
          partnerResponsible: profileData?.data?.geoLocationDetails?.partnerResponsible || "Not specified",
          region: profileData?.data?.geoLocationDetails?.region || "Not specified",
          district: profileData?.data?.geoLocationDetails?.district || "Not specified",
          settlement: profileData?.data?.geoLocationDetails?.settlement || "Not specified",
          subCounty: profileData?.data?.geoLocationDetails?.subCounty || "Not specified",
          parishZoneCluster: profileData?.data?.geoLocationDetails?.parishZoneCluster || "Not specified",
          village: profileData?.data?.geoLocationDetails?.village || "Not specified",
        },
        participantDetails: {
          nameOfParticipant: profileData?.data?.participantDetails?.nameOfParticipant || "Not specified",
          groupNumber: profileData?.data?.participantDetails?.groupNumber || "Not specified",
          individualNumber: profileData?.data?.participantDetails?.individualNumber || "Not specified",
          nin: profileData?.data?.participantDetails?.nin || "Not specified",
          sex: profileData?.data?.participantDetails?.sex || "Not specified",
          age: profileData?.data?.participantDetails?.age || "Not specified",
          maritalStatus: profileData?.data?.participantDetails?.maritalStatus || "Not specified",
          specialInterestCategory: profileData?.data?.participantDetails?.specialInterestCategory || "Not specified",
          disabilityType: profileData?.data?.participantDetails?.disabilityType || "Not specified",
          numberOfDisabilities: profileData?.data?.participantDetails?.numberOfDisabilities || "Not specified",
          mainDisabilityDetails: profileData?.data?.participantDetails?.mainDisabilityDetails || "Not specified",
          nationalityCategory: profileData?.data?.participantDetails?.nationalityCategory || "Not specified",
          uniqueIdNo: profileData?.data?.participantDetails?.uniqueIdNo || "Not specified",
        },
      });
    }
  }, [profileData]);

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
        <h1 className="text-2xl font-bold text-gray-900">Profile Details</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Skills and Training */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <UserOutlined className="text-blue-500" />
              Skills & Training
            </h2>
            {isAdmin && (
            <EditOutlined 
              className="cursor-pointer text-blue-500 hover:text-blue-700"
              onClick={() => openEditModal("skillsAndTraining")}
            />
            )}
          </div>
          <div className="space-y-3">
            {Object.entries(details.skillsAndTraining).map(([key, value]) => (
              <div key={key} className="flex justify-between items-start border-b pb-2">
                <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}:</span>
                <span className="text-gray-800 font-medium">{value || 'Not specified'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Artisan Details */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <ToolOutlined className="text-green-500" />
              Artisan Details
            </h2>
            {isAdmin && (
            <EditOutlined 
              className="cursor-pointer text-blue-500 hover:text-blue-700"
              onClick={() => openEditModal("artisanDetails")}
            />
            )}
          </div>
          <div className="space-y-3">
            {Object.entries(details.artisanDetails).map(([key, value]) => (
              <div key={key} className="flex justify-between items-start border-b pb-2">
                <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}:</span>
                <span className="text-gray-800 font-medium">{value || 'Not specified'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Geographical Location */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <EnvironmentOutlined className="text-purple-500" />
              Location Details
            </h2>
            {isAdmin && (
            <EditOutlined 
              className="cursor-pointer text-blue-500 hover:text-blue-700"
              onClick={() => openEditModal("geoLocationDetails")}
            />
            )}
          </div>
          <div className="space-y-3">
            {Object.entries(details.geoLocationDetails).map(([key, value]) => (
              <div key={key} className="flex justify-between items-start border-b pb-2">
                <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}:</span>
                <span className="text-gray-800 font-medium">{value || 'Not specified'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Demographic Details */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <TeamOutlined className="text-red-500" />
              Demographic Details
            </h2>
            {isAdmin && (
            <EditOutlined 
              className="cursor-pointer text-blue-500 hover:text-blue-700"
              onClick={() => openEditModal("participantDetails")}
            />
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(details.participantDetails).map(([key, value]) => (
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
          {editingType === "skillsAndTraining" &&
            Object.entries(details.skillsAndTraining).map(([key, value]) => (
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
          {editingType === "artisanDetails" &&
            Object.entries(details.artisanDetails).map(([key, value]) => (
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
          {editingType === "geoLocationDetails" &&
            Object.entries(details.geoLocationDetails).map(([key, value]) => (
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
          {editingType === "participantDetails" &&
            Object.entries(details.participantDetails).map(([key, value]) => (
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
        </Form>
      </Modal>
    </div>
  );
};

export default ProfileDetails;
