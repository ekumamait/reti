import React, {useEffect, useState} from 'react';
import {Button, Progress, Form, notification} from 'antd';
import WelcomePage from './WelcomePage';
import InformationPage from './InformationPage';
import RetiCandidatePage from './RetiCandidatePage';
import AdditionalInformationPage from './AdditionalInformationPage';
import {useUpdateProfileMutation} from "../../services/profiles.ts";
import {userDetails} from "../../utils.ts";
import {useNavigate} from "react-router-dom";
import OnboardSuccessPage from './OnboardSuccessPage';

interface InformData {
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    dateOfBirth?: string;
    role?: string
}

interface AdditionalInformation {
    aboutMe?: string;
    profilePicture?: string;
}

const Onboarding: React.FC = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
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
                <InformationPage formData={formData} setFormData={setFormData} />),
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
            content: () => <AdditionalInformationPage formData={formData} setFormData={setFormData}/>,
            key: 'lastData',
        },
    ];
    const [updateUser, {isSuccess}] = useUpdateProfileMutation()
    const progressPercentage = ((current + 1) / steps.length) * 100;

    const handleFormChange = (changedValues: any, allValues: any) => {
        setFormData(prev => ({ 
            ...prev, 
            ...allValues,
            sectionsData: {
                ...prev.sectionsData,
                ...allValues.sectionsData
            }
        }));
    };

    const handleFinish = async () => {
        console.log(formData, '>>>>');
        
        try {
            await updateUser({
                profile: {
                    ...formData,
                    role: formData.sectionsData,
                },
                profileId: userDetails()?.data.id
            }).unwrap();
            
            setSubmissionStatus('success');
            localStorage.removeItem('userDetails');
        } catch (error) {
            notification.error({
                message: 'Submission Failed',
                description: 'Please review your information and try again'
            });
            setSubmissionStatus('error');
        }
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
                        <div  className="sm:h-[500px] px-2 w-full sm:overflow-hidden">
                           
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
                                    onClick={() => next()}
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
