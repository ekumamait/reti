import { Form } from 'antd';

const partners = [
    'Bishop Stuart University (BSU)',
    'CEFORD (CEF)',
    'Dan Church Aid (DCA)',
    'Finn Church Aid (FCA)',
    'Gulu University (GUN)',
    'Meeting Points Kitgum (MPK)',
    'Muni University (MUN)',
    'PALM Corps (PAC)',
    'YARID (YAR)'
];

const RetiCandidatePage = ({ formData, setFormData }) => {
    const [form] = Form.useForm();

    const handleRetiCandidateClick = (value: boolean) => {
        setFormData((prev) => ({ ...prev, isRetiCandidate: value, retiPartner: value ? prev.retiPartner : null }));
        form.setFieldsValue({ isRetiCandidate: value, retiPartner: value ? form.getFieldValue('retiPartner') : null });
    };

    const handlePartnerClick = (partner: string) => {
        setFormData((prev) => ({ ...prev, retiPartner: partner }));
        form.setFieldsValue({ retiPartner: partner });
    };

    return (
        <Form form={form} className="space-y-6" initialValues={{ isRetiCandidate: formData.isRetiCandidate }}>
            <div className="text-xl/8 font-semibold text-gray-900 sm:text-lg/9">
                <p>Are you a RETI candidate?</p>
            </div>

            <Form.Item
                name="isRetiCandidate"
                rules={[{ required: true, message: 'This field is required' }]}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[true, false].map((value) => (
                        <div
                            key={value.toString()}
                            onClick={() => handleRetiCandidateClick(value)}
                            className={`p-4 border rounded-lg cursor-pointer h-full transition-colors
                                ${form.getFieldValue('isRetiCandidate') === value
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'hover:border-blue-500'}`}
                        >
                            <span className="text-lg font-medium">
                                {value ? 'Yes' : 'No'}
                            </span>
                        </div>
                    ))}
                </div>
            </Form.Item>

            {form.getFieldValue('isRetiCandidate') && (
                <div className="space-y-6">
                    <div className="text-xl/8 font-semibold text-gray-900 sm:text-lg/9">
                        <p>Select your training partner</p>
                    </div>
                    <Form.Item
                        name="retiPartner"
                        rules={[{ required: true, message: 'Partner selection is required' }]}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {partners.map(partner => (
                                <div
                                    key={partner}
                                    onClick={() =>  handlePartnerClick(partner)}
                                    className={`p-4 border rounded-lg cursor-pointer h-full transition-colors
                                    ${form.getFieldValue('retiPartner') === partner
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'hover:border-blue-500'}`}
                                >
                                    <span className="font-medium">{partner}</span>
                                </div>
                            ))}
                        </div>
                    </Form.Item>
                </div>
            )}
        </Form>
    );
};

export default RetiCandidatePage;
