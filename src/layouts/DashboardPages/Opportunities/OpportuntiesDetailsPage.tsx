import { useParams, useNavigate } from "react-router-dom";
import CustomAppTitle from "../../../components/secondary/CustomAppTitle";
import { Avatar, Button } from "antd";
import { Content } from "antd/es/layout/layout";
import { formatDistanceToNow } from "../../../utils";
import {
  EditOutlined,
  EnvironmentOutlined,
  MailOutlined,
  MoneyCollectOutlined,
  PhoneOutlined,
  ScheduleOutlined,
} from "@ant-design/icons";
import CustomDashboardLayout from "../../../components/secondary/CustomDashboardPagesLayout";
import Header from "../../../components/secondary/Header";
import {
  useGetOpportunityDetailsQuery,
  useDeleteOpportunityMutation,
} from "../../../services/opportunities.ts";
import DeletePopconfirm from "../../../components/secondary/CustomDeletePopUp";
import { useEffect, useState } from "react";
import AddOpportunitiesForm from "../Forms/AddOpportunityForm.tsx";
import { loginDetails } from "../../../utils";
import moment from "moment";
import Loader from "../../loader.tsx";
import { toast } from "react-toastify";
import Chat from "../../../components/secondary/Chat.tsx";
import { useCreateNotificationMutation } from "../../../services/notifications.ts";
import {
  useSendJobEmailMutation,
  useHasUserAppliedQuery,
} from "../../../services/jobEmail.ts";

