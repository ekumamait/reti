import React, { useState } from "react";
import { Button, Progress, Form } from "antd";
import WelcomePage from "./WelcomePage";
import InformationPage from "./InformationPage";
import RetiCandidatePage from "./RetiCandidatePage";
import AdditionalInformationPage from "./AdditionalInformationPage";
import CitizenshipPage from "./CitizenshipPage";
import { useCreateProfileMutation } from "../../services/profiles.ts";
import { userDetails } from "../../utils.ts";
import OnboardSuccessPage from "./OnboardSuccessPage";
import moment from "moment";

const Onboarding: React.FC = () => {
  const [form] = Form.useForm();
  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [submissionStatus, setSubmissionStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const next = () => setCurrent((prev) => prev + 1);
  const prev = () => setCurrent((prev) => prev - 1);

  const steps = [
    {
      title: "Welcome",
      content: () => <WelcomePage />,
      key: "welcomeData",
    },
    {
      title: "Second",
      content: () => <InformationPage form={form} setFormData={setFormData} />,
      key: "informationData",
    },
    {
      title: "Third",
      content: () => (
        <RetiCandidatePage
          form={form}
          formData={formData}
          setFormData={setFormData}
        />
      ),
      key: "sectionsData",
    },
    {
      title: "Citizenship Status",
      content: () => (
        <CitizenshipPage
          form={form}
          formData={formData}
          setFormData={setFormData}
        />
      ),
      key: "citizenshipData",
    },
    {
      title: "Additional Information",
      content: () => (
        <AdditionalInformationPage
          form={form}
          formData={formData}
          setFormData={setFormData}
        />
      ),
      key: "additionalInformation",
    },
  ];
  const [updateUser] = useCreateProfileMutation();
  const progressPercentage = ((current + 1) / steps.length) * 100;

  const handleFormChange = (allValues: any) => {
    setFormData((prev) => ({
      ...prev,
      ...allValues,
      sectionsData: {
        ...prev.sectionsData,
        ...allValues.sectionsData,
      },
      lastData: {
        ...prev.lastData,
        ...allValues.lastData,
      },
    }));
  };

  const handleFinish = async () => {
    if (current === steps.length - 1) {
      const finalValues = { ...formData, ...form.getFieldsValue() };
      const { firstName, lastName, ...restData } = finalValues;

      // Correct age calculation
      const age = moment().diff(
        moment(finalValues.dateOfBirth),
        "years",
        false
      );

      // Prepare payload without retiPartner if not a RETI candidate
      const profilePayload = {
        ...restData,
        age: age,
      };

      // Only include retiPartner if isRetiCandidate is true
      if (finalValues.isRetiCandidate) {
        profilePayload.retiPartner = finalValues.retiPartner;
      }

      await updateUser({
        profile: profilePayload,
        profileId: userDetails()?.user.id,
      }).unwrap();
      setSubmissionStatus("success");
      localStorage.removeItem("userDetails");
    }
  };

  if (submissionStatus === "success") {
    return <OnboardSuccessPage />;
  }

  return (
    <div>
      <div className="mx-auto max-w-2xl">
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <Form
            form={form}
            scrollToFirstError
            onFinish={handleFinish}
            onValuesChange={handleFormChange}
            initialValues={formData}
          >
            {/* Progress bar & step text */}
            <div className="px-2">
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
            <div className="fixed sm:static bottom-2 left-0 right-0 sm:right-auto sm:bottom-auto sm:ml-auto sm:mr-0 sm:mt-4">
              <div className="flex justify-end gap-2 max-w-2xl mx-auto sm:mx-0 sm:max-w-none px-4 sm:px-0">
                {current > 0 && (
                  <Button className="w-24" onClick={() => prev()}>
                    Back
                  </Button>
                )}
                {current < steps.length - 1 ? (
                  <Button
                    className="w-24"
                    type="primary"
                    onClick={() => {
                      form
                        .validateFields()
                        .then(() => {
                          setFormData((prev) => ({
                            ...prev,
                            ...form.getFieldsValue(),
                          }));
                          if (current < steps.length - 1) {
                            next();
                          }
                        })
                        .catch((err) => console.log("Validation Failed:", err));
                    }}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    className="w-24"
                    type="primary"
                    onClick={() => {
                      form
                        .validateFields()
                        .then(() => {
                          handleFinish();
                        })
                        .catch((err) => {
                          console.error("Validation Failed:", err?.errorFields);
                          // Optionally, you can display a toast or message here
                          // toast.error("Please fill in all required fields.");
                        });
                    }}
                  >
                    Finish
                  </Button>
                )}
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
