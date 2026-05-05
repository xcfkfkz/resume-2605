import { Form, Button } from "antd";
import ProductSelect from "@/components/ProductSelect.tsx";
import DynamicForm from "./components/DynamicForm";

export default function App() {
  const [form] = Form.useForm();
  return (
    <div>
      999
      <Form form={form}>
        <Form.Item name="product">
          <ProductSelect />
        </Form.Item>
        <Form.Item>
          <Button
            onClick={() => {
              console.log("formValues", form.getFieldsValue());
            }}
          >
            submit
          </Button>
        </Form.Item>
      </Form>
      <div>------------Dynamic Form------------</div>
      <DynamicForm />
    </div>
  );
}
