import React, { useState } from "react";
import { Button, Modal, Form, Input, InputNumber, Tag } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const Experience = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [form] = Form.useForm();

    const [experiences, setExperiences] = useState([
        {
            type: "Work",
            company: "Tech Corp",
            position: "Software Engineer",
            startYear: 2020,
            endYear: 2023,
            description: "Worked on developing web applications.",
            skills: ["React", "Node.js", "MongoDB"],
        },
        {
            type: "Work",
            company: "Corp",
            position: " Engineer",
            startYear: 2020,
            endYear: 2023,
            description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Molestias magni autem quam, eligendi culpa eum minima sit dicta delectus nihil numquam quaerat, doloremque voluptas molestiae iusto velit. Ea, delectus eum!",
            skills: ["React", "Node.js", "MongoDB"],
        },
    ]);

    const openEditModal = (index: number) => {
        setEditingIndex(index);
        setIsModalOpen(true);
        if (index >= 0) {
            form.setFieldsValue(experiences[index]);
        } else {
            form.resetFields();
        }
    };

    const handleAddOrEdit = (values: any) => {
        if (editingIndex !== null && editingIndex >= 0) {
            const updatedExperiences = [...experiences];
            updatedExperiences[editingIndex] = { ...values };
            setExperiences(updatedExperiences);
        } else {
            setExperiences([...experiences, { ...values, skills: [] }]);
        }
        setIsModalOpen(false);
        setEditingIndex(null);
    };

    const handleRemoveExperience = (index: number) => {
        setExperiences(experiences.filter((_, i) => i !== index));
    };

    return (
        <div className="pt-4 space-y-4">
            <div className="flex items-center justify-between border-b py-4">
                <h1 className="text-2xl font-semibold">Work Experience</h1>
            </div>

            <div className="">
                
                {experiences.length > 0 ? (
                    experiences.map((entry, index) => (
                        <div key={index} className="py-8 grid grid-cols-1 md:grid-cols-2 gap-6 w-full border-b">
                            <div className="flex justify-between mb-2">
                                <span>{entry.position} at {entry.company}</span>
                            </div>
                            <div>
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="font-semibold">{entry.position}</span>
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
                                                onClick={() => handleRemoveExperience(index)}
                                            />
                                        </div>
                                    </div>
                                    <span className="font-semibold py-2">{entry.company}</span>
                                    <p className="py-2">{entry.description}</p>
                                    <div>
                                        {/* <strong>Skills Used:</strong> */}
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {entry.skills.map((skill, idx) => (
                                                <Tag key={idx} color="blue">
                                                    {skill}
                                                </Tag>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    ))
                ) : (
                    <p>No experiences added yet. Click "Add Experience" to get started!</p>
                )}
            </div>

            <Modal
                title={editingIndex !== null ? "Edit Experience" : "Add Experience"}
                visible={isModalOpen}
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
                        type: "Work",
                        company: "",
                        position: "",
                        startYear: 2020,
                        endYear: 2023,
                        description: "",
                    }}
                >
                    <Form.Item
                        label="Type"
                        name="type"
                        rules={[{ required: true, message: "Type is required" }]}
                    >
                        <Input placeholder="e.g., Work, Internship" />
                    </Form.Item>
                    <Form.Item
                        label="Company"
                        name="company"
                        rules={[{ required: true, message: "Company name is required" }]}
                    >
                        <Input placeholder="Enter company name" />
                    </Form.Item>
                    <Form.Item
                        label="Position"
                        name="position"
                        rules={[{ required: true, message: "Position is required" }]}
                    >
                        <Input placeholder="Enter your position" />
                    </Form.Item>
                    <Form.Item
                        label="Start Year"
                        name="startYear"
                        rules={[{ required: true, message: "Start year is required" }]}
                    >
                        <InputNumber
                            min={2000}
                            max={new Date().getFullYear()}
                            style={{ width: "100%" }}
                        />
                    </Form.Item>
                    <Form.Item
                        label="End Year"
                        name="endYear"
                        rules={[
                            { required: true, message: "End year is required" },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || value >= getFieldValue("startYear")) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(
                                        new Error("End year cannot be before start year")
                                    );
                                },
                            }),
                        ]}
                    >
                        <InputNumber
                            min={2000}
                            max={new Date().getFullYear()}
                            style={{ width: "100%" }}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[
                            { required: true, message: "Description is required" },
                        ]}
                    >
                        <Input.TextArea placeholder="Describe your experience" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Experience;




