"use client";

import {
  LayoutDashboard,
  Users,
  FileText,
  GalleryVerticalEnd,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  PATIENT_ID_001,
  PATIENT_ID_002,
  PATIENT_ID_003,
} from "@/mocks/patient-data";

const navigation = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    url: "/dashboard",
  },
  {
    title: "Patients",
    icon: Users,
    url: "/",
  },
  {
    title: "Notes & Insights",
    icon: FileText,
    url: "/notes",
  },
];

const todayAppointments = [
  {
    id: PATIENT_ID_001,
    name: "Mario R.",
    initials: "MR",
    url: `/patients/${PATIENT_ID_001}`,
  },
  {
    id: PATIENT_ID_002,
    name: "Giada D.",
    initials: "GD",
    url: `/patients/${PATIENT_ID_002}`,
  },
  {
    id: PATIENT_ID_003,
    name: "Tommaso G.",
    initials: "TG",
    url: `/patients/${PATIENT_ID_003}`,
  },
];

export function AppSidebar() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const isActive = (url: string) => {
    if (url === "/") return pathname === "/";
    return pathname.startsWith(url);
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <GalleryVerticalEnd className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold">Humana</span>
                <span className="text-xs text-muted-foreground">Demo</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navigation.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  asChild
                  isActive={isActive(item.url)}
                >
                  <a href={item.url}>
                    <item.icon className="size-4" />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Today Appointments</SidebarGroupLabel>
          <SidebarMenu>
            {todayAppointments.map((patient) => (
              <SidebarMenuItem key={patient.id}>
                <SidebarMenuButton tooltip={patient.name} asChild>
                  <a href={patient.url} className="flex items-center gap-2">
                    <span aria-hidden />
                    <span>{patient.name}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center gap-2 px-2 py-2">
          <Avatar className="size-8">
            <AvatarImage src="/avatar.png" alt="John Doe" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-0.5 leading-none flex-1 min-w-0">
            <span className="font-semibold text-sm truncate">John Doe</span>
            <span className="text-xs text-muted-foreground truncate">
              johndoe@example.com
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              onClick={toggleTheme}
            >
              <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            <SidebarTrigger className="size-7" />
          </div>
        </div>
        <div className="px-2 pb-2">
          <p className="text-[11px] text-muted-foreground leading-tight">
            Demo version – No data is saved
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
