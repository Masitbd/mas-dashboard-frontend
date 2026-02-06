"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Panel,
  Button,
  ButtonToolbar,
  Divider,
  Tag,
  Placeholder,
  Message,
} from "rsuite";
import {
  ArrowLeft,
  Pencil,
  Mail,
  User as UserIcon,
  Shield,
  ToggleLeft,
  Calendar,
  Clock,
  BadgeCheck,
  Link as LinkIcon,
  MapPin,
  Twitter,
  Github,
  Linkedin,
  Image as ImageIcon,
  LucideTimerReset,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useGetMyProfileQuery } from "@/redux/api/profile/profile.api";
import { useSession } from "next-auth/react";
import { useChangePasswordMutation } from "@/redux/api/auth/auth.api";
import { ChangePasswordButton } from "@/components/auth/ChangePassword";
import { AvatarEdit } from "@/components/users/AvatarEdit";

export type UserRole = "admin" | "editor" | "author" | "reader";
export type UserStatus = "active" | "disabled";

export type User = {
  id: string;
  uuid: string;

  email: string;
  username: string;
  passwordHash: string;

  role: UserRole;
  status: UserStatus;

  emailVerifiedAt: Date | null;
  lastLoginAt: Date | null;

  createdAt: Date;
  updatedAt: Date;
};

export type UserProfile = {
  id: string;
  uuid: string;

  userId: string;
  displayName: string;

  avatarUrl: string | null;
  bio: string | null;

  websiteUrl: string | null;
  location: string | null;

  twitterUrl: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;

  createdAt: Date;
  updatedAt: Date;
};

type UserDetails = {
  user: User;
  profile: UserProfile;
};

function formatDate(d: Date | null) {
  if (!d) return "—";
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

function StatusTag({ value }: { value: UserStatus }) {
  const props =
    value === "active"
      ? { color: "green" as const }
      : { color: "orange" as const };
  return (
    <Tag {...props} className="capitalize">
      {value}
    </Tag>
  );
}

function RoleTag({ value }: { value: UserRole }) {
  const color =
    value === "admin"
      ? "blue"
      : value === "editor"
        ? "violet"
        : value === "author"
          ? "cyan"
          : "silver";
  return (
    <Tag color={color as any} className="capitalize">
      {value}
    </Tag>
  );
}

function InfoRow({
  icon,
  label,
  value,
  mono,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-secondary">{icon}</div>
      <div className="min-w-0">
        <div className="text-xs uppercase text-muted">{label}</div>
        <div
          className={
            mono
              ? "truncate font-mono text-sm text-foreground"
              : "truncate text-sm text-foreground"
          }
        >
          {value}
        </div>
      </div>
    </div>
  );
}

function ExternalLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="truncate text-sm text-primary hover:underline"
    >
      {label}
    </a>
  );
}

