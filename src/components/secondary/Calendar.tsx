import { useState } from 'react';
import { Calendar, Badge, Modal, Form, Input, DatePicker, Button, Select } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { MentorshipSession } from '../../services/types';
import {
  useUpdateMentorshipSessionMutation,
  useCreateMentorshipSessionMutation,
  useGetMentorshipSessionsQuery,
} from '../../services/mentorship';
import { useGetAllUsersQuery } from '../../services/users';
import { loginDetails } from '../../utils';
import MentorshipSessionDetails from '../../layouts/DashboardPages/Forms/AddMentorshipSessionForm';
import { toast } from 'react-toastify';

const { RangePicker } = DatePicker;
const { TextArea } = Input;

const MentorshipCalendar = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedSession, setSelectedSession] = useState<MentorshipSession | null>(null);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const user = loginDetails();
  const userRole = user?.user?.role as 'mentor' | 'youth';
  const { data: sessions = [] } = useGetMentorshipSessionsQuery(userRole);
  const { data: usersData = [] } = useGetAllUsersQuery();
  const [createSession] = useCreateMentorshipSessionMutation();
  const [updateSession] = useUpdateMentorshipSessionMutation();

  const mentors = usersData?.data?.filter(user => user?.role === 'mentor');

  const dateCellRender = (value: Dayjs) => {
    const daySessions = sessions?.data?.filter(session =>
      value.isSame(dayjs(session?.sessionDate), 'day')
    );

    return (
      <ul className="events">
        {daySessions?.map(session => {
          const startTime = dayjs(session.sessionDate);
          const endTime = startTime.add(session.duration, 'minutes');
          const timeRange = `${startTime.format('HH:mm')} - ${endTime.format('HH:mm')}`;
          return (
            <li
              key={session.id}
              onClick={e => {
                e.stopPropagation();
                setSelectedSession(session);
                setIsDetailsVisible(true);
              }}
            >
              <Badge
                status={
                  session.status === 'CONFIRMED'
                    ? 'processing'
                    : session.status === 'COMPLETED'
                      ? 'success'
                      : 'error'
                }
                text={`${session.title} (${timeRange})`}
              />
            </li>
          );
        })}
      </ul>
    );
  };

  const handleDateSelect = (date: Dayjs) => {
    if (date.isBefore(dayjs().startOf('day')) || userRole === 'mentor') return;
    setSelectedDate(dayjs(date));
    setSelectedDate(date);
    setIsModalVisible(true);
  };

  const handleCreateSession = async (values: any) => {
    try {
      const [startTime, endTime] = values.duration;
      const sessionData = {
        title: values.title,
        notes: values.notes,
        sessionDate: selectedDate.toISOString(),
        duration: endTime.diff(startTime, 'minutes'),
        mentorId: user.role === 'mentor' ? user.id : values.mentorId,
        youthId: user.role === 'youth' ? user.id : values.youthId,
        meetingLink: values.meetingLink,
        status: 'PENDING',
      };
      await createSession(sessionData).unwrap();
      toast.success('Mentorship session created successfully!');
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      toast.error('Failed to create mentorship session');
    }
  };

  const handleEditSession = (session: MentorshipSession) => {
    setSelectedSession(session);
    setIsDetailsVisible(false);
    form.setFieldsValue({
      title: session.title,
      notes: session.notes,
      duration: [
        dayjs(session.sessionDate),
        dayjs(session.sessionDate).add(session.duration, 'minutes'),
      ],
      meetingLink: session.meetingLink,
      mentorId: session.mentorId,
      youthId: session.youthId,
      status: session.status,
    });
    setIsModalVisible(true);
  };

  return (
    <div className="px-2 text-center">
      <div className="mentorship-calendar">
        <Calendar dateCellRender={dateCellRender} onSelect={handleDateSelect} />
        <Modal
          title={selectedSession ? 'Edit Mentorship Session' : 'Create Mentorship Session'}
          open={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            setSelectedSession(null);
            form.resetFields();
          }}
          footer={null}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={selectedSession ? updateSession : handleCreateSession}
            initialValues={{
              date: selectedDate,
            }}
          >
            <Form.Item
              name="title"
              label="Session Title"
              rules={[{ required: true, message: 'Please enter session title' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="notes"
              label="Session Notes"
              rules={[{ required: true, message: 'Please enter session notes' }]}
            >
              <TextArea rows={4} />
            </Form.Item>

            <div className="grid grid-cols-2 gap-4">
                <Form.Item
                name="duration"
                label="Session Duration"
                rules={[{ required: true, message: 'Please select session duration' }]}
                >
                <RangePicker
                  picker="time"
                  format="hh:mm a"
                  minuteStep={15}
                  showTime={{ format: 'hh:mm a', use12Hours: true }}
                  style={{ width: '100%' }}
                  onChange={(dates) => {
                  if (dates) {
                    const [startDate] = dates;
                    setSelectedDate(dayjs(selectedDate).set('hour', startDate.hour()).set('minute', startDate.minute()));
                  } else {
                    setSelectedDate(null);
                  }
                  }}
                />
                </Form.Item>
              {selectedSession && userRole !== 'youth' && (
                <Form.Item
                  name="status"
                  label="Status"
                  rules={[{ required: true }]}
                >
                  <Select>
                    <Select.Option value="PENDING">Pending</Select.Option>
                    <Select.Option value="CONFIRMED">Confirmed</Select.Option>
                    <Select.Option value="COMPLETED">Completed</Select.Option>
                    <Select.Option value="CANCELLED">Cancelled</Select.Option>
                  </Select>
                </Form.Item>
              )}
            </div>

            <Form.Item name="meetingLink" label="Meeting Link">
              <Input placeholder="Online meeting link (if applicable)" />
            </Form.Item>

            {userRole === 'youth' && (
              <Form.Item
                name="mentorId"
                label="Select Mentor"
                rules={[{ required: true, message: 'Please select a mentor' }]}
              >
                <Select placeholder="Select mentor">
                  {mentors?.map(mentor => (
                    <Select.Option key={mentor.id} value={mentor.id}>
                      {`${mentor.firstName} ${mentor.lastName}`}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )}
            <Form.Item>
              <Button type="primary" htmlType="submit">
                {selectedSession ? 'Update Session' : 'Create Session'}
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        <MentorshipSessionDetails
          session={selectedSession}
          visible={isDetailsVisible}
          onClose={() => {
            setIsDetailsVisible(false);
            setSelectedSession(null);
          }}
          onEdit={handleEditSession}
          userRole={user?.role as 'mentor' | 'youth'}
        />
      </div>
    </div>
  );
};

export default MentorshipCalendar;
