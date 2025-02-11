import React, { useState } from 'react';
import { Button, Progress, Form } from 'antd';
import WelcomePage from './WelcomePage';
import InformationPage from './InformationPage';
import RetiCandidatePage from './RetiCandidatePage';
import AdditionalInformationPage from './AdditionalInformationPage';
import { useCreateProfileMutation } from "../../services/profiles.ts";
import { userDetails } from "../../utils.ts";
import OnboardSuccessPage from './OnboardSuccessPage';
import moment from 'moment';

const Onboarding: React.FC = () => {
    const [form] = Form.useForm();
    const [current, setCurrent] = useState(0);
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const next = () => setCurrent((prev) => prev + 1);
    const prev = () => setCurrent((prev) => prev - 1);

    const steps = [
        {
            title: 'Welcome',
            content: () => <WelcomePage />,
            key: 'welcomeData',
        },
        {
            title: 'Second',
            content: () => (
                <InformationPage setFormData={setFormData} />),
            key: 'informationData',
        },
        {
            title: 'Third',
            content: () => (
                <RetiCandidatePage formData={formData} setFormData={setFormData} />
            ),
            key: 'sectionsData',
        },
        {
            title: 'four',
            content: () => <AdditionalInformationPage formData={formData} setFormData={setFormData} />,
            key: 'lastData',
        },
    ];
    const [updateUser] = useCreateProfileMutation()
    const progressPercentage = ((current + 1) / steps.length) * 100;

    const handleFormChange = (allValues: any) => {
        setFormData(prev => ({
            ...prev,
            ...allValues,
            sectionsData: {
                ...prev.sectionsData,
                ...allValues.sectionsData
            },
            lastData: {
                ...prev.lastData,
                ...allValues.lastData
            }
        }));
    };

    const handleFinish = async () => {
        const finalValues = { ...formData, ...form.getFieldsValue() };
        const { firstName, lastName, ...restData } = finalValues;
        const age = moment().diff(finalValues.dateOfBirth, 'years');

        const profilePayload = {
            ...restData,
            age: age,
        };

        const response = await updateUser({
            profile: profilePayload,
            profileId: userDetails()?.user.id
        }).unwrap();
        console.log(response);
        setSubmissionStatus('success');
        localStorage.removeItem('userDetails');
    };

    if (submissionStatus === 'success') {
        return <OnboardSuccessPage />;
    }

    return (
        <div className='py-20'>
            <div className="mx-auto max-w-2xl">
                <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                    <Form
                        form={form}
                        onFinish={handleFinish}
                        onValuesChange={handleFormChange}
                        initialValues={formData}
                    >
                        {/* Progress bar & step text */}
                        <div className='px-2'>
                            <div className="font-semibold text-sm text-gray-900">
                                Step {current + 1} of {steps.length}
                            </div>
                            <Progress percent={progressPercentage} showInfo={false} />
                        </div>

                        {/* Step content */}
                        <div className="sm:h-[500px] px-2 w-full sm:overflow-hidden">

                            {/* {steps[current].content} */}
                            {steps[current].content()}
                        </div>

                        {/* Navigation buttons */}
                        <div className="mt-10 text-right">
                            {current > 0 && (
                                <Button className="ml-2 w-24" onClick={() => prev()}>
                                    Back
                                </Button>
                            )}
                            {current < steps.length - 1 ? (
                                <Button
                                    className="ml-2 w-24"
                                    type="primary"
                                    onClick={() => {
                                        form
                                            .validateFields()
                                            .then(() => {
                                                setFormData((prev) => ({ ...prev, ...form.getFieldsValue() })); // Ensure all fields are saved
                                                if (current < steps.length - 1) {
                                                    next(); // Move to next step only if it's not the last
                                                }
                                            })
                                            .catch((err) => console.log('Validation Failed:', err));
                                    }}
                                >
                                    Next
                                </Button>


                            ) : (
                                <Button
                                    className="ml-2 w-24"
                                    type="primary"
                                    htmlType="submit"
                                >
                                    Finish
                                </Button>
                            )}
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
