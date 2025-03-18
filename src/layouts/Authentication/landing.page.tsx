import { Link } from "react-router-dom"
import { Button, Card, Typography, Layout, Row, Col } from "antd"

const { Title, Paragraph, Text } = Typography
const { Header, Content, Footer } = Layout
import logos from "../../constants/logos.ts"
import reti from "../../assets/reti.png"
import background from "../../assets/background.png"
import mastercardLogo from "../../assets/logos/MasterCard.png";
import muniLogo from "../../assets/logos/muni.png";


export default function LandingPage() {
  return (
    <Layout className="min-h-screen bg-white">
      {/* Navbar */}
      <Header className="sticky top-0 z-50 w-full bg-white shadow-sm px-0 h-20 flex items-center">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <img alt="Your Company" src={reti || "/placeholder.svg"} className="h-20 w-auto mx-auto" />
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-gray-600 text-sm font-medium hover:text-[#FF0000]">
              Login
            </Link>
            <Button
              block
              type="primary"
              style={{ backgroundColor: "#FF0000", borderColor: "#FF0000" }}
              className="hover:bg-red-700"
            >
              <Link to="/register" className="text-white">
                Sign up
              </Link>
            </Button>
          </div>
        </div>
      </Header>

      <Content className="flex-1">
        {/* Hero Section with Slider */}
        <section className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              backgroundImage: `url(${background})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              opacity: "0.3",
            }}
          ></div>

          <div className="absolute inset-0 bg-black bg-opacity-30"></div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="container mx-auto px-4 relative z-10">
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center max-w-5xl mx-auto">
                {logos.map((logo, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-center p-6 bg-white rounded-lg shadow-lg w-full h-full transform transition-transform hover:scale-105"
                    style={{ minHeight: "150px" }}
                  >
                    <img
                      src={logo || "/placeholder.svg"}
                      alt={`Partner logo ${index + 1}`}
                      className="w-full h-auto object-contain"
                      style={{ maxHeight: "120px" }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* About Product Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container mx-auto px-4 md:px-6">
            <Row gutter={[64, 64]} align="middle">
              <Col xs={24} md={8} className="hidden md:flex justify-start">
                <div className="relative w-full max-w-md">
                  <div className="rounded-2xl bg-gray-200  shadow-xl p-6 relative z-10">
                    <div className="aspect-video bg-white rounded-lg mb-4 overflow-hidden flex items-center justify-center">
                      <img
                        src={muniLogo}
                        alt="Muni University"
                        className="max-width-full max-height-full object-contain"
                        style={{ maxHeight: "400px" }}
                      />
                    </div>
                    <Title level={4}>Muni University</Title>
                    <Paragraph className="text-gray-500">
                      To provide quality education, generate knowledge, promote innovations and community empowerment
                      for transformation.
                    </Paragraph>
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-full h-full bg-[#FF0000]/10 rounded-2xl"></div>
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div className="space-y-6">
                  <Title level={3} className="text-3xl font-bold tracking-tighter sm:text-4xl">
                    Refugee and Host Community Youth Empowerment and Transformation Initiative
                  </Title>
                  <Paragraph className="text-gray-600 md:text-lg">
                    <span className="text-red-500">⚽ </span>Refugee and host community young people in 15 districts
                    with dignified and fulfilling work by 2027.
                  </Paragraph>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1 text-[#FF0000] text-xl">✓</div>
                      <div>
                        <Text strong className="text-lg">
                          Employment
                        </Text>
                        <Paragraph className="text-gray-500">
                          The project intends to address unemployment challenges (Barriers) faced by young people aged
                          15 –35yrs, 70% refugees, 3% dissability
                        </Paragraph>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1 text-[#FF0000] text-xl">✓</div>
                      <div>
                        <Text strong className="text-lg">
                          Systemic changes
                        </Text>
                        <Paragraph className="text-gray-500">
                          Contribute to systemic changes such as shifts in policies, positive mindset-change,
                          relationships, and power dynamics
                        </Paragraph>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1 text-[#FF0000] text-xl">✓</div>
                      <div>
                        <Text strong className="text-lg">
                          Digital solutions
                        </Text>
                        <Paragraph className="text-gray-500">
                          Integration of digital solutions and Agribusiness, business incubation support, innovation
                          grants
                        </Paragraph>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1 text-[#FF0000] text-xl">✓</div>
                      <div>
                        <Text strong className="text-lg">
                          DCA strategic goal 2
                        </Text>
                        <Paragraph className="text-gray-500">
                          Alignment to Frameworks – DCA strategic goal 2, TVET Policy, NDP III, Vision 2040, SDG (4, 8)
                          & STA II
                        </Paragraph>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              <Col xs={24} md={8} className="hidden md:flex justify-end">
                <div className="relative w-full max-w-md">
                  <div className="rounded-2xl bg-white shadow-xl p-6 relative z-10">
                    <div className="aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden">
                      <img
                        src={mastercardLogo}
                        alt="MasterCard"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Title level={4}>In Partnership with Mastercard Foundation</Title>
                    <Paragraph className="text-gray-500">
                      Mastercard is working with businesses and governments around the world to improve the lives of the
                      billions of people.
                    </Paragraph>
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-full h-full bg-[#FF0000]/10 rounded-2xl"></div>
                </div>
              </Col>
            </Row>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
              <Title level={2} className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Powerful Features
              </Title>
              <Paragraph className="max-w-[85%] text-gray-500 md:text-xl">
                Integrating Entrepreneurship, Business Incubation and life skills.
              </Paragraph>
            </div>
            <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:grid-cols-3 lg:gap-8 mt-8">
              {[
                {
                  title: "Products",
                  description: "Access a wide range of resources, tools, and services from our community.",
                  emoji: "🛒",
                },
                {
                  title: "Opportunities",
                  description: "Find your next opportunity or post openings for your team.",
                  emoji: "💼",
                },
                {
                  title: "Calendar",
                  description: "Schedule and manage mentorship sessions with experienced professionals.",
                  emoji: "📅",
                },
                {
                  title: "Posts",
                  description: "Share knowledge and insights through dedicated mentorship content.",
                  emoji: "📝",
                },
                {
                  title: "Chat",
                  description: "Communicate seamlessly with mentors, peers, and potential employers.",
                  emoji: "💬",
                },
                {
                  title: "24/7 Support",
                  description: "Our support team is always available to help you whenever you need assistance.",
                  emoji: "📱",
                },
              ].map((feature, index) => (
                <Card
                  key={index}
                  className="flex flex-col items-center text-center h-full border rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-4">
                    <span className="text-3xl" role="img" aria-label={feature.title}>
                      {feature.emoji}
                    </span>
                  </div>
                  <Title level={4} className="text-xl font-bold">
                    {feature.title}
                  </Title>
                  <Paragraph className="text-gray-500">{feature.description}</Paragraph>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </Content>

      <Footer className="bg-gray-100 pt-12 pb-6">
          <Paragraph className="text-center text-gray-500 text-sm mt-8">
            &copy; {new Date().getFullYear()} Refugee and Host Community Youth Empowerment and Transformation Initiative
            (RETI). All rights reserved.
          </Paragraph>
      </Footer>
    </Layout>
  )
}

