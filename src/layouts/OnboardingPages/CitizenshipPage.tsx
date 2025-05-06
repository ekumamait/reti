import { Form, Select, Input } from "antd";

const CitizenshipPage = ({ form, formData, setFormData }) => {
  const ninPattern = /^(CM|CF)[A-Z0-9]{12}$/;
  return (
    <div>
      <h1 className="text-xl/8 font-semibold text-gray-900 sm:text-lg/9 mb-6">
        Are you a citizen or Refugee?
      </h1>

      <Form
        form={form}
        layout="vertical"
        initialValues={formData.citizenshipData || {}}
        onValuesChange={(_, allValues) => {
          setFormData((prev) => ({ ...prev, citizenshipData: allValues }));
        }}
      >
        <Form.Item
          name="nationality"
          label="Nationality"
          rules={[
            { required: true, message: "Please select your nationality" },
          ]}
          className="my-24"
        >
          <Select placeholder="Select your nationality" size="large">
            <Select.Option value="ugandan">National - Ugandan</Select.Option>
            <Select.Option value="south_sudan">
              Refugee - South Sudan
            </Select.Option>
            <Select.Option value="congolese">Refugee - Congolese</Select.Option>
            <Select.Option value="rwandese">Refugee - Rwandese</Select.Option>
            <Select.Option value="burundian">Refugee - Burundian</Select.Option>
            <Select.Option value="somali">Refugee - Somali</Select.Option>
            <Select.Option value="sudanese">Refugee - Sudanese</Select.Option>
            <Select.Option value="others">Refugee - Others</Select.Option>
          </Select>
        </Form.Item>

        {form.getFieldValue("nationality") === "ugandan" && (
          <Form.Item
            name="nin"
            label="National Identification Number (NIN)"
            rules={[
              { required: true, message: "Please enter your NIN" },
              {
                pattern: ninPattern,
                message: "NIN must start with CM/CF followed by 12 characters",
              },
              {
                len: 14,
                message: "NIN must be exactly 14 characters",
              },
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();

                  const firstTwoChars = value.substring(0, 2).toUpperCase();
                  if (firstTwoChars !== "CM" && firstTwoChars !== "CF") {
                    return Promise.reject("NIN must start with CM or CF");
                  }
                  return Promise.resolve();
                },
              },
            ]}
            validateTrigger={["onChange", "onBlur"]}
          >
            <Input
              size="large"
              placeholder="Enter your NIN (e.g., CM12345678901XE)"
              maxLength={14}
              style={{ textTransform: "uppercase" }}
            />
          </Form.Item>
        )}

        {form.getFieldValue("nationality") !== "ugandan" && (
          <>
            <Form.Item
              name="uniqueIdNo"
              label="Unique Identification No."
              rules={[
                {
                  required: true,
                  message: "Please enter your Unique Identification Number",
                },
              ]}
              className="my-24"
            >
              <Input
                size="large"
                placeholder="Enter your Unique Identification Number"
              />
            </Form.Item>
          </>
        )}
      </Form>
    </div>
  );
};

export default CitizenshipPage;
