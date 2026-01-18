"use client";

import React, {
  useMemo,
  useState,
  forwardRef,
  useRef,
  useImperativeHandle,
  useCallback,
} from "react";
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
  SelectPicker,
  Input,
  InputGroup,
} from "rsuite";
import {
  Mail,
  User as UserIcon,
  Lock,
  Shield,
  ToggleLeft,
  Save,
  ArrowLeft,
  Image,
  Globe,
  MapPin,
  Twitter,
  Github,
  Linkedin,
  FileText,
  Eye,
  EyeOff,
} from "lucide-react";

export type UserRole = "admin" | "editor" | "author" | "reader";
export type UserStatus = "active" | "disabled";

type FormValues = {
  email: string;
  username: string;
  password: string;
  role: UserRole;
  status: UserStatus;

  displayName: string;
  avatarUrl: string;
  bio: string;

  websiteUrl: string;
  location: string;
  twitterUrl: string;
  githubUrl: string;
  linkedinUrl: string;
};

const { StringType } = Schema.Types;

const model = Schema.Model({
  email: StringType()
    .isEmail("Enter a valid email.")
    .isRequired("Email is required."),
  username: StringType()
    .isRequired("Username is required.")
    .minLength(3, "Username must be at least 3 characters.")
    .maxLength(30, "Username must be under 30 characters."),
  password: StringType()
    .isRequired("Password is required.")
    .minLength(8, "Password must be at least 8 characters."),
  role: StringType().isRequired("Role is required."),
  status: StringType().isRequired("Status is required."),

  displayName: StringType()
    .isRequired("Display name is required.")
    .minLength(2, "Display name must be at least 2 characters.")
    .maxLength(60, "Display name must be under 60 characters."),

  avatarUrl: StringType().maxLength(500, "Too long."),
  bio: StringType().maxLength(280, "Bio must be under 280 characters."),

  websiteUrl: StringType().maxLength(500, "Too long."),
  location: StringType().maxLength(80, "Too long."),

  twitterUrl: StringType().maxLength(500, "Too long."),
  githubUrl: StringType().maxLength(500, "Too long."),
  linkedinUrl: StringType().maxLength(500, "Too long."),
});

const ROLE_OPTIONS = [
  { label: "Admin", value: "admin" },
  { label: "Editor", value: "editor" },
  { label: "Author", value: "author" },
  { label: "Reader", value: "reader" },
] as const;

const STATUS_OPTIONS = [
  { label: "Active", value: "active" },
  { label: "Disabled", value: "disabled" },
] as const;

function LabeledIcon({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-2">
      {icon}
      {label}
    </span>
  );
}

/** Stable accepter: input with left icon */
type IconInputProps = React.ComponentProps<typeof Input> & {
  icon?: React.ReactNode;
};

const IconInput = forwardRef<HTMLInputElement, IconInputProps>(
  function IconInput({ icon, ...props }, ref) {
    const innerRef = useRef<HTMLInputElement | null>(null);
    useImperativeHandle(ref, () => innerRef.current as HTMLInputElement);

    return (
      <InputGroup inside>
        <InputGroup.Addon>{icon}</InputGroup.Addon>
        <Input {...props} inputRef={innerRef} />
      </InputGroup>
    );
  }
);

/** Stable accepter: password input with eye toggle */
type PasswordInputProps = Omit<React.ComponentProps<typeof Input>, "type"> & {
  icon?: React.ReactNode;
  show?: boolean;
  onToggleShow?: () => void;
};

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput({ icon, show, onToggleShow, ...props }, ref) {
    const innerRef = useRef<HTMLInputElement | null>(null);
    useImperativeHandle(ref, () => innerRef.current as HTMLInputElement);

    const handleToggle = () => {
      onToggleShow?.();
      // Keep focus on the input after toggling
      requestAnimationFrame(() => innerRef.current?.focus());
    };

    return (
      <InputGroup inside>
        <InputGroup.Addon>{icon}</InputGroup.Addon>
        <Input
          {...props}
          type={show ? "text" : "password"}
          inputRef={innerRef}
        />
        <InputGroup.Button
          onClick={handleToggle}
          aria-label={show ? "Hide password" : "Show password"}
          tabIndex={-1}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </InputGroup.Button>
      </InputGroup>
    );
  }
);

