import React, { useState } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Row,
  Col,
  message,
  ConfigProvider,
} from "antd";
import logo from "../../assets/IMG/logo_con1.png";

const { TextArea } = Input;

const RegisterBusiness = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem("business_data", JSON.stringify(values));
      message.success("Business Registered Successfully!");
      setLoading(false);
    }, 1000);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#162646",
          borderRadius: 12,
        },
      }}
    >
      <div className="min-h-screen   flex items-center justify-center p-4">
        {/* MAIN CARD */}
        <div className="w-full max-w-6xl bg-white rounded-[28px] shadow-2xl overflow-hidden flex flex-col md:flex-row">
          {/* LEFT PANEL */}
          <div className="w-full md:w-[38%] bg-[#162646] text-white p-10 flex flex-col justify-center items-center text-center">
            <img
              src={logo}
              alt="Contracts India Logo"
              className=" rounded-2xl h-9 w-9 sm:h-11 sm:w-11 object-contain 
                               transition-all duration-300 
                               group-hover:scale-105"
            />

            <h1 className="text-3xl font-black leading-tight mt-2">
              CONTRACTS INDIA
            </h1>

            <p className="mt-4 text-sm opacity-80 max-w-xs">
              Integrated Solution For Construction & Infrastructure
            </p>

            {/* <button className="mt-8 border border-white px-6 py-2 rounded-lg font-semibold hover:bg-white hover:text-[#162646] transition">
              Login
            </button> */}
          </div>
 
          {/* RIGHT PANEL */}
          <div className="w-full md:w-[62%] flex flex-col bg-white">
            {/* HEADER */}
            <div className="px-8 pt-8 pb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Register Business
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Fill details to get started
              </p>
            </div>

            {/* FORM */}
            <div className="flex-1 overflow-y-auto px-8 pb-6">
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                requiredMark={false}
              >
                <Row gutter={[16, 12]}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="companyName"
                      label="Company Name"
                      rules={[{ required: true }]}
                    >
                      <Input className="h-11 rounded-lg bg-gray-100 border-none focus:shadow-md" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      name="contactPerson"
                      label="Contact Person"
                      rules={[{ required: true }]}
                    >
                      <Input className="h-11 rounded-lg bg-gray-100 border-none focus:shadow-md" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      name="email"
                      label="Email"
                      rules={[{ required: true, type: "email" }]}
                    >
                      <Input className="h-11 rounded-lg bg-gray-100 border-none focus:shadow-md" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      name="phone"
                      label="Phone"
                      rules={[{ required: true }]}
                    >
                      <Input className="h-11 rounded-lg bg-gray-100 border-none focus:shadow-md" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      name="companyType"
                      label="Company Type"
                      rules={[{ required: true }]}
                    >
                      <Select
                        placeholder="Select"
                        className="h-11"
                        options={[
                          { value: "contractor", label: "Contractor" },
                          { value: "supplier", label: "Supplier" },
                          { value: "architecture", label: "Architecture" },
                        ]}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      name="experience"
                      label="Experience"
                      rules={[{ required: true }]}
                    >
                      <Input
                        type="number"
                        className="h-11 rounded-lg bg-gray-100 border-none focus:shadow-md"
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      name="state"
                      label="State"
                      rules={[{ required: true }]}
                    >
                      <Select
                        placeholder="Select"
                        className="h-11"
                        options={[
                          { value: "delhi", label: "Delhi" },
                          { value: "mp", label: "Madhya Pradesh" },
                          { value: "maharashtra", label: "Maharashtra" },
                        ]}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      name="city"
                      label="City"
                      rules={[{ required: true }]}
                    >
                      <Input className="h-11 rounded-lg bg-gray-100 border-none focus:shadow-md" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      name="gst"
                      label="GST Number"
                      rules={[{ required: true }]}
                    >
                      <Input className="h-11 rounded-lg bg-gray-100 border-none focus:shadow-md" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      name="services"
                      label="Services"
                      rules={[{ required: true }]}
                    >
                      <Input className="h-11 rounded-lg bg-gray-100 border-none focus:shadow-md" />
                    </Form.Item>
                  </Col>

                  <Col span={24}>
                    <Form.Item
                      name="about"
                      label="About Company"
                      rules={[{ required: true }]}
                    >
                      <TextArea
                        rows={3}
                        className="rounded-lg bg-gray-100 border-none focus:shadow-md"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </div>

            {/* FOOTER */}
            <div className="px-8 py-4 flex justify-between items-center ">
              <button
                onClick={() => form.resetFields()}
                type="text"
                className="h-11 px-8 rounded-lg font-semibold bg-[#162646] border-none hover:bg-blue-800 text-white"
              >
                Reset
              </button>

              <button
                type="primary"
                onClick={() => form.submit()}
                loading={loading}
                className="h-11 px-8 rounded-lg font-semibold bg-[#162646] border-none hover:bg-blue-800 text-white"
              >
                Register 🚀
              </button>
            </div>
          </div>
          
        </div>
            
      </div>
       
    </ConfigProvider>
  );
};

export default RegisterBusiness;
