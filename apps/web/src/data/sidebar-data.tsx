import { BookCopy, MessagesSquare, Plus, Workflow } from "lucide-react";

export const items: { title: string; url: string; icon: React.ReactNode }[] = [
  {
    title: "New Chat",
    url: "/chat",
    icon: <Plus className="w-5 h-5" />,
  },
  {
    title: "Chats",
    url: "/chats",
    icon: <MessagesSquare className="w-5 h-5" />,
  },
  {
    title: "Collections",
    url: "/collections",
    icon: <BookCopy className="w-5 h-5" />,
  },

  // {
  //   title: "Integrations",
  //   url: "/integrations",
  //   icon: <Workflow className="w-5 h-5" />,
  // },
];

export const chats:{id:number,title:string}[] = [
  { id: 0, title: "API Documentation" },
  { id: 1, title: "Code Generation" },
  { id: 2, title: "API Integrations" },
  { id: 3, title: "Developer Productivity" },
  { id: 4, title: "Analytics & Monitoring" },
  { id: 5, title: "Customization & Features" },
  { id: 6, title: "API Health Checks" },
  { id: 7, title: "VS Code Extension" },
  { id: 8, title: "Slack Integration" },
  { id: 9, title: "GraphQL Support" },
];
