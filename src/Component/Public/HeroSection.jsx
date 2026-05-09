import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Form,
  Input,
  Select,
  Button,
  Modal,
  Row,
  Col,
  message,
  Space,
} from "antd";
import { ArrowRight, Trophy, Zap, ShieldCheck, MapPin } from "lucide-react";
import {
  RocketOutlined,
  BankOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  PlusOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";

const slides = [
  {
    badge: "🏛️ GOVERNMENT TENDERS",
    title: "Win Big Government Contracts",
    desc: "Access 8,400+ live PWD, NHAI & PSU tenders.",
    color: "from-blue-600/80 to-primary/90",
    image:
      "https://www.hoffmannworkcomp.com/wp-content/uploads/why-workers-comp-claims-rise-during-construction-activity-1024x683.jpg",
  },
  {
    badge: "🏗️ VERIFIED CONTRACTORS",
    title: "Hire Top Civil Experts",
    desc: "50,000+ verified EPC, PMC & architects.",
    color: "from-emerald-600/80 to-primary/90",
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1000",
  },
  {
    badge: "🧱 MATERIALS MARKET",
    title: "Source at Best Prices",
    desc: "Cement, steel & materials direct from suppliers.",
    color: "from-amber-600/80 to-primary/90",
    image:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1000",
  },
];

const stats = [
  { value: "50K+", label: "Companies" },
  { value: "12K+", label: "Tenders" },
  { value: "₹8K Cr+", label: "Value" },
  { value: "28+", label: "States" },
];

const trending = [
  "Waterproofing",
  "EPC Contractor",
  "Road Projects",
  "Interior Delhi",
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [companyForm] = Form.useForm();
  const { TextArea } = Input;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((p) => (p + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const onFinish = (values) => {
    setLoading(true);

    setTimeout(() => {
      const existing = JSON.parse(localStorage.getItem("companies_v1")) || [];

      const newCompany = {
        id: Date.now(),
        ...values,
      };

      localStorage.setItem(
        "companies_v1", // ✅ UNIQUE STORAGE KEY
        JSON.stringify([...existing, newCompany]),
      );

      message.success("Company registered successfully");

      companyForm.resetFields(); // ✅ SAFE RESET (NO CONFLICT)
      setLoading(false);
      setOpen(false);
    }, 800);
  };

  return (
    <>
  
<section className="relative h-[85vh] w-full overflow-hidden text-white">

  {/* 🔥 BACKGROUND IMAGE */}
  <div className="absolute inset-0">
    <AnimatePresence mode="wait">
      <motion.div
        key={currentSlide}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0"
      >
        <img
          src={slides[currentSlide].image}
          className="w-full h-full object-cover"
        />

        {/* 🔥 LIGHT OVERLAY (IMAGE PAR OPACITY) */}
        <div className="absolute inset-0 bg-black/30" />

        {/* Optional gradient for premium feel */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />
      </motion.div>
    </AnimatePresence>
  </div>

  {/* 🔷 CONTENT (NO BACKGROUND BOX) */}
  <div className="relative z-10 h-full flex items-center">
    <div className="container mx-auto px-6">

      <div className="max-w-xl">

        {/* 🔷 HEADING */}
        <h2 className="text-4xl md:text-6xl font-extrabold leading-tight">
         India's Largest  {" "}
          <span className="bg-gradient-to-r from-cta to-amber-300 text-transparent bg-clip-text">
            Construction Market Place
          </span>
        </h2>

        {/* 🔹 TEXT */}
        {/* <p className="mt-5 text-lg text-slate-200 leading-relaxed">
          Streamline your projects, connect with verified companies, and manage
          tenders efficiently in one platform.
        </p> */}

        {/* 🔘 CTA */}
        {/* <div className="mt-7">
          <button className="px-8 py-3 bg-cta text-primary font-semibold rounded-xl shadow-lg hover:scale-105 transition-all duration-300">
            Register
          </button>
        </div> */}

        {/* 📊 STATS */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: "50K+", label: "Companies" },
            { value: "12K+", label: "Tenders" },
            { value: "₹8K Cr+", label: "Value" },
            { value: "28+", label: "States" },
          ].map((item, i) => (
            <div key={i} className="text-left">
              <div className="text-2xl md:text-3xl font-bold">
                {item.value}
              </div>
              <div className="text-sm text-slate-300 uppercase tracking-wide">
                {item.label}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  </div>

  {/* 🔘 DOTS */}
  <div className="absolute bottom-6 right-8 flex gap-2 z-10">
    {slides.map((_, i) => (
      <button
        key={i}
        onClick={() => setCurrentSlide(i)}
        className={`w-2 h-2 rounded-full ${
          currentSlide === i ? "bg-cta" : "bg-white/40"
        }`}
      />
    ))}
  </div>

</section>
      <Modal
        open={open}
        onCancel={() => {
          setOpen(false);
          companyForm.resetFields();
        }}
        footer={null}
        width={760}
        centered
        destroyOnClose
        className="premium-modal"
      >
        {/* HEADER */}
        <div className=" mt-5 relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 rounded-t-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/20 blur-3xl rounded-full"></div>

          <div className="relative z-10 flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-xl shadow-lg shadow-blue-500/30">
              <RocketOutlined className="text-white text-lg" />
            </div>

            <div>
              <h2 className="text-white text-xl font-black m-0 tracking-wide">
                Register <span className="text-blue-400">Business</span>
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                Join verified contractor network
              </p>
            </div>
          </div>
        </div>

        {/* FORM */}
        <div className="p-6 bg-white rounded-b-2xl">
          <Form
            layout="vertical"
            form={companyForm}
            onFinish={onFinish}
            requiredMark={false}
          >
            <Row gutter={[16, 8]}>
              {/* COMPANY NAME */}
              <Col span={24}>
                <Form.Item
                  label="Company Name *"
                  name="companyName"
                  rules={[
                    { required: true, message: "Company name is required" },
                    { min: 3, message: "Minimum 3 characters required" },
                  ]}
                >
                  <Input
                    prefix={<BankOutlined className="text-slate-300" />}
                    placeholder="e.g. Skyline Architecture Ltd."
                    className="h-11 rounded-xl bg-slate-50"
                  />
                </Form.Item>
              </Col>

              {/* CONTACT PERSON */}
              <Col xs={24} md={12}>
                <Form.Item
                  label="Contact Person *"
                  name="contactPerson"
                  rules={[
                    { required: true, message: "Contact person is required" },
                    { min: 3, message: "Enter valid name" },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined className="text-slate-300" />}
                    className="h-11 rounded-xl bg-slate-50"
                  />
                </Form.Item>
              </Col>

              {/* EMAIL */}
              <Col xs={24} md={12}>
                <Form.Item
                  label="Email *"
                  name="email"
                  rules={[
                    { required: true, message: "Email is required" },
                    { type: "email", message: "Enter valid email" },
                  ]}
                >
                  <Input
                    prefix={<MailOutlined className="text-slate-300" />}
                    className="h-11 rounded-xl bg-slate-50"
                  />
                </Form.Item>
              </Col>

              {/* PHONE */}
              <Col xs={24} md={12}>
                <Form.Item
                  label="Phone *"
                  name="phone"
                  rules={[
                    { required: true, message: "Phone number is required" },
                    {
                      pattern: /^[0-9]{10}$/,
                      message: "Enter valid 10-digit number",
                    },
                  ]}
                >
                  <Input
                    prefix={<PhoneOutlined className="text-slate-300" />}
                    className="h-11 rounded-xl bg-slate-50"
                  />
                </Form.Item>
              </Col>

              {/* COMPANY TYPE */}
              <Col xs={24} md={12}>
                <Form.Item
                  label="Company Type *"
                  name="companyType"
                  rules={[{ required: true, message: "Select company type" }]}
                >
                  <Select
                    placeholder="Select type"
                    className="h-11"
                    options={[
                      { value: "contractor", label: "Contractor" },
                      { value: "architecture", label: "Architecture" },
                      { value: "epc", label: "EPC Provider" },
                    ]}
                  />
                </Form.Item>
              </Col>

              {/* YEARS OF EXPERIENCE */}
              <Col xs={24} md={12}>
                <Form.Item
                  label="Years of Experience *"
                  name="experience"
                  rules={[
                    { required: true, message: "Experience is required" },
                    { pattern: /^[0-9]+$/, message: "Only numbers allowed" },
                  ]}
                >
                  <Input
                    placeholder="e.g. 5"
                    className="h-11 rounded-xl bg-slate-50"
                  />
                </Form.Item>
              </Col>

              {/* STATE */}
              <Col xs={24} md={12}>
                <Form.Item
                  label="State *"
                  name="state"
                  rules={[{ required: true, message: "State is required" }]}
                >
                  <Select
                    placeholder="Select state"
                    className="h-11"
                    options={[
                      { value: "Delhi", label: "Delhi" },
                      { value: "Maharashtra", label: "Maharashtra" },
                      { value: "UP", label: "Uttar Pradesh" },
                      { value: "MP", label: "Madhya Pradesh" },
                      { value: "Rajasthan", label: "Rajasthan" },
                    ]}
                  />
                </Form.Item>
              </Col>

              {/* CITY */}
              <Col xs={24} md={12}>
                <Form.Item
                  label="City *"
                  name="city"
                  rules={[{ required: true, message: "City is required" }]}
                >
                  <Input
                    prefix={<EnvironmentOutlined className="text-slate-300" />}
                    className="h-11 rounded-xl bg-slate-50"
                  />
                </Form.Item>
              </Col>

              {/* GST */}
              <Col xs={24} md={12}>
                <Form.Item
                  label="GST Number"
                  name="gst"
                  rules={[
                    { required: true, message: "GST number is required" },
                    { min: 15, max: 15, message: "GST must be 15 characters" },
                  ]}
                >
                  <Input
                    prefix={
                      <SafetyCertificateOutlined className="text-slate-300" />
                    }
                    className="h-11 rounded-xl bg-slate-50"
                  />
                </Form.Item>
              </Col>

              {/* SERVICES OFFERED */}
              <Col span={24}>
                <Form.Item
                  label="Services Offered *"
                  name="services"
                  rules={[
                    { required: true, message: "Enter services offered" },
                    { min: 10, message: "Write at least 10 characters" },
                  ]}
                >
                  <Input.TextArea
                    rows={3}
                    placeholder="e.g. RCC, Plumbing, Electrical, Interior Work"
                    className="rounded-xl bg-slate-50"
                  />
                </Form.Item>
              </Col>

              {/* ABOUT COMPANY */}
              <Col span={24}>
                <Form.Item
                  label="About Company *"
                  name="about"
                  rules={[
                    { required: true, message: "About company is required" },
                    { min: 20, message: "Write at least 20 characters" },
                  ]}
                >
                  <Input.TextArea
                    rows={4}
                    placeholder="Brief description about your company..."
                    className="rounded-xl bg-slate-50"
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* ACTIONS */}
            <div className="mt-6 flex justify-between items-center border-t pt-5">
              <Space>
                {/* RESET */}
                <button
                  type="button"
                  onClick={() => companyForm.resetFields()}
                  className="h-10 px-5 rounded-xl font-bold text-white
      bg-gradient-to-r from-gray-500 to-gray-700
      hover:from-gray-600 hover:to-gray-800
      shadow-md transition-all"
                >
                  Reset
                </button>

                {/* CANCEL */}
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="h-10 px-5 rounded-xl font-bold text-white
      bg-gradient-to-r from-red-500 to-red-700
      hover:from-red-600 hover:to-red-800
      shadow-md transition-all"
                >
                  Cancel
                </button>
              </Space>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loading}
                className="h-11 px-8 rounded-xl font-bold text-white
    bg-gradient-to-r from-[#162646] to-[#1e3a5f]
    hover:from-[#0f1e38] hover:to-[#274c77]
    shadow-lg transition-all disabled:opacity-60"
              >
                {loading ? "Registering..." : "Register"}
                <ThunderboltOutlined className="ml-2" />
              </button>
            </div>
          </Form>
        </div>
      </Modal>

      {/* STYLE */}
      <style jsx global>{`
        .premium-modal .ant-modal-content {
          border-radius: 20px;
          overflow: hidden;
        }
      `}</style>
    </>
  );
};
export default HeroSection;