const OpportunitiesDetailsPage = () => {
  const { id } = useParams();
  const userDetails = loginDetails();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { data, isLoading } = useGetOpportunityDetailsQuery(id);
  const [deleteJob] = useDeleteOpportunityMutation();
  const navigate = useNavigate();
  const jobCreatedDate = new Date(data?.data.createdAt);
  const [receiverId, setReceiverId] = useState(null);
  const [createNotification] = useCreateNotificationMutation();
  const [sendJobEmail, { isLoading: isSending }] = useSendJobEmailMutation();
  const [hasApplied, setHasApplied] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  const user_id = userDetails?.user.id;
  const jobId = data?.data?.id;
  const { data: hasAppliedData, refetch } = useHasUserAppliedQuery(
    jobId,
    user_id
  );

  useEffect(() => {
    if (hasAppliedData?.hasApplied !== undefined) {
      setHasApplied(hasAppliedData.hasApplied);
    }
  }, [hasAppliedData]);

  const handleDeleteJob = async () => {
    try {
      await deleteJob(Number(id)).unwrap();
      toast.success("Job deleted successfully!");
      navigate("/opportunities");
    } catch (error) {
      toast.error("Failed to delete job: " + error.message);
    }
  };

  const handleCancel = () => {
    setIsEditOpen(false);
  };

  const handleSendMessage = () => {
    const employerId = data?.data?.employer?.id;
    if (employerId) {
      setReceiverId(employerId);
    }
  };

  const handleApplyNow = async () => {
    const employerId = data?.data?.employer?.id;
    const { firstName, lastName } = userDetails.user;
    if (!employerId) {
      toast.error("Unable to find employer information.");
      return;
    }
    const notificationData = {
      title: "New Application Received",
      message: `${firstName} ${lastName} has applied for the job: ${data?.data?.title}.`,
      userId: employerId,
    };
    const emailData = {
      employerEmail: data?.data?.contactEmail,
      jobTitle: data?.data?.title,
      employerName:
        data?.data?.employer?.firstName + " " + data?.data?.employer?.lastName,
      applicantName:
        userDetails?.user.firstName + " " + userDetails?.user.lastName,
      applicantPhone: userDetails?.user.phoneNumber,
      jobId: data?.data?.id,
    };

    try {
      setIsApplying(true);
      await createNotification(notificationData).unwrap();
      await sendJobEmail(emailData).unwrap();
      toast.success("Your Application has been submitted");
      refetch();
    } catch (error) {
      toast.error("Failed to send notification: " + error.message);
    } finally {
      setIsApplying(false);
    }
  };

  const formattedInitialData = data?.data
    ? {
        id: data.data.id,
        title: data.data.title,
        description: data.data.description,
        jobType: data.data.jobType,
        jobCategory: data.data.jobCategory,
        location: data.data.location,
        companyName: data.data.companyName,
        contactEmail: data.data.contactEmail,
        positions: data.data.positions,
        experience: data.data.experience,
        minSalary: data.data.salary.min,
        maxSalary: data.data.salary.max,
        applicationDeadline: moment(data.data.applicationDeadline),
        qualifications: data.data.qualifications || [],
      }
    : null;

  return (
    <div>
      <Header pageTitle="Opportunity Details" />
      <CustomAppTitle showBackButton={true}></CustomAppTitle>
      <CustomDashboardLayout>
        {isLoading ? (
          <Loader />
        ) : (
          <Content className="bg-white mt-2 border border-gray-900/10 rounded-lg relative w-full max-w-3xl">
            <div className="sm:flex  justify-between">
              <div className="sm:w-8/12 border-r border-gray-200 p-6">
                {/* job section */}
                <div className="">
                  <h1 className="text-2xl font-bold text-gray-800 mb-4">
                    {data?.data.title}
                  </h1>

                  {data?.data.imageUrl && (
                    <div className="my-4">
                      <img
                        src={data.data.imageUrl}
                        alt="Opportunity"
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    </div>
                  )}

                  <div>
                    <h3 className="pt-2 text-lg font-semibold text-gray-900">
                      {" "}
                      {data?.data.companyName}
                    </h3>
                    <p className="text-sm text-gray-500">{`Posted ${formatDistanceToNow(
                      jobCreatedDate
                    )}`}</p>
                  </div>

                  <p className="text-md text-gray-700 mb-6">
                    {data?.data.description}
                  </p>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-800">
                      Application Deadline: {}
                      <span className="text-gray-600">
                        {new Date(
                          data?.data.applicationDeadline
                        ).toLocaleDateString()}
                      </span>
                    </h4>
                  </div>

                  <div className="">
                    <p className="text-sm truncate text-gray-500 flex items-center gap-2">
                      <span className="text-gray-400">
                        <EnvironmentOutlined />
                      </span>
                      {data?.data.location}
                    </p>

                    <p className="text-sm truncate text-gray-500 flex items-center gap-2">
                      <span className="text-gray-400">
                        <ScheduleOutlined />
                      </span>
                      {data?.data.jobType}
                    </p>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm truncate text-gray-500 flex items-center gap-2">
                      <span className="text-gray-400">
                        <MoneyCollectOutlined />
                      </span>
                      UGX {data?.data.salary.min} - UGX {data?.data.salary.max}
                    </p>
                  </div>

                  {loginDetails().user.role === "youth" && (
                    <Button
                      className="mt-4"
                      type="primary"
                      loading={isSending}
                      onClick={handleApplyNow}
                      disabled={hasApplied || isApplying}
                      htmlType="submit"
                      block
                      size="large"
                    >
                      {hasApplied ? "Already Applied" : "Apply Now"}
                    </Button>
                  )}
                </div>
              </div>

              {/* job post */}
              <div className="w-7/12">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Posted by
                  </h3>
                  <div className="flex items-center gap-x-3">
                    <Avatar>{data?.data.companyName[0]}</Avatar>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">
                        {data?.data.companyName}
                      </h4>
                      <p className="text-md text-gray-600"></p>
                    </div>
                  </div>

                  <div className="mt-2">
                    <h4 className="font-semibold text-gray-800">
                      Company:{" "}
                      <span className="text-gray-600">
                        {data?.data.companyName}
                      </span>
                    </h4>
                  </div>

                  <div className="mt-2">
                    <h4 className="font-semibold text-gray-800">Contact:</h4>

                    <p className="text-sm truncate text-gray-500 flex items-center gap-2 mt-2">
                      <span className="text-gray-400">
                        <MailOutlined />
                      </span>
                      {data?.data.contactEmail}
                    </p>
                    <p className="text-sm truncate text-gray-500 flex items-center gap-2 mt-2">
                      <span className="text-gray-400">
                        <EnvironmentOutlined />
                      </span>
                      {data?.data.location}
                    </p>
                    <p className="text-sm truncate text-gray-500 flex items-center gap-2 mt-2 mb-2">
                      <span className="text-gray-400">
                        <PhoneOutlined />
                      </span>
                      {data?.data?.employer?.phoneNumber}
                    </p>
                  </div>

                  <div className="mt-2">
                    <Button
                      className="bg-green-600 text-white hover:bg-green-700"
                      type="default"
                      onClick={handleSendMessage}
                    >
                      Start Chat
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            {loginDetails().user.role === "employer" ||
              (loginDetails().user.role === "super" && (
                <div className="absolute bottom-4 right-4 space-y-2">
                  <div>
                    <DeletePopconfirm
                      title="Delete"
                      description="Are you sure to delete this job?"
                      onConfirm={handleDeleteJob}
                      onConfirmMessage="Job deleted successfully"
                      onCancelMessage="Job deletion cancelled"
                      okText="Yes"
                      cancelText="No"
                    />
                  </div>
                  <div>
                    <EditOutlined
                      onClick={() => setIsEditOpen(true)}
                      className="text-blue-500 cursor-pointer text-lg"
                    />
                  </div>
                </div>
              ))}
            {loginDetails().user.role === "employer" && (
              <AddOpportunitiesForm
                onCancel={handleCancel}
                onOk={() => setIsEditOpen(false)}
                open={isEditOpen}
                loading={false}
                initialData={formattedInitialData}
                isEdit={true}
              />
            )}
          </Content>
        )}
      </CustomDashboardLayout>
      <Chat receiverId={receiverId} />
    </div>
  );
};

export default OpportunitiesDetailsPage;