export default function UserViewPage({
  params,
}: {
  params: { page: "dashboard" | "public" };
}) {
  const {
    data: myProfileData,
    error: profileError,
    isError: idProfileError,
    isLoading: loading,
    refetch: refetchProfile,
  } = useGetMyProfileQuery(undefined);
  const session = useSession();
  const searchParams = useSearchParams();
  const [data, setData] = useState<UserDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  const uuid = searchParams.get("uuid"); // in Next.js app router: /dashboard/users/[uuid]

  // useEffect(() => {
  //   // Replace with real fetch using uuid
  //   // Example:
  //   // fetch(`/api/users/${uuid}`).then(...)
  //   const t = setTimeout(() => {
  //     if (!uuid) {
  //       // If you don’t use dynamic route, remove this block
  //       setData(MOCK);
  //       setLoading(false);
  //       return;
  //     }

  //     // Mock "found"
  //     setData({ ...MOCK, user: { ...MOCK.user, uuid } });
  //     setLoading(false);
  //   }, 700);

  //   return () => clearTimeout(t);
  // }, [uuid]);

  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (session?.data?.user) {
      setUser(session?.data?.user as unknown as User);
    }
    if (myProfileData?.data) {
      setProfile(myProfileData?.data as unknown as UserProfile);
    }
  }, [session, myProfileData]);

  const headerName = useMemo(() => {
    if (!profile?.displayName && !user?.username) return "User";
    return profile?.displayName || user?.username || "User";
  }, [profile?.displayName, user?.username]);

  const [change, { isLoading, isSuccess }] = useChangePasswordMutation();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">{headerName}</h1>
          <div className="flex flex-wrap items-center gap-2">
            {user ? <RoleTag value={user.role as UserRole} /> : null}
            {user ? <StatusTag value={user.status as UserStatus} /> : null}
            {user?.emailVerifiedAt ? (
              <Tag color="green">
                <span className="inline-flex items-center gap-2">
                  <BadgeCheck size={14} />
                  Email verified
                </span>
              </Tag>
            ) : (
              <Tag color="orange">Email not verified</Tag>
            )}
          </div>
        </div>

        <ButtonToolbar>
          <ChangePasswordButton />

          <Button
            appearance="primary"
            as={Link}
            href={`${params?.page == "public" ? "/profile/edit" : "/dashboard/profile?mode=edit&uuid=${user?.uuid}"}`}
          >
            <span className="inline-flex items-center gap-2">
              <Pencil size={16} />
              Edit
            </span>
          </Button>
        </ButtonToolbar>
      </div>

      {/* LOADING STATE */}
      {loading && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Panel
            bordered
            className="rounded-xl border border-border bg-card lg:col-span-2"
          >
            <Placeholder.Paragraph rows={8} active />
          </Panel>
          <Panel bordered className="rounded-xl border border-border bg-card">
            <Placeholder.Graph active height={160} />
            <Divider />
            <Placeholder.Paragraph rows={4} active />
          </Panel>
        </div>
      )}

      {/* CONTENT */}
      {!loading && user && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Core */}
          <Panel
            bordered
            className="rounded-xl border border-border bg-card lg:col-span-2"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="text-lg font-semibold">User Details</div>
                <div className="text-sm text-secondary">
                  High-signal identity and access controls.
                </div>
              </div>

              <div className="hidden md:flex items-center gap-3">
                <AvatarEdit
                  avatarUrl={profile?.avatarUrl}
                  refetchProfile={refetchProfile}
                  onUpdated={(newUrl) => {
                    setProfile((prev) =>
                      prev ? { ...prev, avatarUrl: newUrl } : prev,
                    );
                  }}
                />
              </div>
            </div>

            <Divider className="my-6" />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <InfoRow
                icon={<UserIcon size={16} />}
                label="Display name"
                value={profile?.displayName || "—"}
              />
              <InfoRow
                icon={<UserIcon size={16} />}
                label="Username"
                value={user.username}
              />

              <InfoRow
                icon={<Mail size={16} />}
                label="Email"
                value={user.email}
              />
              <InfoRow
                icon={<Shield size={16} />}
                label="Role"
                value={<RoleTag value={user.role as UserRole} />}
              />

              <InfoRow
                icon={<ToggleLeft size={16} />}
                label="Status"
                value={<StatusTag value={user.status as UserStatus} />}
              />
              <InfoRow
                icon={<BadgeCheck size={16} />}
                label="Email verified at"
                value={formatDate(user.emailVerifiedAt as unknown as Date)}
              />

              {/* <InfoRow
                icon={<Clock size={16} />}
                label="Last login"
                value={formatDate(user.lastLoginAt as unknown as Date)}
              /> */}
              {/* <InfoRow
                icon={<Calendar size={16} />}
                label="Created"
                value={formatDate(profile?.createdAt as unknown as Date)}
              /> */}

              {/* <InfoRow
                icon={<Calendar size={16} />}
                label="Updated"
                value={formatDate(user.updatedAt)}
              /> */}
              <InfoRow
                icon={<LinkIcon size={16} />}
                label="User UUID"
                value={user.uuid}
                mono
              />
            </div>

            <Divider className="my-6" />

            <div className="space-y-2">
              <div className="text-xs uppercase text-muted">Bio</div>
              <div className="text-sm text-foreground">
                {profile?.bio ? (
                  profile?.bio
                ) : (
                  <span className="text-secondary">—</span>
                )}
              </div>
            </div>
          </Panel>

          {/* Profile / Links */}
          <Panel bordered className="rounded-xl border border-border bg-card">
            <div className="space-y-1">
              <div className="text-lg font-semibold">Profile</div>
              <div className="text-sm text-secondary">
                Public-facing details and links.
              </div>
            </div>

            <Divider className="my-6" />

            <div className="space-y-5">
              <InfoRow
                icon={<ImageIcon size={16} />}
                label="Avatar"
                value={
                  profile?.avatarUrl ? (
                    <ExternalLink
                      href={profile?.avatarUrl}
                      label="Open avatar"
                    />
                  ) : (
                    "—"
                  )
                }
              />

              <InfoRow
                icon={<MapPin size={16} />}
                label="Location"
                value={
                  profile?.location || <span className="text-secondary">—</span>
                }
              />

              <InfoRow
                icon={<LinkIcon size={16} />}
                label="Website"
                value={
                  profile?.websiteUrl ? (
                    <ExternalLink
                      href={profile?.websiteUrl}
                      label={profile?.websiteUrl}
                    />
                  ) : (
                    <span className="text-secondary">—</span>
                  )
                }
              />

              <Divider />

              <InfoRow
                icon={<Twitter size={16} />}
                label="Twitter"
                value={
                  profile?.twitterUrl ? (
                    <ExternalLink
                      href={profile?.twitterUrl}
                      label={profile?.twitterUrl}
                    />
                  ) : (
                    <span className="text-secondary">—</span>
                  )
                }
              />

              <InfoRow
                icon={<Github size={16} />}
                label="GitHub"
                value={
                  profile?.githubUrl ? (
                    <ExternalLink
                      href={profile?.githubUrl}
                      label={profile?.githubUrl}
                    />
                  ) : (
                    <span className="text-secondary">—</span>
                  )
                }
              />

              <InfoRow
                icon={<Linkedin size={16} />}
                label="LinkedIn"
                value={
                  profile?.linkedinUrl ? (
                    <ExternalLink
                      href={profile?.linkedinUrl}
                      label={profile?.linkedinUrl}
                    />
                  ) : (
                    <span className="text-secondary">—</span>
                  )
                }
              />
            </div>

            <Divider className="my-6" />

            <div className="text-xs uppercase text-muted">Profile UUID</div>
            <div className="mt-1 font-mono text-[12px] text-secondary">
              {profile?.uuid}
            </div>
          </Panel>
        </div>
      )}
    </div>
  );
}
