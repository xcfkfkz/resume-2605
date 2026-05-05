import { useState } from "react";
import { createForm, onFieldValueChange, onFieldReact } from "@formily/core";
import type { Field as FieldType, DataField } from "@formily/core";
import {
  FormProvider,
  createSchemaField,
  connect,
  mapProps,
} from "@formily/react";
import { Form, Input, Radio, Button } from "antd";
import { useCreation, useMemoizedFn, useRequest } from "ahooks";
import { keyBy } from "lodash-es";

interface FormTemplate {
  formTemplateId: string;
  title: string;
  data: string;
}

const ORDER_ID_FIELD_SCHEMA = {
  name: "orderId",
  type: "string",
  title: "订单号",
  required: true,
  "x-component": "input",
  "x-decorator": "form-item",
};
const FORM_TEMPLATE_ID_FIELD_SCHEMA = {
  name: "formTemplateId",
  type: "string",
  title: "表单模板",
  required: true,
  "x-component": "radio-group",
  "x-decorator": "form-item",
};
const INITIAL_SCHEMA = {
  type: "object",
  properties: {
    orderId: {
      ...ORDER_ID_FIELD_SCHEMA,
    },
    formTemplateId: {
      ...FORM_TEMPLATE_ID_FIELD_SCHEMA,
      "x-display": "hidden",
    },
  },
};
const DYNAMIC_FIELDS = "DYNAMIC_FIELDS";

export default function DynamicForm() {
  const form = useCreation(
    () =>
      createForm({
        effects() {
          onFieldValueChange("orderId", (field) => {
            reset();
            dispatchFormTemplate(field.value);
          });
        },
      }),
    []
  );
  const SchemaField = useCreation(
    () =>
      createSchemaField({
        components: {
          "form-item": connect(
            Form.Item,
            mapProps(
              {
                title: "label",
                description: "extra",
                required: true,
                validateStatus: true,
              },
              (props, field) => {
                return {
                  ...props,
                  help: (field as FieldType).selfErrors?.length
                    ? (field as FieldType).selfErrors
                    : void 0,
                };
              }
            )
          ),
          input: Input,
          "radio-group": Radio.Group,
          textarea: Input.TextArea,
        },
      }),
    []
  );
  const [schema, setSchema] = useState<Record<string, unknown>>(
    INITIAL_SCHEMA as Record<string, unknown>
  );
  const reset = useMemoizedFn(() => {
    setSchema(INITIAL_SCHEMA as Record<string, unknown>);
    form.clearFormGraph(new RegExp(DYNAMIC_FIELDS), true);
  });
  const { run: dispatchFormTemplate } = useRequest(
    (orderId: string) =>
      new Promise<FormTemplate[]>((resolve) => {
        setTimeout(() => {
          resolve([
            {
              formTemplateId: `123${orderId}`,
              title: "催发货表单模板",
              data:
                '{"type":"object","properties":{"phone":{"name":"phone","type":"string","title":"联系方式","x-index":1,"required":true,"x-component":"input","x-decorator":"form-item"},"content":{"name":"content","type":"string","title":"问题描述","x-index":2,"required":true,"x-component":"textarea","x-decorator":"form-item"}}}',
            },
            {
              formTemplateId: "456",
              title: "举证表单模板",
              data:
                '{"type":"object","properties":{"appeal":{"name":"appeal","type":"string","title":"诉求","x-index":3,"required":true,"x-component":"textarea","x-decorator":"form-item"}}}',
            },
          ]);
        }, 250);
      }),
    {
      manual: true,
      onSuccess(formTemplates) {
        const FORM_TEMPLATE_ID_OPTIONS_EFFECT_KEY =
          "FORM_TEMPLATE_ID_OPTIONS_EFFECT_KEY";
        form.removeEffects(FORM_TEMPLATE_ID_OPTIONS_EFFECT_KEY);
        form.addEffects(FORM_TEMPLATE_ID_OPTIONS_EFFECT_KEY, () => {
          function onFormTemplateIdChange(formTemplateId: string) {
            const templateMap = keyBy(
              formTemplates,
              "formTemplateId"
            ) as Record<string, FormTemplate>;
            setSchema({
              type: "object",
              properties: {
                orderId: { ...ORDER_ID_FIELD_SCHEMA },
                formTemplateId: {
                  ...FORM_TEMPLATE_ID_FIELD_SCHEMA,
                  "x-display": "visible",
                },
                [DYNAMIC_FIELDS]: {
                  name: DYNAMIC_FIELDS,
                  ...JSON.parse(templateMap[formTemplateId]!.data),
                },
              },
            });
            form.clearFormGraph(new RegExp(DYNAMIC_FIELDS), true);
          }
          onFieldValueChange("formTemplateId", (field) => {
            onFormTemplateIdChange(field.value);
          });
          onFieldReact("formTemplateId", (field) => {
            const dataField = field as DataField;
            field.setComponentProps({
              options: formTemplates.map(({ title, formTemplateId }) => ({
                label: title,
                value: formTemplateId,
              })),
            });
            field.setDisplay("visible");
            setTimeout(() => {
              dataField.setValue(formTemplates[0]!.formTemplateId as any);
            }, 0);
          });
        });
      },
    }
  );
  return (
    <>
      <FormProvider form={form}>
        <SchemaField schema={schema} />
      </FormProvider>
      <Button
        onClick={() => {
          console.log("formValues = ", form.values);
        }}
      >
        submit
      </Button>
    </>
  );
}
