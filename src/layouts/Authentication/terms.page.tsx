import { Link } from "react-router-dom";
import { Layout, Typography } from "antd";
import reti from "../../assets/reti.png";

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

export default function TermsPage() {
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
          <Title level={2}>Terms of Service – ReTivate Platform</Title>
          <Paragraph className="text-gray-500">
            Last updated: 22 August 2026
          </Paragraph>

          <Title level={4}>Eligibility</Title>
          <Paragraph>
            To use the ReTivate platform, you must be a legal resident of Uganda or a registered
            participant in the RETI program and have a valid Ugandan phone number for account
            verification.
          </Paragraph>

          <Title level={4}>Access</Title>
          <Paragraph>
            The ReTivate platform is accessible via web browsers and mobile devices. Users may log in
            directly through the official website or other approved access points provided.
          </Paragraph>

          <Title level={4}>Account Creation</Title>
          <Paragraph>
            When creating a ReTivate account, you will be required to provide your name, mobile phone
            number, age, location, gender, refugee and national ID number. You will also set a secure
            password to protect your account. It is your responsibility to keep your account details
            accurate and up to date at all times.
          </Paragraph>

          <Title level={4}>Logging Out</Title>
          <Paragraph>
            You can log out of ReTivate by pressing the "Logout" function. Logging out does not delete
            your account but is a temporary exit from your account on your device.
          </Paragraph>

          <Title level={4}>Managing Your Account</Title>
          <Paragraph>
            You may receive notifications or updates from ReTivate even when logged out. If you no
            longer wish to use ReTivate services, you can deactivate your account through the account
            settings.
          </Paragraph>

          <Title level={4}>Safety, Security, and Complaints</Title>
          <Paragraph>
            Your ReTivate account is protected by your password, which you should not share with
            anyone. If you forget your password, you can reset it using the phone number or email
            registered with ReTivate.
          </Paragraph>
          <Paragraph>
            We value the privacy of your data. Any reports produced and shared will be de-personalized
            and guided by our{" "}
            <Link to="/privacy" className="text-red-500 hover:underline">Privacy Policy</Link>.
          </Paragraph>
          <Paragraph>
            If you have complaints about our services, please report them immediately via the help and
            support function. We will respond within 5 business days.
          </Paragraph>

          <Title level={4}>Intellectual Property</Title>
          <Paragraph>
            All intellectual property rights in the ReTivate platform and its content remain vested in
            Muni University and DanChurchAid (DCA). You shall not reproduce, distribute, or otherwise
            use any content or materials found on the platform without prior written consent.
          </Paragraph>

          <Title level={4}>User Conduct</Title>
          <Paragraph>
            You agree not to use the ReTivate platform for any unlawful or prohibited purpose. You
            shall not transmit material that is offensive, defamatory, or infringes on the rights of
            others.
          </Paragraph>

          <Title level={4}>Termination</Title>
          <Paragraph>
            We may terminate your use of the ReTivate platform if you breach these terms. We may also
            discontinue the platform or any part of it at any time, without notice or liability.
          </Paragraph>

          <Title level={4}>Limitation of Liability</Title>
          <Paragraph>
            We shall not be liable for any loss or damage arising out of your use of the ReTivate
            platform, including but not limited to loss of data, or any other consequential or
            indirect loss.
          </Paragraph>

          <Title level={4}>Indemnification</Title>
          <Paragraph>
            You agree to indemnify and hold harmless the RETI program from any claim, demand, or
            damage, including reasonable legal fees, arising out of your use of the ReTivate platform
            or violation of these terms.
          </Paragraph>

          <Title level={4}>Governing Law</Title>
          <Paragraph>
            These terms shall be governed by and construed in accordance with the laws of Uganda. Any
            dispute arising out of your use of the ReTivate platform shall be subject to the exclusive
            jurisdiction of the courts of Uganda.
          </Paragraph>

          <Title level={4}>Modification</Title>
          <Paragraph>
            We reserve the right to modify or amend these terms at any time. Any changes will be
            effective immediately upon posting on the ReTivate platform. Continued use of the platform
            following changes shall be deemed acceptance of those changes.
          </Paragraph>

          <Title level={4}>Contact Information</Title>
          <Paragraph>
            If you have questions about these terms, please contact us via the help and support
            section on the platform.
          </Paragraph>

          <Paragraph className="text-gray-500 text-sm">
            Note: These terms and conditions are subject to change at any time without prior notice.
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