/** Stable accepter: textarea */
type TextareaProps = React.ComponentProps<typeof Input>;
const Textarea = forwardRef<HTMLInputElement, TextareaProps>(function Textarea(
  props,
  ref
) {
  return <Input {...props} as="textarea" ref={ref as any} />;
});

export default function NewUserPage() {
  const toaster = useToaster();

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  const [formValue, setFormValue] = useState<FormValues>({
    email: "",
    username: "",
    password: "",
    role: "reader",
    status: "active",
    displayName: "",
    avatarUrl: "",
    bio: "",
    websiteUrl: "",
    location: "",
    twitterUrl: "",
    githubUrl: "",
    linkedinUrl: "",
  });

  const canSubmit = useMemo(() => {
    return (
      formValue.email.trim().length > 0 &&
      formValue.username.trim().length >= 3 &&
      formValue.password.trim().length >= 8 &&
      formValue.displayName.trim().length >= 2 &&
      !submitting
    );
  }, [formValue, submitting]);

  const toggleShowPassword = useCallback(() => {
    setShowPassword((v) => !v);
  }, []);

  const handleSubmit = async () => {
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
      const payload = {
        user: {
          email: formValue.email.trim(),
          username: formValue.username.trim(),
          password: formValue.password, // hash server-side
          role: formValue.role,
          status: formValue.status,
        },
        profile: {
          displayName: formValue.displayName.trim(),
          avatarUrl: formValue.avatarUrl.trim() || null,
          bio: formValue.bio.trim() || null,
          websiteUrl: formValue.websiteUrl.trim() || null,
          location: formValue.location.trim() || null,
          twitterUrl: formValue.twitterUrl.trim() || null,
          githubUrl: formValue.githubUrl.trim() || null,
          linkedinUrl: formValue.linkedinUrl.trim() || null,
        },
      };

      // Replace with API call
      await new Promise((r) => setTimeout(r, 900));

      toaster.push(
        <Message type="success" closable>
          User created successfully.
        </Message>,
        { placement: "topEnd" }
      );

      setFormValue({
        email: "",
        username: "",
        password: "",
        role: "reader",
        status: "active",
        displayName: "",
        avatarUrl: "",
        bio: "",
        websiteUrl: "",
        location: "",
        twitterUrl: "",
        githubUrl: "",
        linkedinUrl: "",
      });
      setShowPassword(false);
    } catch {
      toaster.push(
        <Message type="error" closable>
          Failed to create user. Try again.
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
          <h1 className="text-2xl font-semibold">New User</h1>
          <p className="text-sm text-secondary">
            Create a user and their profile in one pass.
          </p>
        </div>

        <Button appearance="ghost" as={Link} href="/dashboard/users">
          <span className="inline-flex items-center gap-2">
            <ArrowLeft size={16} />
            Back
          </span>
        </Button>
      </div>

      <Panel bordered className="rounded-xl border border-border bg-card">
        <Form
          fluid
          model={model}
          formValue={formValue}
          formError={formError}
          onChange={(next) => setFormValue(next as FormValues)}
          onCheck={setFormError}
        >
          {/* USER CORE */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 w-full">
            <Form.Group controlId="email">
              <Form.ControlLabel>
                <LabeledIcon icon={<Mail size={16} />} label="Email" />
              </Form.ControlLabel>
              <Form.Control
                name="email"
                accepter={IconInput}
                icon={<Mail size={16} />}
                placeholder="name@company.com"
              />
            </Form.Group>

            <Form.Group controlId="username">
              <Form.ControlLabel>
                <LabeledIcon icon={<UserIcon size={16} />} label="Username" />
              </Form.ControlLabel>
              <Form.Control
                name="username"
                accepter={IconInput}
                icon={<UserIcon size={16} />}
                placeholder="e.g., saidul"
              />
            </Form.Group>

            <Form.Group controlId="password" className="md:col-span-2">
              <Form.ControlLabel>
                <LabeledIcon icon={<Lock size={16} />} label="Password" />
              </Form.ControlLabel>
              <Form.Control
                name="password"
                accepter={PasswordInput}
                icon={<Lock size={16} />}
                show={showPassword}
                onToggleShow={toggleShowPassword}
                placeholder="Minimum 8 characters"
                autoComplete="new-password"
              />
              <Form.HelpText>
                Hash on the server. Never store plaintext.
              </Form.HelpText>
            </Form.Group>

            <Form.Group controlId="role">
              <Form.ControlLabel>
                <LabeledIcon icon={<Shield size={16} />} label="Role" />
              </Form.ControlLabel>
              <Form.Control
                name="role"
                accepter={SelectPicker}
                data={ROLE_OPTIONS as any}
                searchable={false}
                cleanable={false}
                block
                placeholder="Select role"
              />
            </Form.Group>

            <Form.Group controlId="status">
              <Form.ControlLabel>
                <LabeledIcon icon={<ToggleLeft size={16} />} label="Status" />
              </Form.ControlLabel>
              <Form.Control
                name="status"
                accepter={SelectPicker}
                data={STATUS_OPTIONS as any}
                searchable={false}
                cleanable={false}
                block
                placeholder="Select status"
              />
            </Form.Group>
          </div>

          <Divider className="my-6" />

          {/* PROFILE */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 w-full">
            <Form.Group controlId="displayName">
              <Form.ControlLabel>
                <LabeledIcon
                  icon={<UserIcon size={16} />}
                  label="Display Name"
                />
              </Form.ControlLabel>
              <Form.Control
                name="displayName"
                accepter={IconInput}
                icon={<UserIcon size={16} />}
                placeholder="e.g., Saidul Islam"
              />
            </Form.Group>

            <Form.Group controlId="avatarUrl">
              <Form.ControlLabel>
                <LabeledIcon
                  icon={<Image size={16} />}
                  label="Avatar URL (optional)"
                />
              </Form.ControlLabel>
              <Form.Control
                name="avatarUrl"
                accepter={IconInput}
                icon={<Image size={16} />}
                placeholder="https://..."
              />
            </Form.Group>

            <Form.Group controlId="bio" className="md:col-span-2">
              <Form.ControlLabel>
                <LabeledIcon
                  icon={<FileText size={16} />}
                  label="Bio (optional)"
                />
              </Form.ControlLabel>
              <Form.Control
                name="bio"
                accepter={Textarea}
                rows={4}
                placeholder="Short bio (max 280 chars)"
              />
            </Form.Group>

            <Form.Group controlId="websiteUrl">
              <Form.ControlLabel>
                <LabeledIcon
                  icon={<Globe size={16} />}
                  label="Website (optional)"
                />
              </Form.ControlLabel>
              <Form.Control
                name="websiteUrl"
                accepter={IconInput}
                icon={<Globe size={16} />}
                placeholder="https://your-site.com"
              />
            </Form.Group>

            <Form.Group controlId="location">
              <Form.ControlLabel>
                <LabeledIcon
                  icon={<MapPin size={16} />}
                  label="Location (optional)"
                />
              </Form.ControlLabel>
              <Form.Control
                name="location"
                accepter={IconInput}
                icon={<MapPin size={16} />}
                placeholder="Dhaka, BD"
              />
            </Form.Group>

            <Form.Group controlId="twitterUrl">
              <Form.ControlLabel>
                <LabeledIcon
                  icon={<Twitter size={16} />}
                  label="Twitter URL (optional)"
                />
              </Form.ControlLabel>
              <Form.Control
                name="twitterUrl"
                accepter={IconInput}
                icon={<Twitter size={16} />}
                placeholder="https://twitter.com/..."
              />
            </Form.Group>

            <Form.Group controlId="githubUrl">
              <Form.ControlLabel>
                <LabeledIcon
                  icon={<Github size={16} />}
                  label="GitHub URL (optional)"
                />
              </Form.ControlLabel>
              <Form.Control
                name="githubUrl"
                accepter={IconInput}
                icon={<Github size={16} />}
                placeholder="https://github.com/..."
              />
            </Form.Group>

            <Form.Group controlId="linkedinUrl">
              <Form.ControlLabel>
                <LabeledIcon
                  icon={<Linkedin size={16} />}
                  label="LinkedIn URL (optional)"
                />
              </Form.ControlLabel>
              <Form.Control
                name="linkedinUrl"
                accepter={IconInput}
                icon={<Linkedin size={16} />}
                placeholder="https://linkedin.com/in/..."
              />
            </Form.Group>
          </div>

          <Divider className="my-6" />

          <ButtonToolbar className="justify-end">
            <Button appearance="ghost" as={Link} href="/dashboard/users">
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
                Create user
              </span>
            </Button>
          </ButtonToolbar>
        </Form>
      </Panel>
    </div>
  );
}
