import { Form, Radio, Space } from 'antd';

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

const RetiCandidatePage = ({ sectionsData, setSectionsData }) => {
	const handleSelection = (value: string) => {
        setSectionsData(value);
    };
    return (
        <div className="space-y-6">
            <div className="text-xl/8 font-semibold text-gray-900 sm:text-lg/9">
                <p>Are you a RETI candidate?</p>
            </div>
            
            <Form.Item
                name="isRetiCandidate"
                rules={[{ required: true, message: 'This field is required' }]}
            >
                <Radio.Group>
                    <Space direction="vertical">
                        <Radio value={true}>Yes</Radio>
                        <Radio value={false}>No</Radio>
                    </Space>
                </Radio.Group>
            </Form.Item>

            <Form.Item
                noStyle
                shouldUpdate={(prev, current) => prev.isRetiCandidate !== current.isRetiCandidate}
            >
                {({ getFieldValue }) => getFieldValue('isRetiCandidate') && (
                    <Form.Item
                        name="retiPartner"
                        label="Select your training partner"
                        rules={[{ required: true, message: 'Partner selection is required' }]}
                    >
                        <Radio.Group>
                            <Space direction="vertical">
                                {partners.map(partner => (
                                    <Radio key={partner} value={partner}>
                                        {partner}
                                    </Radio>
                                ))}
                            </Space>
                        </Radio.Group>
                    </Form.Item>
                )}
            </Form.Item>
        </div>
    );
}; 
export default RetiCandidatePage;