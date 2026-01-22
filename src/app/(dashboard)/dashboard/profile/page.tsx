"use client";

import React, {
  useMemo,
  useState,
  forwardRef,
  useRef,
  useImperativeHandle,
  useCallback,
  Suspense,
  useEffect,
} from "react";
import {
  Panel,
  Form,
  Button,
  ButtonToolbar,
  Schema,
  Message,
  useToaster,
  Divider,
  Input,
  InputGroup,
} from "rsuite";
import {
  User as UserIcon,
  Image,
  Globe,
  MapPin,
  Twitter,
  Github,
  Linkedin,
  FileText,
  Save,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useGetMyProfileQuery,
  useUpdateMyOwnProfileMutation,
} from "@/redux/api/profile/profile.api";

type ProfileFormValues = {
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
  },
);

/** Stable accepter: textarea */
type TextareaProps = React.ComponentProps<typeof Input>;
const Textarea = forwardRef<HTMLInputElement, TextareaProps>(
  function Textarea(props, ref) {
    return <Input {...props} as="textarea" ref={ref as any} />;
  },
);

function ProfileOnlyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const uuid = searchParams.get("uuid");
  const mode = searchParams.get("mode");
  const { data: myProfileData, isLoading: myProfileDataLoading } =
    useGetMyProfileQuery(undefined);
  const [updateMyOwnProfile, { isLoading: isUpdating }] =
    useUpdateMyOwnProfileMutation();
  const toaster = useToaster();

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<Record<string, string>>({});

  const [formValue, setFormValue] = useState<ProfileFormValues>({
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
    return formValue.displayName.trim().length >= 2 && !submitting;
  }, [formValue.displayName, submitting]);

  const handleSubmit = useCallback(async () => {
    const check = model.check(formValue);
    if (check.hasError) {
      setFormError(
        Object.fromEntries(
          Object.entries(check.errors).map(([k, v]) => [
            k,
            v?.[0]?.message || "Invalid",
          ]),
        ),
      );
      return;
    }

    setFormError({});
    setSubmitting(true);

    try {
      const payload = {
        displayName: formValue.displayName.trim(),
        avatarUrl: formValue.avatarUrl.trim() || null,
        bio: formValue.bio.trim() || null,
        websiteUrl: formValue.websiteUrl.trim() || null,
        location: formValue.location.trim() || null,
        twitterUrl: formValue.twitterUrl.trim() || null,
        githubUrl: formValue.githubUrl.trim() || null,
        linkedinUrl: formValue.linkedinUrl.trim() || null,
      };

      const result = await updateMyOwnProfile({ body: payload }).unwrap();
      if (result?.success) {
        toaster.push(
          <Message type="success" closable>
            Profile saved successfully.
          </Message>,
          { placement: "topEnd" },
        );

        setFormValue({
          displayName: "",
          avatarUrl: "",
          bio: "",
          websiteUrl: "",
          location: "",
          twitterUrl: "",
          githubUrl: "",
          linkedinUrl: "",
        });
        router.push("/dashboard/profile/view");
      }
    } catch {
      toaster.push(
        <Message type="error" closable>
          Failed to save profile. Try again.
        </Message>,
        { placement: "topEnd" },
      );
    } finally {
      setSubmitting(false);
    }
  }, [formValue, toaster]);

  // Setting the default values when data is loaded
  useEffect(() => {
    if (myProfileData && !myProfileDataLoading) {
      setFormValue({
        displayName: myProfileData?.data?.displayName,
        avatarUrl: myProfileData?.data?.avatarUrl || "",
        bio: myProfileData?.data?.bio || "",
        websiteUrl: myProfileData?.data?.websiteUrl || "",
        location: myProfileData?.data?.location || "",
        twitterUrl: myProfileData?.data?.twitterUrl || "",
        githubUrl: myProfileData?.data?.githubUrl || "",
        linkedinUrl: myProfileData?.data?.linkedinUrl || "",
      });
    }
  }, [myProfileData, myProfileDataLoading]);
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="text-sm text-secondary">Manage public profile details.</p>
      </div>

      <Panel bordered className="rounded-xl border border-border bg-card">
        <Form
          fluid
          model={model}
          formValue={formValue}
          formError={formError}
          onChange={(next) => setFormValue(next as ProfileFormValues)}
          onCheck={setFormError}
        >
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
            <Button
              appearance="primary"
              loading={submitting}
              disabled={!canSubmit}
              onClick={handleSubmit}
            >
              <span className="inline-flex items-center gap-2">
                <Save size={16} />
                Save profile
              </span>
            </Button>
          </ButtonToolbar>
        </Form>
      </Panel>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProfileOnlyForm />
    </Suspense>
  );
}
