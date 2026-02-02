"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Panel,
  Button,
  ButtonToolbar,
  Divider,
  Tag,
  Placeholder,
  Message,
  useToaster,
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
  KeyRound,
  RefreshCw,
} from "lucide-react";
import { skipToken } from "@reduxjs/toolkit/query";
import {
  useChangeUserPasswordByAdminMutation,
  useChangeUserStatusMutation,
  useGetFullUserInfoQuery,
} from "@/redux/api/users/user.api";
import { ChangeUserRoleButton } from "./ChangeUserRole";
import { AdminChangePasswordButton } from "./ChangePassword";

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
  emailVerifiedAt: string | Date | null;
  lastLoginAt: string | Date | null;
  createdAt: string | Date;
  updatedAt: string | Date;
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
  createdAt: string | Date;
  updatedAt: string | Date;
};

type UserDetails = {
  user: User;
  profile: UserProfile | null;
};

function toDate(value: string | Date | null | undefined) {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function formatDate(value: string | Date | null | undefined) {
  const d = toDate(value);
  if (!d) return "—";
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

function getRtkErrorMessage(err: unknown) {
  const anyErr = err as any;
  // RTK Query errors are commonly { status, data } or { error }
  if (!anyErr) return "Something went wrong.";
  if (typeof anyErr?.data?.message === "string") return anyErr.data.message;
  if (Array.isArray(anyErr?.data?.message))
    return anyErr.data.message.join(", ");
  if (typeof anyErr?.error === "string") return anyErr.error;
  if (typeof anyErr?.message === "string") return anyErr.message;
  return "Something went wrong.";
}

function ensureHttp(url: string) {
  const u = url.trim();
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  return `https://${u}`;
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
          : "gray";

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
          title={typeof value === "string" ? value : undefined}
        >
          {value}
        </div>
      </div>
    </div>
  );
}

function ExternalLink({ href, label }: { href: string; label: string }) {
  const safe = ensureHttp(href);
  if (!safe) return <span className="text-secondary">—</span>;

  return (
    <a
      href={safe}
      target="_blank"
      rel="noreferrer"
      className="truncate text-sm text-primary hover:underline"
      title={safe}
    >
      {label}
    </a>
  );
}

export default function UserViewPage() {
  const searchParams = useSearchParams();
  const toaster = useToaster();

  const uuid = searchParams.get("uuid")?.trim() || "";

  const {
    data: userInfo,
    isFetching,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetFullUserInfoQuery(uuid ? (uuid as string) : skipToken);

  // Support either { data: { user, profile } } or { user, profile }
  const details: UserDetails | null = useMemo(() => {
    const raw: any = userInfo as any;
    const payload = raw?.data ?? raw;
    if (!payload?.user) return null;
    return payload as UserDetails;
  }, [userInfo]);

  const user = details?.user ?? null;
  const profile = details?.profile ?? null;

  const [avatarBroken, setAvatarBroken] = useState(false);

  const headerName = useMemo(() => {
    const dn = profile?.displayName?.trim();
    const un = user?.username?.trim();
    return dn || un || "User";
  }, [profile?.displayName, user?.username]);

  const loading = !!uuid && (isLoading || isFetching);

  const canAct = !!user?.uuid && !loading;

  // NOTE: These buttons are intentionally “safe by default”.
  // If you already have modal flows + redux mutations for status/password changes,
  // replace the href routes with your modal handlers.
  const changeStatusHref = user?.uuid
    ? `/dashboard/users/${user.uuid}/status`
    : "#";
  const changePasswordHref = user?.uuid
    ? `/dashboard/users/${user.uuid}/change-password`
    : "#";

  //user CHanging status
  const [changeStatus] = useChangeUserStatusMutation();
  const [changePassword] = useChangeUserPasswordByAdminMutation();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1 min-w-0">
          <h1 className="text-2xl font-semibold truncate">{headerName}</h1>

          <div className="flex flex-wrap items-center gap-2">
            {user?.role ? <RoleTag value={user.role} /> : null}
            {user?.status ? <StatusTag value={user.status} /> : null}

            {user?.emailVerifiedAt ? (
              <Tag color="green">
                <span className="inline-flex items-center gap-2">
                  <BadgeCheck size={14} />
                  Email verified
                </span>
              </Tag>
            ) : user ? (
              <Tag color="orange">Email not verified</Tag>
            ) : null}
          </div>
        </div>

        <ButtonToolbar className="shrink-0">
          <Button appearance="ghost" as={Link} href="/dashboard/users">
            <span className="inline-flex items-center gap-2">
              <ArrowLeft size={16} />
              Back
            </span>
          </Button>

          <Button
            appearance="ghost"
            onClick={() => refetch()}
            disabled={!uuid || loading}
          >
            <span className="inline-flex items-center gap-2">
              <RefreshCw size={16} />
              Refresh
            </span>
          </Button>

          <Button
            appearance="primary"
            as={Link}
            href={user?.uuid ? `/dashboard/users/${user.uuid}/edit` : "#"}
            disabled={!canAct}
          >
            <span className="inline-flex items-center gap-2">
              <Pencil size={16} />
              Edit
            </span>
          </Button>

          {/* NEW: Change Status */}
          <ChangeUserRoleButton
            currentRole={user?.status}
            onUpdateRole={({ uuid, role }) =>
              changeStatus({ uuid, status: role }).unwrap()
            }
            userUuid={user?.uuid}
            onSuccess={() => refetch()}
          />

          <AdminChangePasswordButton
            onAdminChangePassword={({ newPassword, uuid }) =>
              changePassword({ uuid, password: newPassword }).unwrap()
            }
            userUuid={user?.uuid}
          />
        </ButtonToolbar>
      </div>
      {/* Missing UUID edge case */}
      {!uuid && (
        <Message type="warning" closable>
          No user UUID found in the URL. Add <b>?uuid=...</b> to view a user.
        </Message>
      )}

      {/* API Error edge case */}
      {uuid && isError && (
        <Message type="error" closable>
          {getRtkErrorMessage(error)}
        </Message>
      )}

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
      {!loading && details?.user && (
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
                <div className="h-11 w-11 overflow-hidden rounded-full border border-border bg-muted flex items-center justify-center">
                  {profile?.avatarUrl && !avatarBroken ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={profile.avatarUrl}
                      alt="avatar"
                      className="h-full w-full object-cover"
                      onError={() => setAvatarBroken(true)}
                    />
                  ) : (
                    <UserIcon size={18} className="text-secondary" />
                  )}
                </div>
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
                value={user?.username || "—"}
              />

              <InfoRow
                icon={<Mail size={16} />}
                label="Email"
                value={user?.email || "—"}
              />

              <InfoRow
                icon={<Shield size={16} />}
                label="Role"
                value={user?.role ? <RoleTag value={user.role} /> : "—"}
              />

              <InfoRow
                icon={<ToggleLeft size={16} />}
                label="Status"
                value={user?.status ? <StatusTag value={user.status} /> : "—"}
              />

              <InfoRow
                icon={<BadgeCheck size={16} />}
                label="Email verified at"
                value={formatDate(user?.emailVerifiedAt)}
              />

              <InfoRow
                icon={<Clock size={16} />}
                label="Last login"
                value={formatDate(user?.lastLoginAt)}
              />

              <InfoRow
                icon={<Calendar size={16} />}
                label="Created"
                value={formatDate(user?.createdAt)}
              />

              <InfoRow
                icon={<Calendar size={16} />}
                label="Updated"
                value={formatDate(user?.updatedAt)}
              />

              <InfoRow
                icon={<LinkIcon size={16} />}
                label="User UUID"
                value={user?.uuid || "—"}
                mono
              />
            </div>

            <Divider className="my-6" />

            <div className="space-y-2">
              <div className="text-xs uppercase text-muted">Bio</div>
              <div className="text-sm text-foreground">
                {profile?.bio ? (
                  profile.bio
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
                      href={profile.avatarUrl}
                      label="Open avatar"
                    />
                  ) : (
                    <span className="text-secondary">—</span>
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
                      href={profile.websiteUrl}
                      label={profile.websiteUrl}
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
                      href={profile.twitterUrl}
                      label={profile.twitterUrl}
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
                      href={profile.githubUrl}
                      label={profile.githubUrl}
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
                      href={profile.linkedinUrl}
                      label={profile.linkedinUrl}
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
              {profile?.uuid || "—"}
            </div>
          </Panel>
        </div>
      )}

      {/* Not found edge case */}
      {!loading && uuid && !details?.user && !isError && (
        <Message type="warning" closable>
          User not found.
        </Message>
      )}
    </div>
  );
}
