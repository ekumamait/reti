import React, { useState } from "react";
import { Button, Modal, Form, Input, InputNumber, DatePicker, Tag } from "antd";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const Projects = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProjectIndex, setEditingProjectIndex] = useState<number | null>(null);
    const [form] = Form.useForm();

    const [projects, setProjects] = useState([
        {
            name: "E-commerce App",
            description: "A platform for buying and selling products online.",
            startYear: 'Sept, 2020',
            endYear: 2023,
            skills: ["React", "Node.js", "MongoDB"],
        },
        {
            name: "Portfolio Website",
            description: "A personal website showcasing projects and achievements.",
            startYear: 'Jan, 2021',
            endYear: '2022',
            skills: ["HTML", "CSS", "JavaScript"],
        },
        {
            name: "E-commerce App",
            description: "A platform for buying and selling products online.",
            startYear: 'Aug, 2021',
            endYear: 'Present',
            skills: ["React", "Node.js", "MongoDB"],
        },
        {
            name: "Portfolio Website",
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim sint consectetur, quos et officiis voluptates dolorem laborum dolor! Nobis possimus laudantium corporis maiores aperiam praesentium a tempora velit asperiores voluptatem?",
            startYear: 'May, 2020',
            endYear: 2021,
            skills: ["HTML", "CSS", "JavaScript"],
        },
    ]);

    const openEditModal = (index: number) => {
        setEditingProjectIndex(index);
        setIsModalOpen(true);
        form.setFieldsValue(projects[index]);
    };

    const handleAddOrEdit = (values: any) => {
        if (editingProjectIndex !== null) {
            // Editing existing project
            const updatedProjects = [...projects];
            updatedProjects[editingProjectIndex] = { ...values };
            setProjects(updatedProjects);
        } else {
            // Adding new project
            setProjects([...projects, values]);
        }

        setIsModalOpen(false);
        setEditingProjectIndex(null);
    };

    const handleRemoveProject = (index: number) => {
        const updatedProjects = projects.filter((_, i) => i !== index);
        setProjects(updatedProjects);
    };

    return (
        <div className="pt-4 space-y-4">
            <div className="flex items-center justify-between border-b py-4">

                <h1 className="text-2xl font-semibold mb-4">Projects</h1>
                <Button type="text" icon={<EditOutlined />} className="text-red-500 mt-2" onClick={() => openEditModal("skills")}>
                    Edit
                </Button>

            </div>
        
            <div className="grid grid-cols-1 md:grid-cols-2 gap-20 w-full">
                {projects.map((project, index) => (
                    <div key={index} className="pt-8 space-y-2">
                        <h4 className="text-lg font-semibold mb-4 flex justify-between">
                            <span>{project.startYear}-  {project.endYear} </span>
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
                                    onClick={() => handleRemoveProject(index)}
                                />
                            </div>
                        </h4>
                        <p><strong>{project.name}</strong></p>
                        <p>{project.description}</p>
                        <div>
                            <strong>Skills Used:</strong>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {project.skills.map((skill, idx) => (
                                    <Tag key={idx} color="blue">
                                        {skill}
                                    </Tag>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            <Modal
                title={editingProjectIndex !== null ? "Edit Project" : "Add Project"}
                visible={isModalOpen}
                onCancel={() => {
                    setIsModalOpen(false);
                    setEditingProjectIndex(null);
                }}
                onOk={() => form.submit()}
                okText={editingProjectIndex !== null ? "Save" : "Add"}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleAddOrEdit}
                    initialValues={{
                        name: '',
                        description: '',
                        startYear: 2020,
                        endYear: 2021,
                        skills: [],
                    }}
                >
                    <Form.Item
                        label="Project Name"
                        name="name"
                        rules={[{ required: true, message: "Project name is required" }]}
                    >
                        <Input placeholder="Enter project name" />
                    </Form.Item>

                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[{ required: true, message: "Description is required" }]}
                    >
                        <Input.TextArea placeholder="Enter project description" />
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
                        label="Skills Used"
                        name="skills"
                        rules={[{ required: true, message: "Please select at least one skill" }]}
                    >
                        <Input
                            placeholder="Enter skills (comma separated)"
                            onBlur={(e) => {
                                form.setFieldsValue({
                                    skills: e.target.value.split(',').map((skill) => skill.trim())
                                });
                            }}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Projects;
