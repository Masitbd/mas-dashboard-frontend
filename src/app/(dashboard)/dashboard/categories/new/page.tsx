"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  Panel,
  Form,
  Button,
  ButtonToolbar,
  Schema,
  Message,
  useToaster,
  Divider,
  Textarea,
} from "rsuite";
import { Tag, AlignLeft, Save, ArrowLeft } from "lucide-react";

type CategoryFormValues = {
  name: string;
  description: string;
};

const { StringType } = Schema.Types;

const model = Schema.Model({
  name: StringType()
    .isRequired("Category name is required.")
    .minLength(2, "Name must be at least 2 characters.")
    .maxLength(60, "Name must be under 60 characters."),
  description: StringType()
    .isRequired("Description is required.")
    .minLength(10, "Description must be at least 10 characters.")
    .maxLength(240, "Description must be under 240 characters."),
});

export default function NewCategoryPage() {
  const toaster = useToaster();
  const [formValue, setFormValue] = useState<CategoryFormValues>({
    name: "",
    description: "",
  });
  const [formError, setFormError] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(() => {
    return (
      formValue.name.trim().length >= 2 &&
      formValue.description.trim().length >= 10 &&
      !submitting
    );
  }, [formValue, submitting]);

  const handleSubmit = async () => {
    // Client-side validation via rsuite schema
    const check = model.check(formValue);
    if (check.hasError) {
      setFormError(
        Object.fromEntries(
          Object.entries(check.errors).map(([k, v]) => [
            k,
            v?.[0]?.message || "Invalid",
          ])
        )
      );
      return;
    }

    setFormError({});
    setSubmitting(true);

    try {
      // Replace with your API call (fetch/axios) and route push
      await new Promise((r) => setTimeout(r, 900));

      toaster.push(
        <Message type="success" closable>
          Category created successfully.
        </Message>,
        { placement: "topEnd" }
      );

      // Reset form (or redirect)
      setFormValue({ name: "", description: "" });
    } catch {
      toaster.push(
        <Message type="error" closable>
          Failed to create category. Try again.
        </Message>,
        { placement: "topEnd" }
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">New Category</h1>
          <p className="text-sm text-secondary">
            Create a category for organizing posts.
          </p>
        </div>

        <Button appearance="ghost" as={Link} href="/dashboard/categories">
          <span className="inline-flex items-center gap-2">
            <ArrowLeft size={16} />
            Back
          </span>
        </Button>
      </div>

      <Panel
        bordered
        className="rounded-xl border border-border bg-card w-full"
      >
        <Form
          fluid
          model={model}
          formValue={formValue}
          formError={formError}
          onChange={(next) => setFormValue(next as CategoryFormValues)}
          onCheck={setFormError}
          className="w-full"
        >
          <div className="gap-6 w-full">
            <Form.Group controlId="name">
              <Form.ControlLabel>
                <span className="inline-flex items-center gap-2">
                  <Tag size={16} />
                  Name
                </span>
              </Form.ControlLabel>
              <Form.Control name="name" placeholder="e.g., Technology" />
              <Form.HelpText>Use a short, clear label.</Form.HelpText>
            </Form.Group>

            <Form.Group controlId="description" className="w-full mt-5">
              <Form.ControlLabel>
                <span className="inline-flex items-center gap-2">
                  <AlignLeft size={16} />
                  Description
                </span>
              </Form.ControlLabel>
              <Form.Control
                name="description"
                accepter={Textarea}
                placeholder="Write a brief description of what belongs in this category."
              />
              <Form.HelpText>
                Keep it practical. Max 240 characters.
              </Form.HelpText>
            </Form.Group>
          </div>

          <Divider className="my-6" />

          <ButtonToolbar className="justify-end">
            <Button appearance="ghost" as={Link} href="/dashboard/categories">
              Cancel
            </Button>

            <Button
              appearance="primary"
              loading={submitting}
              disabled={!canSubmit}
              onClick={handleSubmit}
            >
              <span className="inline-flex items-center gap-2">
                <Save size={16} />
                Create category
              </span>
            </Button>
          </ButtonToolbar>
        </Form>
      </Panel>
    </div>
  );
}
