import { Form, Input, Button } from "antd";
import AutoComplete from "./components/AutoComplete";

export default function App() {
  const [form] = Form.useForm();
  return (
    <div>
      <Form form={form}>
        <Form.Item name="comment">
          <AutoComplete
            inputRender={({
              onElMounted,
              onFocus,
              onBlur,
              onSearchTermChange,
              onChange,
              value,
            }) => (
              <Input.TextArea
                ref={(el) => {
                  onElMounted(el?.nativeElement);
                }}
                onFocus={onFocus}
                onBlur={onBlur}
                value={value}
                onChange={(ev) => {
                  const val = ev.target.value;
                  onSearchTermChange(val);
                  onChange(val);
                }}
              />
            )}
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            onClick={() => {
              console.log("formValues", form.getFieldsValue());
            }}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
