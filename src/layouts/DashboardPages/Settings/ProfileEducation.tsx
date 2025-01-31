import React, { useState } from "react";
import { Button, Modal, Form, Input, InputNumber } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const Education = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [form] = Form.useForm();

    const [educationList, setEducationList] = useState([
        {
            institution: "University of XYZ",
            degree: "Bachelor's in Computer Science",
            startYear: 2016,
            endYear: 2020,
            description: "Focused on software development and algorithms."
        },
        {
            institution: "ABC Institute of Technology",
            degree: "Master's in Data Science",
            startYear: 2021,
            endYear: 2023,
            description: "Specialized in big data and machine learning."
        }
    ]);

    const openEditModal = (index: number) => {
        setEditingIndex(index);
        setIsModalOpen(true);
        form.setFieldsValue(educationList[index]);
    };

    const handleAddOrEdit = (values: any) => {
        if (editingIndex !== null) {
            const updatedList = [...educationList];
            updatedList[editingIndex] = { ...values };
            setEducationList(updatedList);
        } else {
            setEducationList([...educationList, values]);
        }

        setIsModalOpen(false);
        setEditingIndex(null);
    };

    const handleRemoveEducation = (index: number) => {
        const updatedList = educationList.filter((_, i) => i !== index);
        setEducationList(updatedList);
    };

    return (
        <div className="pt-4 space-y-4">
            <div className="flex items-center justify-between border-b py-4">
                <h1 className="text-2xl font-semibold mb-4">Education</h1>
            </div>

            <div className="">
                
                {educationList.length > 0 ? (
                    educationList.map((entry, index) => (
                        <div key={index} className="py-8 grid grid-cols-1 md:grid-cols-2 gap-6 w-full border-b">
                            <div className="flex justify-between mb-2">
                                <span>{entry.institution}</span>
                            </div>
                            <div>
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="font-semibold">{entry.startYear} - {entry.endYear}</span>
                                        {/* <p>{entry.description}</p> */}
                                        <div className="flex gap-2">
                                            <Button
                                                size="small"
                                                icon={<EditOutlined />}
                                                onClick={() => openEditModal(index)}
                                            />
                                            <Button
                                                size="small"
                                                danger
                                                icon={<DeleteOutlined />}
                                                onClick={() => handleRemoveEducation(index)}
                                            />
                                        </div>
                                    </div>
                                    <span className="font-semibold py-2">{entry.degree}</span>
                                    <p className="py-2">{entry.description}</p>
                                  
                                </div>
                            </div>
                        </div>
                        
                    ))
                ) : (
                    <p>No education added yet. Click "Add Education" to get started!</p>
                )}
            </div>


            {/* Modal */}

            <Modal
                title={editingIndex !== null ? "Edit Education" : "Add Education"}
                open={isModalOpen}
                onCancel={() => {
                    setIsModalOpen(false);
                    setEditingIndex(null);
                }}
                onOk={() => form.submit()}
                okText={editingIndex !== null ? "Save" : "Add"}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleAddOrEdit}
                    initialValues={{
                        institution: "",
                        degree: "",
                        startYear: new Date().getFullYear(),
                        endYear: new Date().getFullYear(),
                        description: ""
                    }}
                >
                    <Form.Item
                        label="Institution"
                        name="institution"
                        rules={[{ required: true, message: "Institution name is required" }]}
                    >
                        <Input placeholder="Enter institution name" />
                    </Form.Item>

                    <Form.Item
                        label="Degree"
                        name="degree"
                        rules={[{ required: true, message: "Degree is required" }]}
                    >
                        <Input placeholder="Enter degree" />
                    </Form.Item>

                    <Form.Item
                        label="Start Year"
                        name="startYear"
                        rules={[{ required: true, message: "Start year is required" }]}
                    >
                        <InputNumber
                            min={2000}
                            max={new Date().getFullYear()}
                            placeholder="Start year"
                            style={{ width: "100%" }}
                        />
                    </Form.Item>

                    <Form.Item
                        label="End Year"
                        name="endYear"
                        rules={[{ required: true, message: "End year is required" }]}
                    >
                        <InputNumber
                            min={2000}
                            max={new Date().getFullYear()}
                            placeholder="End year"
                            style={{ width: "100%" }}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[{ required: true, message: "Please provide a description" }]}
                    >
                        <Input.TextArea placeholder="Describe your education" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Education;
