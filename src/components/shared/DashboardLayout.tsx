import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../ui/sidebar";
import {
    IconArrowLeft,
    IconBrandTabler,
    IconChartBar,
    IconSettings,
    IconUsers,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { ROUTES, APP_NAME } from "@/constants";

interface DashboardLayoutProps {
    children: React.ReactNode;
    role: "admin" | "subadmin";
    userName?: string;
    userAvatar?: string;
}

export function DashboardLayout({
    children,
    role,
    userName = "User",
    userAvatar,
}: DashboardLayoutProps) {
    // Define navigation links based on role
    const adminLinks = [
        {
            label: "Dashboard",
            href: ROUTES.ADMIN_DASHBOARD,
            icon: (
                <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
        },
        {
            label: "Analytics",
            href: `${ROUTES.ADMIN_DASHBOARD}/analytics`,
            icon: (
                <IconChartBar className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
        },
        {
            label: "Users",
            href: `${ROUTES.ADMIN_DASHBOARD}/users`,
            icon: (
                <IconUsers className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
        },
        {
            label: "Settings",
            href: `${ROUTES.ADMIN_DASHBOARD}/settings`,
            icon: (
                <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
        },
        {
            label: "Logout",
            href: ROUTES.LOGIN,
            icon: (
                <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
        },
    ];

    const subadminLinks = [
        {
            label: "Dashboard",
            href: ROUTES.SUBADMIN_DASHBOARD,
            icon: (
                <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
        },
        {
            label: "Analytics",
            href: `${ROUTES.SUBADMIN_DASHBOARD}/analytics`,
            icon: (
                <IconChartBar className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
        },
        {
            label: "Settings",
            href: `${ROUTES.SUBADMIN_DASHBOARD}/settings`,
            icon: (
                <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
        },
        {
            label: "Logout",
            href: ROUTES.LOGIN,
            icon: (
                <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
        },
    ];

    const links = role === "admin" ? adminLinks : subadminLinks;
    const [open, setOpen] = useState(false);

    return (
        <div
            className={cn(
                "mx-auto flex h-screen w-full flex-1 flex-col overflow-hidden bg-gray-100 md:flex-row dark:bg-neutral-800"
            )}
        >
            <Sidebar open={open} setOpen={setOpen}>
                <SidebarBody className="justify-between gap-10">
                    <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
                        {open ? <Logo /> : <LogoIcon />}
                        <div className="mt-6 flex flex-col gap-2">
                            {links.map((link, idx) => (
                                <SidebarLink key={idx} link={link} />
                            ))}
                        </div>
                    </div>
                    <div>
                        <SidebarLink
                            link={{
                                label: userName,
                                href: "#",
                                icon: userAvatar ? (
                                    <img
                                        src={userAvatar}
                                        className="h-7 w-7 shrink-0 rounded-full"
                                        width={50}
                                        height={50}
                                        alt="Avatar"
                                    />
                                ) : (
                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-700 text-xs font-semibold text-white dark:bg-neutral-200 dark:text-black">
                                        {userName.charAt(0).toUpperCase()}
                                    </div>
                                ),
                            }}
                        />
                    </div>
                </SidebarBody>
            </Sidebar>
            <Dashboard>{children}</Dashboard>
        </div>
    );
}

const Logo = () => {
    return (
        <a
            href="#"
            className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
        >
            <img
                src="/logo.svg"
                alt="Logo"
                className="h-10 w-10 shrink-0 object-contain"
            />
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="whitespace-pre font-medium text-black dark:text-white"
            >
                {APP_NAME}
            </motion.span>
        </a>
    );
};

const LogoIcon = () => {
    return (
        <a
            href="#"
            className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
        >
            <img
                src="/logo.svg"
                alt="Logo"
                className="h-10 w-10 shrink-0 object-contain"
            />
        </a>
    );
};

// Dashboard wrapper component for main content
const Dashboard = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex flex-1 overflow-hidden">
            <div className="flex h-full w-full flex-1 flex-col overflow-y-auto rounded-tl-2xl border border-neutral-200 bg-white p-4 md:p-8 dark:border-neutral-700 dark:bg-neutral-900">
                {children}
            </div>
        </div>
    );
};
