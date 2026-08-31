import { Link } from "react-router-dom";
import { Layout, Typography } from "antd";
import reti from "../../assets/reti.png";

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

export default function PrivacyPage() {
  return (
    <Layout className="min-h-screen bg-white">
      <Header className="sticky top-0 z-50 w-full bg-white shadow-sm px-0 h-20 flex items-center">
        <div className="container mx-auto flex justify-between items-center px-4">
          <Link to="/" className="flex items-center space-x-2">
            <img alt="RETI" src={reti} className="h-16 w-auto" />
          </Link>
          <Link to="/register" className="text-gray-600 text-sm font-medium hover:text-[#FF0000]">
            Back to Sign up
          </Link>
        </div>
      </Header>

      <Content className="flex-1">
        <div className="container mx-auto px-4 py-10 max-w-3xl">
          <Title level={2}>Privacy Policy – ReTivate Platform</Title>
          <Paragraph className="text-gray-500">
            Last updated: 22 August 2026
          </Paragraph>

          <Title level={4}>Data Responsibility and Contact Information</Title>
          <Paragraph>
            The Refugee and Host Community Youth Empowerment &amp; Transformation Initiative (RETI),
            implemented by Muni University in collaboration with Gulu University, Bishop Stuart
            University and six non-university partners: Finn Church Aid, DanChurchAid, Community
            Empowerment for Rural Development, PALM Corps, Meeting Point Kitgum, and Young African
            Refugees for Integral Development, is responsible for the information processed through
            the ReTivate digital platform.
          </Paragraph>

          <Title level={4}>Information We Collect</Title>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li>Personal details: name, phone number, refugee ID, National ID, email, gender, date of birth</li>
            <li>Profile data: skills, education, work experience, certifications, demographics</li>
            <li>Platform activity: job applications, mentorship requests, product listings, chats</li>
            <li>Technical data: login credentials, session activity, device/browser information</li>
          </ul>

          <Title level={4}>Purposes of Processing</Title>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li>Enable access to employment, mentorship, and training opportunities</li>
            <li>Facilitate communication between young people, employers, mentors, and staff</li>
            <li>Support monitoring, reporting, and analytics for program improvement</li>
            <li>Ensure compliance with donor frameworks and data protection laws</li>
            <li>Provide technical support and maintain platform security</li>
          </ul>

          <Title level={4}>Legal Basis</Title>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li>Consent (registration and profile creation)</li>
            <li>Contractual necessity (service delivery)</li>
            <li>Legitimate interest (monitoring and improvement)</li>
            <li>Legal obligations (GDPR, Ugandan Data Protection Act)</li>
          </ul>

          <Title level={4}>Data Sharing</Title>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li>Program partners (Muni University, DCA, MPK, BSU, CEFORD, FCA, Palm Corps, YARID, Gulu University)</li>
            <li>Employers and mentors engaged by users</li>
            <li>Donors and stakeholders (aggregated, non-identifiable data)</li>
            <li>Third-party service providers under strict agreements</li>
          </ul>

          <Title level={4}>Data Retention</Title>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li>Retained only as long as necessary for program delivery and reporting</li>
            <li>Inactive accounts anonymized or deleted after 36 months</li>
            <li>Aggregated data retained for donor reporting and evaluation</li>
          </ul>

          <Title level={4}>Security Measures</Title>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li>Secure authentication and optional two-factor login</li>
            <li>Encryption of data in transit and at rest</li>
            <li>Role-based access control</li>
            <li>Regular audits and incident response protocols</li>
          </ul>

          <Title level={4}>Your Rights</Title>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li>Access, correction, deletion of data</li>
            <li>Withdraw consent</li>
            <li>Object to profiling or automated decisions</li>
          </ul>

          <Title level={4}>Consequences of Non-Consent</Title>
          <Paragraph>
            Without providing personal data, access to certain platform features (jobs, mentorship,
            training) may be restricted.
          </Paragraph>

          <Title level={4}>Complaints</Title>
          <Paragraph>
            Complaints can be lodged with the RETI complaints system using the following channels:
            Toll free line –{" "}
            <a href="tel:0800300304" className="text-red-500 hover:underline">0800300304</a>, Email:{" "}
            <a href="mailto:reti_complaints@muni.ac.ug" className="text-red-500 hover:underline">
              reti_complaints@muni.ac.ug
            </a>
            {" "}and WhatsApp{" "}
            <a href="tel:0753996870" className="text-red-500 hover:underline">0753996870</a>.
          </Paragraph>
        </div>
      </Content>

      <Footer className="bg-gray-100 pt-8 pb-6">
        <Paragraph className="text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Refugee and Host Community Youth Empowerment and
          Transformation Initiative (RETI). All rights reserved.
        </Paragraph>
      </Footer>
    </Layout>
  );
}
