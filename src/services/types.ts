export interface customError {
    data: {
        message: string | string[];
    };
    status: number;
}
export interface User {
  bio: any;
  gender: any;
  phoneNumber: any;
  user: any;
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  password: string;
  createdAt: string;
  isOnboarded: boolean;
  profileImage: any;
}

export interface UserDataType {
  id: number;
  userId: number;
  profileImage: any;
  skills: any[];
  stakeholderLinks: any;
  bio: any;
  location: any;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  createdAt: string;
  updatedAt: string;
  user: User;
}

export interface LoginResponseType {
  user?: User;
  access_token?: string;
}

export interface ProfileResponseType {
  data?: User;
  access_token?: string;
}

// Define TabItem interface
export interface TabItem {
  key: string;
  label: React.ReactNode;
  children: React.ReactNode;
}

// Define TabsProps type
export type TabsProps = {
  items: TabItem[];
};

export interface SectionsPageProps {
    sectionsData: {
        firstName?: string;
        lastName?: string;
        email?: string;
        phoneNumber?: string;
        dateOfBirth?: string;
        role?: string
    };
    setSectionsData: React.Dispatch<React.SetStateAction<{ role: string } | null>>;
}


export interface OpportunitiesResponseType {
  status: number;
  message: string;
  data: OpportunitiesType[];
}

export interface InspirationsResponseType {
    status: number;
    message: string;
    data: InspirationsType[];
}
export interface OpportunitiesDetailsResponseType {
  status: number;
  message: string;
  data: OpportunitiesType;
}

export interface OpportunitiesType {
  id: number;
  title: string;
  description: string;
  location: string;
  salary: Salary;
  qualifications: string[];
  status: string;
  interested: any[];
  employer: Employer;
  positions: number;
  experience: string;
  jobCategory: string;
  jobType: string;
  applicationDeadline: string;
  companyName: string;
  contactEmail: string;
  createdAt: string;
  updatedAt: string;
}

export interface InspirationsType {
    id: number,
    title: string,
    content: string,
    mentor: User,
    likes: number,
    createdAt: string;
}

export interface Employer{
    id: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email?: string;
    role: string;
}

export interface Salary {
  min: number;
  max: number;
}
export interface Message {
//   id: number;
  content: string;
  senderId: number;
  receiverId: number;
  createdAt: string;
  isRead: boolean;
}

export interface ConversationType {
  id: number;
  messages: Message[];
  createdAt: string;
}

export interface ConversationsResponseType {
  status: string;
  data: ConversationType[];
}

export interface ConversationDetailsResponseType {
  status: string;
  data: ConversationType;
}

export interface MessagesResponseType {
  status: string;
  data: Message[];
}

export interface ProductDto {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl?: any;
  createdAt: string;
  userId: number;
}

export interface CreateProductDto {
  name: string;
  category: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl?: any;
}

export interface ProductsResponseType {
  success: boolean;
  message: string;
  data: ProductDto[];
}

export interface ProductDetailsResponseType {
  success: boolean;
  message: string;
  data: ProductDto;
}

export interface ProductType {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  status: string;
  sellerId: number;
  quantity: number;
  images: string[];
  createdAt: string;
  updatedAt: string;
}
export interface Notification {
    id: number;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

export interface NotificationResponse {
    data: Notification[];
}

export interface CreateNotificationRequest {
    title: string;
    message: string;
}


export interface MentorshipSession {
  id: string;
  title: string;
  notes: string;
  sessionDate: string;
  duration: number;
  mentorId: number;
  youthId: number;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'CONFIRMED';
  meetingLink?: string; // For online sessions
  createdAt: string;
  updatedAt: string;
}

export interface CreateMentorshipSessionDto {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  mentorId: number;
  youthId: number;
  location?: string;
  meetingLink?: string;
}

export interface UpdateMentorshipSessionDto extends Partial<CreateMentorshipSessionDto> {
  status?: 'scheduled' | 'completed' | 'cancelled';
}

export interface MentorshipSessionResponse {
  status: string;
  data: MentorshipSession;
}

export interface MentorshipSessionsResponse {
  status: string;
  data: MentorshipSession[];
}
