import {Input, Form, Button} from "antd";
import {Upload, message} from "antd";
import {InboxOutlined} from "@ant-design/icons";

const {Dragger} = Upload;

const AdditionalInformationPage = ({setAdditionalData}) => {
    const {TextArea} = Input;
    const [form] = Form.useForm();
    const props = {
        name: "file",
        multiple: false,
        accept: "image/*", // Restricts to images only
        action: "/upload", // Replace with your upload endpoint
        onChange(info: any) {
            const {status} = info.file;
            if (status === "done") {
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === "error") {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };


    return (
        <div className="space-y-6">
            <div className="mt-2">
                <div className="text-xl/8 font-semibold text-gray-900 sm:text-lg/9">
                    <p>Additional Information</p>
                </div>
            </div>
            <Form form={form} layout="vertical">
                <Form.Item label="About me" className="my-24" name="bio">
                    <TextArea placeholder="" allowClear/>
                </Form.Item>

                <Form.Item className="my-24" label="Upload a profile picture" name="profilePicture">
                    <Dragger
                        {...props}
                    >
                        <p className="text-center text-2xl">
                            <InboxOutlined/>
                        </p>
                        <p className="text-center text-gray-600 mt-2">
                            Upload or drag and drop
                        </p>
                        <p className="text-center text-gray-400 text-sm">
                            Only image files are supported.
                        </p>
                    </Dragger>
                </Form.Item>
                <Form.Item className="mt-36">
                    <Button type="default" block onClick={() => {
                        const values = form.getFieldsValue();
                        setAdditionalData(values);
                    }}>Save</Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default AdditionalInformationPage;
